const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let bottomScreen = canvas.height;

window.addEventListener('resize', function () {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
});

const gravity = 1.5;

class Sprite {
	constructor({ position, velocity, fillColour }) {
		this.position = position;
		this.velocity = velocity;
		this.width = 30;
		this.height = 30;
		this.health = 3;
		this.fillColour = fillColour;
		this.alive = true;
	}
	draw() {
		ctx.fillStyle = this.fillColour;
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
	update() {
		this.draw();
		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;
		if (this.position.y + this.height + this.velocity.y <= canvas.height) {
			this.velocity.y += gravity;
		} else {
			this.velocity.y = 0;
		}
	}
	died() {
		console.log('You died, fix this message later');
	}
}

class Platform {
	constructor({ position, width, height, fillColour }) {
		this.position = position;
		this.width = width;
		this.height = height;
		this.fillColour = fillColour;
	}
	draw() {
		ctx.fillStyle = this.fillColour;
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
}

//player character
const player = new Sprite({
	position: { x: 10, y: 0 },
	velocity: { x: 0, y: 0 },
	fillColour: 'red',
});

//level array
const platforms = [
	new Platform({
		position: { x: 0, y: (bottomScreen -= 80) },
		width: 600,
		height: 80,
		fillColour: 'blue',
	}),
	new Platform({
		position: {
			x: 200,
			y: 200,
		},
		width: 200,
		height: 20,
		fillColour: 'blue',
	}),

	new Platform({
		position: {
			x: 650,
			y: 300,
		},
		width: 200,
		height: 20,
		fillColour: 'blue',
	}),
];
const keys = {
	right: { pressed: false },
	left: { pressed: false },
	down: { pressed: false },
	up: { pressed: false },
};

//win state
let scrollOffset = 0;

function animate() {
	window.requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//generate player and platforms
	player.update();
	platforms.forEach((platform) => {
		platform.draw();
	});

	if (player.position.y + player.height > canvas.height) {
		console.log('you died!');
		player.alive = false;
		player.died();
	}

	// movement
	if (keys.right.pressed && player.position.x < 400) {
		player.velocity.x += 3;
	} else if (keys.left.pressed && player.position.x > 100) {
		player.velocity.x -= 3;
	} else if (keys.up.pressed) {
		player.velocity.y -= 3;
	} else {
		player.velocity.x = 0;
		if (keys.right.pressed) {
			scrollOffset += 3;
			platforms.forEach((platform) => {
				platform.position.x -= 3;
			});
		} else if (keys.left.pressed) {
			scrollOffset -= 3;
			platforms.forEach((platform) => {
				platform.position.x += 3;
			});
		}
	}

	//collision detection
	platforms.forEach((platform) => {
		if (
			player.position.y + player.height <= platform.position.y &&
			player.position.y + player.height + player.velocity.y >=
				platform.position.y &&
			player.position.x + player.width >= platform.position.x &&
			player.position.x <= platform.position.x + platform.width
		) {
			player.velocity.y = 0;
		}
	});
	if (scrollOffset > 2000) {
		console.log('you win!');
	}
}

animate();
// window.onload = setInterval(animate, 1000 / 30);

//controller
addEventListener('keydown', ({ key }) => {
	switch (key) {
		case 'a':
			keys.left.pressed = true;

			break;
		case 's':
			keys.down.pressed = true;
			break;
		case 'd':
			keys.right.pressed = true;
			break;
		case 'w':
			keys.up.pressed = true;
			break;
	}
});

addEventListener('keyup', ({ key }) => {
	switch (key) {
		case 'a':
			keys.left.pressed = false;
			break;
		case 's':
			keys.down.pressed = false;
			break;
		case 'd':
			keys.right.pressed = false;
			break;
		case 'w':
			keys.up.pressed = false;
			break;
	}
});
