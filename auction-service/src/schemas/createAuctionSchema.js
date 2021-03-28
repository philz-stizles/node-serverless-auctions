module.exports = schema = {
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string'
        }
      },
      required: ['title']
    }
  },
  required: ['body']
};