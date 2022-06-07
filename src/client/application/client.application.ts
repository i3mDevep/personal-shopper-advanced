import createError from 'http-errors'
import type { BridgeRepository } from '@shared/event-bridge/domain/event.repository'
import { EventPersonalShopper } from '@shared/event-bridge/helper/event.personal-shopper'
import BaseApplication from '@shared/persistence/dynamodb/application/dynamodb.application'
import type Result from '@shared/persistence/dynamodb/application/result.interface'
import { identityDatabase as ID } from '@shared/helper/identity.database'
import type { JoinInfoResponseType } from '@shared/types/chime'
import { ResponseDto } from '@shared/persistence/dynamodb/application/response.dto'

import type { MeetingApplication } from '../../meeting/application/meeting.application'
import type { ClientModel } from '../domain/client.model'
import type { StoreRepository } from '../domain/client.store.repository'

export class ClientApplication extends BaseApplication<ClientModel> {
  constructor(
    private storeRepository: StoreRepository,
    private eventRepository: BridgeRepository,
    private meetingApplication?: MeetingApplication
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

  async joinClient(
    id: string
  ): Promise<Result<ClientModel & JoinInfoResponseType>> {
    const client = await this.storeRepository.getItem({
      PK: `${ID.Client}#${id}`,
      SK: `${ID.Client}#${id}`,
    })

    if (!client.payload.data) throw createError(409, 'Client is not exist')

    const joinInfo = await this.meetingApplication.joinMeeting(
      id,
      (client.payload.data as ClientModel).fullName,
      'guest'
    )

    return ResponseDto('123', { ...client.payload.data, ...joinInfo })
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
