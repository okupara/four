export const definedVal = (n: any) => typeof n !== "undefined"

export const isAudioParam = (n: any): n is AudioParam =>
  n.defaultValue && n.maxValue && n.minValue

export const isNumber = (n: any): n is Number => typeof n === "number"

export const calcPlaybackRate = (distance: number) => Math.pow(2, distance / 12)

const halfpi = Math.PI / 2
const negHalfpi = halfpi * -1
const twopi = Math.PI * 2

export const normalizedCos = (x: number) =>
  Math.sin(x * twopi - halfpi) * 0.5 + 0.5
