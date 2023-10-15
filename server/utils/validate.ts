const emailRe = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
const passwordRe =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@~`!@#$%^&*()-=_+[\]\\{}|;':",./<>?])[A-Za-z\d@~`!@#$%^&*()-=_+[\]\\{}|;':",./<>?]+$/;

export function validateEmail(email: any) {
  return (
    typeof email === 'string' &&
    email.length <= 254 &&
    email.length >= 3 &&
    emailRe.test(email)
  );
}

export function validatePassword(password: any) {
  return (
    typeof password === 'string' &&
    password.length >= 8 &&
    password.length <= 30 &&
    passwordRe.test(password)
  );
}
