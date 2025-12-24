// Actor Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Back button functionality
    const backButton = document.querySelector('.back-button');
    backButton.addEventListener('click', function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
    });

    // Share button functionality
    const shareButton = document.querySelector('.share-button');
    shareButton.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: document.querySelector('.actor-name').textContent + ' - Профіль актора',
                text: 'Перевірте профіль цього актора!',
                url: window.location.href
            }).catch(err => console.log('Помилка поділу', err));
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                const originalHTML = shareButton.innerHTML;
                shareButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                setTimeout(() => {
                    shareButton.innerHTML = originalHTML;
                }, 2000);
            });
        }
    });

    // Follow button toggle
    const followButton = document.getElementById('follow-button');
    let isFollowing = false;
    
    followButton.addEventListener('click', function() {
        isFollowing = !isFollowing;
        followButton.classList.toggle('following', isFollowing);
        
        const buttonText = followButton.querySelector('span');
        if (isFollowing) {
            buttonText.textContent = 'Підписано';
        } else {
            buttonText.textContent = 'Підписатися';
        }
        
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });

    // Favorite button toggle
    const favoriteButton = document.querySelector('.favorite-button-actor');
    let isFavorited = false;
    
    favoriteButton.addEventListener('click', function() {
        isFavorited = !isFavorited;
        favoriteButton.classList.toggle('active', isFavorited);
        
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });

    // Share button in action buttons
    const shareButtonActor = document.querySelector('.share-button-actor');
    shareButtonActor.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: document.querySelector('.actor-name').textContent + ' - Профіль актора',
                text: 'Перевірте профіль цього актора!',
                url: window.location.href
            }).catch(err => console.log('Помилка поділу', err));
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
        }
    });

    // Read more button for biography
    const readMoreButton = document.getElementById('read-more-button');
    const biographyFull = document.getElementById('biography-full');
    let isExpanded = false;
    
    readMoreButton.addEventListener('click', function() {
        isExpanded = !isExpanded;
        readMoreButton.classList.toggle('expanded', isExpanded);
        
        if (isExpanded) {
            biographyFull.style.display = 'block';
            readMoreButton.querySelector('.read-more-text').textContent = 'Читати менше';
        } else {
            biographyFull.style.display = 'none';
            readMoreButton.querySelector('.read-more-text').textContent = 'Читати більше';
        }
        
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });

    // Filmography item click handlers
    const filmographyItems = document.querySelectorAll('.filmography-item');
    filmographyItems.forEach(item => {
        item.addEventListener('click', function() {
            const movieTitle = this.querySelector('.filmography-title').textContent;
            // In a real app, this would navigate to the movie detail page
            console.log('Filmography item clicked:', movieTitle);
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    });

    // Handle header visibility on scroll
    let lastScrollTop = 0;
    const header = document.querySelector('.actor-header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });

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

    // Add loading state for images
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            this.alt = 'Зображення недоступне';
        });
    });
});

