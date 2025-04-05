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

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); 

        if (!userName.value || !email.value || !age.value || !address.value || !occupation.value || !password.value || !passwordConfirmation.value) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (password.value !== passwordConfirmation.value) {
            alert('As senhas não coincidem!');
            return;
        }

        const pessoa = {
            name: userName.value,
            email: email.value,
            age: age.value,
            address: address.value,
            occupation: occupation.value,
            password: password.value
        };

        try {
            const response = await fetch('http://localhost:8080/pessoa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pessoa) // Agora enviando a variável correta
            });
        console.log(pessoa);
            if (response.ok) {
                const message = await response.text();
                alert(message);
            } else {
                alert('Erro ao cadastrar. Tente novamente.');
                console.error('Erro:', response.status);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro de conexão com o servidor.');
        }
    });
});
