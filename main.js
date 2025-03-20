console.log('Emi');

// 1. identificar el canvas
const canvas = document.querySelector('#canvas');
console.log(canvas);

// 1.5 definir el tamaño del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 2. definir el contexto de una constante
const ctx = canvas.getContext('2d');
console.log(ctx);

///variables
const naranja = 'rgb(234 153 77)';
const naranja_obscuro = 'rgb(233 135 77)';
const sol = 'rgb(253 230 180)';
let nightOpacity = 0; // opacidad del overlay nocturno
let darkening = true;
let lastMousePos;
let stars = [];

////edificios
const buildingRects = [
    // Primera fila
    { x: 0,    y: 350, w: 200, h: 800, color: naranja },
    { x: 100,  y: 250, w: 100, h: 800, color: naranja },
    { x: 300,  y: 150, w: 200, h: 800, color: naranja },
    { x: 300,  y: 0,   w: 50,  h: 600, color: naranja },
    { x: 650,  y: 300, w: 300, h: 800, color: naranja },
    { x: 900,  y: 100, w: 50,  h: 600, color: naranja },
    { x: 1050, y: 100, w: 300, h: 800, color: naranja },
    { x: 1300, y: 20,  w: 50,  h: 600, color: naranja },
    { x: 1500, y: 250, w: 150, h: 800, color: naranja },
    { x: 1500, y: 100, w: 50,  h: 600, color: naranja },

    // Segunda fila (capa inferior)
    { x: 100,  y: 650, w: 250, h: 300, color: naranja_obscuro },
    { x: 100,  y: 400, w: 50,  h: 500, color: naranja_obscuro },
    { x: 450,  y: 550, w: 200, h: 500, color: naranja_obscuro },
    { x: 450,  y: 500, w: 100, h: 100, color: naranja_obscuro },
    { x: 800,  y: 430, w: 300, h: 700, color: naranja_obscuro },
    { x: 800,  y: 200, w: 50,  h: 300, color: naranja_obscuro },
    { x: 1250, y: 550, w: 300, h: 700, color: naranja_obscuro },
    { x: 1250, y: 400, w: 60,  h: 300, color: naranja_obscuro },
    { x: 1650, y: 600, w: 100, h: 300, color: naranja_obscuro },
    { x: 1700, y: 500, w: 50,  h: 100, color: naranja_obscuro }
];

//Dibujar edificios
function drawBuildings() {
    for (let rect of buildingRects) {
        ctx.beginPath();
        ctx.fillStyle = rect.color;
        ctx.rect(rect.x, rect.y, rect.w, rect.h);
        ctx.fill();
    }
}

function drawScene() {
    drawBuildings();
    drawLine();
}

///linea
function drawLine() {
    ctx.beginPath();
    ctx.moveTo(40, 830);
    ctx.lineTo(950, 830);
    ctx.strokeStyle = 'rgb(255,255,255)';
    ctx.lineWidth = 6;
    ctx.stroke();
}

// función para generar estrellas
function initStars() {
    const starCount = 100; // número de estrellas
    stars = [];
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 1  // radio
        });
    }
}

// función para dibujar estrellas
function drawStars() {
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
    }
}

/////funciones del teclado/mouse

//actualizar el canvas
function updateCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	// Dibujar el círculo (fondo)
	if (lastMousePos) {
		ctx.beginPath();
		ctx.fillStyle = sol;
		ctx.arc(lastMousePos.x, lastMousePos.y, 300, 0, Math.PI * 2);
		ctx.fill();
	}
	
	// Dibujar la escena de edificios encima del círculo
	drawScene();
	
	//overlay
	if (nightOpacity > 0) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(0, 0, canvas.width, canvas.height);
		if (lastMousePos) {
			ctx.arc(lastMousePos.x, lastMousePos.y, 300, 0, Math.PI * 2, true);
		}
		ctx.clip('evenodd');
		ctx.fillStyle = `rgba(0,0,0,${nightOpacity})`;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.restore();
	}
	
///// estrellas
    if (nightOpacity === 1) {
        if (stars.length === 0) initStars();
        drawStars();
    }
}

// Dibuja la escena inicial
drawScene();

// actualizar poscicion del mouse
canvas.addEventListener('mousemove', (event) => {
	lastMousePos = { x: event.clientX, y: event.clientY };
	updateCanvas();
});

// Teclado:
window.addEventListener('keydown', (event) => {
	if (event.code === 'Space') {
		event.preventDefault();
		if (darkening) {
			nightOpacity += 0.1;
			if (nightOpacity >= 1) {
				nightOpacity = 1;
				darkening = false;
			}
		} else {
			nightOpacity -= 0.1;
			if (nightOpacity <= 0) {
				nightOpacity = 0;
				darkening = true;
			}
		}
		updateCanvas();
	}
});
