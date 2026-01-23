import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { validateRequest } from "@/app/lib/validate";
import { CreateDisplayDeviceSchema } from "../schemas";

export async function POST(req: Request) {
  const validated = await validateRequest(req, CreateDisplayDeviceSchema);

  if (validated instanceof NextResponse) {
    return validated;
  }

  try {
    const pdcExists = await prisma.pdcDevice.findUnique({
      where: { pf: validated.pf },
    });

    if (!pdcExists) {
      return NextResponse.json(
        { success: false, message: "PDC not found for this platform" },
        { status: 400 },
      );
    }

    const device = await prisma.displayDevice.create({
      data: validated,
    });

    return NextResponse.json({ success: true, data: device }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message: "Display device with this IP already exists",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create display device",
      },
      { status: 500 },
    );
  }
}
