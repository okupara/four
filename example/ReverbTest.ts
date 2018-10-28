import { track, mix, createFNode, render } from "../src"
import getAudioContext from "../src/Context"
import { playAdsr, TimeVal } from "../src/Adsr"
import { interval, timer } from "rxjs"
import { tick$ } from "../src/Timer"
import * as h from "../src/Helper"

const interval$ = interval(1800)
// const interval$ = tick$(80)
const timer$ = timer(400)

const t1 = track(
  createFNode(h.createOscilator({ frequency: 1200 }), timer$, m => {
    const t = m.targetNode as OscillatorNode
    t.start()
  }),
  createFNode(h.createGain(0), interval$, m => {
    const t = m.targetNode as GainNode
    playAdsr({
      adsr: {
        attack: TimeVal(0.01, 1),
        decay: TimeVal(0.05, 0.6),
        sustain: 0.4,
        release: TimeVal(0.1, 0),
        duration: 0.3
      },
      gainNode: t
    })
  })
)

const t1Reverb = track(createFNode(t1), createFNode(h.createReverb()))

render(mix(t1, t1Reverb))

export default () => {}
