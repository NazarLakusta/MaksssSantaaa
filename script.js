// Mobile Movie Viewer JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Back button functionality
    const backButton = document.querySelector('.back-button');
    backButton.addEventListener('click', function() {
        // In a real app, this would navigate back
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Fallback if no history
            window.location.href = '/';
        }
    });

    // Share button functionality
    const shareButton = document.querySelector('.share-button');
    shareButton.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: document.querySelector('.movie-title').textContent,
                text: 'Перевірте цей фільм!',
                url: window.location.href
            }).catch(err => console.log('Помилка поділу', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                // Show feedback
                const originalHTML = shareButton.innerHTML;
                shareButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                setTimeout(() => {
                    shareButton.innerHTML = originalHTML;
                }, 2000);
            });
        }
    });

    // Favorite button toggle
    const favoriteButton = document.querySelector('.favorite-button');
    let isFavorited = false;
    
    favoriteButton.addEventListener('click', function() {
        isFavorited = !isFavorited;
        favoriteButton.classList.toggle('active', isFavorited);
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });

    // Download button functionality
    const downloadButton = document.querySelector('.download-button');
    downloadButton.addEventListener('click', function() {
        // In a real app, this would trigger a download
        console.log('Download clicked');
        // Add haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });

    // Video Player Functionality
    const video = document.getElementById('movie-video');
    const videoContainer = document.querySelector('.video-container');
    const videoOverlay = document.getElementById('video-overlay');
    const centerPlayButton = document.getElementById('center-play-button');
    const videoControls = document.getElementById('video-controls');
    const playPauseButton = document.getElementById('play-pause-button');
    const progressBar = document.getElementById('progress-bar');
    const progressFilled = document.getElementById('progress-filled');
    const progressHandle = document.getElementById('progress-handle');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationTimeDisplay = document.getElementById('duration-time');
    const volumeButton = document.getElementById('volume-button');
    const fullscreenButton = document.getElementById('fullscreen-button');
    const backButtonVideo = document.getElementById('back-button-video');
    const watchNowButton = document.querySelector('#watch-now-button');

    let isDragging = false;
    let controlsTimeout;
    let wasPlayingBeforeDrag = false;

    // Format time helper
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Update progress bar
    function updateProgress() {
        if (isDragging) return;
        const progress = (video.currentTime / video.duration) * 100;
        progressFilled.style.width = progress + '%';
        progressHandle.style.left = progress + '%';
        currentTimeDisplay.textContent = formatTime(video.currentTime);
    }

    // Update duration
    video.addEventListener('loadedmetadata', function() {
        durationTimeDisplay.textContent = formatTime(video.duration);
    });

    // Update time while playing
    video.addEventListener('timeupdate', updateProgress);

    // Play/Pause functionality
    function togglePlayPause() {
        if (video.paused) {
            video.play();
            videoContainer.classList.remove('paused');
            videoContainer.classList.add('playing');
            showControls();
        } else {
            video.pause();
            videoContainer.classList.remove('playing');
            videoContainer.classList.add('paused');
            showControls();
        }
        updatePlayPauseIcon();
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    function updatePlayPauseIcon() {
        const playIcon = playPauseButton.querySelector('.play-icon');
        const pauseIcon = playPauseButton.querySelector('.pause-icon');
        if (video.paused) {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        } else {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }
    }

    // Center play button
    centerPlayButton.addEventListener('click', function(e) {
        e.stopPropagation();
        togglePlayPause();
    });

    // Play/Pause button in controls
    playPauseButton.addEventListener('click', function(e) {
        e.stopPropagation();
        togglePlayPause();
    });

    // Video click to play/pause
    video.addEventListener('click', function(e) {
        e.stopPropagation();
        togglePlayPause();
    });

    // Watch Now button
    if (watchNowButton) {
        watchNowButton.addEventListener('click', function() {
            video.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                togglePlayPause();
            }, 300);
        });
    }

    // Progress bar interaction
    progressBar.addEventListener('click', function(e) {
        if (isDragging) return;
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
        updateProgress();
    });

    // Progress bar drag
    progressBar.addEventListener('mousedown', startDrag);
    progressBar.addEventListener('touchstart', startDrag);

    function startDrag(e) {
        isDragging = true;
        wasPlayingBeforeDrag = !video.paused;
        if (wasPlayingBeforeDrag) {
            video.pause();
        }
        progressBar.classList.add('dragging');
        updateDrag(e);
        
        document.addEventListener('mousemove', updateDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', updateDrag);
        document.addEventListener('touchend', endDrag);
        
        e.preventDefault();
    }

    function updateDrag(e) {
        const rect = progressBar.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        video.currentTime = percent * video.duration;
        updateProgress();
    }

    function endDrag() {
        isDragging = false;
        progressBar.classList.remove('dragging');
        if (wasPlayingBeforeDrag) {
            video.play();
        }
        document.removeEventListener('mousemove', updateDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', updateDrag);
        document.removeEventListener('touchend', endDrag);
    }

    // Volume control
    let isMuted = false;
    let previousVolume = 1;

    volumeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        const volumeIcon = volumeButton.querySelector('.volume-icon');
        const volumeMutedIcon = volumeButton.querySelector('.volume-muted-icon');
        
        if (isMuted) {
            video.muted = false;
            video.volume = previousVolume;
            volumeIcon.style.display = 'block';
            volumeMutedIcon.style.display = 'none';
            isMuted = false;
        } else {
            previousVolume = video.volume;
            video.muted = true;
            volumeIcon.style.display = 'none';
            volumeMutedIcon.style.display = 'block';
            isMuted = true;
        }
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });

    // Fullscreen
    fullscreenButton.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });

    // Handle fullscreen change
    document.addEventListener('fullscreenchange', function() {
        if (document.fullscreenElement) {
            videoContainer.classList.add('fullscreen');
        } else {
            videoContainer.classList.remove('fullscreen');
        }
    });

    // Back button in video
    backButtonVideo.addEventListener('click', function(e) {
        e.stopPropagation();
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            video.pause();
            videoContainer.classList.add('paused');
            videoContainer.classList.remove('playing');
            updatePlayPauseIcon();
        }
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });

    // Show/hide controls
    function showControls() {
        videoControls.classList.add('visible');
        clearTimeout(controlsTimeout);
        
        if (!video.paused) {
            controlsTimeout = setTimeout(() => {
                if (!video.paused && !isDragging) {
                    videoControls.classList.remove('visible');
                }
            }, 3000);
        }
    }

    function hideControls() {
        if (!video.paused && !isDragging) {
            videoControls.classList.remove('visible');
        }
    }

    // Show controls on interaction
    videoContainer.addEventListener('mousemove', showControls);
    videoContainer.addEventListener('touchstart', showControls);
    videoContainer.addEventListener('click', function(e) {
        if (e.target === video) {
            showControls();
        }
    });

    // Video events
    video.addEventListener('play', function() {
        videoContainer.classList.remove('paused');
        videoContainer.classList.add('playing');
        updatePlayPauseIcon();
        showControls();
    });

    video.addEventListener('pause', function() {
        videoContainer.classList.remove('playing');
        videoContainer.classList.add('paused');
        updatePlayPauseIcon();
        showControls();
    });

    video.addEventListener('ended', function() {
        videoContainer.classList.remove('playing');
        videoContainer.classList.add('paused');
        updatePlayPauseIcon();
        video.currentTime = 0;
        updateProgress();
    });

    // Initial state
    videoContainer.classList.add('paused');
    updatePlayPauseIcon();

    // Smooth scroll for cast and similar movies sections
    const castList = document.querySelector('.cast-list');
    const similarMovies = document.querySelector('.similar-movies');
    
    // Add momentum scrolling for iOS
    if (castList) {
        castList.style.webkitOverflowScrolling = 'touch';
    }
    if (similarMovies) {
        similarMovies.style.webkitOverflowScrolling = 'touch';
    }

    // Lazy load images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });

    // Handle header visibility on scroll
    let lastScrollTop = 0;
    const header = document.querySelector('.movie-header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });

    // Prevent pull-to-refresh on mobile (optional)
    let touchStartY = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        if (window.scrollY === 0 && e.touches[0].clientY > touchStartY) {
            // User is pulling down at the top
            // You can prevent default here if needed
        }
    }, { passive: true });

    // Add loading state for images
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            // Handle broken images
            this.style.opacity = '0.5';
            this.alt = 'Image not available';
        });
    });

    // Add click handlers for similar movies
    const similarMovieCards = document.querySelectorAll('.similar-movie-card');
    similarMovieCards.forEach(card => {
        card.addEventListener('click', function() {
            // In a real app, this would navigate to the movie detail page
            console.log('Similar movie clicked:', this.querySelector('.similar-movie-title').textContent);
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
        
        // Add hover effect for non-touch devices
        card.style.cursor = 'pointer';
    });

    // Add click handlers for cast items
    const castItems = document.querySelectorAll('.cast-item');
    castItems.forEach(item => {
        item.addEventListener('click', function() {
            const castName = this.querySelector('.cast-name').textContent;
            console.log('Cast member clicked:', castName);
            
            // Navigate to actor page
            // In a real app, you would pass the actor ID as a query parameter
            window.location.href = 'actor.html';
            
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
        
        item.style.cursor = 'pointer';
    });
});

