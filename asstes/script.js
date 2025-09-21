
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

        // Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Navbar Scroll Effect
        const header = document.getElementById('header');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('navbar-scroll');
            } else {
                header.classList.remove('navbar-scroll');
                header.classList.add('navbar-scroll-before');
                header.classList.add('navbar-scroll-all');
            }


        });

        // Smooth Scrolling for Navigation Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                // Close mobile menu after clicking
                mobileMenu.classList.add('hidden');
            });
        });

        // Back to Top Button
        const backToTopBtn = document.getElementById('back-to-top');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.remove('opacity-0', 'invisible');
                backToTopBtn.classList.add('opacity-100', 'visible');
            } else {
                backToTopBtn.classList.add('opacity-0', 'invisible');
                backToTopBtn.classList.remove('opacity-100', 'visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

  

        // Add loading animation to service cards
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up', 'active');
                }
            });
        }, observerOptions);

        // Observe all service cards
        document.querySelectorAll('.service-card').forEach(card => {
            observer.observe(card);
        });

        // Add hover effects to partner logos
        document.querySelectorAll('.partner-logo').forEach(logo => {
            logo.addEventListener('mouseenter', function () {
                this.style.transform = 'scale(1.05) translateY(-5px)';
            });

            logo.addEventListener('mouseleave', function () {
                this.style.transform = 'scale(1) translateY(0)';
            });
        });

        // Add floating animation delay to hero icon
        const heroIcon = document.querySelector('.floating-animation');
        if (heroIcon) {
            heroIcon.style.animationDelay = '1s';
        }

        // Add typing effect to hero subtitle
        const subtitle = document.querySelector('.hero-text + p');
        if (subtitle) {
            const text = subtitle.textContent;
            subtitle.textContent = '';
            let i = 0;

            setTimeout(() => {
                const typeInterval = setInterval(() => {
                    subtitle.textContent += text.charAt(i);
                    i++;
                    if (i > text.length) {
                        clearInterval(typeInterval);
                    }
                }, 50);
            }, 2000);
        }

        // Enhanced True Infinite Partners Slider - Zero Lag Implementation
        document.addEventListener('DOMContentLoaded', () => {
            const track = document.getElementById('partnersInfiniteTrack');
            if (!track) return;

            // Get original partner items
            const originalItems = Array.from(track.children);
            const itemCount = originalItems.length;

            // Calculate the width needed for seamless loop
            const itemWidth = 280 + 40; // item width + gap
            const totalWidth = itemWidth * itemCount;

            // Clone items multiple times for ultra-smooth infinite effect
            const cloneMultiplier = 4; // More clones = smoother infinite loop

            for (let i = 0; i < cloneMultiplier; i++) {
                originalItems.forEach(item => {
                    const clone = item.cloneNode(true);
                    clone.classList.add('partner-clone');
                    track.appendChild(clone);
                });
            }

            // Set up the infinite animation with perfect timing
            const animationDuration = 40; // seconds
            track.style.animation = `infiniteSlide ${animationDuration}s linear infinite`;

            // Enhanced hover interactions
            const allItems = track.querySelectorAll('.partner-super-item');
            let isHovered = false;

            allItems.forEach((item, index) => {
                // Pause animation on hover
                item.addEventListener('mouseenter', () => {
                    if (!isHovered) {
                        isHovered = true;
                        track.style.animationPlayState = 'paused';
                    }

                    // Enhanced 3D hover effect
                    item.style.transform = 'translateY(-20px) scale(1.05) rotateY(5deg)';
                    item.style.zIndex = '100';
                    item.style.filter = 'brightness(1.1) drop-shadow(0 20px 40px rgba(0,84,77,0.3))';

                    // Affect neighboring items with magnetic effect
                    const neighbors = [item.previousElementSibling, item.nextElementSibling];
                    neighbors.forEach(neighbor => {
                        if (neighbor && neighbor.classList.contains('partner-super-item')) {
                            neighbor.style.transform = 'translateY(-5px) scale(0.95) rotateY(-2deg)';
                            neighbor.style.filter = 'brightness(0.8)';
                            neighbor.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        }
                    });
                });

                item.addEventListener('mouseleave', () => {
                    // Resume animation after short delay for smoother UX
                    setTimeout(() => {
                        if (isHovered) {
                            isHovered = false;
                            track.style.animationPlayState = 'running';
                        }
                    }, 300);

                    // Reset all transformations
                    item.style.transform = '';
                    item.style.zIndex = '';
                    item.style.filter = '';

                    // Reset neighboring items
                    const neighbors = [item.previousElementSibling, item.nextElementSibling];
                    neighbors.forEach(neighbor => {
                        if (neighbor && neighbor.classList.contains('partner-super-item')) {
                            neighbor.style.transform = '';
                            neighbor.style.filter = '';
                        }
                    });
                });

                // Click animation
                item.addEventListener('click', () => {
                    item.style.transform = 'translateY(-25px) scale(1.08) rotateY(8deg)';
                    setTimeout(() => {
                        if (!item.matches(':hover')) {
                            item.style.transform = '';
                        }
                    }, 200);
                });
            });

            // Performance optimization - use CSS transform instead of changing animation
            // This ensures the smoothest possible infinite scroll
            let animationStartTime = Date.now();

            function optimizeAnimation() {
                // Reset animation seamlessly when it completes one cycle
                const currentTime = Date.now();
                const elapsed = (currentTime - animationStartTime) / 1000;

                if (elapsed >= animationDuration) {
                    // Seamlessly reset the animation
                    track.style.animation = 'none';
                    track.offsetHeight; // Trigger reflow
                    track.style.animation = `infiniteSlide ${animationDuration}s linear infinite`;
                    animationStartTime = currentTime;
                }

                requestAnimationFrame(optimizeAnimation);
            }

            // Start optimization loop for ultra-smooth performance
            requestAnimationFrame(optimizeAnimation);

            // Touch/swipe support for mobile
            let startX = 0;
            let isDragging = false;

            track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                track.style.animationPlayState = 'paused';
            }, { passive: true });

            track.addEventListener('touchmove', (e) => {
                if (!isDragging) return;

                const currentX = e.touches[0].clientX;
                const diff = startX - currentX;

                // Add subtle resistance effect
                track.style.transform = `translateX(${-diff * 0.5}px)`;
            }, { passive: true });

            track.addEventListener('touchend', () => {
                if (isDragging) {
                    isDragging = false;
                    track.style.transform = '';

                    setTimeout(() => {
                        track.style.animationPlayState = 'running';
                    }, 200);
                }
            }, { passive: true });

            // Intersection Observer for performance - pause animation when not visible
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        track.style.animationPlayState = 'running';
                    } else {
                        track.style.animationPlayState = 'paused';
                    }
                });
            }, { threshold: 0.1 });

            sectionObserver.observe(track.closest('.partners-mega-section'));

            // Animate progress bar
            const progressBar = document.getElementById('partnersProgressBar');
            if (progressBar) {
                function updateProgressBar() {
                    const currentTime = Date.now();
                    const elapsed = ((currentTime - animationStartTime) % (animationDuration * 1000)) / 1000;
                    const progress = (elapsed / animationDuration) * 100;
                    progressBar.style.width = `${progress}%`;
                    requestAnimationFrame(updateProgressBar);
                }
                updateProgressBar();
            }

            console.log('🚀 Ultra-smooth infinite partners slider initialized!');
        });

        // Customer Rates Horizontal Scrolling
        document.addEventListener('DOMContentLoaded', () => {
            const ratesContainer = document.getElementById('ratesScrollContainer');
            const leftBtn = document.getElementById('ratesScrollLeft');
            const rightBtn = document.getElementById('ratesScrollRight');

            if (!ratesContainer || !leftBtn || !rightBtn) return;

            const scrollAmount = 380; // Width of one card plus gap

            // Smooth scroll left
            leftBtn.addEventListener('click', () => {
                ratesContainer.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            });

            // Smooth scroll right  
            rightBtn.addEventListener('click', () => {
                ratesContainer.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });

            // Show/hide navigation buttons based on scroll position
            function updateNavButtons() {
                const { scrollLeft, scrollWidth, clientWidth } = ratesContainer;

                leftBtn.style.opacity = scrollLeft > 0 ? '1' : '0.5';
                leftBtn.style.pointerEvents = scrollLeft > 0 ? 'auto' : 'none';

                rightBtn.style.opacity = scrollLeft < scrollWidth - clientWidth - 10 ? '1' : '0.5';
                rightBtn.style.pointerEvents = scrollLeft < scrollWidth - clientWidth - 10 ? 'auto' : 'none';
            }

            // Update buttons on scroll
            ratesContainer.addEventListener('scroll', updateNavButtons);

            // Initialize button states
            updateNavButtons();

            // Touch/swipe support for mobile
            let startX = 0;
            let scrollLeftStart = 0;
            let isDragging = false;

            ratesContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                scrollLeftStart = ratesContainer.scrollLeft;
                isDragging = true;
            }, { passive: true });

            ratesContainer.addEventListener('touchmove', (e) => {
                if (!isDragging) return;

                const currentX = e.touches[0].clientX;
                const diff = startX - currentX;
                ratesContainer.scrollLeft = scrollLeftStart + diff;
            }, { passive: true });

            ratesContainer.addEventListener('touchend', () => {
                isDragging = false;
            }, { passive: true });

            console.log('🌟 Customer rates horizontal scrolling initialized!');
        });
    