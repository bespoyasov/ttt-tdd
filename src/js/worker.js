onmessage = function(event) {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js')

  var content = event.data.content
  var index = event.data.index
  var result = self.hljs.highlightAuto(content)

  postMessage({
    result: result.value,
    index: index,
  })
}