const AWS = require('aws-sdk');
const createError = require('http-errors');
const validator = require('@middy/validator');
const commonMiddleware = require('../middlewares/commonMiddleware');
const getAuctionsSchema = require('../schemas/getAuctionsSchema');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAuctions = async (event, context) => {
  const { status } = event.queryStringParameters;

  let auctions;
  
  const params = {
    TableName: 'AuctionsTable',
    IndexName: 'statusAndEndingAt',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status
    },
    ExpressionAttributeNames: {
      '#status':'status'
    }
  };

  try {
    const result = await dynamodb.query(params).promise(); // Add the dynamodb:Scan Action to the provider.iamRoleStatements.Action
    auctions = result.Items;

  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
};

// const getAuctions = async (event, context) => {
//   let auctions;

//   try {
//     const result = await dynamodb.scan({ // Add the dynamodb:Scan Action to the provider.iamRoleStatements.Action
//       TableName: 'AuctionsTable'
//     }).promise();

//     auctions = result.Items;

//   } catch (error) {
//     console.error(error);
//     throw new createError.InternalServerError(error);
//   }

//   return {
//     statusCode: 200,
//     body: JSON.stringify(auctions),
//   };
// };

module.exports.handler = commonMiddleware(getAuctions)
  .use(validator({ 
    inputSchema: getAuctionsSchema, 
    ajvOptions: { useDefaults: true } 
  }));
