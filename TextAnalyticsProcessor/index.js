module.exports = function(context, req) {
  let statusCode = 400;
  let responseBody = 'Invalid request object';

  if (req.params && req.params.requestType) {
    const { requestType } = req.params;
    context.log(`Request type: ${requestType}`);

    if (requestType === 'languages') {
      statusCode = 200;
      responseBody = {
        documents: [
          {
            detectedLanguages: [
              {
                iso6391Name: 'en',
              },
            ],
          },
        ],
      };
    } else if (requestType === 'entities') {
      statusCode = 200;
      responseBody = {
        documents: [
          {
            entities: [
              {
                name: 'Temporary',
              },
            ],
          },
        ],
      };
    }
  }

  context.res = {
    status: statusCode,
    body: responseBody,
  };

  context.done();
};
