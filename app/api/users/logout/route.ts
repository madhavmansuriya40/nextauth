import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const resposne = NextResponse.json({
      message: "Logout Success!",
      success: true,
    });

    resposne.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return resposne;
  } catch (error: any) {
    return NextResponse.json({
      message: "Soemthing went wrong while loging in",
      status: 500,
    });
  }
}
