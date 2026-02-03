import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    DeviceList: [
      { NOD: 3 },
      { IP: "10.0.1.105", INT: 50, PNO: 1 }, // MLD
      { IP: "10.0.1.145", INT: 50, PNO: 2 }, // AGD
      { IP: "10.0.1.175", INT: 25, PNO: 3 }, // PFD
    ],
    DevConf: [
      {
        TOD: new Date().toLocaleTimeString("en-GB"),
        RST: "N",
      },
    ],
  });
}
