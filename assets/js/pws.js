var Footsteps = new function() {
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    
    var canvas;
    var context;
    
    var particles = [];
    var maxParticles = 20; // Maximum number of particles displayed
    var stepInterval = 200; // Interval to create new particles (ms)
    var stepSize = 120; // Increased size of paw print
    
    var imageLeft1 = new Image();
    imageLeft1.src = 'assets/images/pws left 1.png'; // Path to left paw print image 1
    
    var imageRight1 = new Image();
    imageRight1.src = 'assets/images/pws right 1.png'; // Path to right paw print image 1
    
    var imageLeft2 = new Image();
    imageLeft2.src = 'assets/images/pws left 2.png'; // Path to left paw print image 2
    
    var imageRight2 = new Image();
    imageRight2.src = 'assets/images/pws right 2.png'; // Path to right paw print image 2

    var stepPositions = [];
    var stepDelay = 500; // Delay to remove paw prints (ms)
    var currentStepIndex = 0;

    this.init = function() {
        canvas = document.querySelector("canvas");
    
        if (canvas && canvas.getContext) {
            context = canvas.getContext('2d');

            window.addEventListener('resize', windowResizeHandler, false);
            
            windowResizeHandler();
            
            generateStepPositions();
            
            setInterval(createParticles, stepInterval);
            setInterval(loop, 1000 / 60);
        }
    }

    function generateStepPositions() {
        var numSteps = 10; // Number of steps to be generated
        var x = 0;
        var y = SCREEN_HEIGHT;

        for (var i = 0; i < numSteps; i++) {
            stepPositions.push({ x: x, y: y });
            x += (SCREEN_WIDTH - stepSize) / (numSteps - 1);
            y -= (SCREEN_HEIGHT - stepSize) / (numSteps - 1);
        }
    }

    function createParticles() {
        if (particles.length >= maxParticles) {
            particles.splice(0, particles.length - maxParticles);
        }

        var p = new Particle();
        var pos = stepPositions[currentStepIndex];
        p.position.x = pos.x;
        p.position.y = pos.y;
        p.initialPosition = { x: pos.x, y: pos.y };
        p.velocity = { x: 0, y: 0 }; // No initial velocity, just displaying paw prints
        p.creationTime = Date.now(); // Time when particle was created
        
        switch (currentStepIndex % 4) {
            case 0:
                p.image = imageLeft1;
                break;
            case 1:
                p.image = imageRight1;
                break;
            case 2:
                p.image = imageLeft2;
                break;
            case 3:
                p.image = imageRight2;
                break;
        }
        
        particles.push(p);

        currentStepIndex++;
        if (currentStepIndex >= stepPositions.length) {
            currentStepIndex = 0;
        }
    }

    function windowResizeHandler() {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        
        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_HEIGHT;

        generateStepPositions();
    }

    function loop() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        var now = Date.now();
        var particle;
        var i, ilen;

        for (i = 0, ilen = particles.length; i < ilen; i++) {
            particle = particles[i];

            if (now - particle.creationTime > stepDelay) {
                particles.splice(i, 1);
                i--;
                ilen--;
                continue;
            }

            context.drawImage(
                particle.image,
                particle.position.x - stepSize / 2,
                particle.position.y - stepSize / 2,
                stepSize,
                stepSize
            );
        }
    }
}

function Particle() {
    this.size = 120; // Increased size of paw print
    this.position = { x: 0, y: 0 };
    this.initialPosition = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.creationTime = 0;
    this.image = null;
}

Footsteps.init();
