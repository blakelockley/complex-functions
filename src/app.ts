window.onload = () => {
    render()
}

function render() {
    const canvas = <HTMLCanvasElement>document.getElementById("plane");
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
