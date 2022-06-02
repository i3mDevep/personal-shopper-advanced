import { handlerPath } from '@shared/helper/context.route'

import { createSchemaAdviser, updateSchemaAdviser } from './schema'

export const adviserCreate = {
  handler: `${handlerPath(__dirname)}/route.handlerCreateAdviser`,
  events: [
    {
      http: {
        method: 'post',
        path: 'adviser/',
        request: {
          schemas: {
            'application/json': createSchemaAdviser,
          },
        },
      },
    },
  ],
}

export const adviserForAccount = {
  handler: `${handlerPath(__dirname)}/route.handlerAdviserForAccount`,
  events: [
    {
      http: {
        method: 'get',
        path: 'adviser/{account}',
      },
    },
  ],
}

export const handlerGetAdviser = {
  handler: `${handlerPath(__dirname)}/route.handlerGetAdviser`,
  events: [
    {
      http: {
        method: 'get',
        path: 'adviser/{account}/email/{email}',
      },
    },
  ],
}

export const handlerUpdateAdviser = {
  handler: `${handlerPath(__dirname)}/route.handlerUpdateAdviser`,
  events: [
    {
      http: {
        method: 'put',
        path: 'adviser/{account}/email/{email}',
        request: {
          schemas: {
            'application/json': updateSchemaAdviser,
          },
        },
      },
    },
  ],
}

export const adviserForState = {
  handler: `${handlerPath(__dirname)}/route.handlerAdviserForState`,
  events: [
    {
      http: {
        method: 'get',
        path: 'adviser/{account}/state/{state}',
      },
    },
  ],
}
