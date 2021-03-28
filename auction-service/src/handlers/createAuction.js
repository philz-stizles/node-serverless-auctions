const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const createError = require('http-errors');
const validator = require('@middy/validator');
const commonMiddleware = require('../middlewares/commonMiddleware');
const createAuctionSchema = require('../schemas/createAuctionSchema');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const createAuction = async (event, context) => {
  // const { title }  = JSON.parse(event.body);
  const { title }  = event.body;
  const { email }  = event.requestContext.authorizer;
  const now = new Date();
  const endingAt = new Date();
  endingAt.setHours(now.getHours() + 1);

  const newAuction = {
    id: uuidv4(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endingAt.toISOString(),
    highestBid: {
      amount: 0
    },
    seller: email
  };

  try {
    await dynamodb.put({
      TableName: 'AuctionsTable',
      Item: newAuction
    }).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(newAuction),
  };
};

module.exports.handler = commonMiddleware(createAuction)
  .use(validator({ inputSchema: createAuctionSchema }));
