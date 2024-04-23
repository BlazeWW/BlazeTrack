import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  DriverId, 
  NewDriverParams,
  UpdateDriverParams, 
  updateDriverSchema,
  insertDriverSchema, 
  drivers,
  driverIdSchema 
} from "@/lib/db/schema/drivers";
import { getUserAuth } from "@/lib/auth/utils";

export const createDriver = async (driver: NewDriverParams) => {
  const { session } = await getUserAuth();
  const newDriver = insertDriverSchema.parse({ ...driver, userId: session?.user.id! });
  try {
    const [d] =  await db.insert(drivers).values(newDriver).returning();
    return { driver: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateDriver = async (id: DriverId, driver: UpdateDriverParams) => {
  const { session } = await getUserAuth();
  const { id: driverId } = driverIdSchema.parse({ id });
  const newDriver = updateDriverSchema.parse({ ...driver, userId: session?.user.id! });
  try {
    const [d] =  await db
     .update(drivers)
     .set({...newDriver, updatedAt: new Date() })
     .where(and(eq(drivers.id, driverId!), eq(drivers.userId, session?.user.id!)))
     .returning();
    return { driver: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteDriver = async (id: DriverId) => {
  const { session } = await getUserAuth();
  const { id: driverId } = driverIdSchema.parse({ id });
  try {
    const [d] =  await db.delete(drivers).where(and(eq(drivers.id, driverId!), eq(drivers.userId, session?.user.id!)))
    .returning();
    return { driver: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

