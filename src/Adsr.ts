import { getAudioContext } from "./Four"
export interface TimeVal {
  time: number // sec
  value: number
}
export const TimeVal = (time: number, value: number): TimeVal => ({
  time,
  value
})

export interface Adsr {
  start?: number
  duration: number
  attack: TimeVal
  decay: TimeVal
  sustain: number
  release: TimeVal
}

export class AdsrGain {
  duration: number
  offset: number
  gainNode: GainNode
  constructor(duration: number, offset: number, gainNode: GainNode) {
    this.duration = duration
    this.gainNode = gainNode
  }
  connectToGainNode(gainNode: GainNode) {
    this.gainNode.connect(gainNode)
  }
  beConnectedFromNode(node: AudioNode) {
    node.connect(this.gainNode)
  }
}

interface Gainable {
  gain: AudioParam
}

export const createAdsrGain = (adsr: Adsr) => {
  console.log("Adsr", adsr)
  const context = getAudioContext()
  const gainNode = context.createGain()
  const currentTime = context.currentTime
  gainNode.gain.value = 0
  const timeStart = currentTime + (adsr.start ? adsr.start : 0)
  const timeEndAttack = timeStart + adsr.attack.time
  const timeEndDecay = timeEndAttack + adsr.decay.time
  const timeEndSustain = currentTime + (adsr.duration - adsr.release.time)
  const timeEnd = currentTime + adsr.duration

  // node.gain.linearRampToValueAtTime(0, currentTime)

  // // wait until the time
  gainNode.gain.linearRampToValueAtTime(0, timeStart)
  // // start attack
  gainNode.gain.linearRampToValueAtTime(adsr.attack.value, timeEndAttack)
  // // start decay
  gainNode.gain.linearRampToValueAtTime(adsr.decay.value, timeEndDecay)
  // // start sustain
  gainNode.gain.linearRampToValueAtTime(adsr.sustain, timeEndSustain)
  // // start release
  gainNode.gain.linearRampToValueAtTime(0, timeEnd)

  return gainNode
}
