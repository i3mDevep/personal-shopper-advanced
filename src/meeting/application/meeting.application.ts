import type { ChimeRepository } from '../domain/chime.repository'
import type { PersistenceRepository } from '../domain/persistence.repository'

export class MeetingApplication {
  private readonly roleModerator = 'moderador'
  private readonly roleGuest = 'guest'

  constructor(
    private chimeRepository: ChimeRepository,
    private persistenceRepository: PersistenceRepository
  ) {}

  async endMeeting(title: string) {
    const meetingInfo = await this.persistenceRepository.getMeeting(title)

    return this.chimeRepository.endMeeting(meetingInfo.Meeting.MeetingId)
  }

  async joinMeeting(
    title: string,
    name: string,
    role: typeof this.roleModerator | typeof this.roleGuest
  ) {
    let meetingInfo = await this.persistenceRepository.getMeeting(title)

    if (meetingInfo?.Meeting?.MeetingId)
      meetingInfo = await this.chimeRepository
        .getMeeting(meetingInfo.Meeting.MeetingId)
        .catch((e) => e)

    if (!meetingInfo?.Meeting?.MeetingId && role === this.roleGuest)
      return {
        JoinInfo: {
          Error: `Meeting ${title} not found with role ${role}`,
        },
      }
    if (!meetingInfo?.Meeting?.MeetingId) {
      meetingInfo = await this.chimeRepository.createMeeting()
    }

    await this.persistenceRepository.putMeeting(title, meetingInfo as string)

    const attendee = await this.chimeRepository.createAttendee(
      meetingInfo.Meeting.MeetingId,
      role,
      name
    )

    return {
      JoinInfo: {
        Title: title,
        Meeting: meetingInfo,
        Attendee: attendee,
      },
    }
  }
}
