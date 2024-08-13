import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log(reqBody);
    const { email, password } = reqBody;

    const user = await User.findOne({ email });

    // handling user not found case
    if (!user) {
      return NextResponse.json({
        message: "User does not exists",
        status: 400,
      });
    }

    // user found success case
    const validPassword = await bcryptjs.compare(password, user.password);

    // invalid password check
    if (!validPassword) {
      return NextResponse.json({
        message: "Check your credentials",
        status: 500,
      });
    }

    // creating token
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const resposne = NextResponse.json({
      message: "Login Success!",
      success: true,
    });

    resposne.cookies.set("token", token, {
      httpOnly: true,
    });

    return resposne;
  } catch (error: any) {
    return NextResponse.json({
      message: "Soemthing went wrong while loging in",
      status: 500,
    });
  }
}
