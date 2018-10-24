let runTimer = false
let cnt = 0
let startTime = 0

const isActive = data => typeof data !== "undefined"

let timerId = 0

const startTimer = n => {
  console.log(n)
  if (runTimer) {
    return
  }
  runTimer = true
  startTime = +new Date()
  timerId = setInterval(() => {
    cnt += 1
    const now = +new Date()
    self.postMessage({ elapsed: now - startTime, cnt })
  }, n)
}

const stopTimer = () => {
  clearInterval(timerId)
  cnt = 0
  runTimer = false
}

self.onmessage = message => {
  if (!isActive(message.data)) {
    return
  }
  switch (message.data.type) {
    case "START":
      console.log("FOJ")
      startTimer(message.data.interval)
      break
    case "STOP":
      stopTimer()
      break
    default:
      break
  }
}
