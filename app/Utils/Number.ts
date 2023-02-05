/**
 * Generates numeric code of n-length
 * @param n length of code
 * @returns code
 */
export function generateNumericCode (n: number) {
  let add = 1
  let max = 12 - add

  if (n > max) {
    return generateNumericCode(max) + generateNumericCode(n - max)
  }

  max = Math.pow(10, n + add)
  const min = max / 10
  const number = Math.floor(Math.random() * (max - min + 1)) + min

  return ('' + number).substring(add)
}
