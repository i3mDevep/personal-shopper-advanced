import { handlerPath } from '@shared/helper/context.route'

export const puto = {
  handler: `${handlerPath(__dirname)}/route.handler`,
  events: [
    {
      eventBridge: {
        eventBus: process.env.BUS_PERSONAL_SHOPPER,
        pattern: {
          source: ['custom.personal-shopper'],
          'detail-type': ['ClientCreated'],
        },
      },
    },
  ],
}
