const axios = require('axios');

const sendEmail = async (options) => {
  // Placeholder for real email logic (Nodemailer)
  console.log(`Sending email to ${options.to}: ${options.subject}`);
};

const sendSMS = async (phone, message) => {
  // Placeholder for Fast2SMS integration
  console.log(`Sending SMS to ${phone}: ${message}`);
};

module.exports = { sendEmail, sendSMS };
