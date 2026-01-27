import { NextRequest, NextResponse } from "next/server";
import { VerifyService } from "../../../backend/services/VerifyService";

export async function POST(req: NextRequest) {
  try {
    const { number } = await req.json();

    if (!number || typeof number !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const result = VerifyService.verify(number);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
