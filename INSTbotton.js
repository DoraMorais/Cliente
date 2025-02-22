document.addEventListener("DOMContentLoaded", function () {
    const instructionsBtn = document.getElementById('instructions-btn');
    const instructionsMenu = document.getElementById('instructions-menu');
    const closeBtn = document.getElementById('close-btn');

    instructionsBtn.addEventListener('click', function () {
        instructionsMenu.style.display = 'block';
    });

    closeBtn.addEventListener('click', function () {
        instructionsMenu.style.display = 'none';
    });
});
  // esse é o botão de instruções" 