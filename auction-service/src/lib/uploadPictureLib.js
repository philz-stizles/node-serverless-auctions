import AWS from 'aws-sdk';

module.exports.uploadPictureToS3 = async (key, body) => {
  const s3 = new AWS.S3();
  const result = await s3.upload({
    Bucket: process.env.AUCTIONS_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
  }).promise();

  return result.Location;
}

module.exports.setAuctionPictureUrl = async (id, pictureUrl) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set pictureUrl = :pictureUrl',
    ExpressionAttributeValues: {
      ':pictureUrl': pictureUrl,
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamodb.update(params).promise();
  return result.Attributes;
}