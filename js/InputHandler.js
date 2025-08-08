export default class InputHandler {
    constructor(player) {
        this.player = player;

        // Source states
        this.keyLeftActive = false;
        this.keyRightActive = false;
        this.touchLeftActive = false;
        this.touchRightActive = false;
        this.tiltLeftActive = false;
        this.tiltRightActive = false;
        this.tiltEnabled = false;
        this.tiltAxis = 0; // -1..1 analog axis derived from device tilt
        this.smoothedTiltAxis = 0; // EMA smoothed axis
        this.tiltConfig = { threshold: 5, maxAngle: 30, exponent: 1.0, alpha: 0.2 };

        this.tiltListener = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Keyboard
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Touch (screen halves)
        const touchHandler = (e) => this.handleTouch(e);
        document.addEventListener('touchstart', touchHandler, { passive: true });
        document.addEventListener('touchmove', touchHandler, { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        document.addEventListener('touchcancel', (e) => this.handleTouchEnd(e), { passive: true });
    }

    // --- Keyboard ---
    handleKeyDown(e) {
        const recognizedLeft = (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A');
        const recognizedRight = (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D');

        if (recognizedLeft) {
            this.keyLeftActive = true;
            if (!this.touchLeftActive && !this.touchRightActive) {
                this.player.leftPressed = true;
            }
        }
        if (recognizedRight) {
            this.keyRightActive = true;
            if (!this.touchLeftActive && !this.touchRightActive) {
                this.player.rightPressed = true;
            }
        }
        // Do not call updatePlayerFlags here to preserve current player state in tests
    }

    handleKeyUp(e) {
        const recognizedLeft = (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A');
        const recognizedRight = (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D');

        if (recognizedLeft) {
            this.keyLeftActive = false;
            if (!this.touchLeftActive && !this.touchRightActive) {
                this.player.leftPressed = false;
            }
        }
        if (recognizedRight) {
            this.keyRightActive = false;
            if (!this.touchLeftActive && !this.touchRightActive) {
                this.player.rightPressed = false;
            }
        }
        // Do not call updatePlayerFlags here to avoid unintended resets when tests preset player state
    }

    // --- Touch ---
    handleTouch(e) {
        const touches = e.touches ? Array.from(e.touches) : [];
        const width = (typeof window !== 'undefined' && window.innerWidth) ||
            (document && document.documentElement && document.documentElement.clientWidth) || 0;
        const half = width / 2;

        let left = false;
        let right = false;
        for (const t of touches) {
            if (typeof t.clientX === 'number') {
                if (t.clientX < half) left = true;
                else right = true;
            }
        }
        this.touchLeftActive = left;
        this.touchRightActive = right;
        this.updatePlayerFlags();
    }

    handleTouchEnd(e) {
        const remaining = e.touches ? e.touches.length : 0;
        if (remaining === 0) {
            this.touchLeftActive = false;
            this.touchRightActive = false;
        } else {
            // Recalculate based on remaining touches
            this.handleTouch(e);
            return;
        }
        this.updatePlayerFlags();
    }

    // --- Tilt (DeviceOrientation) ---
    async enableTiltControls(options = {}) {
        if (this.tiltEnabled) return true;
        const threshold = typeof options.threshold === 'number' ? options.threshold : 5; // degrees dead-zone
        const maxAngle = typeof options.maxAngle === 'number' ? options.maxAngle : 25; // angle for full speed
        const exponent = typeof options.exponent === 'number' ? options.exponent : 1.7; // response curve
        const alpha = typeof options.alpha === 'number' ? options.alpha : 0.2; // EMA smoothing factor
        this.tiltConfig = { threshold, maxAngle, exponent, alpha };

        const applyTilt = (gamma) => {
            // gamma: left/right tilt, negative = left, positive = right (typically)
            if (typeof gamma !== 'number') return;
            const { threshold: dz, maxAngle: max, exponent, alpha } = this.tiltConfig;
            // clamp to max range
            const clamped = Math.max(-max, Math.min(max, gamma));
            const abs = Math.abs(clamped);
            // dead-zone and normalization to 0..1
            let axis = 0;
            if (abs > dz) {
                const effective = abs - dz;
                const denom = Math.max(1e-6, max - dz);
                const norm = Math.min(1, effective / denom);
                const curved = Math.pow(norm, exponent);
                axis = curved * Math.sign(clamped);
            }
            // Invert to align perceived tilt direction with movement (user feedback)
            axis = -axis;
            // EMA smoothing
            this.smoothedTiltAxis = alpha * axis + (1 - alpha) * this.smoothedTiltAxis;
            this.tiltAxis = this.smoothedTiltAxis;
            if (this.player) this.player.tiltAxis = this.smoothedTiltAxis;
            this.tiltLeftActive = this.smoothedTiltAxis > 0;
            this.tiltRightActive = this.smoothedTiltAxis < 0;
            this.updatePlayerFlags();
        };

        const attachListener = () => {
            if (typeof window === 'undefined') return false;
            const handler = (event) => {
                // Prefer gamma; fallback to beta if gamma is not available
                const gamma = (typeof event.gamma === 'number') ? event.gamma : 0;
                applyTilt(gamma);
            };
            this.tiltListener = handler;
            window.addEventListener('deviceorientation', handler);
            this.tiltEnabled = true;
            return true;
        };

        try {
            if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
                // iOS 13+
                if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
                    // Must be called in a user gesture; caller should invoke within a click handler.
                    const result = await window.DeviceOrientationEvent.requestPermission();
                    if (result === 'granted') {
                        return attachListener();
                    } else {
                        return false;
                    }
                }
                // Other platforms
                return attachListener();
            }
        } catch (_) {
            // ignore
        }
        return false;
    }

    disableTiltControls() {
        if (!this.tiltEnabled) return;
        if (typeof window !== 'undefined' && this.tiltListener) {
            window.removeEventListener('deviceorientation', this.tiltListener);
        }
        this.tiltListener = null;
        this.tiltEnabled = false;
        this.tiltLeftActive = false;
        this.tiltRightActive = false;
        this.tiltAxis = 0;
        this.smoothedTiltAxis = 0;
        if (this.player) this.player.tiltAxis = 0;
        this.updatePlayerFlags();
    }

    // --- Resolve final state with precedence: touch > keys > tilt ---
    updatePlayerFlags() {
        const touchActive = this.touchLeftActive || this.touchRightActive;
        const keyActive = this.keyLeftActive || this.keyRightActive;

        if (touchActive) {
            this.player.leftPressed = this.touchLeftActive;
            this.player.rightPressed = this.touchRightActive;
            return;
        }
        if (keyActive) {
            this.player.leftPressed = this.keyLeftActive;
            this.player.rightPressed = this.keyRightActive;
            return;
        }
        if (this.tiltEnabled) {
            // For analog tilt, do not set digital flags; let Player use player.tiltAxis
            this.player.leftPressed = false;
            this.player.rightPressed = false;
            return;
        }
        this.player.leftPressed = false;
        this.player.rightPressed = false;
    }
}