export const loginSchema = {
  email: {
    in: ['body'],
    isEmpty: {
      negated: true,
    },
    errorMessage: 'Podaj email',
  },
  password: {
    in: ['body'],
    isEmpty: {
      negated: true,
    },
    errorMessage: 'Podaj hasło',
  }
}