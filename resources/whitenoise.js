class WhiteNoiseGenerator extends AudioWorkletProcessor {
  constructor(options) {
    super(options)
  }
  process(inputs, outputs, parameters) {
    let output = outputs[0]
    for (
      let channel = 0, channelLen = output.length;
      channel < channelLen;
      ++channel
    ) {
      let outputChannel = output[channel]
      for (let i = 0, len = outputChannel.length; i < len; i++) {
        outputChannel[i] = Math.random() * 2 - 1
      }
    }
    return true
  }
}
registerProcessor("whitenoise", WhiteNoiseGenerator)
