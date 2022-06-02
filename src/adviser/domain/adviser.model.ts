export class AdviserModel {
  constructor(
    public account: string,
    public email: string,
    public state?: string,
    public fullName?: string,
    public active?: boolean,
    public createdAt?: number,
    public lastUpdate?: number,
    public phone?: string,
    public rules?: Array<{
      type: string
      values?: string[]
    }>,
    public schedules?: {
      events: Array<{
        day: string
        intervals: Array<{
          dateStart: string
          dateEnd: string
        }>
      }>
      timeZone: {
        country: string
        label: string
        offset: string
        offsetValue: number
        value: string
        included: string[]
      }
      typeSchedule: string
    }
  ) {}
}
