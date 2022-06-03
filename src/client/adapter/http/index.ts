import { handlerPath } from '@shared/helper/context.route'

import { createSchemaClient, updateSchemaClient } from './schema'

export const clientGet = {
  handler: `${handlerPath(__dirname)}/route.handlerGetClient`,
  events: [
    {
      http: {
        method: 'get',
        path: 'client/{client}',
      },
    },
  ],
}

export const clientGetForState = {
  handler: `${handlerPath(__dirname)}/route.handlerGetClientForState`,
  events: [
    {
      http: {
        method: 'get',
        path: 'client/{account}/state/{state}',
      },
    },
  ],
}
export const clientCreate = {
  handler: `${handlerPath(__dirname)}/route.handlerCreateClient`,
  events: [
    {
      http: {
        method: 'post',
        path: 'client/',
        request: {
          schemas: {
            'application/json': createSchemaClient,
          },
        },
      },
    },
  ],
}

export const clientUpdate = {
  handler: `${handlerPath(__dirname)}/route.handlerUpdateClient`,
  events: [
    {
      http: {
        method: 'put',
        path: 'client/{client}',
        request: {
          schemas: {
            'application/json': updateSchemaClient,
          },
        },
      },
    },
  ],
}
