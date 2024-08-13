import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    console.log("\n\n\n userId --> ", userId);
    const user = await User.findOne({ _id: userId }).select("-password");
    console.log("\n\n\n user --> ", user);

    if (!user) {
      return NextResponse.json({
        message: "Invalid Token, User not found",
        status: 500,
      });
    }

    return NextResponse.json({
      data: user,
    });
  } catch (error: any) {
    console.log("error --> ", error);
    return NextResponse.json({
      message: "Soemthing went wrong while getting user details",
      status: 500,
    });
  }
}
