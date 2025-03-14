document.addEventListener('DOMContentLoaded', function() {
    const instructionsBtn = document.getElementById('instructions-btn');
    const instructionsMenu = document.getElementById('instructions-menu');
    const closeBtn = document.getElementById('close-btn');

    instructionsBtn.addEventListener('click', function() {
        instructionsMenu.style.display = instructionsMenu.style.display === 'none' ? 'block' : 'none';
    });

    closeBtn.addEventListener('click', function() {
        instructionsMenu.style.display = 'none';
    });

    // Initially hide the instructions menu
    instructionsMenu.style.display = 'none'; });