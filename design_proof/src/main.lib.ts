import Module from "@/Module"

export default new Module("#devhook", {
  // config object
})

const app = document.querySelector("#devhook")
if (app instanceof HTMLElement) {
  app.addEventListener("some-event", function (e) {
    if (e instanceof CustomEvent) {
      console.log(e.detail)
      // you can test events emitted for context app here...
    }
  })

  app.addEventListener("some-event", function (e) {
    if (e instanceof CustomEvent) {
      console.log("clickevnet")
      console.log(e.detail)
      // you can test events emitted for context app here...
    }
  })
}
