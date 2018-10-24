import { from } from "rxjs"
import { switchMap, shareReplay } from "rxjs/operators"
import { Connectable, getAudioContext, FBaseNode } from "./Four"

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
  createAudioSourceBufferNode(): AudioBufferSourceNode | null {
    if (!this._ready) {
      return null
    }
    const ctx = getAudioContext()
    const bs = ctx.createBufferSource()
    bs.buffer = this._audioBuffer

    return bs
  }
}
