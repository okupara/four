import { track, mix, createFNode, render } from "../src"
import getAudioContext from "../src/Context"
import { playAdsr, TimeVal } from "../src/Adsr"
import { interval, timer } from "rxjs"
import { tick$ } from "../src/Timer"
import * as h from "../src/Helper"
import { connect } from "../src/FAudioNodes"

const interval$ = interval(3200)
// const interval$ = tick$(80)
const timer$ = timer(400)

const d1 = h.createDelay({ maxDelayTime: 2, delayTime: p => (p.value = 0.4) })
const f1 = h.createGain(0.4)
console.log("f1", f1)

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

const t1Delay = track(createFNode(t1), createFNode(d1), createFNode(f1))
// we have to find a more elegant way....
connect(
  f1,
  d1
)

render(mix(t1, t1Delay))

// const del = getAudioContext().createDelay(1)
// del.delayTime.value = 0.5
// const tt1 = t1 as GainNode
// tt1.connect(getAudioContext().destination)
// tt1.connect(del).connect(getAudioContext().destination)
// render(t1)

export default () => {}
