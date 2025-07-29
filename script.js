// Add some interactive JavaScript animations
document.addEventListener('DOMContentLoaded', function() {
    // Check if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Debug mode - add to console
    console.log('Page loaded. Screen width:', window.innerWidth);
    console.log('Is touch device:', isTouchDevice);
    
    // Video background management with better fallback
    const videoBackground = document.querySelector('.video-background video');
    const animatedBg = document.querySelector('.animated-bg');
    const videoContainer = document.querySelector('.video-background');
    
    console.log('Video element found:', !!videoBackground);
    console.log('Animated background found:', !!animatedBg);
    
    if (videoBackground && window.innerWidth > 768) {
        console.log('Attempting to load video for desktop');
        
        // Set up video event listeners
        videoBackground.addEventListener('loadstart', function() {
            console.log('Video loading started');
        });
        
        videoBackground.addEventListener('loadedmetadata', function() {
            console.log('Video metadata loaded. Duration:', this.duration);
        });
        
        videoBackground.addEventListener('canplay', function() {
            console.log('Video can play');
            this.classList.add('loaded');
            this.style.opacity = '1';
            if (animatedBg) {
                animatedBg.style.opacity = '0';
            }
        });
        
        videoBackground.addEventListener('playing', function() {
            console.log('Video is playing');
        });
        
        videoBackground.addEventListener('error', function(e) {
            console.log('Video failed to load:', e);
            console.log('Error details:', this.error);
            console.log('Falling back to animated background');
            this.style.display = 'none';
            if (animatedBg) {
                animatedBg.style.opacity = '1';
            }
        });
        
        // Force play the video (some browsers need this)
        videoBackground.addEventListener('loadeddata', function() {
            console.log('Video data loaded, attempting to play');
            this.play().then(() => {
                console.log('Video play successful');
            }).catch(function(error) {
                console.log('Autoplay failed:', error);
                // Fallback to animated background if autoplay fails
                videoBackground.style.display = 'none';
                if (animatedBg) {
                    animatedBg.style.opacity = '1';
                }
            });
        });
        
        // Pause video when tab is not visible (performance optimization)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                videoBackground.pause();
                console.log('Video paused (tab hidden)');
            } else {
                videoBackground.play().then(() => {
                    console.log('Video resumed (tab visible)');
                }).catch(function(error) {
                    console.log('Resume play failed:', error);
                });
            }
        });
        
        // Fallback timeout - if video doesn't load within 10 seconds, show animated bg
        setTimeout(function() {
            if (!videoBackground.classList.contains('loaded')) {
                console.log('Video loading timeout, using animated background');
                videoBackground.style.display = 'none';
                if (animatedBg) {
                    animatedBg.style.opacity = '1';
                }
            }
        }, 10000);
        
        // Try to trigger play immediately if video is ready
        if (videoBackground.readyState >= 3) {
            console.log('Video ready immediately, attempting play');
            videoBackground.play().catch(function(error) {
                console.log('Immediate play failed:', error);
            });
        }
        
    } else if (videoBackground) {
        // Hide video on mobile devices and show animated background
        console.log('Mobile device or small screen detected, using animated background');
        videoContainer.style.display = 'none';
        document.body.style.background = 'linear-gradient(-45deg, #ff9a9e, #fecfef, #f093fb, #f5576c)';
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'gradientShift 15s ease infinite';
    }
    
    // Animate cards on scroll
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInRight 1s ease-out';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => {
        observer.observe(card);
    });

    // Add click animation to buttons
    const buttons = document.querySelectorAll('.animated-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }, 100);
        });
        
        // Add touch feedback for mobile devices
        if (isTouchDevice) {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            button.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        }
    });

    // Parallax effect for floating shapes (disabled on touch devices for performance)
    if (!isTouchDevice && window.innerWidth > 768) {
        document.addEventListener('mousemove', function(e) {
            const shapes = document.querySelectorAll('.floating-shape');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed * 50;
                const y = (mouseY - 0.5) * speed * 50;
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            // Reset any transforms on orientation change
            const shapes = document.querySelectorAll('.floating-shape');
            shapes.forEach(shape => {
                shape.style.transform = '';
            });
            
            // Hide video on mobile orientation change
            if (window.innerWidth <= 768) {
                const videoBg = document.querySelector('.video-background');
                if (videoBg) videoBg.style.display = 'none';
            }
        }, 500);
    });
    
    // Optimize animations for mobile devices
    if (isTouchDevice || window.innerWidth <= 768) {
        // Reduce animation duration for better performance on mobile
        const style = document.createElement('style');
        style.textContent = `
            .card {
                animation-duration: 0.6s !important;
            }
            .header h1 {
                animation-duration: 1s !important;
            }
            .floating-shape {
                animation-duration: 4s !important;
            }
            .video-background {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Re-check if parallax should be enabled after resize
            const shapes = document.querySelectorAll('.floating-shape');
            if (window.innerWidth <= 768) {
                shapes.forEach(shape => {
                    shape.style.transform = '';
                });
                // Hide video on mobile after resize
                const videoBg = document.querySelector('.video-background');
                if (videoBg) videoBg.style.display = 'none';
            } else if (window.innerWidth > 768) {
                // Show video on desktop after resize
                const videoBg = document.querySelector('.video-background');
                if (videoBg) videoBg.style.display = 'block';
            }
        }, 250);
    });
    
    // Lazy loading for skill bars animation
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillBars.forEach(bar => {
        bar.style.animationPlayState = 'paused';
        skillObserver.observe(bar);
    });
    
    // Add swipe gesture support for mobile
    if (isTouchDevice) {
        let startY = 0;
        let startX = 0;
        
        document.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        });
        
        document.addEventListener('touchmove', function(e) {
            // Prevent bounce scrolling on iOS
            if (Math.abs(e.touches[0].clientY - startY) > Math.abs(e.touches[0].clientX - startX)) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    // Performance optimization: Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
            .floating-shape {
                animation: none !important;
            }
            .typewriter {
                animation: none !important;
                border-right: none !important;
            }
            .video-background {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
});
