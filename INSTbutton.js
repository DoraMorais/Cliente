document.addEventListener("DOMContentLoaded", function () {
    const instructionsBtn = document.getElementById('instructions-btn');
    const instructionsMenu = document.getElementById('instructions-menu');
    const closeBtn = document.getElementById('close-btn');

    if (instructionsBtn && instructionsMenu && closeBtn) {
        instructionsBtn.addEventListener('click', function () {
            instructionsMenu.style.display = 'block';
        });

        closeBtn.addEventListener('click', function () {
            instructionsMenu.style.display = 'none';
        });
    } else {
        console.error('One or more elements not found');
    }
});

  // esse é o botão de instruções do formulário//
//o botão exibe um menu de instruções quando clicado//