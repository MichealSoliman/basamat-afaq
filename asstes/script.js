// Partners Slider JavaScript
class PartnersSlider {
    constructor() {
        this.sliderTrack = document.getElementById('sliderTrack');
        this.speedIndicator = document.getElementById('speedIndicator');
        this.currentSpeed = 'normal';
        this.isPaused = false;
        this.isVisible = false;
        
        this.speeds = {
            slow: '60s',
            normal: '30s',
            fast: '15s'
        };
        
        this.speedNames = {
            slow: 'بطيء',
            normal: 'عادي',
            fast: 'سريع'
        };
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupTouchEvents();
        this.setupKeyboardEvents();
        this.setupEntranceAnimation();
        this.setupErrorHandling();
    }
    
    pauseSlider() {
        this.sliderTrack.style.animationPlayState = 'paused';
        this.isPaused = true;
        this.speedIndicator.textContent = 'السرعة: متوقف';
        this.announceToScreenReader('تم إيقاف الشريط مؤقتاً');
    }
    
    resumeSlider() {
        this.sliderTrack.style.animationPlayState = 'running';
        this.isPaused = false;
        this.speedIndicator.textContent = `السرعة: ${this.speedNames[this.currentSpeed]}`;
        this.announceToScreenReader('تم استئناف الشريط');
    }
    
    changeSpeed(speed) {
        if (!this.speeds[speed]) {
            console.warn(`Invalid speed: ${speed}`);
            return;
        }
        
        this.currentSpeed = speed;
        this.sliderTrack.style.animationDuration = this.speeds[speed];
        
        if (!this.isPaused) {
            this.speedIndicator.textContent = `السرعة: ${this.speedNames[speed]}`;
        }
        
        this.announceToScreenReader(`تم تغيير السرعة إلى ${this.speedNames[speed]}`);
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
                if (entry.isIntersecting && !this.isPaused) {
                    this.sliderTrack.style.animationPlayState = 'running';
                } else {
                    this.sliderTrack.style.animationPlayState = 'paused';
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(document.querySelector('.slider-container'));
    }
    
    setupTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let wasRunning = false;
        
        this.sliderTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            wasRunning = !this.isPaused;
            this.sliderTrack.style.animationPlayState = 'paused';
        }, { passive: true });
        
        this.sliderTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            
            // Add visual feedback for touch interaction
            this.sliderTrack.style.filter = `brightness(${1 + Math.abs(diffX) / 1000})`;
        }, { passive: true });
        
        this.sliderTrack.addEventListener('touchend', () => {
            isDragging = false;
            this.sliderTrack.style.filter = 'brightness(1)';
            
            if (wasRunning && this.isVisible) {
                this.sliderTrack.style.animationPlayState = 'running';
            }
        }, { passive: true });
    }
    
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Only handle keyboard events when slider is focused or visible
            if (!this.isVisible) return;
            
            switch(e.key) {
                case ' ':
                case 'Spacebar':
                    e.preventDefault();
                    this.isPaused ? this.resumeSlider() : this.pauseSlider();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.changeSpeed('slow');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.changeSpeed('fast');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.changeSpeed('normal');
                    break;
            }
        });
    }
    
    setupEntranceAnimation() {
        window.addEventListener('load', () => {
            const partnerItems = document.querySelectorAll('.partner-item');
            
            partnerItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    }
    
    setupErrorHandling() {
        // Handle missing images
        const images = document.querySelectorAll('.partner-logo');
        images.forEach(img => {
            img.addEventListener('error', () => {
                img.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'logo-placeholder';
                placeholder.style.cssText = `
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 10px;
                `;
                placeholder.textContent = 'شعار';
                img.parentNode.insertBefore(placeholder, img);
            });
        });
    }
    
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Public API methods
    getStatus() {
        return {
            isPaused: this.isPaused,
            currentSpeed: this.currentSpeed,
            isVisible: this.isVisible
        };
    }
    
    destroy() {
        // Clean up event listeners and observers
        this.sliderTrack.style.animation = 'none';
    }
}

// Initialize the slider when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.partnersSlider = new PartnersSlider();
});

// Global functions for button controls (backward compatibility)
function pauseSlider() {
    if (window.partnersSlider) {
        window.partnersSlider.pauseSlider();
    }
}

function resumeSlider() {
    if (window.partnersSlider) {
        window.partnersSlider.resumeSlider();
    }
}

function changeSpeed(speed) {
    if (window.partnersSlider) {
        window.partnersSlider.changeSpeed(speed);
    }
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData.loadEventEnd - perfData.loadEventStart > 3000) {
                console.warn('Slider loaded slowly. Consider optimizing images.');
            }
        }, 0);
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PartnersSlider;
}

