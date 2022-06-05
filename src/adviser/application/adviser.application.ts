import type { BridgeRepository } from '@shared/event-bridge/domain/event.repository'
import { EventPersonalShopper } from '@shared/event-bridge/helper/event.personal-shopper'
import { StatePersonalShopper } from '@shared/helper/state.personal-shoper'
import BaseApplication from '@shared/persistence/dynamodb/application/dynamodb.application'

import { AdviserModel } from '../domain/adviser.model'
import { AdviserSerializer } from '../domain/adviser.serializer'
import type { AdviserRepository } from '../domain/adviser.repository'
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

  async adviserAcceptedClient(
    account: string,
    adviser: string,
    client: string
  ) {
    const adviserSerializer = new AdviserSerializer(
      new AdviserModel(account, adviser)
    )

    const adviserData = await this.getItem(adviserSerializer.keys())

    if (
      (adviserData.payload.data as AdviserModel).state !==
      StatePersonalShopper.AVAILABLE
    )
      return { error: 'Adviser is not available', code: 400 }

    const joinInfo = await this.meetingApplication.joinMeeting(
      client,
      (adviserData.payload.data as AdviserModel).fullName,
      'moderador'
    )

    await this.updateItem(adviserSerializer.keys(), {
      state: StatePersonalShopper.ACCEPTED,
      lastJoin: new Date().getTime(),
    })

    const response = {
      ...adviserData,
      payload: {
        ...adviserData.payload,
        data: {
          ...adviserData.payload.data,
          client,
          JoinInfo: joinInfo.JoinInfo,
        },
      },
    }

    await this.eventRepository.sendMessage([
      {
        Detail: JSON.stringify(response),
        DetailType: EventPersonalShopper.EVENT_ADVISER_ACCEPTED,
      },
    ])

    return response
  }

  async advicerSearchAvailable(client: Record<string, unknown>) {
    if (!client.account) return new Error('Account is required')
    const res = await this.getAdviserForAccount(
      client.account as string,
      StatePersonalShopper.AVAILABLE
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
          Detail: JSON.stringify(client),
          DetailType: EventPersonalShopper.EVENT_ADVISER_UNAVAILABLE,
        },
      ])
    }

    return res
  }
}
