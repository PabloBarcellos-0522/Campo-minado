document.addEventListener("mousemove", function (e) {
  var mouse = document.getElementById("mouse")

  mouse.style.left = e.pageX - 350 + "px"
  mouse.style.top = e.pageY - 350 + "px"

  //   mouse.style.left = e.pageX - 27 + "px"
  //   mouse.style.top = e.pageY - 25 + "px"
})

const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

// ctx.fillStyle = "#ff0000"
// ctx.fillRect(0, 0, 510, 360)

var tilesX = 17
var tilesY = 12

var tiles = []

class Tile {
  constructor(i, j) {
    this.i = i
    this.j = j
    this.isBomb = false
    this.isOpen = false
    this.isFlagad = false
    this.bombsAround = 0
  }
}

function generateTiles() {
  for (let i = 0; i < tilesX; i++) {
    for (let j = 0; j < tilesY; j++) {
      let tile = new Tile(i, j)
      tiles.push(tile)
    }
  }
}

generateTiles()

function draw() {
  tiles.map((t) => {
    if (t.isOpen) {
      ctx.fillStyle = "#2bff00"
    } else {
      ctx.fillStyle = "#ff0000"
    }
    let x = t.i * 31 + 1
    let y = t.j * 31 + 1
    ctx.fillRect(x, y, 30, 30)
  })
}

draw()

document.addEventListener("click", function (e) {
  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const i = Math.floor((mouseX / 526) * 17)
  const j = Math.floor((mouseY / 371) * 12)

  let tile = tiles.find((t) => t.i == i && t.j == j)
  tile.isOpen = true

  draw()
})
