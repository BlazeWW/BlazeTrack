import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { trackingTypesRouter } from "./trackingTypes";
import { assetsRouter } from "./assets";
import { driversRouter } from "./drivers";

export const appRouter = router({
  computers: computersRouter,
  trackingTypes: trackingTypesRouter,
  assets: assetsRouter,
  drivers: driversRouter,
});

export type AppRouter = typeof appRouter;
