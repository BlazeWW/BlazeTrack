import { getTrackingTypeById, getTrackingTypes } from "@/lib/api/trackingTypes/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  trackingTypeIdSchema,
  insertTrackingTypeParams,
  updateTrackingTypeParams,
} from "@/lib/db/schema/trackingTypes";
import { createTrackingType, deleteTrackingType, updateTrackingType } from "@/lib/api/trackingTypes/mutations";

export const trackingTypesRouter = router({
  getTrackingTypes: publicProcedure.query(async () => {
    return getTrackingTypes();
  }),
  getTrackingTypeById: publicProcedure.input(trackingTypeIdSchema).query(async ({ input }) => {
    return getTrackingTypeById(input.id);
  }),
  createTrackingType: publicProcedure
    .input(insertTrackingTypeParams)
    .mutation(async ({ input }) => {
      return createTrackingType(input);
    }),
  updateTrackingType: publicProcedure
    .input(updateTrackingTypeParams)
    .mutation(async ({ input }) => {
      return updateTrackingType(input.id, input);
    }),
  deleteTrackingType: publicProcedure
    .input(trackingTypeIdSchema)
    .mutation(async ({ input }) => {
      return deleteTrackingType(input.id);
    }),
});
