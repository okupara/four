class Clipper extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: "threashold", defaultValue: 0.7, minValue: 0.05, maxValue: 0.99 }
    ]
  }
  constructor(options) {
    super(options)
  }
  process(inputs, outputs, parameters) {
    let output = outputs[0]
    let input = inputs[0]
    let threashold = parameters.threashold
    for (
      let channel = 0, channelLen = input.length;
      channel < channelLen;
      ++channel
    ) {
      let outputChannel = output[channel]
      let inputChannel = input[channel]
      for (let i = 0, len = inputChannel.length; i < len; i++) {
        let val = inputChannel[i]
        let t = threashold[i]
        if (t < Math.abs(val)) {
          if (val < 0) {
            val = t * -1
          } else {
            val = t
          }
        }

        outputChannel[i] = val
      }
    }
    return true
  }
}
registerProcessor("clipper", Clipper)
