"use server";

import { revalidatePath } from "next/cache";
import {
  createAsset,
  deleteAsset,
  updateAsset,
} from "@/lib/api/assets/mutations";
import {
  AssetId,
  NewAssetParams,
  UpdateAssetParams,
  assetIdSchema,
  insertAssetParams,
  updateAssetParams,
} from "@/lib/db/schema/assets";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateAssets = () => revalidatePath("/assets");

export const createAssetAction = async (input: NewAssetParams) => {
  try {
    const payload = insertAssetParams.parse(input);
    await createAsset(payload);
    revalidateAssets();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateAssetAction = async (input: UpdateAssetParams) => {
  try {
    const payload = updateAssetParams.parse(input);
    await updateAsset(payload.id, payload);
    revalidateAssets();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteAssetAction = async (input: AssetId) => {
  try {
    const payload = assetIdSchema.parse({ id: input });
    await deleteAsset(payload.id);
    revalidateAssets();
  } catch (e) {
    return handleErrors(e);
  }
};