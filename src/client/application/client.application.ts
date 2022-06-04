import type { BridgeRepository } from '@shared/event-bridge/domain/event.repository'
import { EventPersonalShopper } from '@shared/event-bridge/helper/event.personal-shopper'
import BaseApplication from '@shared/persistence/dynamodb/application/dynamodb.application'
import type Result from '@shared/persistence/dynamodb/application/result.interface'

import type { ClientModel } from '../domain/client.model'
import type { StoreRepository } from '../domain/client.store.repository'

export class ClientApplication extends BaseApplication<ClientModel> {
  constructor(
    private storeRepository: StoreRepository,
    private eventRepository: BridgeRepository
  ) {
    super(storeRepository)
  }

  getClienForState(
    account: string,
    adviser: string,
    state: string
  ): Promise<Result<ClientModel | Record<string, unknown>>> {
    return this.storeRepository.getClienForState(account, adviser, state)
  }

  override create = async (
    data: ClientModel | Record<string, unknown>,
    search?: Record<string, unknown>
  ) => {
    const res = await this.storeRepository.create(data)

    await this.eventRepository.sendMessage([
      {
        Detail: JSON.stringify({ ...res, ...search }),
        DetailType: EventPersonalShopper.EVENT_CLIENT_CREATED,
      },
    ])

    return res
  }
}
