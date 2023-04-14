const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) create a transporter
  // FOR GMAIL
  //   const transporter = nodemailer.createTransport({
  //     service: 'Gmail',
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       password: process.env.EMAIL_PASSWORD,
  //     },
  //     // activate in gmail "less secure app" option
  //   });
  const transporter = nodemailer.createTransport({
    host: config.env.EMAIL_HOST,
    port: config.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Feshal Naguji <hello@feshal.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
