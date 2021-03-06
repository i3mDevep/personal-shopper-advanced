import createError from 'http-errors'
import type { BridgeRepository } from '@shared/event-bridge/domain/event.repository'
import { EventPersonalShopper } from '@shared/event-bridge/helper/event.personal-shopper'
import { StatePersonalShopper } from '@shared/helper/state.personal-shoper'
import BaseApplication from '@shared/persistence/dynamodb/application/dynamodb.application'
import { ResponseDto } from '@shared/persistence/dynamodb/application/response.dto'

import { AdviserModel } from '../domain/model/adviser.model'
import { AdviserSerializer } from '../domain/service/adviser.serializer'
import type { AdviserRepository } from '../domain/repository/adviser.repository'
import type { MeetingApplication } from '../../meeting/application/meeting.application'

export class AdviserApplication extends BaseApplication<AdviserModel> {
  constructor(
    private repositoryAdviser: AdviserRepository,
    private eventRepository: BridgeRepository,
    private meetingApplication?: MeetingApplication
  ) {
    super(repositoryAdviser)
  }

  async getAdviserForAccount(account: string, state?: string) {
    return this.repositoryAdviser.getAdviserForAccount(account, state)
  }

  async joinAdviser(account: string, adviser: string, client: string) {
    const adviserSerializer = new AdviserSerializer(
      new AdviserModel(account, adviser)
    )

    const adviserData = await this.repositoryAdviser.getAdviserValidateClient(
      adviserSerializer.keys(),
      client
    )

    if (
      !adviserData.payload.data ||
      ![
        StatePersonalShopper.IN_MEETING,
        StatePersonalShopper.ACCEPTED,
      ].includes((adviserData.payload.data as AdviserModel)?.state)
    )
      throw createError(409, 'Adviser is not had accepted or not found')

    const [joinInfo] = await Promise.all([
      this.meetingApplication.joinMeeting(
        client,
        (adviserData.payload.data as AdviserModel).fullName,
        'moderador'
      ),
      this.updateItem(adviserSerializer.keys(), {
        state: StatePersonalShopper.IN_MEETING,
        lastJoin: new Date().getTime(),
      }),
    ])

    const dataResponse = ResponseDto('123', {
      ...adviserData.payload.data,
      client,
      JoinInfo: joinInfo.JoinInfo,
    })

    return dataResponse
  }

  async adviserAcceptedClient(
    account: string,
    adviser: string,
    client: string
  ) {
    const adviserSerializer = new AdviserSerializer(
      new AdviserModel(account, adviser)
    )

    const adviserData = await this.repositoryAdviser.getAdviserValidateClient(
      adviserSerializer.keys(),
      client
    )

    if (!adviserData) throw createError(409, 'Case is not exist')

    if (
      !adviserData.payload.data ||
      (adviserData.payload.data as AdviserModel)?.state !==
        StatePersonalShopper.AVAILABLE
    )
      throw createError(409, 'Adviser is not available or not found')

    const dataResponse = ResponseDto('123', {
      ...adviserData.payload.data,
      client,
    })

    await Promise.all([
      this.updateItem(adviserSerializer.keys(), {
        state: StatePersonalShopper.ACCEPTED,
      }),
      this.eventRepository.sendMessage([
        {
          Detail: JSON.stringify(dataResponse),
          DetailType: EventPersonalShopper.EVENT_ADVISER_ACCEPTED,
        },
      ]),
    ])

    return adviserData
  }

  async advicerSearchAvailable(client: Record<string, unknown>) {
    if (!client.account) throw createError(409, 'Account is required')
    const res = await this.getAdviserForAccount(
      client.account as string,
      StatePersonalShopper.AVAILABLE
    )

    if (res.payload.total) {
      await this.eventRepository.sendMessage([
        {
          Detail: JSON.stringify(res),
          DetailType: EventPersonalShopper.EVENT_ADVISER_AVAILABLE,
        },
      ])

      return res
    }

    await this.eventRepository.sendMessage([
      {
        Detail: JSON.stringify(client),
        DetailType: EventPersonalShopper.EVENT_ADVISER_UNAVAILABLE,
      },
    ])

    return res
  }
}
