const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getEndedAuctions = async () => {
  const now = new Date();
  const params = {
    TableName: 'AuctionsTable',
    IndexName: 'statusAndEndingAt',
    KeyConditionExpression: '#status = :status AND endingAt <= :now',
    ExpressionAttributeValues: {
      ':status': 'OPEN',
      ':now': now.toISOString()
    },
    ExpressionAttributeNames: {
      '#status':'status'
    }
  };

  const result = await dynamodb.query(params).promise();
  return result.Items;
}

module.exports.closeAuction = async (auction) => {
  const params = {
    TableName: 'AuctionsTable',
    Key: { id: auction.id },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status': 'CLOSED'
    },
    ExpressionAttributeNames: {
      '#status':'status'
    },
  };

  const result = await dynamodb.update(params).promise();
  
  return result;
}