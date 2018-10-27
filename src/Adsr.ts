import getAudioContext from "./Context"
import { addListener } from "cluster"
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

interface Gainable {
  gain: AudioParam
}

export type AdsrGainGenerator = (currentTime: number) => AdsrGain
export interface AdsrGain {
  adsr: Adsr
  gainNode: GainNode
}

export const createAdsrGain = (adsr: Adsr): AdsrGain => {
  console.log("Adsr", adsr)
  const context = getAudioContext()
  const gainNode = context.createGain()
  return {
    adsr,
    gainNode
  }
}

export const playAdsr = (adsrGain: AdsrGain, currentTime: number) => {
  const { adsr, gainNode } = adsrGain
  gainNode.gain.value = 0
  // const adsrStart = (adsr.start ? adsr.start : 0)
  const timeStart = currentTime + (adsr.start ? adsr.start : 0)
  const timeEndAttack = timeStart + adsr.attack.time
  const timeEndDecay = timeEndAttack + adsr.decay.time
  const timeEndSustain = timeStart + (adsr.duration - adsr.release.time)
  const timeEnd = timeStart + adsr.duration

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
}
