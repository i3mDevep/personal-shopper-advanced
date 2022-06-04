import { EventPersonalShopper } from '@shared/event-bridge/helper/event.personal-shopper'
import { handlerPath } from '@shared/helper/context.route'

export const searchAvailableEvent = {
  handler: `${handlerPath(__dirname)}/route.searchAdviserAvailable`,
  events: [
    {
      eventBridge: {
        eventBus: process.env.BUS_PERSONAL_SHOPPER,
        pattern: {
          source: ['custom.personal-shopper'],
          'detail-type': [EventPersonalShopper.EVENT_CLIENT_CREATED],
        },
      },
    },
  ],
}
