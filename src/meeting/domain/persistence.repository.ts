export interface PersistenceRepository {
  putMeeting(title: string, meeting: string): Promise<void>
  getMeeting(
    title: string
  ): Promise<AWS.Chime.CreateMeetingResponse | undefined>
}
