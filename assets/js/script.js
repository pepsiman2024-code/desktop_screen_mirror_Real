document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('button');
    const body = document.body;
    const icon = themeToggleButton.querySelector('i');

    // Check for saved theme preference in local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.replace('fa-moon-stars', 'fa-sun-bright');
    }

    themeToggleButton.addEventListener('click', () => {
        // Toggle dark mode
        body.classList.toggle('dark-mode');

        // Toggle icon between moon and sun
        if (body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon-stars', 'fa-sun-bright');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('fa-sun-bright', 'fa-moon-stars');
            localStorage.setItem('theme', 'light');
        }
    });
});
const shareButton = document.getElementById('mainBody');

shareButton.addEventListener('click', async () => {
    if (navigator.mediaDevices.getDisplayMedia()) {
        try {
            await navigator.mediaDevices.getDisplayMedia()({
                title: 'My Awesome Website',
                text: 'Check out this amazing content!',
                url: window.location.href, // Shares the current page URL
            });
            console.log('Content shared successfully');
        } catch (error) {
            console.error('Error sharing content:', error);
        }
    } else {
        // Fallback for browsers that do not support the Web Share API
        alert('Web Share API is not supported in this browser.');
        // You could also implement a custom share dialog here
    }
});
