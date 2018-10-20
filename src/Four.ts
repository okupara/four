import { Observable, combineLatest, of } from "rxjs"
import { definedVal } from "./Util"
// import { Lens } from "monocle-ts"

const audioContext = new AudioContext()
export const getAudioContext = () => audioContext

interface FAudioNode {
  connect(con: Connectable): void
}
export class FBaseNode implements FAudioNode {
  connect(con: Connectable) {}
}

type BasicNode = AudioNode | FBaseNode

export type Connectable =
  | {
      connect(
        destinationNode: AudioNode,
        output?: number,
        input?: number
      ): AudioNode
    }
  | FAudioNode

const isAudioNode = (n: Connectable): n is AudioNode => n instanceof AudioNode

const connect = (from: Connectable, to: Connectable) => {
  if (isAudioNode(from) && isAudioNode(to)) {
    from.connect(to)
  }
}

interface FNode {
  readonly previousNode?: BasicNode
  readonly nextNode?: BasicNode
  readonly targetNode: BasicNode
}
const FNode = (
  targetNode: BasicNode,
  previousNode?: BasicNode,
  nextNode?: BasicNode
): FNode => ({
  previousNode: previousNode,
  nextNode: nextNode,
  targetNode: targetNode
})

interface FNodeReducer {
  subscribe: () => void
  fnode: FNode
}
const FNodeReducer = (subscribe: () => void, fnode: FNode): FNodeReducer => ({
  subscribe,
  fnode
})

// const previous = Lens.fromProp<FNode, "previousNode">("previousNode")
// const next = Lens.fromProp<FNode, "nextNode">("nextNode")
// const target = Lens.fromProp<FNode, "targetNode">("targetNode")

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
        combineLatest(of(targetNode), observable, (a, b) =>
          Object.assign({}, a, b)
        ).subscribe()
      }
    },
    fnode: FNode(targetNode)
  }
}

export const track = (...args: FNodeReducer[]) =>
  args.reduce((prev, current, i) => {
    if (prev === null) {
      return FNodeReducer(current.subscribe, FNode(current.fnode.targetNode))
    } else {
      const { previousNode, targetNode } = prev.fnode
      FNodeReducer(
        prev.subscribe,
        FNode(targetNode, previousNode, current.fnode.targetNode)
      ).subscribe()
      connect(
        prev.fnode.targetNode,
        current.fnode.targetNode
      )
    }
    if (i === args.length - 1) {
      const targetNode = current.fnode.targetNode
      FNodeReducer(
        current.subscribe,
        FNode(targetNode, prev.fnode.targetNode)
      ).subscribe()
    }
    return FNodeReducer(current.subscribe, FNode(current.fnode.targetNode))
  })

export const mix = (...args: AudioNode[]) =>
  args.reduce((gainNode, currentNode) => {
    currentNode.connect(gainNode)
    return gainNode
  }, audioContext.createGain())

export const render = (t: Connectable) =>
  connect(
    t,
    audioContext.destination
  )
