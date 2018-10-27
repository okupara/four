class PinkNoiseGenerator extends AudioWorkletProcessor {
  constructor(options) {
    super(options)
    this.b0 = this.b1 = this.b2 = this.b3 = this.b4 = this.b5 = this.b6 = 0
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
        // outputChannel[i] = 2 * (Math.random() - 0.5) * 0.6;
        const white = Math.random() * 2 - 1
        this.b0 = 0.99886 * this.b0 + white * 0.0555179
        this.b1 = 0.99332 * this.b1 + white * 0.0750759
        this.b2 = 0.969 * this.b2 + white * 0.153852
        this.b3 = 0.8665 * this.b3 + white * 0.3104856
        this.b4 = 0.55 * this.b4 + white * 0.5329522
        this.b5 = -0.7616 * this.b5 - white * 0.016898
        outputChannel[i] =
          this.b0 +
          this.b1 +
          this.b2 +
          this.b3 +
          this.b4 +
          this.b5 +
          this.b6 +
          white * 0.5362
        outputChannel[i] *= 0.0011 // (roughly) compensate for gain
        this.b6 = white * 0.115926
      }
    }
    return true
  }
}
registerProcessor("pinknoise", PinkNoiseGenerator)
