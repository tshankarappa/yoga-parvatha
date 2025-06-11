class YogaTimer {
    constructor(taskArray, title) {
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

        this.bell = new Audio("/assets/audio/bell.mp3");
        this.allAudio = [this.bell];

        // Initialize buttons with both click and touch events
        this.initializeButtons();

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && !this.pause) {
                this.pauseTimer();
            }
        });

        // Initialize display
        this.updateDisplay();
    }

    initializeButtons() {
        const buttons = {
            'start': () => this.startTimer(),
            'pause': () => this.pauseTimer(),
            'resume': () => this.resumeTimer(),
            'stop': () => this.stopTimer(),
            'mute': (event) => this.toggleMute(event),
            'next': () => this.nextStep()
        };

        Object.entries(buttons).forEach(([id, handler]) => {
            const button = document.getElementById(id);
            if (button) {
                // Remove existing onclick attributes
                button.removeAttribute('onclick');
                
                // Add both click and touch events
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`Button ${id} clicked`);
                    handler(e);
                });
                
                button.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    console.log(`Button ${id} touched`);
                    handler(e);
                });
            }
        });
    }

    preloadAudio() {
        this.allAudio.forEach((audio) => {
            audio.play();
            audio.pause();
            audio.currentTime = 0;
        });
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

        const now = Date.now();
        const deltaTime = now - this.lastUpdateTime;
        this.lastUpdateTime = now;

        // If the time difference is too large (e.g., device was asleep),
        // reset the timer to prevent large jumps
        if (deltaTime > 2000) {
            this.stopTimer();
            return;
        }

        this.updateDisplay();

        if (this.currentTaskTime == 0) {
            this.i++;

            if (!this.mute) {
                this.bell.play().catch(e => console.log('Audio play failed:', e));
            }

            if (this.taskArray.length > this.i) {
                this.currentTaskTime = this.taskArray[this.i][1];
                return;
            } else {
                this.stopTimer();
                return;
            }
        }
        
        if (!document.hasFocus() || (this.totalTime > 3300)){
            this.stopTimer();
            return;
        }
        this.totalTime++;
        this.currentTaskTime--;
    }

    toggleMute(event) {
        this.mute = !this.mute;
        const muteButton = event.target;
        muteButton.classList.toggle('muted', this.mute);
        muteButton.title = this.mute ? "Unmute Sound" : "Mute Sound";
    }

    nextStep() {
        if (this.i < this.taskArray.length - 1) {
            this.currentTaskTime = 0;
        }
    }

    startTimer() {
        console.log('Starting timer...');
        this.preloadAudio();
        const container = document.querySelector(".container");
        container.classList.remove("stopTimer", "pauseTimer");
        container.classList.add("startTimer");
        
        this.i = 0;
        this.currentTaskTime = this.taskArray[this.i][1];
        this.pause = false;
        this.totalTime = 0;
        this.lastUpdateTime = Date.now();
        
        this.updateDisplay();
        
        // Try to enable NoSleep
        try {
            this.noSleep.enable();
            console.log('NoSleep enabled');
        } catch (e) {
            console.log('NoSleep enable failed:', e);
        }
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => this.timerfunction(), 1000);
        console.log('Timer interval set');
    }

    stopTimer() {
        clearInterval(this.timer);
        try {
            this.noSleep.disable();
        } catch (e) {
            console.log('NoSleep disable failed:', e);
        }
        
        const container = document.querySelector(".container");
        container.classList.remove("startTimer", "pauseTimer");
        container.classList.add("stopTimer");
        
        document.getElementById("timer").innerHTML = "Practice Complete";
        document.getElementById("current-step").innerHTML = "Thank you for your practice";
    }

    pauseTimer() {
        this.pause = true;
        const container = document.querySelector(".container");
        container.classList.remove("startTimer");
        container.classList.add("pauseTimer");
    }

    resumeTimer() {
        this.pause = false;
        const container = document.querySelector(".container");
        container.classList.remove("pauseTimer");
        container.classList.add("startTimer");
    }
} 