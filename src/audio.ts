let audioContext = new AudioContext()

/**
 * const t1 = track(
 *   synthA,
 *   effectA,
 *   effectB
 * )
 * const t2 = track(
 *   synthD,
 *   effectD,
 *   send(mix1)
 * )
 * const mix1 = mix(t1, t2)
 *   .toMaster()
 *
 * master(mix1, mix2)
 * patch()
 */

interface FNode {
  connect: (node: FNode) => void
}

export const master: FNode = {
  connect: () => {}
}

export const patch = (...args: FNode[]) => {}

export const send = (node: FNode) => {
  return node
}

export const track = (...args: AudioNode[]) => {
  const res = args.reduce((previousNode, currentNode) => {
    if (previousNode) {
      previousNode.connect(currentNode)
    }
    return currentNode
  })
  res.connect(audioContext.destination)
}

export const mix = (...args: AudioNode[]) =>
  args.reduce((gainNode, currentNode) => {
    currentNode.connect(gainNode)
    return gainNode
  }, createGainNode())

export const trackPipe = (...args: AudioNode[]) => {
  const res = args.reduce((previousNode, currentNode) => {
    if (previousNode) {
      previousNode.connect(currentNode)
    }
    return currentNode
  })
  res.connect(audioContext.destination)
}

// TODO: put into /helper space

export const createSinwaveNode = () => {}
export const createGainNode = () => {
  const gainNode = audioContext.createGain()
  gainNode.gain.value = 1.0
  return gainNode
}
