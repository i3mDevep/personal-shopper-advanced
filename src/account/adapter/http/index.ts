import { handlerPath } from '@shared/helper/context.route'

import { createSchemaAccount, updateSchemaAccount } from './schemas'

export const accountGet = {
  handler: `${handlerPath(__dirname)}/route.handlerGetAccount`,
  events: [
    {
      http: {
        method: 'get',
        path: 'account/{account}',
      },
    },
  ],
}

export const accountCreate = {
  handler: `${handlerPath(__dirname)}/route.handlerCreateAccount`,
  events: [
    {
      http: {
        method: 'post',
        path: 'account/',
        request: {
          schemas: {
            'application/json': createSchemaAccount,
          },
        },
      },
    },
  ],
}

export const accountUpdate = {
  handler: `${handlerPath(__dirname)}/route.handlerUpdateAccount`,
  events: [
    {
      http: {
        method: 'put',
        path: 'account/{account}',
        request: {
          schemas: {
            'application/json': updateSchemaAccount,
          },
        },
      },
    },
  ],
}
