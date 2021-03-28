'use strict';
const AWS = require('aws-sdk');

const ses = new AWS.SES({ region: 'eu-west-2' });

module.exports.handler = async (event, context) => {
  const record = event.Records[0];

  console.log('Record processing', record);

  const email = JSON.parse(record.body);

  const { subject, body, recipient } = email;

  const params = {
    Source: 'theophilusighalo@gmail.com',
    Destination: {
      ToAddresses: [recipient]
    },
    Message: {
      Body: { Text: { Data: body } },
      Subject: { Data: subject }
    }
  };

  try {

    const result = await ses.sendEmail(params).promise();
    console.log(result)
    return result;

  } catch (error) {
    console.error(error);
    // throw new createError.InternalServerError(error);
  }
  
  return event
};
