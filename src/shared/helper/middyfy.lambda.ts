import middy from '@middy/core'
import validator from '@middy/validator'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'

const outputSchema = {
  type: 'object',
  required: ['body', 'statusCode'],
  properties: {
    body: {
      type: 'string',
    },
    statusCode: {
      type: 'number',
    },
    headers: {
      type: 'object',
    },
  },
}

export const middyfy = (handler, inputSchema = undefined) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(
      validator({
        inputSchema,
        outputSchema,
      })
    )
    .use(httpErrorHandler())
}
