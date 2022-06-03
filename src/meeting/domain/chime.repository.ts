export interface ChimeRepository {
  createMeeting(): Promise<AWS.Chime.CreateMeetingResponse>
  getMeeting(MeetingId: string): Promise<AWS.Chime.GetMeetingResponse>
  endMeeting(MeetingId: string): Promise<void>
  createAttendee(
    MeetingId: string,
    role: string,
    name: string
  ): Promise<AWS.Chime.CreateAttendeeResponse>
  listAttendees(MeetingId: string): Promise<AWS.Chime.ListAttendeesResponse>
  deleteAttendee(MeetingId: string, AttendeeId: string): Promise<void>
}
