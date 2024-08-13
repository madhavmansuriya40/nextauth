import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    console.log("Token -> ", token);

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({
        message: "Unauthorised, no user found",
        status: 400,
      });
    } else {
      user.isVerified = true;
      user.verifyToken = undefined;
      user.verifyTokenExpiry = undefined;

      await user.save();

      return NextResponse.json({
        message: "User verified successfully",
        success: true,
      });
    }
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({
      message: "Issue verifying the user",
      status: 500,
    });
  }
}
