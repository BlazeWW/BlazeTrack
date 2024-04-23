"use server";

import { revalidatePath } from "next/cache";
import {
  createTrackingType,
  deleteTrackingType,
  updateTrackingType,
} from "@/lib/api/trackingTypes/mutations";
import {
  TrackingTypeId,
  NewTrackingTypeParams,
  UpdateTrackingTypeParams,
  trackingTypeIdSchema,
  insertTrackingTypeParams,
  updateTrackingTypeParams,
} from "@/lib/db/schema/trackingTypes";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateTrackingTypes = () => revalidatePath("/tracking-types");

export const createTrackingTypeAction = async (input: NewTrackingTypeParams) => {
  try {
    const payload = insertTrackingTypeParams.parse(input);
    await createTrackingType(payload);
    revalidateTrackingTypes();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateTrackingTypeAction = async (input: UpdateTrackingTypeParams) => {
  try {
    const payload = updateTrackingTypeParams.parse(input);
    await updateTrackingType(payload.id, payload);
    revalidateTrackingTypes();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteTrackingTypeAction = async (input: TrackingTypeId) => {
  try {
    const payload = trackingTypeIdSchema.parse({ id: input });
    await deleteTrackingType(payload.id);
    revalidateTrackingTypes();
  } catch (e) {
    return handleErrors(e);
  }
};