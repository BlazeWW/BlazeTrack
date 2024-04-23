import { getAssetById, getAssets } from "@/lib/api/assets/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  assetIdSchema,
  insertAssetParams,
  updateAssetParams,
} from "@/lib/db/schema/assets";
import { createAsset, deleteAsset, updateAsset } from "@/lib/api/assets/mutations";

export const assetsRouter = router({
  getAssets: publicProcedure.query(async () => {
    return getAssets();
  }),
  getAssetById: publicProcedure.input(assetIdSchema).query(async ({ input }) => {
    return getAssetById(input.id);
  }),
  createAsset: publicProcedure
    .input(insertAssetParams)
    .mutation(async ({ input }) => {
      return createAsset(input);
    }),
  updateAsset: publicProcedure
    .input(updateAssetParams)
    .mutation(async ({ input }) => {
      return updateAsset(input.id, input);
    }),
  deleteAsset: publicProcedure
    .input(assetIdSchema)
    .mutation(async ({ input }) => {
      return deleteAsset(input.id);
    }),
});
