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



exports.getInTouch = async (to, recipientName, userMessage) => {
  

  try {
    // Render the email template
    const thankyouForContactingUs = await ejs.renderFile(
      path.join(__dirname, '../../views/thankyouForContactingUs.ejs'),
      { recipientName }
    );

    const youHaveNewContactUsMessage = await ejs.renderFile(
      path.join(__dirname, '../../views/youHaveNewContactUsMessage.ejs'),
      { recipientName, userEmail: to, userMessage }
    );

    const thankyouForContactingUsOptions = {
      from: `"Plant Seller" <${smtpConfig.auth.user}>`, // Sender address
      to, // List of receivers
      subject: "Thank you for reaching out to us.", // Subject line
      html: thankyouForContactingUs, // HTML body
    };

    const youHaveNewContactUsMessageOptions = {
      from: `"Plant Seller" <${smtpConfig.auth.user}>`, // Sender address
      to: "piyushraj2340@gmail.com", // List of receivers
      subject: "New message from PlantSeller", // Subject line
      html: youHaveNewContactUsMessage, // HTML body
    };

    // Send email
    await transporter.sendMail(thankyouForContactingUsOptions);
    await transporter.sendMail(youHaveNewContactUsMessageOptions);

    return true
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


exports.emailSubscriber = async (to) => {
  try {
    // Render the email template
    const thankyouForSubscribingUs = await ejs.renderFile(
      path.join(__dirname, '../../views/thankyouForSubscribingUs.ejs'));

    const youHaveNewSubscriber = await ejs.renderFile(
      path.join(__dirname, '../../views/youHaveNewSubscriber.ejs'),
      { subscriberEmail : to }
    );

    const thankyouForSubscribingUsOptions = {
      from: `"Plant Seller" <${smtpConfig.auth.user}>`, // Sender address
      to, // List of receivers
      subject: "Thank You for Subscribing!", // Subject line
      html: thankyouForSubscribingUs, // HTML body
    };

    const youHaveNewSubscriberOptions = {
      from: `"Plant Seller" <${smtpConfig.auth.user}>`, // Sender address
      to: "piyushraj2340@gmail.com", // List of receivers
      subject: "New subscriber from PlantSeller", // Subject line
      html: youHaveNewSubscriber, // HTML body
    };

    // Send email
    await transporter.sendMail(thankyouForSubscribingUsOptions);
    await transporter.sendMail(youHaveNewSubscriberOptions);

    return true
  } catch (error) {
    console.error('Error sending email:', error);
  }
};