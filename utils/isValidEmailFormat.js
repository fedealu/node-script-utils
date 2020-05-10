module.exports = (email) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const avoidableStrings = [
    'notiene', 'noposee'
  ]
  let isNotAvoidableEmail = !avoidableStrings.reduce((isAvoidable, pattern) => isAvoidable || email.indexOf(pattern) !== -1, false)
  return emailRegex.test(String(email).toLowerCase()) && isNotAvoidableEmail;
}