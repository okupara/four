import getAudioContext from "./Context"
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

type AudioParamCallback = (param: AudioParam) => void

// https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
export const enum FilterTypes {
  lowpass = "lowpass",
  highpass = "highpass",
  bandpass = "bandpass",
  lowshelf = "lowshelf",
  highshelf = "highshelf",
  peaking = "peaking",
  notch = "notch",
  allpass = "allpass"
}

interface FilterParams {
  frequency: AudioParamCallback
  detune: AudioParamCallback
  type: FilterTypes
  Q: AudioParamCallback
  gain: AudioParamCallback
}
type PartializedFilterParams = Partial<FilterParams>

const optionalizeFilterParams = (p?: PartializedFilterParams): FilterParams => {
  const d: FilterParams = {
    detune: (p: AudioParam) => {},
    type: FilterTypes.lowpass,
    Q: (p: AudioParam) => {},
    gain: (p: AudioParam) => {},
    frequency: (p: AudioParam) => {}
  }
  if (!p) return d
  else return { ...d, ...p }
}

export const createFilter = (param?: PartializedFilterParams) => {
  const fil = getAudioContext().createBiquadFilter()
  const p = optionalizeFilterParams(param)
  p.detune(fil.detune)
  p.gain(fil.gain)
  p.Q(fil.Q)
  p.frequency(fil.frequency)
  fil.type = p.type
  return fil
}

interface DelayParams {
  delayTime: AudioParamCallback
  maxDelayTime: number
}
type PartializedDelayParams = Partial<DelayParams>

const optionalizeDelayParams = (p?: PartializedDelayParams): DelayParams => {
  const d: DelayParams = {
    delayTime: (p: AudioParam) => {},
    maxDelayTime: 1
  }
  if (!p) return d
  else return { ...d, ...p }
}

export const createDelay = (param?: PartializedDelayParams) => {
  const p = optionalizeDelayParams(param)
  const del = getAudioContext().createDelay(p.maxDelayTime)
  p.delayTime(del.delayTime)
  return del
}
