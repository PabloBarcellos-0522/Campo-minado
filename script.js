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
var cron
var tilesX = 17
var tilesY = 12
var size = 30

var i
var j

var tiles = []
var nBombs = 0
var qBombs = 30
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

      // tile.isBomb = Math.floor(Math.random() * 7) == 0
      // if (tile.isBomb) {
      // nBombs += 1
      // }

      tiles.push(tile)
    }
  }
}

function verificar() {
  let QQD = 0

  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].isBomb) {
      QQD += 1
    }
  }
  return QQD
}

function generateBombs() {
  for (let i = 0; i < qBombs; i++) {
    let random = Math.floor(Math.random() * tiles.filter((t) => !t.isBomb).length)
    // tiles.filter((t) => !t.isBomb)[random].isBomb = true
    if (!tiles[random].isBomb) {
      tiles[random].isBomb = true
    } else {
      qBombs += 1
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
generateBombs()
generateNBombs()
draw()

function darwTile(tile) {
  let x = tile.i * 31 + 1
  let y = tile.j * 31 + 1

  if (difficultyN == "Facil") {
    size = 39
    x = tile.i * 40 + 1
    y = tile.j * 40 + 1
    z = 20
    w = 30
  } else if (difficultyN == "Medio") {
    size = 30
    x = tile.i * 31 + 1
    y = tile.j * 31 + 1
    z = 15
    w = 25
  } else {
    size = 20
    x = tile.i * 21 + 1
    y = tile.j * 21 + 1

    z = 10
    w = 20
  }

  if (tile.isOpen) {
    if (tile.isBomb) {
      ctx.fillStyle = "#ff0000"
      ctx.fillRect(x, y, size, size)
    } else {
      if ((tile.i + tile.j) % 2 == 0) {
        ctx.fillStyle = "#999999"
      } else {
        ctx.fillStyle = "#888888"
      }
      ctx.fillRect(x, y, size, size)

      if (tile.bombsAround) {
        ctx.font = "25px Arial"
        ctx.textAlign = "center"
        ctx.fillStyle = "black"
        ctx.fillText(tile.bombsAround, x + z, y + w)
      }
    }
  } else {
    if ((tile.i + tile.j) % 2 == 0) {
      ctx.fillStyle = "#2fbf04"
    } else {
      ctx.fillStyle = "#28ac00"
    }
    ctx.fillRect(x, y, size, size)
  }

  if (tile.isFlagad && !tile.isOpen) {
    ctx.drawImage(flag, x, y, size, size)
  }
}

document.addEventListener("click", function (e) {
  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  if (difficulty.value != difficultyN) {
    difficultyN = difficulty.value
    if (difficulty.value == "Medio") {
      document.getElementById("game").style.width = "526px"
      ctx.clearRect(0, 0, 1000, 1000)
      tilesX = 17
      tilesY = 12
      tiles = []
      qBombs = 30

      document.getElementById("Flags").innerHTML = "30"
    } else if (difficulty.value == "Facil") {
      ctx.clearRect(0, 0, 1000, 1000)
      tilesX = 13
      tilesY = 9
      tiles = []
      qBombs = 10

      document.getElementById("Flags").innerHTML = "10"
    } else {
      ctx.clearRect(0, 0, 1000, 1000)
      tilesX = 25
      tilesY = 17
      tiles = []
      qBombs = 50

      document.getElementById("Flags").innerHTML = "50"
    }

    generateTiles()
    generateBombs()
    quant()
    generateNBombs()

    document.getElementById("seconds").innerHTML = "000"
    clearInterval(cron)
    draw()
  }

  if (difficulty.value == "Medio") {
    i = Math.floor((mouseX / 526) * 17)
    j = Math.floor((mouseY / 371) * 12)
  } else if (difficulty.value == "Facil") {
    i = Math.floor((mouseX / 519) * 13) // 39
    j = Math.floor((mouseY / 371) * 9)
  } else {
    i = Math.floor((mouseX / 526) * 25) // 20
    j = Math.floor((mouseY / 356) * 17)
  }

  let tile = tiles.find((t) => t.i == i && t.j == j)

  let first = function () {
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i].isOpen) {
        console.log(tiles[i])
        return false
      }
    }
    if (!tile.isOpen) {
      return true
    }
  }
  console.log(first())
  if (first()) {
    cron = setInterval(() => {
      time()
    }, 1000)
  }

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

  if (difficulty.value == "Medio") {
    i = Math.floor((mouseX / 526) * 17)
    j = Math.floor((mouseY / 371) * 12)
  } else if (difficulty.value == "Facil") {
    i = Math.floor((mouseX / 519) * 13) // 39
    j = Math.floor((mouseY / 371) * 9)
  } else {
    i = Math.floor((mouseX / 526) * 25) // 20
    j = Math.floor((mouseY / 356) * 17)
  }

  let tile = tiles.find((t) => t.i == i && t.j == j)

  if (tile.isFlagad && !tile.isOpen) {
    let n = document.getElementById("Flags").innerHTML
    n -= 0
    n += 1
    document.getElementById("Flags").innerHTML = n
  } else if (!tile.isOpen) {
    let n = document.getElementById("Flags").innerHTML
    n -= 1
    document.getElementById("Flags").innerHTML = n
  }

  tile.isFlagad = !tile.isFlagad
  let x = tile.i * 31 + 1
  let y = tile.j * 31 + 1
  draw()
})

function quant() {
  let QQQ = 0

  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].isBomb) {
      QQQ += 1
    }
  }
  console.log(QQQ)
}

function time() {
  let cron = document.getElementById("seconds")
  let now = cron.innerHTML
  now -= 0
  now += 1

  now = "" + now

  if (now.length == 1) {
    now = "00" + now
  } else if (now.length == 2) {
    now = "0" + now
  }
  document.getElementById("seconds").innerHTML = now
}
