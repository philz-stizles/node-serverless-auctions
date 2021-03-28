const AWS = require('aws-sdk');
const createError = require('http-errors');
const commonMiddleware = require('../middlewares/commonMiddleware');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAuctionById = async (id) => {
  let auction;

  try {
    const result = await dynamodb.get({ // Add the dynamodb:Scan Action to the provider.iamRoleStatements.Action
      TableName: 'AuctionsTable',
      Key: { id }
    }).promise();

    auction = result.Item;

  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if(!auction) {
    throw new createError.NotFound(`Auction with ID ${id} was not found`)
  }

  return auction;
}

const getAuction = async (event, context) => {
  const { auctionId } = event.pathParameters;

  const auction = await getAuctionById(auctionId)

  return {
    statusCode: 200,
    body: JSON.stringify(auction, null, 2)
  };
};

exports.getAuctionById = getAuctionById
exports.handler = commonMiddleware(getAuction);
