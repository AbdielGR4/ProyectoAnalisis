const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abdygaro2@gmail.com',
    pass: 'aepj msng rpna lyaj'
  }
});

module.exports = transporter;
