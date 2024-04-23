import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  AssetId, 
  NewAssetParams,
  UpdateAssetParams, 
  updateAssetSchema,
  insertAssetSchema, 
  assets,
  assetIdSchema 
} from "@/lib/db/schema/assets";
import { getUserAuth } from "@/lib/auth/utils";

export const createAsset = async (asset: NewAssetParams) => {
  const { session } = await getUserAuth();
  const newAsset = insertAssetSchema.parse({ ...asset, userId: session?.user.id! });
  try {
    const [a] =  await db.insert(assets).values(newAsset).returning();
    return { asset: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateAsset = async (id: AssetId, asset: UpdateAssetParams) => {
  const { session } = await getUserAuth();
  const { id: assetId } = assetIdSchema.parse({ id });
  const newAsset = updateAssetSchema.parse({ ...asset, userId: session?.user.id! });
  try {
    const [a] =  await db
     .update(assets)
     .set({...newAsset, updatedAt: new Date() })
     .where(and(eq(assets.id, assetId!), eq(assets.userId, session?.user.id!)))
     .returning();
    return { asset: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteAsset = async (id: AssetId) => {
  const { session } = await getUserAuth();
  const { id: assetId } = assetIdSchema.parse({ id });
  try {
    const [a] =  await db.delete(assets).where(and(eq(assets.id, assetId!), eq(assets.userId, session?.user.id!)))
    .returning();
    return { asset: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

