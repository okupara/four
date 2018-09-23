let audioContext = new AudioContext()

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
export const createGainNode = () => {}
