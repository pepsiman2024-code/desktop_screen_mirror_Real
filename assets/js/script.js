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

// Replace the shareButton event listener with:
shareButton.addEventListener('click', async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Desktop Screen Mirror',
                text: 'Check out this screen mirroring app!',
                url: window.location.href,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        alert('Web Share API not supported in your browser');
    }
});
console.log("Now that you are in here See my github repo at: https://github.com/pepsiman2024-code/DesktopScreenMirrorReal/tree/trunk")
const GithubRepo = "Now that you are in here See my github repo at: https://github.com/pepsiman2024-code/DesktopScreenMirrorReal/tree/trunk"
alert(GithubRepo)
window.addEventListener('beforeunload', function (e) {

    e.preventDefault(); // Cancel the event
    e.returnValue = ''; // For older browsers, setting returnValue is necessary
});
