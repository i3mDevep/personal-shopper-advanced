export type JoinInfoResponseType = {
  JoinInfo: {
    Title: string
    Meeting: AWS.Chime.CreateMeetingResponse
    Attendee: AWS.Chime.CreateAttendeeResponse
  }
}
