const smtpapi = require('smtpapi');
const nodemailer = require('nodemailer');

const sendgridUsername = process.env.sendgridUsername;
const sendgridPassword = process.env.sendgridPassword;
const sendgridHost = process.env.sendgridSmtpServer;
const sendgridToAddress = process.env.toAddress;

module.exports = function(context, eventHubMessages) {
  const header = new smtpapi();
  let emailBody = 'The following topics has passed the set threshold:<br />';

  eventHubMessages.forEach(message => {
    if (typeof message.topic === 'undefined') {
      return;
    }

    const { topic, windowStart, windowEnd, count } = message;
    emailBody += `Topic [${topic}] between ${windowStart} and ${windowEnd} with a count of ${count}.<br />`;
    context.log(`Processed message: ${windowStart} [${topic}]`);
  });

  // Add to
  header.addTo(sendgridToAddress);
  const headers = { 'x-smtpapi': header.jsonString() };

  // Use nodemailer to send the email
  const settings = {
    host: sendgridHost,
    port: parseInt(587, 10),
    requiresAuth: true,
    auth: {
      user: sendgridUsername,
      pass: sendgridPassword,
    },
  };
  const smtpTransport = nodemailer.createTransport(settings);

  const mailOptions = {
    from: 'Mor Shemesh <morshe@microsoft.com>',
    to: sendgridToAddress,
    subject: `Alerted Topics`,
    html: emailBody,
    headers,
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    smtpTransport.close();

    if (error) {
      context.log(error);
    } else {
      context.log('Message sent');
    }

    context.done();
  });
};
