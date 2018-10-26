interface FAudioNode {
  connect(con: Connectable): void
}
export class FBaseNode implements FAudioNode {
  connect(con: Connectable) {}
}

export type BasicNode = AudioNode | FBaseNode

export type Connectable =
  | {
      connect(
        destinationNode: AudioNode,
        output?: number,
        input?: number
      ): AudioNode
    }
  | FAudioNode

const isAudioNode = (n: Connectable): n is AudioNode => {
  if (n instanceof AudioNode) {
    return true
  }
  if (n.connect) {
    return true
  }
  return false
}

export const connect = (from: Connectable, to: Connectable) => {
  if (isAudioNode(from) && isAudioNode(to)) {
    from.connect(to)
  }
}
