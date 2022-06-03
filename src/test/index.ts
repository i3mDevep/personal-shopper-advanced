import { handlerPath } from '@shared/helper/context.route'

export const puto = {
  handler: `${handlerPath(__dirname)}/route.handler`,
  events: [
    {
      http: {
        method: 'post',
        path: 'puto/',
      },
    },
  ],
}
