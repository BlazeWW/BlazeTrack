import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createTrackingType,
  deleteTrackingType,
  updateTrackingType,
} from "@/lib/api/trackingTypes/mutations";
import { 
  trackingTypeIdSchema,
  insertTrackingTypeParams,
  updateTrackingTypeParams 
} from "@/lib/db/schema/trackingTypes";

export async function POST(req: Request) {
  try {
    const validatedData = insertTrackingTypeParams.parse(await req.json());
    const { trackingType } = await createTrackingType(validatedData);

    revalidatePath("/trackingTypes"); // optional - assumes you will have named route same as entity

    return NextResponse.json(trackingType, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateTrackingTypeParams.parse(await req.json());
    const validatedParams = trackingTypeIdSchema.parse({ id });

    const { trackingType } = await updateTrackingType(validatedParams.id, validatedData);

    return NextResponse.json(trackingType, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = trackingTypeIdSchema.parse({ id });
    const { trackingType } = await deleteTrackingType(validatedParams.id);

    return NextResponse.json(trackingType, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
