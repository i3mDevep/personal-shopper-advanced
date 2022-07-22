import { handlerPath } from '@shared/helper/context.route'

import { createSchemaClient, updateSchemaClient } from './schema'

export const caseGet = {
  handler: `${handlerPath(__dirname)}/route.handlerGetClient`,
  events: [
    {
      http: {
        method: 'get',
        path: 'case/{case}',
      },
    },
  ],
}

export const caseJoin = {
  handler: `${handlerPath(__dirname)}/route.handlerJoinClient`,
  events: [
    {
      http: {
        method: 'post',
        path: 'case/{case}/join',
      },
    },
  ],
}
export const caseGetForState = {
  handler: `${handlerPath(__dirname)}/route.handlerGetClientForState`,
  events: [
    {
      http: {
        method: 'get',
        path: 'case/{account}/{adviser}',
      },
    },
  ],
}

export const caseCreate = {
  handler: `${handlerPath(__dirname)}/route.handlerCreateClient`,
  events: [
    {
      http: {
        method: 'post',
        path: 'case',
        request: {
          schemas: {
            'application/json': createSchemaClient,
          },
        },
      },
    },
  ],
}

export const caseUpdate = {
  handler: `${handlerPath(__dirname)}/route.handlerUpdateClient`,
  events: [
    {
      http: {
        method: 'put',
        path: 'case/{case}',
        request: {
          schemas: {
            'application/json': updateSchemaClient,
          },
        },
      },
    },
  ],
}
