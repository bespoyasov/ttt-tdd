window.addEventListener('load', function() {
  var codes = document.querySelectorAll('code')
  var worker = new Worker('./js/worker.js')

  worker.onmessage = function(event) { 
    var index = event.data.index
    var result = event.data.result
    codes[index].innerHTML = result
  }

  Array().forEach.call(codes, function(node, i) {
    worker.postMessage({
      content: node.textContent,
      index: i
    })
  })
})