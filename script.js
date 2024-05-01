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
var nBombs = 10

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
      tile.isBomb = Math.floor(Math.random() * 5) == 0
      tiles.push(tile)
    }
  }
}

generateTiles()

function generateNBombs() {
  tiles.map((t) => {
    const nBombs = calculeteNBombsAround(t)
    t.bombsAround = nBombs
  })
}

function calculeteNBombsAround(tile) {
  let bombCounter = 0
  for (let i = tile.i - 1; i <= tile.i + 1; i++) {
    for (let j = tile.j - 1; j < tile.j + 1; j++) {
      if (i != tile.i || j != tile.j) {
        if (tiles.find((t) => t.i == i && t.j == j)?.isBomb) bombCounter += 1
      }
    }
  }
  return bombCounter
}
generateNBombs()

function draw() {
  tiles.map((t) => {
    darwTile(t)
  })
}

draw()

function darwTile(tile) {
  let x = tile.i * 31 + 1
  let y = tile.j * 31 + 1

  if (tile.isOpen) {
    if (tile.isBomb) {
      ctx.fillStyle = "#ff0000"
      ctx.fillRect(x, y, 30, 30)
    } else {
      ctx.fillStyle = "#999900"
      ctx.fillRect(x, y, 30, 30)

      if (tile.bombsAround) {
        ctx.font = "25px Arial"
        ctx.textAlign = "center"
        ctx.fillStyle = "black"
        ctx.fillText(tile.bombsAround, x + 15, y + 25)
      }
    }
  } else {
    ctx.fillStyle = "#999999"
    ctx.fillRect(x, y, 30, 30)
  }
}

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
