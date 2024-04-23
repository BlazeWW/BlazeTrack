import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type DriverId, driverIdSchema, drivers } from "@/lib/db/schema/drivers";

export const getDrivers = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select().from(drivers).where(eq(drivers.userId, session?.user.id!));
  const d = rows
  return { drivers: d };
};

export const getDriverById = async (id: DriverId) => {
  const { session } = await getUserAuth();
  const { id: driverId } = driverIdSchema.parse({ id });
  const [row] = await db.select().from(drivers).where(and(eq(drivers.id, driverId), eq(drivers.userId, session?.user.id!)));
  if (row === undefined) return {};
  const d = row;
  return { driver: d };
};


