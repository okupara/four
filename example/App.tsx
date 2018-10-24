import * as React from "react"
import sine from "./SineTest"
import one from "./OneshotTest"
import simpleSequence from "./SimpleSequenceTest"

export default () => (
  <div>
    <button onClick={() => console.log("foo")}>hello</button>
  </div>
)

// sine()
one()
// simpleSequence()
