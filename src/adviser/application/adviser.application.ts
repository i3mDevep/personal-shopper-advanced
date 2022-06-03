import type { BridgeRepository } from '@shared/event-bridge/domain/event.repository'
import { EventPersonalShopper } from '@shared/event-bridge/helper/event.personal-shopper'
import BaseApplication from '@shared/persistence/dynamodb/application/dynamodb.application'

import type { AdviserModel } from '../domain/adviser.model'
import type { AdviserRepository } from '../domain/adviser.repository'

export class AdviserApplication extends BaseApplication<AdviserModel> {
  constructor(
    private repositoryAdviser: AdviserRepository,
    private eventRepository: BridgeRepository
  ) {
    super(repositoryAdviser)
  }

  async getAdviserForState(account: string, state: string) {
    return this.repositoryAdviser.getAdviserForState(account, state)
  }

  async getAdviserForAccount(account: string) {
    return this.repositoryAdviser.getAdviserForAccount(account)
  }

  async advicerSearchAvailable(client: Record<string, unknown>) {
    if (!client.account) return 'account is required'
    const res = await this.getAdviserForState(
      client.account as string,
      'AVAILABLE'
    )

    if (res.payload.total)
      await this.eventRepository.sendMessage([
        {
          Detail: JSON.stringify(res),
          DetailType: EventPersonalShopper.EVENT_ADVISER_AVAILABLE,
        },
      ])
    else {
      await this.eventRepository.sendMessage([
        {
          Detail: JSON.stringify(res),
          DetailType: EventPersonalShopper.EVENT_ADVISER_UNAVAILABLE,
        },
      ])
    }

    return res
  }
}
