document.addEventListener("DOMContentLoaded", function () {
    const submitBtn = document.getElementById('submit-btn');

    if (!submitBtn) {
        console.error("Elemento com ID 'submit-btn' não encontrado.");
        return;
    }

    submitBtn.addEventListener('click', function () {
        const name = document.getElementById('name')?.value.trim('name');
        const email = document.getElementById('email')?.value.trim('email');
        const age = document.getElementById('age')?.value.trim('age');
        const address = document.getElementById('address')?.value.trim('address'); // Certifique-se que o ID no HTML seja "address"
        const occupation = document.getElementById('opcoes')?.value.trim('opcoes');
        const password = document.getElementById('password')?.value.trim('password');
        const passwordConfirmation = document.getElementById('passwordconfirmation')?.value;

        if (!name || !email || !age || !address || !occupation || !password || !passwordConfirmation) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (password !== passwordConfirmation) {
            alert('As senhas não coincidem!');
            return;
        }

        const formData = {
            name,
            email,
            age,
            address,
            occupation,
            password,
            passwordConfirmation,
        };

        fetch('https://seu-servidor.com/api/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Formulário enviado com sucesso!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Erro ao enviar o formulário.');
        });
    });
});