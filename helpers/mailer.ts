import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => { 
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        
        if (emailType === "VEIFY") {
            await User.findByIdAndUpdate(userId, { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 360000 })
        } else if (emailType === "RESET") { 
            await User.findByIdAndUpdate(userId, { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 360000 })
        }

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "cc7f3cdea9e864", // put in env 
                pass: "dea9463c30a5ab" // put in env 
            }
        });

        const mailOptions = {
            from: 'madhav@madhav.ai',
            to: email,
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
            html: `<p> Click <a href="${process.env.DOMAIN}/verifyemail?toke=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "Verify your email" : "reset your password"}
                    or copy and paste the below link in your browser <br>
                    </p>${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
        }

        const mailResponse = await transporter.sendMail(mailOptions)

    } catch(error: any) { 
        throw new Error(error.message)
    }
}