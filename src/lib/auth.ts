import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.App_Email,
        pass: process.env.App_Pass,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
                required: false,
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignup: false,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
            const verifyUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
            const info = await transporter.sendMail({
                from: "blog_app", // sender address
                to: user.email, // list of recipients
                subject: "Verify your email", // subject line
                text: `Click on the link to verify your email: ${verifyUrl}`, // plain text body
                html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Email Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#4f46e5;color:#ffffff;padding:20px;text-align:center;font-size:22px;font-weight:bold;">
              Blog App
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;color:#333;">
              <h2 style="margin-top:0;">Verify your email</h2>
              <p style="font-size:14px;line-height:1.6;">
                Hi ${user.name || "there"},<br/><br/>
                Thanks for signing up! Please confirm your email address by clicking the button below.
              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" style="margin:20px 0;">
                <tr>
                  <td align="center">
                    <a href="${verifyUrl}" 
                       style="background:#4f46e5;color:#ffffff;padding:12px 20px;
                              text-decoration:none;border-radius:5px;
                              display:inline-block;font-size:14px;">
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;color:#555;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all;font-size:12px;color:#2563eb;">
                ${verifyUrl}
              </p>

              <p style="font-size:13px;color:#777;margin-top:20px;">
                If you didn’t create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f1f1f1;text-align:center;padding:15px;font-size:12px;color:#888;">
              © ${new Date().getFullYear()} Blog App. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`, // HTML body
            });

            console.log("Message sent: %s", info.messageId);
        },
    },
});