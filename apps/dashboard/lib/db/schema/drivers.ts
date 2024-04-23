import { sql } from "drizzle-orm";
import { varchar, date, text, integer, boolean, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getDrivers } from "@/lib/api/drivers/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const drivers = pgTable('drivers', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  name: varchar("name", { length: 256 }),
  surname: varchar("surname", { length: 256 }),
  idNumber: varchar("id_number", { length: 256 }),
  dateOfBirth: date("date_of_birth"),
  mobileNr: varchar("mobile_nr", { length: 256 }),
  physicalAddress: text("physical_address"),
  postalAddress: text("postal_address"),
  email: varchar("email", { length: 256 }),
  licenseType: varchar("license_type", { length: 256 }),
  lastRenewedDate: date("last_renewed_date"),
  licenseExpiry: date("license_expiry"),
  vehicleRestriction: integer("vehicle_restriction"),
  driverRestriction: integer("driver_restriction"),
  image: varchar("image", { length: 256 }),
  handPrints: varchar("hand_prints", { length: 256 }),
  comments: text("comments"),
  active: boolean("active"),
  userId: varchar("user_id", { length: 256 }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for drivers - used to validate API requests
const baseSchema = createSelectSchema(drivers).omit(timestamps)

export const insertDriverSchema = createInsertSchema(drivers).omit(timestamps);
export const insertDriverParams = baseSchema.extend({
  dateOfBirth: z.coerce.string().min(1),
  lastRenewedDate: z.coerce.string().min(1),
  licenseExpiry: z.coerce.string().min(1),
  vehicleRestriction: z.coerce.number(),
  driverRestriction: z.coerce.number(),
  active: z.coerce.boolean()
}).omit({ 
  id: true,
  userId: true
});

export const updateDriverSchema = baseSchema;
export const updateDriverParams = baseSchema.extend({
  dateOfBirth: z.coerce.string().min(1),
  lastRenewedDate: z.coerce.string().min(1),
  licenseExpiry: z.coerce.string().min(1),
  vehicleRestriction: z.coerce.number(),
  driverRestriction: z.coerce.number(),
  active: z.coerce.boolean()
}).omit({ 
  userId: true
});
export const driverIdSchema = baseSchema.pick({ id: true });

// Types for drivers - used to type API request params and within Components
export type Driver = typeof drivers.$inferSelect;
export type NewDriver = z.infer<typeof insertDriverSchema>;
export type NewDriverParams = z.infer<typeof insertDriverParams>;
export type UpdateDriverParams = z.infer<typeof updateDriverParams>;
export type DriverId = z.infer<typeof driverIdSchema>["id"];
    
// this type infers the return from getDrivers() - meaning it will include any joins
export type CompleteDriver = Awaited<ReturnType<typeof getDrivers>>["drivers"][number];

