import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type TrackingTypeId, trackingTypeIdSchema, trackingTypes } from "@/lib/db/schema/trackingTypes";

export const getTrackingTypes = async () => {
  const rows = await db.select().from(trackingTypes);
  const t = rows
  return { trackingTypes: t };
};

export const getTrackingTypeById = async (id: TrackingTypeId) => {
  const { id: trackingTypeId } = trackingTypeIdSchema.parse({ id });
  const [row] = await db.select().from(trackingTypes).where(eq(trackingTypes.id, trackingTypeId));
  if (row === undefined) return {};
  const t = row;
  return { trackingType: t };
};


