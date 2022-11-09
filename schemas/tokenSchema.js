export const tokenSchema = {
  token: {
    in: ['body'],
    isEmpty: {
      negated: true,
    },
    errorMessage: 'Token not found',
  },
}