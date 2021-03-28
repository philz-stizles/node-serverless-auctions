module.exports = schema = {
  properties: {
    body: {
      type: 'string',
      minLength: 1,
      pattern: '\=$'
    },
  },
  required: ['body'],
};