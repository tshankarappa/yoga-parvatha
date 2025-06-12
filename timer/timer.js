class YogaTimer {
    constructor(taskArray, title, debugFn) {
        this.debug = debugFn || function() {};
        this.debug('YogaTimer constructor called');
        
        this.noSleep = new NoSleep();
        this.timer = null;
        this.mute = false;
        this.taskArray = taskArray;
        this.title = title;
        this.i = 0;
        this.currentTaskTime = taskArray[this.i][1];
        this.pause = false;
        this.totalTime = 0;
        this.lastUpdateTime = Date.now();
        this.pauseStartTime = 0;
        this.isPaused = false;

        // Initialize audio context as null
        this.audioContext = null;
        this.bell = null;
        this.allAudio = [];

        // Initialize buttons with both click and touch events
        this.initializeButtons();

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            this.debug('Visibility changed: ' + document.visibilityState);
            
            if (document.hidden) {
                // Clear any existing timer
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                
                // Disable NoSleep
                try {
                    this.noSleep.disable();
                } catch (e) {
                    this.debug('NoSleep disable failed: ' + e.message);
                }
                
                // Reset to initial state
                this.stopTimer();
                this.updateDisplay();
            }
        });

        // Initialize display
        this.updateDisplay();
        this.debug('YogaTimer initialization complete');
    }

    initializeAudio() {
        this.debug('Initializing audio...');
        // Create audio context
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.debug('Audio context created');
        } catch (e) {
            this.debug('Audio context creation failed: ' + e.message);
        }

        // Create and preload bell sound
        this.bell = new Audio();
        this.bell.src = "/assets/audio/bell.mp3";
        this.bell.preload = "auto";
        
        // Add event listeners for audio loading
        this.bell.addEventListener('canplaythrough', () => {
            this.debug('Bell sound loaded and ready');
        });
        
        this.bell.addEventListener('error', (e) => {
            this.debug('Error loading bell sound: ' + e.message);
        });

        // Load the audio
        this.bell.load();
        this.allAudio = [this.bell];
    }

    initializeButtons() {
        this.debug('Initializing buttons...');
        const startBtn = document.getElementById("start");
        const pauseBtn = document.getElementById("pause");
        const resumeBtn = document.getElementById("resume");
        const stopBtn = document.getElementById("stop");
        const muteBtn = document.getElementById("mute");
        const nextBtn = document.getElementById("next");

        // Initialize audio on start button click
        startBtn.addEventListener("click", () => {
            if (!this.audioContext) {
                this.initializeAudio();
            }
            this.startTimer();
        });
        startBtn.addEventListener("touchstart", () => {
            if (!this.audioContext) {
                this.initializeAudio();
            }
            this.startTimer();
        });

        pauseBtn.addEventListener("click", () => this.pauseTimer());
        pauseBtn.addEventListener("touchstart", () => this.pauseTimer());

        resumeBtn.addEventListener("click", () => this.resumeTimer());
        resumeBtn.addEventListener("touchstart", () => this.resumeTimer());

        stopBtn.addEventListener("click", () => this.stopTimer());
        stopBtn.addEventListener("touchstart", () => this.stopTimer());

        muteBtn.addEventListener("click", () => this.toggleMute());
        muteBtn.addEventListener("touchstart", () => this.toggleMute());

        nextBtn.addEventListener("click", () => this.nextStep());
        nextBtn.addEventListener("touchstart", () => this.nextStep());

        this.debug('Buttons initialized');
    }

    preloadAudio() {
        this.allAudio.forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    playBell() {
        if (!this.mute) {
            this.debug('Playing bell sound');
            try {
                // Reset the audio to start
                this.bell.currentTime = 0;
                
                // Resume audio context if suspended (needed for mobile)
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                
                // Play the sound
                const playPromise = this.bell.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        this.debug('Error playing bell: ' + e.message);
                    });
                }
            } catch (e) {
                this.debug('Error in playBell: ' + e.message);
            }
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    updateDisplay() {
        const timerElement = document.getElementById("timer");
        const stepElement = document.getElementById("current-step");
        
        if (this.i === 0 && !this.timer) {
            timerElement.innerHTML = this.title;
            stepElement.innerHTML = "Ready to begin your practice";
        } else {
            timerElement.innerHTML = this.formatTime(this.currentTaskTime);
            stepElement.innerHTML = this.taskArray[this.i][0];
        }
    }
    
    timerfunction() {
        if (this.pause) {
            return;
        }

        if (this.currentTaskTime == 0) {
            // Play bell before updating the step
            if (!this.mute) {
                this.playBell();
            }

            this.i++;
            if (this.taskArray.length > this.i) {
                this.currentTaskTime = this.taskArray[this.i][1];
            } else {
                this.stopTimer();
                return;
            }
        }
        
        this.updateDisplay();
        
        if (!document.hasFocus() || (this.totalTime > 3300)){
            this.debug('Document lost focus or time limit reached, stopping timer');
            this.stopTimer();
            return;
        }
        this.totalTime++;
        this.currentTaskTime--;
    }

    toggleMute() {
        this.mute = !this.mute;
        const muteButton = document.getElementById("mute");
        muteButton.classList.toggle('muted', this.mute);
        muteButton.title = this.mute ? "Unmute Sound" : "Mute Sound";
    }

    nextStep() {
        if (this.i < this.taskArray.length - 1) {
            this.currentTaskTime = 0;
        }
    }

    startTimer() {
        this.debug('Starting timer...');
        if (this.timer) {
            this.debug('Clearing existing timer');
            clearInterval(this.timer);
        }

        this.preloadAudio();
        const container = document.querySelector(".container");
        container.classList.remove("stopTimer", "pauseTimer");
        container.classList.add("startTimer");
        
        this.i = 0;
        this.currentTaskTime = this.taskArray[this.i][1];
        this.pause = false;
        this.isPaused = false;
        this.totalTime = 0;
        this.lastUpdateTime = Date.now();
        
        this.updateDisplay();
        
        // Try to enable NoSleep
        try {
            this.noSleep.enable();
            this.debug('NoSleep enabled');
        } catch (e) {
            this.debug('NoSleep enable failed: ' + e.message);
        }
        
        this.timer = setInterval(() => this.timerfunction(), 1000);
        this.debug('Timer interval set');
    }

    stopTimer() {
        this.debug('Stopping timer...');
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        try {
            this.noSleep.disable();
        } catch (e) {
            this.debug('NoSleep disable failed: ' + e.message);
        }
        
        const container = document.querySelector(".container");
        container.classList.remove("startTimer", "pauseTimer");
        container.classList.add("stopTimer");
        
        document.getElementById("timer").innerHTML = "Practice Complete";
        document.getElementById("current-step").innerHTML = "Thank you for your practice";
        
        this.pause = false;
        this.isPaused = false;
    }

    pauseTimer() {
        if (this.isPaused) return;
        
        this.debug('Pausing timer...');
        this.pause = true;
        this.isPaused = true;
        this.pauseStartTime = Date.now();
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        const container = document.querySelector(".container");
        container.classList.remove("startTimer");
        container.classList.add("pauseTimer");
    }

    resumeTimer() {
        if (!this.isPaused) return;
        
        this.debug('Resuming timer...');
        this.pause = false;
        this.isPaused = false;
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(() => this.timerfunction(), 1000);
        
        const container = document.querySelector(".container");
        container.classList.remove("pauseTimer");
        container.classList.add("startTimer");
    }
}

// Export the YogaTimer class
export { YogaTimer }; 