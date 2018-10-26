import { createFNode, track, render, OneshotNode, tick$ } from "../src/"
import * as h from "../src/Helper"
import { createAdsrGain, TimeVal } from "../src/Adsr"
import { getAudioContext } from "../src/Four"
import {
  applyAdsr,
  OneshotPlayParams,
  AudioParamCallback
} from "../src/FAudioNodes"

const context = getAudioContext()

const createOnshotAdsrGain = (
  start: number,
  offset: number = 0,
  playbackRate: AudioParamCallback = (
    param: AudioParam,
    currentTime: number
  ) => {},
  detune: AudioParamCallback = (param: AudioParam, currentTime: number) => {}
): OneshotPlayParams => {
  const adsrGain = createAdsrGain({
    start,
    duration: 0.4,
    attack: TimeVal(0.08, 1),
    decay: TimeVal(0.1, 0.8),
    sustain: 0.8,
    release: TimeVal(0.1, 0)
  })
  return {
    ...adsrGain,
    offset,
    playbackRate,
    detune
  }
}

const track1 = track(
  createFNode(h.createOneshot("./pipo.mp3"), tick$(180), m => {
    console.log(m)
    const a1 = createOnshotAdsrGain(0)
    const a2 = createOnshotAdsrGain(0.4)

    const playfn1 = applyAdsr(
      m.targetNode as OneshotNode,
      m.nextNode as GainNode,
      a1
    )
    const playfn2 = applyAdsr(
      m.targetNode as OneshotNode,
      m.nextNode as GainNode,
      a2
    )

    playfn1()
    playfn2()
  }),
  createFNode(h.createGain(1.0))
)

render(track1)

export default () => {}
