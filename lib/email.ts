import nodemailer from "nodemailer";

// Create nodemailer transporter using Gmail SMTP
const getTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.error("❌ Email SMTP credentials not configured!");
    console.error("Please ensure  and EMAIL_PASS are set in your .env.local file");
    console.error("Note: You need to use a Gmail App Password, not your regular Gmail password");
    console.error("Get an App Password at: https://myaccount.google.com/apppasswords");
    throw new Error(
      "Email SMTP credentials not configured. Please set EMAIL_USER and EMAIL_PASS in .env.local"
    );
  }

  console.log(`📧 Configuring email transporter for: ${emailUser}`);
  
  return nodemailer.createTransport({
    service: "gmail",
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass, // Gmail App Password (not regular password)
    },
  });
};

// Send email using nodemailer (Gmail SMTP)
export async function sendEmail(to: string, subject: string, html: string, text?: string) {
  try {
    const transporter = getTransporter();
    const fromEmail = process.env.EMAIL_USER;

    if (!fromEmail) {
      throw new Error("EMAIL_USER not configured");
    }

    const info = await transporter.sendMail({
      from: `"Crystal Bowl Studio" <${fromEmail}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Plain text fallback
    });

    console.log(`✅ Email sent successfully to ${to} | Subject: ${subject} | Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email send error:", error);
    
    // Check for authentication error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'EAUTH') {
      console.error("⚠️  Gmail Authentication Failed!");
      console.error("Please check:");
      console.error("1. EMAIL_USER is set to your full Gmail address");
      console.error("2. EMAIL_PASS is set to a valid App Password (NOT your regular password)");
      console.error("3. 2-Step Verification is enabled on your Google Account");
      console.error("4. Create an App Password at: https://myaccount.google.com/apppasswords");
    }
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
}

// Send OTP email
export async function sendOTPEmail(email: string, otp: string, name: string) {
  const subject = "Verify Your Email - Crystal Bowl Studio";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background-color: #f9f9f9; }
        .otp-box { background-color: #fff; border: 2px solid #000; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Crystal Bowl Studio</h1>
        </div>
        <div class="content">
          <h2>Hello ${name}!</h2>
          <p>Thank you for registering with Crystal Bowl Studio. Please verify your email address using the OTP below:</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Crystal Bowl Studio. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await sendEmail(email, subject, html);
    console.log(`✅ OTP email sent successfully to ${name} (${email})`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${name} (${email}):`, error);
    throw error;
  }
}

// Send verification email with link
export async function sendVerificationEmail(email: string, name: string, verificationUrl: string) {
  const subject = "Verify Your Email - Crystal Bowl Studio";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background-color: #f9f9f9; }
        .button { display: inline-block; background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Crystal Bowl Studio</h1>
        </div>
        <div class="content">
          <h2>Hello ${name}!</h2>
          <p>Thank you for registering with Crystal Bowl Studio. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Crystal Bowl Studio. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await sendEmail(email, subject, html);
    console.log(`✅ Verification email sent successfully to ${name} (${email})`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send verification email to ${name} (${email}):`, error);
    throw error;
  }
}

// Send enquiry notification to admin
export async function sendEnquiryNotificationToAdmin(enquiryData: {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  services: string;
  sessionType: string;
  comment?: string;
  createdAt: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  
  if (!adminEmail) {
    throw new Error("Admin email not configured");
  }

  const subject = `New Yoga Session Enquiry - ${enquiryData.fullName}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1C3163; color: #fff; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background-color: #f9f9f9; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #fff; }
        .info-table td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
        .info-table td:first-child { font-weight: bold; width: 200px; color: #1C3163; }
        .session-badge { display: inline-block; padding: 6px 12px; border-radius: 5px; font-weight: bold; color: #fff; }
        .discovery { background-color: #10b981; }
        .private { background-color: #3b82f6; }
        .corporate { background-color: #8b5cf6; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Session Enquiry</h1>
        </div>
        <div class="content">
          <h2>New enquiry received from ${enquiryData.fullName}</h2>
          <p>A new yoga session enquiry has been submitted. Here are the details:</p>
          
          <table class="info-table">
            <tr>
              <td>Full Name</td>
              <td>${enquiryData.fullName}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td><a href="mailto:${enquiryData.email}">${enquiryData.email}</a></td>
            </tr>
            <tr>
              <td>Phone</td>
              <td><a href="tel:${enquiryData.phone}">${enquiryData.phone}</a></td>
            </tr>
            <tr>
              <td>Address</td>
              <td>${enquiryData.address}</td>
            </tr>
            <tr>
              <td>Date of Birth</td>
              <td>${enquiryData.dateOfBirth}</td>
            </tr>
            <tr>
              <td>Service Requested</td>
              <td>${enquiryData.services}</td>
            </tr>
            <tr>
              <td>Session Type</td>
              <td>
                <span class="session-badge ${enquiryData.sessionType || 'discovery'}">
                  ${enquiryData.sessionType ? (enquiryData.sessionType.charAt(0).toUpperCase() + enquiryData.sessionType.slice(1)) : 'Discovery'}
                </span>
              </td>
            </tr>
            ${enquiryData.comment ? `
            <tr>
              <td>Comment</td>
              <td>${enquiryData.comment}</td>
            </tr>
            ` : ''}
            <tr>
              <td>Submitted At</td>
              <td>${new Date(enquiryData.createdAt).toLocaleString()}</td>
            </tr>
          </table>
          
          <p style="margin-top: 30px;">
            <strong>Action Required:</strong> Please contact ${enquiryData.fullName} at the provided email or phone number to discuss their ${enquiryData.sessionType} session enquiry.
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Crystal Bowl Studio. All rights reserved.</p>
          <p>This is an automated notification from your website's enquiry form.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await sendEmail(adminEmail, subject, html);
    console.log(`✅ Admin notification sent successfully for enquiry from ${enquiryData.fullName}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send admin notification for enquiry from ${enquiryData.fullName}:`, error);
    throw error;
  }
}

// Send confirmation email to user
export async function sendEnquiryConfirmationToUser(enquiryData: {
  fullName: string;
  email: string;
  services: string;
  sessionType: string;
}) {
  const subject = "Thank You for Your Enquiry - Crystal Bowl Studio";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1C3163; color: #fff; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; background-color: #f9f9f9; }
        .highlight-box { background-color: #fff; border-left: 4px solid #1C3163; padding: 20px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; background-color: #1C3163; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ Crystal Bowl Studio</h1>
          <p style="margin: 0; font-size: 18px;">Thank You for Your Interest!</p>
        </div>
        <div class="content">
          <h2>Hello ${enquiryData.fullName}!</h2>
          <p>Thank you for your enquiry about our <strong>${enquiryData.services}</strong> service.</p>
          
          <div class="highlight-box">
            <h3 style="margin-top: 0;">📋 What's Next?</h3>
            <p>We have received your enquiry for a <strong>${enquiryData.sessionType}</strong> session and our team will review it shortly.</p>
            <p>One of our specialists will contact you within 24-48 hours to discuss:</p>
            <ul>
              <li>Available session times</li>
              <li>Pricing and packages</li>
              <li>Your specific needs and goals</li>
              <li>Any questions you may have</li>
            </ul>
          </div>
          
          <p>In the meantime, feel free to explore more about our services on our website.</p>
          
          <p style="margin-top: 30px;">
            <strong>Need immediate assistance?</strong><br>
            Feel free to reach out to us directly at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>
          </p>
          
          <p style="margin-top: 30px; font-style: italic; color: #666;">
            We look forward to guiding you on your wellness journey!
          </p>
        </div>
        <div class="footer">
          <p><strong>Crystal Bowl Studio</strong></p>
          <p>&copy; ${new Date().getFullYear()} Crystal Bowl Studio. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await sendEmail(enquiryData.email, subject, html);
    console.log(`✅ Confirmation email sent successfully to ${enquiryData.fullName} (${enquiryData.email})`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send confirmation email to ${enquiryData.fullName} (${enquiryData.email}):`, error);
    throw error;
  }
}


