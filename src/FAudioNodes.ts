import { from } from "rxjs"
import { switchMap, shareReplay } from "rxjs/operators"
import { getAudioContext, FBaseNode } from "./Four"
import { AdsrGain, playAdsr } from "./Adsr"

interface CreateSourceParams<T extends AudioNode> {
  nextNode?: T
}

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
  const durationForPlay = adsr.duration * 1.1
  return () => {
    const currentTime = context.currentTime
    playParam.detune(sourceNode.detune, currentTime)
    playParam.playbackRate(sourceNode.playbackRate, currentTime)
    playAdsr(playParam, currentTime)
    sourceNode.start(currentTime + start, 0, durationForPlay)
  }
}
