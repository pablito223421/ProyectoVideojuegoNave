const botonStart = document.getElementById("boton-start")
const reglasjuego = document.getElementById("reglas-del-juego")
const AreaJuego= document.getElementById("area-del-juego")
const jugador = document.getElementById("jugador")
const Imagenesnavesmalas = ['Imagenesjuego/naveenemiga.png', 'Imagenesjuego/avionenemigo2.jpg', 'Imagenesjuego/navedestructora3.png']
const contarPuntuacion = document.querySelector('#puntaje span')

let justicia
let Intrervalonaves


botonStart.addEventListener("click", (event) => {
  IniciarJuego()
})


function VolarNave(event) {
  if (event.key === "ArrowUp") {
    event.preventDefault()
   MoverhaciaArriba()
  } else if (event.key === "ArrowDown") {
    event.preventDefault()
    MoverhaciaAbajo()
  } else if (event.key === " ") {
    event.preventDefault()
    meteoritofuego()
  }
}


function MoverhaciaArriba() {
  let Posiciontop = window.getComputedStyle(jugador).getPropertyValue('top')
  if (jugador.style.top === "0px") {
    return
  } else {
    let posicion = parseInt(Posiciontop)
    posicion -= 7
    jugador.style.top = `${posicion}px`
  }
}


function MoverhaciaAbajo() {
  let Posiciontop = window.getComputedStyle(jugador).getPropertyValue('top')
  if (jugador.style.top === "360px") {
    return
  } else {
    let posicion = parseInt(Posiciontop)
    posicion += 7
    jugador.style.top = `${posicion}px`
  }
}


function meteoritofuego() {
  let disparos = crearElementoFuego()
  AreaJuego.appendChild(disparos)
  let disparosSFX = new Audio('Efectos/disparos2.mp3')
  disparosSFX.play()
  movimientoDisparo(disparos)
}


function crearElementoFuego() {
  let xposicion = parseInt(window.getComputedStyle(jugador).getPropertyValue('left'))
  let yposicion = parseInt(window.getComputedStyle(jugador).getPropertyValue('top'))
  let nuevosDisparos = document.createElement('img')
  nuevosDisparos.src = 'Imagenesjuego/meteorito.png'
  nuevosDisparos.classList.add('disparos')
  nuevosDisparos.style.left = `${xposicion}px`
  nuevosDisparos.style.top = `${yposicion - 15}px`
  return nuevosDisparos
}


function movimientoDisparo(disparos) {
  let intervaloDisparo = setInterval(() => {
    let xposicion = parseInt(disparos.style.left)
    let naves = document.querySelectorAll(".naves")
    naves.forEach(naves => {
      if (ComprobarColisionDisparo(disparos, naves)) {
        let explosion = new Audio('Efectos/naveestello.mp3')
        explosion.play()
        naves.src = "Imagenesjuego/destruccionnave.png"
        naves.classList.remove("naves")
        naves.classList.add("naves-destruidas")
        contarPuntuacion.innerText = parseInt(contarPuntuacion.innerText) + 20
      }
    })
    if (xposicion === 340) {
      disparos.remove()
    } else {
      disparos.style.left = `${xposicion + 4}px`
    }
  }, 10)
}


function CrearNave() {
  let nuevasnaves = document.createElement('img')
  let ImagenesNaveschicas= Imagenesnavesmalas[Math.floor(Math.random()*Imagenesnavesmalas.length)]
  nuevasnaves.src = ImagenesNaveschicas
  nuevasnaves.classList.add('naves')
  nuevasnaves.classList.add('transicion-naves')
  nuevasnaves.style.left = '370px'
  nuevasnaves.style.top = `${Math.floor(Math.random() * 330) + 30}px`
  AreaJuego.appendChild(nuevasnaves)
  MoverNave(nuevasnaves)
}


function MoverNave(naves) {
  let movimientoIntervaloNaves = setInterval(() => {
    let xposicion = parseInt(window.getComputedStyle(naves).getPropertyValue('left'))
    if (xposicion <= 50) {
      if (Array.from(naves.classList).includes("naves-destruidas")) {
        naves.remove()
      } else {
        PierdesJuego()
      }
    } else {
      naves.style.left = `${xposicion - 4}px`
    }
  }, 30)
}


function ComprobarColisionDisparo(disparos, naves) {
  let disparoIzquierdo = parseInt(disparos.style.left)
  let disparotop= parseInt(disparos.style.top)
  let BotonDisparos= disparotop- 20
  let Navetop = parseInt(naves.style.top)
  let BotonNaves = Navetop - 30
  let NaveIzquierda = parseInt(naves.style.left)
  if (disparoIzquierdo != 340 && disparoIzquierdo + 40 >= NaveIzquierda) {
    if ( (disparotop<= Navetop && disparotop>= BotonNaves) ) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}


function PierdesJuego() {

  window.removeEventListener("keydown", VolarNave)
  justicia.pause()
  let PierdesJuegoSfx = new Audio('Efectos/game-over.m4A')
  PierdesJuegoSfx.play()
  clearInterval(Intrervalonaves)
  let naves = document.querySelectorAll(".naves")
  naves.forEach(naves => naves.remove())
  let disparos = document.querySelectorAll(".disparos")
  disparos.forEach(disparos => disparos.remove())
  setTimeout(() => {
    alert(`GAME OVER.El juego se ha acabado.Tu puntaje total del juego es de: ${contarPuntuacion.innerText}pts`)
    jugador.style.top = "180px"
    botonStart.style.display = "block"
    reglasjuego.style.display = "block"
    contarPuntuacion.innerText = 0
  }, 1100)
}

function IniciarJuego() {
  botonStart.style.display = 'none'
  reglasjuego.style.display = 'none'
  window.addEventListener("keydown", VolarNave)
  justicia = new Audio("Efectos/meteoro.mp3")
  justicia.play()
  Intrervalonaves = setInterval(() => { CrearNave() }, 2100)
}
