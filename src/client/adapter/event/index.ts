import { EventPersonalShopper } from '@shared/event-bridge/helper/event.personal-shopper'
import { handlerPath } from '@shared/helper/context.route'

export const handleClientCanceledEvent = {
  handler: `${handlerPath(__dirname)}/route.handleClientCanceled`,
  events: [
    {
      eventBridge: {
        eventBus: process.env.BUS_PERSONAL_SHOPPER,
        pattern: {
          source: ['custom.personal-shopper'],
          'detail-type': [EventPersonalShopper.EVENT_ADVISER_UNAVAILABLE],
        },
      },
    },
  ],
}

export const handleClientAccepted = {
  handler: `${handlerPath(__dirname)}/route.handleClientAccepted`,
  events: [
    {
      eventBridge: {
        eventBus: process.env.BUS_PERSONAL_SHOPPER,
        pattern: {
          source: ['custom.personal-shopper'],
          'detail-type': [EventPersonalShopper.EVENT_ADVISER_ACCEPTED],
        },
      },
    },
  ],
}
