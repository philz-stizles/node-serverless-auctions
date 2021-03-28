const createError = require('http-errors');
const { getEndedAuctions, closeAuction } = require('../lib/auctionsLib');

const processAuctions = async (event, context) => {
  try {
    console.log('Processing Auctions!');

    const auctionsToClose = await getEndedAuctions();
    
    const closePromises = auctionsToClose.map(auction => closeAuction(auction));

    await Promise.all(closePromises);

    return { close: closePromises.length };

    console.log('Processing Auctions Done!!!');

  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
};

module.exports.handler = processAuctions;
