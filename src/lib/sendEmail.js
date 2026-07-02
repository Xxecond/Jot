 // lib/sendEmail.js
import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error('Missing EMAIL_USER or EMAIL_PASS in .env');
  }

  transporter = nodemailer.createTransport({  // fixed typo
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendMagicLinkEmail(toEmail, magicLink, sessionId = null) {
  // Create simple tracking URLs
  const yesUrl = sessionId ? `${magicLink}&sessionId=${sessionId}&action=approve` : `${magicLink}&action=approve`;
  const noUrl = sessionId ? `${magicLink}&sessionId=${sessionId}&action=deny` : `${magicLink}&action=deny`;
  
  const message = `
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>Someone is trying to log in to Jot</h2>
  <p>Was this you?</p>
  
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width:100%; max-width:400px; margin:30px auto;">
    <tr>
      <td align="center" style="padding:0 6px;">
        <!-- Yes button -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td bgcolor="#22c55e" style="border-radius:8px; background-color:#22c55e;">
              <a href="${yesUrl}" 
                 target="_blank" 
                 style="display:inline-block; padding:12px 20px; color:white; font-weight:bold; text-decoration:none; font-family:Arial, sans-serif;">
                Yes, it's me
              </a>
            </td>
          </tr>
        </table>
      </td>
      
      <td align="center" style="padding:0 6px;">
        <!-- No button -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td bgcolor="#ef4444" style="border-radius:8px; background-color:#ef4444;">
              <a href="${noUrl}" 
                 target="_blank" 
                 style="display:inline-block; padding:12px 20px; color:white; font-weight:bold; text-decoration:none; font-family:Arial, sans-serif;">
                No, it's not me
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  
  <p style="font-size: 14px; color: #666;">This request expires in 15 minutes.</p>
  <p style="font-size: 12px; color: #999;">Clicking will open a minimal confirmation page that you can close immediately.</p>
</div>
  `;

  const t = getTransporter();

  await t.sendMail({
    from: `"Jot" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Jot Login Verification",
    html: message,
  });
}