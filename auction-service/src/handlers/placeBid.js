const AWS = require('aws-sdk');
const createError = require('http-errors');
const validator = require('@middy/validator');
const commonMiddleware = require('../middlewares/commonMiddleware');
const placeBidSchema = require('../schemas/placeBidSchema');
const { getAuctionById } = require('./getAuction');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const placeBid = async (event, context) => {
  const { amount }  = event.body;
  const { id } = event.pathParameters;
  const { email }  = event.requestContext.authorizer;

  const auction = await getAuctionById(id);

  
  if(auction.status === 'CLOSED') {
    throw new createError.Forbidden(`You cannot bid. Auction is closed!`)
  }

  if(auction.seller === email) {
    throw new createError.Forbidden(`Your cannot place a bid on your own auction`)
  }

  if(auction.highestBid.bidder === email) {
    throw new createError.Forbidden(`Your are already the highest bidder`)
  }

  if(amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}!`)
  }

  const params = {
    TableName: 'AuctionsTable',
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
    ExpressionAttributeValues: {
      ':amount': amount,
      ':bidder': email
    },
    ReturnValues: 'ALL_NEW'
  };

  let updatedAuction;

  try {

    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;

  } catch (error) {

    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(updatedAuction),
  };
};

module.exports.handler = commonMiddleware(placeBid)
  .use(validator({ inputSchema: placeBidSchema, useDefaults: true }));
