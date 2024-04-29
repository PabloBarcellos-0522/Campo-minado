document.addEventListener("mousemove", function (e) {
  var mouse = document.getElementById("mouse")

  mouse.style.left = e.pageX - 27 + "px"
  mouse.style.top = e.pageY - 25 + "px"
})
