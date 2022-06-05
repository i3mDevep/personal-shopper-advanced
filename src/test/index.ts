import { EventPersonalShopper } from '@shared/event-bridge/helper/event.personal-shopper'
import { handlerPath } from '@shared/helper/context.route'

export const puto = {
  handler: `${handlerPath(__dirname)}/route.handler`,
  events: [
    {
      eventBridge: {
        eventBus: process.env.BUS_PERSONAL_SHOPPER,
        pattern: {
          source: ['custom.personal-shopper'],
          'detail-type': [
            EventPersonalShopper.EVENT_CLIENT_CREATED,
            EventPersonalShopper.EVENT_ADVISER_ACCEPTED,
          ],
        },
      },
    },
  ],
}
