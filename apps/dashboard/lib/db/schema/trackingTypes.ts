import { varchar, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getTrackingTypes } from "@/lib/api/trackingTypes/queries";

import { nanoid } from "@/lib/utils";


export const trackingTypes = pgTable('tracking_types', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  name: varchar("name", { length: 256 })
});


// Schema for trackingTypes - used to validate API requests
const baseSchema = createSelectSchema(trackingTypes)

export const insertTrackingTypeSchema = createInsertSchema(trackingTypes);
export const insertTrackingTypeParams = baseSchema.extend({}).omit({ 
  id: true
});

export const updateTrackingTypeSchema = baseSchema;
export const updateTrackingTypeParams = baseSchema.extend({})
export const trackingTypeIdSchema = baseSchema.pick({ id: true });

// Types for trackingTypes - used to type API request params and within Components
export type TrackingType = typeof trackingTypes.$inferSelect;
export type NewTrackingType = z.infer<typeof insertTrackingTypeSchema>;
export type NewTrackingTypeParams = z.infer<typeof insertTrackingTypeParams>;
export type UpdateTrackingTypeParams = z.infer<typeof updateTrackingTypeParams>;
export type TrackingTypeId = z.infer<typeof trackingTypeIdSchema>["id"];
    
// this type infers the return from getTrackingTypes() - meaning it will include any joins
export type CompleteTrackingType = Awaited<ReturnType<typeof getTrackingTypes>>["trackingTypes"][number];

