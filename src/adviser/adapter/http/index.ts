import { handlerPath } from '@shared/helper/context.route'

import {
  createSchemaAdviser,
  updateSchemaAdviser,
  acceptedSchemaAdviser,
} from './schema'

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

export const adviserAcceptedClient = {
  handler: `${handlerPath(__dirname)}/route.handlerAdviserAcceptedClient`,
  events: [
    {
      http: {
        method: 'post',
        path: 'adviser/accept',
        request: {
          schemas: {
            'application/json': acceptedSchemaAdviser,
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
