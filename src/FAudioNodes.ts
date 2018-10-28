import { from } from "rxjs"
import { switchMap, shareReplay } from "rxjs/operators"
import getAudioContext from "./Context"
import { AdsrGain, playAdsr } from "./Adsr"

interface FAudioNode {
  connect(con: Connectable): void
}
export class FBaseNode implements FAudioNode {
  connect(con: Connectable) {}
}

export type Connectable =
  | {
      connect(
        destinationNode: AudioNode,
        output?: number,
        input?: number
      ): AudioNode
    }
  | FAudioNode

// I don't think to decide easily to use class is not good, but...

export class OneshotNode extends FBaseNode {
  private _url: string
  private _audioBuffer: AudioBuffer
  private _ready: boolean
  constructor(url: string) {
    super()
    this._url = url
    this._ready = false
    // TODO: consider about memory management.
    from(fetch(url).then(res => res.arrayBuffer()))
      .pipe(
        switchMap(arrayBuffer =>
          getAudioContext().decodeAudioData(arrayBuffer)
        ),
        shareReplay()
      )
      .subscribe(b => this.getReady(b))
  }
  getReady(b: AudioBuffer) {
    this._audioBuffer = b
    this._ready = true
  }
  get ready() {
    return this._ready
  }
  createAudioSourceBufferNode(): AudioBufferSourceNode {
    const ctx = getAudioContext()
    const bs = ctx.createBufferSource()
    bs.buffer = this._audioBuffer
    return bs
  }
}

export type AudioParamCallback = (
  param: AudioParam,
  currentTime: number
) => void
export interface PlayParam {
  offset: number
  playbackRate: AudioParamCallback
  detune: AudioParamCallback
}

export type OneshotPlayParams = PlayParam & AdsrGain

export const applyAdsr = (
  oneshot: OneshotNode,
  nextGain: GainNode,
  playParam: OneshotPlayParams
) => {
  if (!oneshot.ready) {
    return () => {}
  }
  const context = getAudioContext()
  const sourceNode = oneshot.createAudioSourceBufferNode()
  sourceNode.connect(playParam.gainNode).connect(nextGain)
  const adsr = playParam.adsr
  const start = adsr.start ? adsr.start : 0
  const durationForPlay = adsr.duration * 2
  return () => {
    const currentTime = context.currentTime
    playParam.detune(sourceNode.detune, currentTime)
    playParam.playbackRate(sourceNode.playbackRate, currentTime)
    playAdsr(playParam, currentTime)
    sourceNode.start(currentTime + start, playParam.offset, durationForPlay)
  }
}

export class FWorkletNode extends FBaseNode {
  private _audioWorklet: AudioWorkletNode
  private _gainNode: GainNode
  private _ready: boolean
  private _previousNode: AudioNode
  constructor(url: string, workletName: string) {
    super()
    const context = getAudioContext()
    this._gainNode = context.createGain()
    this._ready = false
    from(context.audioWorklet.addModule(url)).subscribe(_ => {
      const w = new AudioWorkletNode(context, workletName)
      this._audioWorklet = w
      if (this._previousNode) {
        this._previousNode.connect(this._audioWorklet)
      }
      console.log(w)
      this.audioWorklet.connect(this._gainNode)
      this._ready = true
    })
  }
  get gainNode() {
    return this._gainNode
  }
  get audioWorklet() {
    return this._audioWorklet
  }
  get ready() {
    return this._ready
  }
  connect(node: AudioNode) {
    this._gainNode.connect(node)
  }
  set previousNode(node: AudioNode) {
    this._previousNode = node
  }
}

export class FeedbackDelayNode extends FBaseNode {}

export type BasicNode = AudioNode | FBaseNode

const isAudioNode = (n: Connectable): n is AudioNode => {
  if (n instanceof AudioNode) {
    return true
  }
  if (n.connect) {
    return true
  }
  return false
}

const isFWorkerNode = (n: Connectable): n is FWorkletNode => {
  if (n instanceof FWorkletNode) return true
  else return false
}

export const connect = (from: Connectable, to: Connectable) => {
  console.log(from, to)
  if (isAudioNode(from) && isFWorkerNode(to)) {
    // from.connect(to.gainNode)
    to.previousNode = from
    return
  }
  if (isAudioNode(from) && isAudioNode(to)) {
    from.connect(to)
  }
}
