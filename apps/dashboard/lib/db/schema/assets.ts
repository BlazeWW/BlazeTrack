import { sql } from "drizzle-orm";
import { varchar, boolean, real, integer, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getAssets } from "@/lib/api/assets/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const assets = pgTable('assets', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  regNr: varchar("reg_nr", { length: 256 }),
  model: varchar("model", { length: 256 }),
  make: varchar("make", { length: 256 }),
  year: varchar("year", { length: 256 }),
  active: boolean("active"),
  avgFuelConsumption: real("avg_fuel_consumption"),
  distanceTravelled: integer("distance_travelled"),
  userId: varchar("user_id", { length: 256 }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for assets - used to validate API requests
const baseSchema = createSelectSchema(assets).omit(timestamps)

export const insertAssetSchema = createInsertSchema(assets).omit(timestamps);
export const insertAssetParams = baseSchema.extend({
  active: z.coerce.boolean(),
  avgFuelConsumption: z.coerce.number(),
  distanceTravelled: z.coerce.number()
}).omit({ 
  id: true,
  userId: true
});

export const updateAssetSchema = baseSchema;
export const updateAssetParams = baseSchema.extend({
  active: z.coerce.boolean(),
  avgFuelConsumption: z.coerce.number(),
  distanceTravelled: z.coerce.number()
}).omit({ 
  userId: true
});
export const assetIdSchema = baseSchema.pick({ id: true });

// Types for assets - used to type API request params and within Components
export type Asset = typeof assets.$inferSelect;
export type NewAsset = z.infer<typeof insertAssetSchema>;
export type NewAssetParams = z.infer<typeof insertAssetParams>;
export type UpdateAssetParams = z.infer<typeof updateAssetParams>;
export type AssetId = z.infer<typeof assetIdSchema>["id"];
    
// this type infers the return from getAssets() - meaning it will include any joins
export type CompleteAsset = Awaited<ReturnType<typeof getAssets>>["assets"][number];

