const nodemailer = require("nodemailer");

// Helper function to clean environment variables (remove quotes if present)
const cleanEnvVar = (value) => {
  if (!value) return value;
  return value.toString().replace(/^["']|["']$/g, "");
};

// Check if required environment variables are set
const checkEmailEnvVars = () => {
  const requiredVars = {
    host: process.env.BREVO_SMTP_HOST || process.env.SMTP_HOST,
    user: process.env.BREVO_SMTP_USER || process.env.SMTP_USER,
    pass:
      process.env.BREVO_SMTP_PASS ||
      process.env.BREVO_SMTP_KEY ||
      process.env.SMTP_PASS,
  };

  const missing = [];
  if (!requiredVars.host) missing.push("BREVO_SMTP_HOST or SMTP_HOST");
  if (!requiredVars.user) missing.push("BREVO_SMTP_USER or SMTP_USER");
  if (!requiredVars.pass)
    missing.push("BREVO_SMTP_PASS, BREVO_SMTP_KEY, or SMTP_PASS");

  return {
    isValid: missing.length === 0,
    missing,
    vars: requiredVars,
  };
};

// Create a transporter using Brevo SMTP configuration from environment variables
// Note: Brevo SMTP requires SMTP password, not API key
const getTransporter = () => {
  const envCheck = checkEmailEnvVars();

  if (!envCheck.isValid) {
    console.error("❌ Missing required email environment variables:");
    envCheck.missing.forEach((varName) => console.error(`   - ${varName}`));
    return null;
  }

  const host = cleanEnvVar(envCheck.vars.host);
  const port = parseInt(
    process.env.BREVO_SMTP_PORT || process.env.SMTP_PORT || 587
  );
  const user = cleanEnvVar(envCheck.vars.user);
  const pass = cleanEnvVar(envCheck.vars.pass);

  return nodemailer.createTransport({
    host,
    port,
    secure: false, // Brevo uses port 587 with secure: false (STARTTLS)
    auth: {
      user,
      pass,
    },
    // Add connection timeout
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
    // Add debug option for troubleshooting
    debug: process.env.NODE_ENV === "development",
    logger: process.env.NODE_ENV === "development",
  });
};

const transporter = getTransporter();

// Function to send welcome email to newly registered users
const sendWelcomeEmail = async (email, username) => {
  try {
    // Check if transporter is available
    if (!transporter) {
      const envCheck = checkEmailEnvVars();
      return {
        success: false,
        error:
          "Email configuration is missing. Please set the required environment variables.",
        missingVars: envCheck.missing,
      };
    }

    // Debug: Log email configuration (without sensitive data)
    const senderEmail = cleanEnvVar(
      process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER
    );

    console.log("=".repeat(50));
    console.log("📧 Attempting to send email...");
    console.log("From:", senderEmail);
    console.log("To:", email);
    console.log("Username:", username);
    console.log(
      "SMTP Host:",
      cleanEnvVar(process.env.BREVO_SMTP_HOST || process.env.SMTP_HOST)
    );
    console.log(
      "SMTP Port:",
      process.env.BREVO_SMTP_PORT || process.env.SMTP_PORT || 587
    );
    console.log(
      "SMTP User:",
      cleanEnvVar(process.env.BREVO_SMTP_USER || process.env.SMTP_USER)
    );
    console.log("=".repeat(50));

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || "Atria"}" <${senderEmail}>`,
      to: email,
      subject: "Welcome to Atria - Registration Successful!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Atria!</h1>
            </div>
            <div class="content">
              <h2>Hello ${username}!</h2>
              <p>Thank you for registering with us. We're excited to have you on board!</p>
              <p>Your account has been successfully created. You can now log in and start exploring all the features we have to offer.</p>
              <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              <p>Best regards,<br>The Atria Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Atria!
        
        Hello ${username}!
        
        Thank you for registering with us. We're excited to have you on board!
        
        Your account has been successfully created. You can now log in and start exploring all the features we have to offer.
        
        If you have any questions or need assistance, please don't hesitate to contact our support team.
        
        Best regards,
        The Atria Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("=".repeat(50));
    console.log("✅ Welcome email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
    console.log("Accepted recipients:", info.accepted);
    console.log("Rejected recipients:", info.rejected);
    console.log("=".repeat(50));
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error("=".repeat(50));
    console.error("❌ Error sending welcome email:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error command:", error.command);
    console.error("Error responseCode:", error.responseCode);

    if (error.response) {
      console.error("SMTP Response:", error.response);
    }

    if (error.responseCode) {
      console.error("SMTP Response Code:", error.responseCode);
    }

    if (error.code === "EAUTH") {
      console.error("⚠️ Authentication failed. Check your SMTP credentials.");
    } else if (error.code === "ETIMEDOUT" || error.code === "ECONNREFUSED") {
      console.error("⚠️ Connection failed. Check your SMTP host and port.");
    } else if (error.code === "EENVELOPE") {
      console.error("⚠️ Invalid email address format.");
    }

    console.error("Full error:", error);
    console.error("=".repeat(50));

    return {
      success: false,
      error: error.message,
      code: error.code,
      responseCode: error.responseCode,
      details: error,
    };
  }
};

// Function to verify email configuration
const verifyEmailConfig = async () => {
  try {
    console.log("=".repeat(50));
    console.log("🔍 Verifying email configuration...");

    const envCheck = checkEmailEnvVars();

    if (!envCheck.isValid) {
      console.error("❌ Missing required environment variables:");
      envCheck.missing.forEach((varName) => console.error(`   - ${varName}`));
      console.error("=".repeat(50));
      return false;
    }

    if (!transporter) {
      console.error("❌ Failed to create email transporter");
      console.error("=".repeat(50));
      return false;
    }

    console.log(
      "SMTP Host:",
      cleanEnvVar(process.env.BREVO_SMTP_HOST || process.env.SMTP_HOST)
    );
    console.log(
      "SMTP Port:",
      process.env.BREVO_SMTP_PORT || process.env.SMTP_PORT || 587
    );
    console.log(
      "SMTP User:",
      cleanEnvVar(process.env.BREVO_SMTP_USER || process.env.SMTP_USER)
    );
    console.log(
      "Sender Email:",
      cleanEnvVar(process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER)
    );
    console.log("Testing SMTP connection...");

    await transporter.verify();
    console.log("✅ Email server is ready to send messages");
    console.log("=".repeat(50));
    return true;
  } catch (error) {
    console.error("=".repeat(50));
    console.error("❌ Email server configuration error:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error command:", error.command);
    console.error("Error responseCode:", error.responseCode);

    if (error.code === "EAUTH") {
      console.error("⚠️ Authentication failed. Please check:");
      console.error("   - BREVO_SMTP_USER or SMTP_USER");
      console.error("   - BREVO_SMTP_PASS, BREVO_SMTP_KEY, or SMTP_PASS");
      console.error("   Note: Brevo requires SMTP password, not API key");
    } else if (error.code === "ETIMEDOUT" || error.code === "ECONNREFUSED") {
      console.error("⚠️ Connection failed. Please check:");
      console.error("   - BREVO_SMTP_HOST or SMTP_HOST");
      console.error("   - BREVO_SMTP_PORT or SMTP_PORT (default: 587)");
      console.error("   - Your internet connection");
      console.error("   - Firewall settings");
    }

    if (error.response) {
      console.error("SMTP Response:", error.response);
    }
    if (error.responseCode) {
      console.error("SMTP Response Code:", error.responseCode);
    }
    console.error("=".repeat(50));
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  verifyEmailConfig,
  transporter,
  checkEmailEnvVars,
};
