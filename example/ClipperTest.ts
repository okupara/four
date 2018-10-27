import { track, render, createFNode } from "../src"
import { timer } from "rxjs"
import { FWorkletNode } from "../src/FAudioNodes"
import * as h from "../src/Helper"

const timer$ = timer(500)

interface AudioWorkletNode {
  get(n: any): any
}

// there two problems
// we have to wait addmodule get finished
// Type definition of AudioParamMap doesn't have "get" method, but actually it does on Chrome

const t1 = track(
  createFNode(h.createOscilator({ frequency: 220 }), timer$, m => {
    const osc = m.targetNode as OscillatorNode
    osc.start()
  }),
  createFNode(h.createWorklet("./clipper.js", "clipper"), timer$, m => {
    console.log(m)
    // The type definition of AudioParamMap is not correct.
    const w = (m.targetNode as FWorkletNode).audioWorklet.parameters as any
    const tp = w.get("threashold")
    tp.value = 0.1
  }),
  createFNode(h.createGain(1))
)

render(t1)

export default () => {}
