document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('button');
    const body = document.body;
    const icon = themeToggleButton.querySelector('i');

    // Check for saved theme preference in local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.replace('fa-moon-stars', 'fa-sun');
    }

    themeToggleButton.addEventListener('click', () => {
        // Toggle dark mode
        body.classList.toggle('dark-mode');

        // Toggle icon between moon and sun
        if (body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon-stars', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon-stars');
            localStorage.setItem('theme', 'light');
        }
    });
});