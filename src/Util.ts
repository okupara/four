export const definedVal = (n: any) => typeof n !== "undefined"

export const isAudioParam = (n: any): n is AudioParam =>
  n.defaultValue && n.maxValue && n.minValue

export const isNumber = (n: any): n is Number => typeof n === "number"
