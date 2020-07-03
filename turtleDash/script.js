function Fish(srcImg, sw, sh) {
	this.srcImg = srcImg;
	this.sw = sw;
	this.sh = sh;
	this.animationPhase = 0;
	this.animationSpeed = 0.1;
	this.x = 0;
	this.y = 0;
	this.w = this.sw;
	this.h = this.sh;
	this.draw = function() {
		ctx.drawImage(this.srcImg, ~~this.animationPhase * this.sw, 0, this.sw, this.sh, this.x, this.y, this.w, this.h);
		this.animationPhase = (this.animationPhase + this.animationSpeed) % (this.srcImg.naturalWidth / this.sw);
	};
	this.update = function() {};
}
function Junk(srcImg) {
	this.srcImg = srcImg;
	this.x = 0;
	this.y = 0;
	this.draw = function() {
		ctx.drawImage(this.srcImg, this.x, this.y);
	};
	this.update = function() {};
}

var can, ctx;

var startScreen, container;

var keyStates = [];

var score = 0;

var turtle = {
	pos: {
		x: 15,
		y: 50
	},
	size: {
		w: 76,
		h: 56
	},
	gravity: 0.25,
	vy: 0,
	animationPhase: 0,
	animationSpeed: 0.06,
	health: 100,
	energy: 100,
	draw: function() {
		ctx.drawImage(Assets.turtleSpritesheet, ~~this.animationPhase * 19, 0, 19, 14, this.pos.x, this.pos.y, this.size.w, this.size.h);
		// Drawing the health bar
		ctx.fillStyle = "black";
		ctx.fillRect(420, 24, 76, 8);
		ctx.fillStyle = "green";
		ctx.fillRect(421, 25, 74, 6);
		ctx.fillStyle = "red";
		ctx.fillRect(495, 25, -((100 - this.health) * 0.74), 6);
		// Drawing the energy bar
		ctx.fillStyle = "black";
		ctx.fillRect(4, 24, 76, 8);
		ctx.fillStyle = "green";
		ctx.fillRect(5, 25, 74, 6);
		ctx.fillStyle = "red";
		ctx.fillRect(79, 25, -((100 - (this.energy > 99.5? 100 : this.energy)) * 0.74), 6);
		// Typing(?) the text(...?)
		ctx.fillStyle = "black";
		ctx.font = "16px Balsamiq Sans";
		ctx.textAlign = "right";
		ctx.fillText(`Health: ${this.health}%`, 500, 0);
		ctx.textAlign = "left";
		ctx.fillText(`Energy: ${ceil(this.energy)}%`, 0, 0);
		// Showing the score (why in the turtle object, IDK)
		ctx.textAlign = "center";
		ctx.fillText(`Score: ${score}`, 250, 0);
	},
	update: function() {
		this.animationPhase = (this.animationPhase + this.animationSpeed) % 4;
		this.vy += this.gravity;
		this.vy = max(min(this.vy, 10), -10);
		this.pos.y += this.vy;
		if(this.pos.y < 0) {
			this.pos.y = 0;
			this.vy = 0;
		} else if(this.pos.y > can.height - this.size.h) {
			this.pos.y = can.height - this.size.h;
			this.vy = 0;
		}
		var bits = [[6,1],[7,1],[8,1],[9,1],[0,2],[3,2],[4,2],[5,2],[10,2],[11,2],[12,2],[0,3],[1,3],[2,3],[13,3],[0,4],[1,4],[14,4],[15,4],[16,4],[17,4],[2,5],[18,5],[2,6],[18,6],[2,7],[18,7],[2,8],[14,8],[15,8],[16,8],[17,8],[0,9],[1,9],[13,9],[0,10],[1,10],[2,10],[13,10],[0,11],[3,11],[4,11],[5,11],[10,11],[11,11],[12,11],[6,12],[7,12],[9,12],[8,13],[9,13],[8,14],[9,14],[6,15],[7,15],[9,15],[0,16],[3,16],[4,16],[5,16],[10,16],[11,16],[12,16],[0,17],[1,17],[2,17],[13,17],[0,18],[1,18],[14,18],[15,18],[16,18],[17,18],[2,19],[18,19],[2,20],[18,20],[2,21],[18,21],[2,22],[14,22],[15,22],[16,22],[17,22],[0,23],[1,23],[13,23],[0,24],[1,24],[2,24],[13,24],[0,25],[3,25],[4,25],[5,25],[10,25],[11,25],[12,25],[6,26],[7,26],[9,26],[8,27],[9,27],[8,28],[9,28],[6,29],[7,29],[9,29],[0,30],[3,30],[4,30],[5,30],[10,30],[11,30],[12,30],[0,31],[1,31],[2,31],[13,31],[0,32],[1,32],[14,32],[15,32],[16,32],[17,32],[2,33],[18,33],[2,34],[18,34],[2,35],[18,35],[2,36],[14,36],[15,36],[16,36],[17,36],[0,37],[1,37],[13,37],[0,38],[1,38],[2,38],[13,38],[0,39],[3,39],[4,39],[5,39],[10,39],[11,39],[12,39],[6,40],[7,40],[9,40],[8,41],[9,41],[8,42],[9,42],[6,43],[7,43],[9,43],[0,44],[3,44],[4,44],[5,44],[10,44],[11,44],[12,44],[0,45],[1,45],[2,45],[13,45],[0,46],[1,46],[14,46],[15,46],[16,46],[17,46],[2,47],[18,47],[2,48],[18,48],[2,49],[18,49],[2,50],[14,50],[15,50],[16,50],[17,50],[0,51],[1,51],[13,51],[0,52],[1,52],[2,52],[13,52],[0,53],[3,53],[4,53],[5,53],[10,53],[11,53],[12,53],[6,54],[7,54],[9,54],[8,55],[9,55]];
		this.bitMap = bits.filter(function(coord) {
			return coord[1] > (~~this.animationPhase * 14) && coord[1] < (~~this.animationPhase * 14 + 14);
		});
		this.energy -= 0.05;
		if(this.energy <= 0) {
			swal.fire({
				title: "Game over!",
				html: "Uh oh! You didn't eat enough food!",
				icon: "error"
			});
		}
	},
	bitMap: []
};
var fish = [];
var junk = [];

var Assets = {
	turtleSpritesheet: "turtleSpritesheet.png",
	fish0: "fish0.png",
	fish1: "fish1.png",
	fish2: "fish2.png",
	cokeCan: "cokeCan.png",
	load: async function() {
		var promsArr = [];
		var keys = Object.keys(this);
		keys.splice(keys.indexOf("load"), 1);
		keys.forEach(function(key) {
			var src = Assets[key];
			var fileExtension = src.startsWith("data:")? src.match(/data:[a-zA-Z]+\/([a-zA-Z]+)/)[1] : src.match(/[a-zA-Z]+$/).toString();
			var fileType = "unknown";
			switch(fileExtension) {
				case "png":
				case "jpg":
				case "svg":
					fileType = "image";
					break;
				case "mp3":
				case "wav":
				case "ogg":
					fileType = "audio";
					break;
				default: break;
			}
			var el;
			switch(fileType) {
				case "image":
					el = document.createElement("img");
					break;
				case "audio":
					el = document.createElement("audio");
					break;
				default: break;
			}
			promsArr.push(new Promise(function(callback, error) {
				el.onload = callback;
				el.onerror = error;
			}));
			el.src = "assets/" + src;
			delete Assets[key];
			Assets[key] = el;
		});
		var ultimateAssetPromise = Promise.all(promsArr);
		await ultimateAssetPromise;
	}
};

window.addEventListener("load", async function() {
	can = selectEl("canvas");
	ctx = can.getContext("2d");
	
	startScreen = selectEl(".startScreen");
	container = selectEl(".container");
	
	await init();
});
async function init() {
	function keyDownEvent(e) {
		var key = (e.key || "w").toLowerCase();
		if(["w", "arrowup", " "].indexOf(key) != -1) {
			e.preventDefault();
			if(keyStates.indexOf(key) == -1) {
				turtle.vy = -5;
			}
		}
		keyStates.push(key);
		if(key == "k") console.log(turtle.x, turtle.y);
	}
	function keyUpEvent(e) {
		var key = (e.key || "w").toLowerCase();
		keyStates.splice(keyStates.indexOf(key), 1);
	}
	window.addEventListener("keydown", keyDownEvent);
	window.addEventListener("keyup", keyUpEvent);
	can.addEventListener("touchstart", keyDownEvent);
	can.addEventListener("mousedown", keyDownEvent);
	can.addEventListener("touchend", keyUpEvent);
	can.addEventListener("mouseup", keyUpEvent);
	ctx.textBaseline = "top";
	ctx.imageSmoothingEnabled = false;
	
	await Assets.load();
	
}
function loop() {
	update();
	draw();
	if(turtle.health > 0 && turtle.energy > 0) {
		window.requestAnimationFrame(loop);
	}
}
function update() {
	score++;
	turtle.update();
	fish.forEach(function(f, i) {
		f.update();
		if(f.x < -f.w) {
			fish.splice(i, 1);
		}
		if(f.checkCollision()) {
			turtle.energy = min(turtle.energy + random(15, 25), 100);
			fish.splice(i, 1);
			score += 200;
		}
	});
	junk.forEach(function(j, i) {
		j.update();
		if(j.x < -j.srcImg.naturalWidth) {
			junk.splice(i, 1);
			return;
		}
		if(j.checkCollision()) {
			turtle.health = max(turtle.health - random(15, 25), 0);
			junk.splice(i, 1);
			score -= 100;
		}
	});
	if(turtle.health <= 0) {
		swal.fire({
			title: "Game over!",
			html: "Uh oh! You ate too much junk!<br/><br/>While this may seem funny, it's a real issue - more than <b><u>1,000</u> turtles die <u>each year</u></b> from plastic and other junk in the water. Is is estimated that by 2050, there will be more plastic than fish in the world's oceans.",
			icon: "error"
		});
	}
	
	var fishMax = 12 - max(~~(score / 2000), 10);
	if(!random(0, 60) && fish.length < fishMax) {
		var allTheFish = [Assets.fish0, Assets.fish1, Assets.fish2];
		var i = random(0, allTheFish.length);
		var newFish = new Fish(allTheFish[i], [22, 37, 36][i], [20, 20, 30][i]);
		newFish.x = 500;
		newFish.y = random(0, 500 - newFish.srcImg.naturalHeight);
		newFish.update = function() {
			this.x -= random(1, 3);
		};
		newFish.bitMap = [[[7,1],[8,1],[9,1],[10,1],[11,1],[12,1],[7,2],[12,2],[20,2],[6,3],[13,3],[19,3],[21,3],[4,4],[5,4],[14,4],[18,4],[21,4],[3,5],[15,5],[18,5],[21,5],[2,6],[16,6],[18,6],[21,6],[1,7],[17,7],[21,7],[1,8],[21,8],[0,9],[21,9],[0,10],[21,10],[0,11],[21,11],[0,12],[21,12],[1,13],[21,13],[1,14],[17,14],[21,14],[2,15],[16,15],[18,15],[21,15],[3,16],[15,16],[18,16],[21,16],[4,17],[5,17],[14,17],[18,17],[21,17],[6,18],[7,18],[8,18],[9,18],[10,18],[11,18],[12,18],[13,18],[19,18],[21,18],[20,19]], [[10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],[20,1],[7,2],[8,2],[9,2],[21,2],[5,3],[6,3],[22,3],[31,3],[32,3],[33,3],[34,3],[4,4],[23,4],[30,4],[35,4],[3,5],[24,5],[30,5],[36,5],[2,6],[25,6],[29,6],[36,6],[1,7],[26,7],[27,7],[28,7],[36,7],[0,8],[36,8],[0,9],[36,9],[0,10],[28,10],[36,10],[0,11],[27,11],[29,11],[36,11],[1,12],[26,12],[27,12],[30,12],[36,12],[2,13],[25,13],[30,13],[35,13],[3,14],[24,14],[31,14],[32,14],[33,14],[34,14],[4,15],[23,15],[5,16],[6,16],[22,16],[7,17],[8,17],[9,17],[21,17],[10,18],[11,18],[12,18],[13,18],[14,18],[19,18],[20,18],[15,19],[18,19]], [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[1,2],[3,2],[8,2],[9,2],[1,3],[4,3],[10,3],[1,4],[4,4],[11,4],[1,5],[3,5],[11,5],[12,5],[2,6],[3,6],[12,6],[12,7],[14,7],[15,7],[16,7],[17,7],[18,7],[32,7],[33,7],[34,7],[11,8],[13,8],[19,8],[20,8],[21,8],[22,8],[31,8],[34,8],[9,9],[10,9],[23,9],[24,9],[31,9],[34,9],[8,10],[25,10],[30,10],[34,10],[7,11],[26,11],[30,11],[34,11],[6,12],[26,12],[30,12],[34,12],[5,13],[27,13],[30,13],[34,13],[4,14],[28,14],[30,14],[34,14],[3,15],[29,15],[34,15],[3,16],[34,16],[3,17],[4,17],[34,17],[5,18],[6,18],[7,18],[34,18],[8,19],[9,19],[34,19],[10,20],[34,20],[10,21],[29,21],[34,21],[8,22],[9,22],[28,22],[30,22],[34,22],[5,23],[6,23],[7,23],[27,23],[30,23],[34,23],[6,24],[26,24],[30,24],[34,24],[7,25],[26,25],[30,25],[34,25],[8,26],[9,26],[24,26],[25,26],[30,26],[34,26],[10,27],[11,27],[22,27],[23,27],[31,27],[34,27],[12,28],[13,28],[14,28],[18,28],[19,28],[20,28],[21,28],[31,28],[34,28],[15,29],[17,29],[32,29],[34,29]]][i];
		newFish.checkCollision = function() {
				var hit = false;
				for(var a = 0; a < turtle.bitMap.length; a++) {
					var coord = turtle.bitMap[a];
					var coord_x = coord[0] * 4 + turtle.pos.x;
					var coord_y = coord[1] * 4 + turtle.pos.y;
					var coord_w = 4;
					var coord_h = 4;
					for(var b = 0; b < newFish.bitMap.length; b++) {
						var coord2 = newFish.bitMap[b];
						var coord2_x = coord2[0] + newFish.x;
						var coord2_y = coord2[1] + newFish.y;
						var coord2_w = 1;
						var coord2_h = 1;
						if(coord_x + coord_w > coord2_x && coord_x < coord2_x + coord2_w && coord_y + coord_h > coord2_y && coord_y < coord2_y + coord2_h) {
							hit = true;
							break;
						}
					}
					if(hit) {
						break;
					}
				}
				return hit;
			};
		fish.push(newFish);
	}
	var junkMax = 2 + min(~~(score / 2000), 10);
	if(!random(0, 60) && junk.length < junkMax) {
		var allTheJunk = [Assets.cokeCan];
		var i = random(0, allTheJunk.length);
		var newJunk = new Junk(allTheJunk[i]);
		var t = 0;
		while(t++ < 10) {
			newJunk.x = 500;
			newJunk.y = random(0, 500 - newJunk.srcImg.naturalHeight);
			var toBreak = true;
			junk.forEach(function(j) {
				if(abs(j.x - newJunk.x) < 100 && abs(j.y - newJunk.y) < 100) {
					toBreak = false;
				}
			});
			if(toBreak) {
				break;
			}
		}
		if(t < 10) {
			newJunk.update = function() {
				this.x -= 1.5;
				this.y += random(-2, 3) / 2;
			};
			newJunk.bitMap = [[[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[4,2],[5,2],[19,2],[3,3],[20,3],[1,4],[2,4],[21,4],[1,5],[20,5],[1,6],[20,6],[1,7],[20,7],[1,8],[21,8],[1,9],[22,9],[0,10],[22,10],[0,11],[21,11],[1,12],[21,12],[1,13],[21,13],[1,14],[21,14],[1,15],[21,15],[1,16],[21,16],[1,17],[21,17],[1,18],[21,18],[1,19],[21,19],[0,20],[21,20],[0,21],[21,21],[1,22],[21,22],[1,23],[21,23],[1,24],[21,24],[1,25],[21,25],[1,26],[21,26],[1,27],[21,27],[1,28],[21,28],[1,29],[21,29],[1,30],[21,30],[1,31],[21,31],[1,32],[21,32],[1,33],[21,33],[1,34],[21,34],[1,35],[21,35],[1,36],[21,36],[1,37],[21,37],[1,38],[20,38],[0,39],[21,39],[1,40],[20,40],[2,41],[20,41],[3,42],[4,42],[18,42],[19,42],[5,43],[6,43],[7,43],[14,43],[15,43],[16,43],[17,43],[8,44],[13,44]]][i];
			newJunk.checkCollision = function() {
				var hit = false;
				for(var a = 0; a < turtle.bitMap.length; a++) {
					var coord = turtle.bitMap[a];
					var coord_x = coord[0] * 4 + turtle.pos.x;
					var coord_y = coord[1] * 4 + turtle.pos.y;
					var coord_w = 4;
					var coord_h = 4;
					for(var b = 0; b < newJunk.bitMap.length; b++) {
						var coord2 = newJunk.bitMap[b];
						var coord2_x = coord2[0] + newJunk.x;
						var coord2_y = coord2[1] + newJunk.y;
						var coord2_w = 1;
						var coord2_h = 1;
						if(coord_x + coord_w > coord2_x && coord_x < coord2_x + coord2_w && coord_y + coord_h > coord2_y && coord_y < coord2_y + coord2_h) {
							hit = true;
							break;
						}
					}
					if(hit) {
						break;
					}
				}
				return hit;
			};
			junk.push(newJunk);
		}
	}
}
function draw() {
	ctx.clearRect(0, 0, can.width, can.height);
	
	turtle.draw();
	fish.forEach(function(f) {
		f.draw();
	});
	junk.forEach(function(j) {
		j.draw();
	});
}

function play() {
	startScreen.classList.add("hidden");
	container.classList.remove("hidden");
	loop();
}
function howToPlay() {
	swal.fire({
		title: "How to Play",
		html: "Tap the screen, or press either the <code>w</code> key, the <code>&uarr;up</code> key, or the <code>_space</code> bar to make the turtle swim up. Remember to eat fish so you have enough energy, but avoid the plastic bags and the other junk in the water!",
		icon: "info"
	});
}
function credits() {
	swal.fire({
		title: "Credits",
		html: `
		<ul style="list-style-position: inside;">
			<li>Made by Rowsej</li>
			<li>Turtle, orange fish and blue fish sprites designed by me, with the use of <a href="//pixilart.com/draw#" target="_blank">Pixilart</a></li>
			<li>Orange-blue angler fish and Coke can designed by ExoticButters</li>
			<li><a href="//sweetalert2.github.io" target="_blank">SweetAlert</a> for the popup boxes (like this one)</li>
			<li><a href="//sololearn.com" target="_blank">SoloLearn</a> for teaching me how to code</li>
			<li><a href="//freepik.com/free-photos-vectors/background" target="_blank">Background vector created by freepik - www.freepik.com</a></li>
			<li><a href=//www.unenvironment.org/news-and-stories/story/fatal-attraction-turtles-and-plastic" target="_blank">Fatal Attraction: Turtles and Plastic</a> for the facts about turtles and plastic in oceans</li>
		</ul>`,
		icon: "info"
	});
}
