import * as React from "react"
import sine from "./SineTest"
import one from "./OneshotTest"
import two from "./OneshotTest2"
import simpleSequence from "./SimpleSequenceTest"
import w from "./WorkletTest"
import c from "./ClipperTest"
import f from "./FilterTest"
import m from "./MixTest"
import d from "./DelayTest"
import fb from "./FeedbackDelayTest"
import r from "./ReverbTest"

export default () => (
  <div>
    <button onClick={() => console.log("foo")}>hello</button>
  </div>
)

// sine()
// one()
// simpleSequence()
// two()

// w()
// console.log("KOOKJK")
// c()
// f()
// m()
// d()
// fb()
r()
