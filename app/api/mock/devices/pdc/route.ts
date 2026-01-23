import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { validateRequest } from "@/app/lib/validate";
import { CreatePdcDeviceSchema } from "../schemas";

export async function POST(req: Request) {
  const validated = await validateRequest(req, CreatePdcDeviceSchema);

  if (validated instanceof NextResponse) {
    return validated;
  }

  try {
    const device = await prisma.pdcDevice.create({
      data: validated,
    });

    return NextResponse.json({ success: true, data: device }, { status: 201 });
  } catch (error: any) {
    // Unique constraint (ip, platformNo)
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message: "PDC device with this IP already exists",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create PDC device" },
      { status: 500 },
    );
  }
}
