import { /*fromEvent,*/ Subject, of } from "rxjs"
import {
  map,
  shareReplay,
  scan,
  filter,
  publish,
  combineLatest
} from "rxjs/operators"

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
