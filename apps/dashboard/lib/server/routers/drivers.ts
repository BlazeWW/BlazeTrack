import { getDriverById, getDrivers } from "@/lib/api/drivers/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  driverIdSchema,
  insertDriverParams,
  updateDriverParams,
} from "@/lib/db/schema/drivers";
import { createDriver, deleteDriver, updateDriver } from "@/lib/api/drivers/mutations";

export const driversRouter = router({
  getDrivers: publicProcedure.query(async () => {
    return getDrivers();
  }),
  getDriverById: publicProcedure.input(driverIdSchema).query(async ({ input }) => {
    return getDriverById(input.id);
  }),
  createDriver: publicProcedure
    .input(insertDriverParams)
    .mutation(async ({ input }) => {
      return createDriver(input);
    }),
  updateDriver: publicProcedure
    .input(updateDriverParams)
    .mutation(async ({ input }) => {
      return updateDriver(input.id, input);
    }),
  deleteDriver: publicProcedure
    .input(driverIdSchema)
    .mutation(async ({ input }) => {
      return deleteDriver(input.id);
    }),
});
