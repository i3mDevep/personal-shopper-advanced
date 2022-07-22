import createError from 'http-errors'
import type { BridgeRepository } from '@shared/event-bridge/domain/event.repository'
import { EventPersonalShopper } from '@shared/event-bridge/helper/event.personal-shopper'
import BaseApplication from '@shared/persistence/dynamodb/application/dynamodb.application'
import type Result from '@shared/persistence/dynamodb/application/result.interface'
import { identityDatabase as ID } from '@shared/helper/identity.database'
import type { JoinInfoResponseType } from '@shared/types/chime'
import { ResponseDto } from '@shared/persistence/dynamodb/application/response.dto'
import { StatePersonalShopper } from '@shared/helper/state.personal-shoper'

import type { MeetingApplication } from '../../meeting/application/meeting.application'
import type { CaseModel } from '../domain/case.model'
import type { StoreRepository } from '../domain/case.store.repository'

export class CaseApplication extends BaseApplication<CaseModel> {
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
  ): Promise<Result<CaseModel | Record<string, unknown>>> {
    return this.storeRepository.getClienForState(account, adviser, state)
  }

  async joinClient(
    id: string
  ): Promise<Result<CaseModel & JoinInfoResponseType>> {
    const client = await this.storeRepository.getItem({
      PK: `${ID.Case}#${id}`,
      SK: `${ID.Case}#${id}`,
    })

    if (!client.payload.data) throw createError(409, 'Case is not exist')

    const clientUpdate = await this.storeRepository.updateItem(
      {
        PK: `${ID.Case}#${id}`,
        SK: `${ID.Case}#${id}`,
      },
      {
        state: StatePersonalShopper.IN_MEETING,
      }
    )

    const joinInfo = await this.meetingApplication.joinMeeting(
      id,
      ({ ...client.payload.data, ...clientUpdate.payload.data } as CaseModel)
        .fullName,
      'guest'
    )

    return ResponseDto('123', { ...client.payload.data, ...joinInfo })
  }

  override create = async (
    data: CaseModel | Record<string, unknown>,
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
