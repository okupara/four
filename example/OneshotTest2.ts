import { createFNode, track, render, OneshotNode, tick$ } from "../src/"
import * as h from "../src/Helper"
import { createAdsrGain, TimeVal } from "../src/Adsr"
import { getAudioContext } from "../src/Four"
import {
  applyAdsr,
  OneshotPlayParams,
  AudioParamCallback
} from "../src/FAudioNodes"
import { scan } from "rxjs/operators"
import { normalizedCos } from "../src/Util"

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
    duration: 0.25,
    attack: TimeVal(0.05, 1),
    decay: TimeVal(0.05, 0.7),
    sustain: 0.5,
    release: TimeVal(0.1, 0)
  })
  return {
    ...adsrGain,
    offset,
    playbackRate,
    detune
  }
}

interface Timer {
  max: number
  min: number
  acc: number
}

const Timer = (max: number, min: number, acc: number) => ({
  max,
  min,
  acc
})

const timer = tick$(2).pipe(
  scan((acc, curr) => {
    return Timer(acc.max, acc.min, acc.acc >= acc.max ? acc.min : acc.acc + 1)
  }, Timer(14, 1, 0))
)

const af = [-16, -14, -11]

const track1 = track(
  createFNode(h.createOneshot("./pipo.mp3"), timer, m => {
    // const p1 = normalizedCos(m.acc / m.max) * 1.6
    // const p2 = normalizedCos(m.acc / m.max) * 1.6
    if (Math.random() < 0.3) {
      return
    }
    const p1 = Math.random() * 1.9
    // const p2 = Math.random() * 1.6

    const b = af[Math.floor(Math.random() * af.length)] * 180

    const a1 = createOnshotAdsrGain(
      0,
      p1,
      _ => {},
      detune => {
        detune.value = b
      }
    )
    // const a2 = createOnshotAdsrGain(
    //   0.15,
    //   p2,
    //   _ => {},
    //   detune => {
    //     detune.value = 200
    //   }
    // )

    const playfn1 = applyAdsr(
      m.targetNode as OneshotNode,
      m.nextNode as GainNode,
      a1
    )
    // const playfn2 = applyAdsr(
    //   m.targetNode as OneshotNode,
    //   m.nextNode as GainNode,
    //   a2
    // )

    playfn1()
    // playfn2()
  }),
  createFNode(h.createGain(1.0))
)

render(track1)

export default () => {}
