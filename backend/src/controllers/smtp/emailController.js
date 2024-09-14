// controllers/emailController.js
const nodemailer = require('nodemailer');
const smtpConfig = require('../../config/smtp/smtpConfig');
const path = require('path');
const ejs = require('ejs');

const transporter = nodemailer.createTransport(smtpConfig);

// Verify SMTP connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

exports.confirmAccountSendEmail = async (to, userName, confirmationLink) => {

  try {
    // Render the email template
    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, '../../views/confirmAccountEmailTemplate.ejs'),
      { userName, confirmationLink, companyName: 'PlantSeller', expirationTime: "15" }
    );

    const mailOptions = {
      from: `"Plant Seller" <${smtpConfig.auth.user}>`, // Sender address
      to, // List of receivers
      subject: "Verify Your Account", // Subject line
      html: emailTemplate, // HTML body
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


exports.resetPasswordSendEmail = async (to, userName, resetLink) => {
  

  try {
    // Render the email template
    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, '../../views/resetPasswordLinkEmailTemplate.ejs'),
      { userName, resetLink, companyName: 'PlantSeller', expirationTime: "15" }
    );

    const mailOptions = {
      from: `"Plant Seller" <${smtpConfig.auth.user}>`, // Sender address
      to, // List of receivers
      subject: "Reset Your Password", // Subject line
      html: emailTemplate, // HTML body
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return true
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

