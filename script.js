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

var difficulty = document.getElementById("difficulty")
var difficultyN = difficulty.value
var tilesX = 17
var tilesY = 12
var tiles = []
var nBombs = 0
let flag = new Image()
flag.src = "./resources/Flag.png"

class Tile {
  constructor(i, j) {
    this.i = i
    this.j = j
    this.isBomb = false
    this.isOpen = false
    this.isFlagad = false
    this.bombsAround = 0
    this.openAround = false
  }
}

function generateTiles() {
  for (let i = 0; i < tilesX; i++) {
    for (let j = 0; j < tilesY; j++) {
      let tile = new Tile(i, j)

      tile.isBomb = Math.floor(Math.random() * 7) == 0
      if (tile.isBomb) {
        nBombs += 1
      }

      tiles.push(tile)
    }
  }
}

function generateNBombs() {
  tiles.map((t) => {
    const nBombs = calculeteNBombsAround(t)
    t.bombsAround = nBombs
  })
}

function calculeteNBombsAround(tile) {
  let bombCounter = 0
  for (let i = tile.i - 1; i <= tile.i + 1; i++) {
    for (let j = tile.j - 1; j <= tile.j + 1; j++) {
      if (i != tile.i || j != tile.j) {
        if (tiles.find((t) => t.i == i && t.j == j)?.isBomb) bombCounter += 1
      }
    }
  }
  return bombCounter
}

function draw() {
  tiles.map((t) => {
    darwTile(t)
  })
}

function openTile(tile) {
  if (!tile.isFlagad) {
    tile.isOpen = true
  }
  if (!tile.openAround && tile.bombsAround == 0 && !tile.isBomb) openAround(tile)
}

function openAround(tile) {
  tile.openAround = true
  for (let i = tile.i - 1; i <= tile.i + 1; i++) {
    for (let j = tile.j - 1; j <= tile.j + 1; j++) {
      if (i != tile.i || j != tile.j) {
        const currentTile = tiles.find((t) => t.i == i && t.j == j)
        if (currentTile && !currentTile?.isBomb) {
          openTile(currentTile)
          draw()
        }
      }
    }
  }
}

generateTiles()
generateNBombs()
draw()

function darwTile(tile) {
  let x = tile.i * 31 + 1
  let y = tile.j * 31 + 1

  if (tile.isOpen) {
    if (tile.isBomb) {
      ctx.fillStyle = "#ff0000"
      ctx.fillRect(x, y, 30, 30)
    } else {
      if ((tile.i + tile.j) % 2 == 0) {
        ctx.fillStyle = "#999999"
      } else {
        ctx.fillStyle = "#888888"
      }
      ctx.fillRect(x, y, 30, 30)

      if (tile.bombsAround) {
        ctx.font = "25px Arial"
        ctx.textAlign = "center"
        ctx.fillStyle = "black"
        ctx.fillText(tile.bombsAround, x + 15, y + 25)
      }
    }
  } else {
    if ((tile.i + tile.j) % 2 == 0) {
      ctx.fillStyle = "#2fbf04"
    } else {
      ctx.fillStyle = "#28ac00"
    }
    ctx.fillRect(x, y, 30, 30)
  }

  if (tile.isFlagad && !tile.isOpen) {
    ctx.drawImage(flag, x, y, 30, 30)
  }
}

document.addEventListener("click", function (e) {
  if (difficulty.value != difficultyN) {
    difficultyN = difficulty.value
    if (difficulty.value == "Medio") {
      ctx.clearRect(0, 0, 1000, 1000)
      tilesX = 17
      tilesY = 12
      tiles = []
      generateTiles()
      generateNBombs()
      draw()
    } else if (difficulty.value == "Facil") {
      ctx.clearRect(0, 0, 1000, 1000)
      tilesX = 10
      tilesY = 10
      tiles = []
      generateTiles()
      generateNBombs()
      draw()
    } else {
      ctx.clearRect(0, 0, 1000, 1000)
      tilesX = 35
      tilesY = 35
      tiles = []
      generateTiles()
      generateNBombs()
      draw()
    }
    draw()
  }
  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const i = Math.floor((mouseX / 526) * 17)
  const j = Math.floor((mouseY / 371) * 12)

  let tile = tiles.find((t) => t.i == i && t.j == j)
  if (!tile.isFlagad) {
    tile.isOpen = true
  }

  draw()
  openTile(tile)
})

document.addEventListener("contextmenu", function (e) {
  e.preventDefault()

  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const i = Math.floor((mouseX / 526) * 17)
  const j = Math.floor((mouseY / 371) * 12)

  let tile = tiles.find((t) => t.i == i && t.j == j)
  tile.isFlagad = !tile.isFlagad
  let x = tile.i * 31 + 1
  let y = tile.j * 31 + 1
  draw()
})
