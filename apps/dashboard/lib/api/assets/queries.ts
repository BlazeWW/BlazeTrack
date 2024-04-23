import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type AssetId, assetIdSchema, assets } from "@/lib/db/schema/assets";

export const getAssets = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select().from(assets).where(eq(assets.userId, session?.user.id!));
  const a = rows
  return { assets: a };
};

export const getAssetById = async (id: AssetId) => {
  const { session } = await getUserAuth();
  const { id: assetId } = assetIdSchema.parse({ id });
  const [row] = await db.select().from(assets).where(and(eq(assets.id, assetId), eq(assets.userId, session?.user.id!)));
  if (row === undefined) return {};
  const a = row;
  return { asset: a };
};


