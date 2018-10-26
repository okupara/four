import * as React from "react"
import sine from "./SineTest"
import one from "./OneshotTest"
import two from "./OneshotTest2"
import simpleSequence from "./SimpleSequenceTest"
import w from "./WorkletTest"

export default () => (
  <div>
    <button onClick={() => console.log("foo")}>hello</button>
  </div>
)

// sine()
// one()
// simpleSequence()
// two()

w()
