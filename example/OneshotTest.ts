import { interval } from "rxjs"
import { map } from "rxjs/operators"
import { createFNode, track, render, OneshotNode } from "../src/"
import * as h from "../src/Helper"

const interval$ = interval(12000).pipe(map(n => ({ num: n })))

const track1 = track(
  createFNode(h.createOneshot("./test1.wav"), interval$, m => {
    const o = m.targetNode as OneshotNode
    console.log(o.ready)
    console.log(m)
    const s = o.createAudioSourceBufferNode({
      nextNode: m.nextNode as AudioNode
    })
    if (s) {
      s.start()
    }
  }),
  createFNode(h.createGain(1.0))
)

render(track1)

export default () => {}
