import { getAudioContext } from "./Four"
import { OneshotNode, FWorkletNode } from "./FAudioNodes"
import { isNumber } from "./Util"

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

type GainFunc = (gainNode: GainNode) => void

export const createGain = (param: number | GainFunc) => {
  const gain = getAudioContext().createGain()
  if (isNumber(param)) {
    gain.gain.value = param
  } else {
    param(gain)
  }
  return gain
}

export const createOneshot = (url: string) => new OneshotNode(url)

export const createWorklet = (url: string, registeredName: string) =>
  new FWorkletNode(url, registeredName)
