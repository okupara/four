import { Observable, /* combineLatest, */ of } from "rxjs"
import { combineLatest, map } from "rxjs/operators"
import { definedVal } from "./Util"
import { Lens } from "monocle-ts"
import { BasicNode, connect, Connectable } from "./FAudioNodes"
import context from "./Context"

/* TODO: make the typing of the fields be Generics. 
  we have to use "as GainNode" until we finish to do that.
*/
interface FNode {
  readonly previousNode?: BasicNode
  readonly nextNode?: BasicNode
  readonly targetNode: BasicNode
}

interface FNodeReducer {
  subscribe: () => void
  fnode: FNode
}
const FNodeReducer = (subscribe: () => void, fnode: FNode): FNodeReducer => ({
  subscribe,
  fnode
})

const fnodeLens = Lens.fromProp<FNodeReducer, "fnode">("fnode")
const previous = fnodeLens.compose(
  Lens.fromProp<FNode, "previousNode">("previousNode")
)
const target = fnodeLens.compose(
  Lens.fromProp<FNode, "targetNode">("targetNode")
)

export const createFNode = <S>(
  targetNode: BasicNode,
  observable?: Observable<S>,
  combineFunction?: (m: FNode & S) => void
): FNodeReducer => {
  if (observable && !definedVal(combineFunction)) {
    throw new Error("It requires a function for combining with an Observable")
  }
  return {
    subscribe() {
      if (observable && combineFunction) {
        observable
          .pipe(
            combineLatest(of(this.fnode), (a, b) => Object.assign({}, b, a)),
            map(combineFunction)
          )
          .subscribe(() => {})
      }
    },
    fnode: { targetNode: targetNode }
  }
}

export const track = (...args: FNodeReducer[]) => {
  const length = args.length
  // if we don't put initial value, reduce runs with filling prev and current, which the first and second elements of a list.
  // and it executes callback length - 1 times.
  const last = args.reduce((p, c, i) => {
    if (i === 1) {
      FNodeReducer(p.subscribe, {
        nextNode: target.get(c),
        targetNode: target.get(p)
      }).subscribe()
    } else {
      FNodeReducer(p.subscribe, {
        targetNode: target.get(p),
        previousNode: previous.get(p),
        nextNode: target.get(c)
      }).subscribe()
    }
    connect(
      target.get(p),
      target.get(c)
    )
    if (i === args.length - 1) {
      FNodeReducer(c.subscribe, {
        previousNode: target.get(p),
        targetNode: target.get(c)
      }).subscribe()
    }
    return FNodeReducer(c.subscribe, {
      previousNode: target.get(p),
      targetNode: target.get(c)
    })
  })
  return last.fnode.targetNode
}

export const mix = (...args: BasicNode[]) =>
  args.reduce((gainNode, currentNode) => {
    connect(
      currentNode,
      gainNode
    )
    return gainNode
  }, context().createGain())

const isFNodeReducer = (n: any): n is FNodeReducer => n.subscribe && n.fnode
export const render = (t: Connectable | FNodeReducer) => {
  const c = context()
  if (isFNodeReducer(t)) {
    connect(
      target.get(t),
      c.destination
    )
  } else {
    connect(
      t,
      c.destination
    )
  }
}
