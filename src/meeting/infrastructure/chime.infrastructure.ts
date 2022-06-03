import { v4 as uuid } from 'uuid'

import type { ChimeRepository } from '../domain/chime.repository'

export class ChimeInfrastructure implements ChimeRepository {
  constructor(
    private readonly chimeClient: AWS.Chime,
    private region = 'us-east-1'
  ) {}

  getMeeting(MeetingId: string): Promise<AWS.Chime.GetMeetingResponse> {
    return this.chimeClient.getMeeting({ MeetingId }).promise()
  }

  createMeeting(): Promise<AWS.Chime.CreateMeetingResponse> {
    return this.chimeClient
      .createMeeting({
        ClientRequestToken: uuid(),
        MediaRegion: this.region,
      })
      .promise()
  }

  async endMeeting(MeetingId: string): Promise<void> {
    await this.chimeClient.deleteMeeting({ MeetingId }).promise()
  }

  createAttendee(
    MeetingId: string,
    role: string,
    name: string
  ): Promise<AWS.Chime.CreateAttendeeResponse> {
    return this.chimeClient
      .createAttendee({
        MeetingId,
        ExternalUserId: `${uuid().substring(0, 8)}#${role}#${name}`.substring(
          0,
          64
        ),
      })
      .promise()
  }

  listAttendees(MeetingId: string): Promise<AWS.Chime.ListAttendeesResponse> {
    return this.chimeClient.listAttendees({ MeetingId }).promise()
  }

  async deleteAttendee(MeetingId: string, AttendeeId: string): Promise<void> {
    await this.chimeClient
      .deleteAttendee({
        AttendeeId,
        MeetingId,
      })
      .promise()
  }
}
