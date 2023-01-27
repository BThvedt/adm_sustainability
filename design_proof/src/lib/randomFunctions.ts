export const bigConsoleLog = (msg: string) => {
  const starLength = 16
  const msgLength = 50

  // if the message is less than 70 chars, pad with spaces

  let finalMsg: string
  let spaces: string
  const stars = "*".repeat(starLength)
  let endingSpaces = ""

  if (msg.length < msgLength) {
    const leftOver = msgLength - msg.length

    if (leftOver % 2 === 0) {
      // thanks stack overflow
      spaces = " ".repeat(leftOver / 2)
      endingSpaces = spaces
    } else {
      spaces = " ".repeat((leftOver - 1) / 2)
      endingSpaces = spaces + " "
    }

    finalMsg = `${spaces}${msg}${endingSpaces}`
  } else {
    finalMsg = msg
  }

  console.log(`${stars} ${finalMsg} ${stars}`)
}

export const genericAwait = (ms: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export const makeRandomString = (length = 24, specialChars = true): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const str = `${letters}${letters.toLowerCase()}1234567890$_${
    specialChars ? "+-!@#%^&*()?/<>,.`~" : ""
  }`
  const randStr = []

  for (let x = 0; x < length; x++) {
    randStr[x] = str[Math.floor(Math.random() * str.length)]
  }

  return randStr.join("")
}
