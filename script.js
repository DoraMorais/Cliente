document.addEventListener("DOMContentLoaded", function () { 
    const form = document.getElementById('form');
    const userName = document.getElementById('name');
    const email = document.getElementById('email');    
    const age = document.getElementById('age'); 
    const address = document.getElementById('address');
    const occupation = document.getElementById('opcoes');
    const password = document.getElementById('password');
    const passwordConfirmation = document.getElementById('passwordconfirmation');

    if (!form || !userName || !email || !age || !address || !occupation || !password || !passwordConfirmation) {
        console.error("Um ou mais elementos do formulário não foram encontrados.");
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault(); 

        if (!userName.value || !email.value || !age.value || !address.value || !occupation.value || !password.value || !passwordConfirmation.value) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (password.value !== passwordConfirmation.value) {
            alert('As senhas não coincidem!');
            return;
        }

        const formData = {
            name: userName.value,
            email: email.value,
            age: age.value,
            address: address.value,
            occupation: occupation.value,
            password: password.value
        };

        fetch('https://seu-servidor.com/api/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar formulário.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert('Formulário enviado com sucesso!');
            form.reset(); // Limpa o formulário após envio bem-sucedido
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Erro ao enviar o formulário.');
        });
    });
});
