import { track, render, createFNode, mix } from "../src"
import { timer } from "rxjs"
import * as h from "../src/Helper"

const timer$ = timer(400)

const t1 = track(
  createFNode(h.createOscilator({ frequency: 440 }), timer$, m => {
    console.log(m)
    const h = m.targetNode as OscillatorNode
    h.start()
  }),
  createFNode(h.createGain(0.2))
)
const t2 = track(
  createFNode(h.createOscilator({ frequency: 660 }), timer$, m => {
    console.log(m)
    const h = m.targetNode as OscillatorNode
    h.start()
  }),
  createFNode(h.createGain(0.2))
)

const m1 = mix(t1, t2)

render(m1)

export default () => {}
