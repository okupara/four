import { getAudioContext } from "./Four"

export type OscilatorTypes = "sine" | "square" | "triangle" | "custom"
export interface CreateOscilatorArg {
  type: OscilatorTypes
  // TODO: allow function as a type
  frequency: number
  detune: number
}

const CreateOscilatorArg: CreateOscilatorArg = {
  type: "sine",
  frequency: 220,
  detune: 0
}

export const createOscilator = (param: Partial<CreateOscilatorArg>) => {
  const p = { ...CreateOscilatorArg, ...param }
  const osc = getAudioContext().createOscillator()
  osc.frequency.value = p.frequency
  osc.detune.value = p.detune
  osc.type = p.type
  return osc
}

export const createGain = (param: number) => {
  const gain = getAudioContext().createGain()
  gain.gain.value = param
  return gain
}
