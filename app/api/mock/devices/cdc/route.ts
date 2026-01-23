import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    TrainList: [
      {
        TNO: "12314",
        TNE: "RAJDHANI EXPRESS",
        TNH: "राजधानी एक्सप्रेस",
        TNR: "রাজধানী এক্সপ্রেস",
        ADF: "A",
        EAT: "10:10",
        EDT: "--:--",
        PNO: "001",
        STA: "Terminated#समाप्त#সমাপ্ত",
        CCD: "ENG#ईंजन,SLR#ब्रे.या,A1#ए1,A2#ए2,B1#बी1,S1#एस1,GS#जीएस",
        COL: ["FFFFFF", "FFFF00", "FF00FF", "FFFFFF", "FFFF00", "FF00FF"],
      },
    ],
    LineConf: [
      {
        INT: 50,
        PTO: 10,
        DTP: 60,
        CHR: 3,
        EFF: 9,
        SPD: 0,
        VID: "XYZ.MP4#ABC.MP4",
        IMG: "XYZ.BMP$5#EFG.JPG$10",
        TOD: "10:24:45",
        RST: "N",
      },
    ],
  });
}
