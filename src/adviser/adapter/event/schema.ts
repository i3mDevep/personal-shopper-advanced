export const searchAvailableAdviserSchema = {
  traceId: { type: 'string' },
  payload: {
    type: 'object',
    data: {
      PK: { type: 'string' },
      SK: { type: 'string' },
      id: { type: 'string' },
      state: { type: 'string' },
      stateRole: { type: 'string' },
      account: { type: 'string' },
      fullName: { type: 'string' },
      rules: {
        type: 'array',
      },
      schedules: {
        type: 'array',
      },
    },
  },
}
