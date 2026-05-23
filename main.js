function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

const canvas = document.getElementById("canv"),
            ctx = canvas.getContext("2d")

resize()

function render() {
    resize()
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    requestAnimationFrame(render)
}
render()