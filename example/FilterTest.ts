import { track, render, createFNode, mix } from "../src"
import { timer } from "rxjs"
import * as h from "../src/Helper"

const timer$ = timer(380)

const t1 = track(
  createFNode(h.createWorklet("./whitenoise.js", "whitenoise"), timer$, m => {
    console.log(m)
  }),
  createFNode(
    h.createFilter({
      type: h.FilterTypes.bandpass,
      Q: p => {
        p.value = 10
      },
      frequency: p => {
        p.value = 1820
      }
    }),
    timer$,
    m => {
      console.log("filter", m)
    }
  ),
  createFNode(h.createGain(0.4))
)

render(t1)

export default () => {}
