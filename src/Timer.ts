import { /*fromEvent,*/ Subject, of } from "rxjs"
import {
  map,
  shareReplay,
  scan,
  filter,
  publish,
  combineLatest
} from "rxjs/operators"

console.log("Timer")
console.log("FO")
const worker = new Worker("./scheduler.js")
const timerSubject = new Subject()

const interval = 25

worker.onmessage = d => timerSubject.next(d)
export const start = () => worker.postMessage({ type: "START", interval })
export const stop = () => worker.postMessage({ type: "STOP" })

setTimeout(() => start(), 500)
export default () => {}

export const tick$ = (times: number) =>
  of(times).pipe(
    combineLatest(timerSubject, (a, _) => a),
    scan(
      (acc, curr) => {
        if (acc.num > interval * times) return { num: 0 }
        else return { num: acc.num + interval }
      },
      { num: 0 }
    ),
    filter(n => n.num === 0)
  )

export const tickAll$ = () => timerSubject

/*

export interface TimerData {
  elapsed: number
  cnt: number
}

export type TimerSubject = Subject<TimerData>

const timer$ = fromEvent<MessageEvent>(ev, "tick").pipe(
  map((x: MessageEvent): TimerData => x.data as TimerData),
  shareReplay()
)

export const getTimer$ = () => timer$

export const createTimerSubject = (limit: number) => {
  const subject: TimerSubject = new Subject()
  const observable = publish<TickEventTrigger>()(
    subject.asObservable().pipe(
      scan((acc: TickEventTrigger, x: TimerData) => {
        acc.update(x.elapsed)
        return acc
      }, new TickEventTrigger(limit)),
      filter(x => x.determineFire())
    )
  )
  observable.connect()
  return { subject, observable }
}

export class TickEventTrigger {
  elapsed: number
  count: number
  limit: number
  countTriggered: number
  constructor(limit: number) {
    this.count = 0
    this.elapsed = 0
    this.countTriggered = 0
    this.limit = limit
  }
  update(elapsed: number) {
    this.count = this.count + 1
    this.elapsed = elapsed
  }
  determineFire() {
    if (this.count >= this.limit) {
      this.count = 0
      this.countTriggered = this.countTriggered + 1
      return true
    }
    return false
  }
}

*/
