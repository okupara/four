import { track, render, createFNode } from "../src/"
import * as h from "../src/Helper"
import { timer } from "rxjs"

const timer$ = timer(800)

const t1 = track(
  createFNode(h.createWorklet("./pinknoise.js", "pinknoise"), timer$, m => {
    console.log("callback", m)
  }),
  createFNode(h.createGain(1))
)

render(t1)

export default () => {}
