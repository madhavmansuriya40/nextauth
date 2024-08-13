import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log(reqBody);
    const { username, email, password } = reqBody;

    // TODO: validation
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    console.log("saved user -> ", savedUser);

    // send verification email
    const sentEmail = await sendEmail({
      email,
      emailType: "VERIFY",
      userId: savedUser._id,
    });
    console.log("saved user -> ", savedUser);

    return NextResponse.json({
      message: "User returned successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    console.log("\n\n\nerror --> ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
