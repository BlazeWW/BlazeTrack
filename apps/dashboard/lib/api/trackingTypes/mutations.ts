import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  TrackingTypeId, 
  NewTrackingTypeParams,
  UpdateTrackingTypeParams, 
  updateTrackingTypeSchema,
  insertTrackingTypeSchema, 
  trackingTypes,
  trackingTypeIdSchema 
} from "@/lib/db/schema/trackingTypes";

export const createTrackingType = async (trackingType: NewTrackingTypeParams) => {
  const newTrackingType = insertTrackingTypeSchema.parse(trackingType);
  try {
    const [t] =  await db.insert(trackingTypes).values(newTrackingType).returning();
    return { trackingType: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateTrackingType = async (id: TrackingTypeId, trackingType: UpdateTrackingTypeParams) => {
  const { id: trackingTypeId } = trackingTypeIdSchema.parse({ id });
  const newTrackingType = updateTrackingTypeSchema.parse(trackingType);
  try {
    const [t] =  await db
     .update(trackingTypes)
     .set(newTrackingType)
     .where(eq(trackingTypes.id, trackingTypeId!))
     .returning();
    return { trackingType: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteTrackingType = async (id: TrackingTypeId) => {
  const { id: trackingTypeId } = trackingTypeIdSchema.parse({ id });
  try {
    const [t] =  await db.delete(trackingTypes).where(eq(trackingTypes.id, trackingTypeId!))
    .returning();
    return { trackingType: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

