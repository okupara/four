import { track, render, createFNode, mix } from "../src"
import { timer } from "rxjs"
import * as h from "../src/Helper"

const timer$ = timer(380)

const noise = createFNode(
  h.createWorklet("./whitenoise.js", "whitenoise"),
  timer$,
  m => {
    console.log(m)
  }
)

const filter1 = createFNode(
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
    console.log("filter1")
  }
)

const filter2 = createFNode(
  h.createFilter({
    type: h.FilterTypes.bandpass,
    Q: p => {
      p.value = 10
    },
    frequency: p => {
      p.value = 520
    }
  }),
  timer$,
  m => {
    console.log("filter1")
  }
)

const t1 = track(noise, filter1, createFNode(h.createGain(0.4)))
const t2 = track(noise, filter2, createFNode(h.createGain(0.4)))
const m = mix(t1, t2)
render(m)

export default () => {}
