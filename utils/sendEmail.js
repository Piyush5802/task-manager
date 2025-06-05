const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async (to, subject, text) => {
  await sgMail.send({
    to,
    from: process.env.SENDGRID_EMAIL_FROM,
    subject,
    text
  });
};