import { timer } from "rxjs"
import { map } from "rxjs/operators"
import { createFNode, track, render } from "../src/"
import * as h from "../src/Helper"

const timer$ = timer(2000).pipe(map(n => ({ num: n })))

const track1 = track(
  createFNode(h.createOscilator({ frequency: 220 }), timer$, m => {
    const osc = m.targetNode as OscillatorNode
    console.log(osc)
    osc.start()
  }),
  createFNode(h.createGain(0.1))
)

export default () => render(track1)
