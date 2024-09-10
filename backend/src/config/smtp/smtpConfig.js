// config/smtpConfig.js
require('dotenv').config();

const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_GOOGLE_MAIL_ADDRESS,
    pass: process.env.SMTP_GOOGLE_APP_PASSWORD,
  },
};

module.exports = smtpConfig;
