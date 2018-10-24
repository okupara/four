import { interval } from "rxjs"
import { map } from "rxjs/operators"
import { createFNode, track, render, OneshotNode, tick$ } from "../src/"
import * as h from "../src/Helper"
import { createAdsrGain, TimeVal } from "../src/Adsr"

// const interval$ = interval(12000).pipe(map(n => ({ num: n })))

const track1 = track(
  createFNode(h.createOneshot("./test1.wav"), tick$(20), m => {
    console.log(m)
    const s = (m.targetNode as OneshotNode).createAudioSourceBufferNode()
    if (s) {
      const adsrGain = createAdsrGain({
        duration: 0.5,
        attack: TimeVal(0.08, 1),
        decay: TimeVal(0.1, 0.8),
        sustain: 0.1,
        release: TimeVal(0.1, 0)
      })
      s.connect(adsrGain).connect(m.nextNode as GainNode)
      s.start()
    }
  }),
  createFNode(h.createGain(1.0))
)

render(track1)

export default () => {}
