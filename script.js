var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var background = new Image();
background.src = 'Corgi Sprite/Buckingham_Palace.png';
canvas.width = 800;
canvas.height = 600;

var idleSprites = ['IDLE1/Cori_Idle1.png', 'IDLE1/Cori_Idle2.png', 'IDLE1/Cori_Idle3.png', 'IDLE1/Cori_Idle4.png', 'IDLE1/Cori_Idle5.png'];
var walkSprites = ['WALK/Walk1.png', 'WALK/Walk2.png', 'WALK/Walk3.png', 'WALK/Walk4.png', 'WALK/Walk5.png'];
var runSprites = ['RUN/Run1.png', 'RUN/Run2.png', 'RUN/Run3.png', 'RUN/Run4.png', 'RUN/Run5.png', 'RUN/Run6.png', 'RUN/Run7.png'];
var currentFrame = 0;
var fightCurrentFrame = 0;
var spriteWidth = 100;
var spriteHeight = 100; 
var xPosition = 10;
var facingRight = true;
var moving = false;
var minXPosition = 0;
var maxXPosition = canvas.width - spriteWidth;
var idleAnimation, walkAnimation, runAnimation, fightAnimation;
var isShiftPressed = false;
var isAPressed = false;
var isDPressed = false;
var isRunning = false;

var cheese = new Image();
cheese.src = 'Cheese.png';
var cheeseFalling = false;
var cheeseX = 0;
var cheeseY = 0;
var cheeseSpeed = 2;

var eagle = new Image();
eagle.src = 'Eagle.png'; // Use the correct path to your cheese sprite
var eagleFalling = false;
var eagleX = 0;
var eagleY = 0;
var eagleSpeed = 3; // Adjust the falling speed as necessary




function loadSprites(spriteArray, callback) {
    var loadedSprites = [];
    var loadedCount = 0;
    for (var i = 0; i < spriteArray.length; i++) {
        loadedSprites[i] = new Image();
        loadedSprites[i].src = "Corgi Sprite/"+spriteArray[i];
        loadedSprites[i].onload = function () {
            loadedCount++;
            if (loadedCount === spriteArray.length) {
                callback(loadedSprites);
            }
        };
    }
}

eagle.onload = function () {
    eagle.width = 5;
    eagle.height = 5;
    randomEagleFall();
};
cheese.onload = function () {
    cheese.width = 5;
    cheese.height = 5;
    randomCheeseFall();
};

background.onload = function () {
    maxXPosition = canvas.width - spriteWidth;
    loadSprites(idleSprites, function (loadedIdleSprites) {
        idleAnimation = loadedIdleSprites;
    });
    loadSprites(idleSprites, function (loadedFightSprites) {
        fightAnimation = loadedFightSprites;
        loadSprites(walkSprites, function (loadedWalkSprites) {
            walkAnimation = loadedWalkSprites;
            loadSprites(runSprites, function (loadedRunSprites) {
                runAnimation = loadedRunSprites;
                requestAnimationFrame(animate);
            });
        });
    });
};


document.addEventListener('keydown', function (event) {
    if (event.key === 'a') {
        facingRight = false;
        moving = true;
    } else if (event.key === 'd') {
        facingRight = true;
        moving = true;
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Shift') {
        isShiftPressed = true;
    }
    if (event.key.toLowerCase() === 'a') {
        isAPressed = true;
        facingRight = false;
    }
    if (event.key.toLowerCase() === 'd') {
        isDPressed = true;
        facingRight = true;
    }

    moving = isAPressed || isDPressed;
    isRunning = isShiftPressed && moving;
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'Shift') {
        isShiftPressed = false;
    }
    if (event.key.toLowerCase() === 'a') {
        isAPressed = false;
    }
    if (event.key.toLowerCase() === 'd') {
        isDPressed = false;
    }

    moving = isAPressed || isDPressed;
    isRunning = isShiftPressed && moving;
});

var frameDelay = 10; //for Dog
var frameDelayCounter = 0;

function startCheeseFalling() {
    cheeseFalling = true;
    cheeseX = Math.random() * (canvas.width - cheese.width); // Random X position
    cheeseY = -cheese.height; // Start above the canvas
}

function updateCheesePosition() {
    if (cheeseFalling) {
        cheeseY += cheeseSpeed; // Move the cheese down
        if (cheeseY > canvas.height) {
            cheeseFalling = false; // Stop falling when it goes off the screen
        }
    }
}

function randomCheeseFall() {
    var randomTime = Math.random() * (5000 - 1000) + 1000; // Random time between 1 and 5 seconds
    setTimeout(function () {
        startCheeseFalling();
        randomCheeseFall(); // Schedule the next cheese fall
    }, randomTime);
}

function startEagleFalling() {
    eagleFalling = true;
    eagleX = Math.random() * (canvas.width - eagle.width); // Random X position
    eagleY = -eagle.height; // Start above the canvas
}

function updateEaglePosition() {
    if (eagleFalling) {
        eagleY += eagleSpeed; // Move the cheese down
        if (eagleY > canvas.height) {
            eagleFalling = false; // Stop falling when it goes off the screen
        }
    }
}

function randomEagleFall() {
    var randomTime = Math.random() * (4000 - 1000) + 1000; // Random time between 1 and 5 seconds
    setTimeout(function () {
        startEagleFalling();
        randomEagleFall(); // Schedule the next cheese fall
    }, randomTime);
}
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Here the movement speed of the dog is chosen, depending on the kind of movement
    var animationSprites = idleAnimation;
    var speed = 0;
    if (isRunning) {
        animationSprites = runAnimation;
        speed = 6; // The speed is higher when the dog is running
    } else if (moving) {
        animationSprites = walkAnimation;
        speed = 3; // The speed is lower when the dog is walking
    } else {
        animationSprites = idleAnimation;
        speed = 0; //There is no speed required when the dog is just standing
    }

    //This changes the dog's X-position, depending on how much it moves with a or d
    if (moving || isRunning) {
        xPosition += facingRight ? speed : -speed;
        xPosition = Math.max(minXPosition, Math.min(xPosition, maxXPosition));//This here makes sure the dog can't get out of the screen
    }

    ctx.save();
    if (!facingRight) {
        ctx.scale(-1, 1);
        ctx.drawImage(animationSprites[currentFrame], -(xPosition + spriteWidth), canvas.height - spriteHeight - 10, spriteWidth, spriteHeight);
    } else {
        ctx.drawImage(animationSprites[currentFrame], xPosition, canvas.height - spriteHeight - 10, spriteWidth, spriteHeight);
    }
    ctx.restore();

    //There were several problem with the frames either changing too fast or too slow. 
    //This down here fixed the problem for the dog.
    frameDelayCounter++;
    if (frameDelayCounter >= frameDelay) {
        currentFrame = (currentFrame + 1) % animationSprites.length;
        frameDelayCounter = 0;
    }

    if (cheeseFalling) {
        ctx.drawImage(cheese, cheeseX, cheeseY);
        updateCheesePosition();
    }

    if (eagleFalling) {
        ctx.drawImage(eagle, eagleX, eagleY);
        updateEaglePosition();
    }


    requestAnimationFrame(animate);
}

// Start the animation
requestAnimationFrame(animate);
