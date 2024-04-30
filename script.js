document.addEventListener("mousemove", function (e) {
  var mouse = document.getElementById("mouse")

  mouse.style.left = e.pageX - 350 + "px"
  mouse.style.top = e.pageY - 350 + "px"

  //   mouse.style.left = e.pageX - 27 + "px"
  //   mouse.style.top = e.pageY - 25 + "px"
})

const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

ctx.fillStyle = "#ff0000"
ctx.fillRect(0, 0, 30, 20)
