document.addEventListener("DOMContentLoaded", function () {
  // --- Cadastro e Edição (formulário) ---
  const form = document.getElementById('form');
  if (form) {
    const userName = document.getElementById('name');
    const email = document.getElementById('email');    
    const age = document.getElementById('age'); 
    const address = document.getElementById('address');
    const occupation = document.getElementById('opcoes');
    const password = document.getElementById('password');
    const passwordConfirmation = document.getElementById('passwordconfirmation');
    const hiddenId = document.getElementById('pessoa-id'); // Campo oculto para edição

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      let formIsValid = true;
      const errorMessages = document.querySelectorAll('.error-message');
      errorMessages.forEach(msg => msg.style.display = 'none');

      if (!userName.value) {
        document.getElementById('name-error').style.display = 'inline';
        formIsValid = false;
      }

      if (!email.value || !/^[^@]+@[^@]+\.[^@]+$/.test(email.value)) {
        document.getElementById('email-error').style.display = 'inline';
        formIsValid = false;
      }

      if (!age.value) {
        document.getElementById('age-error').style.display = 'inline';
        formIsValid = false;
      }

      if (!address.value) {
        document.getElementById('address-error').style.display = 'inline';
        formIsValid = false;
      }

      if (!occupation.value) {
        document.getElementById('opcoes-error').style.display = 'inline';
        formIsValid = false;
      }

      if (!hiddenId) { // Só valida senha se for cadastro
        if (!password.value) {
          document.getElementById('password-error').style.display = 'inline';
          formIsValid = false;
        }

        if (password.value !== passwordConfirmation.value) {
          document.getElementById('passwordconfirmation-error').style.display = 'inline';
          formIsValid = false;
        }
      }

      if (!formIsValid) return;

      const pessoa = {
        nome: userName.value,
        email: email.value,
        idade: parseInt(age.value),
        endereco: address.value,
        ocupacao: occupation.value
      };

      if (!hiddenId) {
        pessoa.senha = password.value; // Só envia senha no cadastro
      }

      try {
        const metodo = hiddenId ? 'PUT' : 'POST';
        const url = hiddenId 
          ? `http://localhost:8081/api/pessoa/${hiddenId.value}`
          : `http://localhost:8081/api/pessoa`;

        const response = await fetch(url, {
          method: metodo,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pessoa)
        });

        if (!response.ok) throw new Error('Erro ao enviar dados');

        alert(hiddenId ? 'Pessoa atualizada com sucesso!' : 'Pessoa cadastrada com sucesso!');
        window.location.href = 'listarPessoas.html';
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar os dados. Tente novamente.');
      }
    });

    // --- Preenche o formulário para edição, se for o caso ---
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id && hiddenId) {
      fetch(`http://localhost:8081/api/pessoa/${id}`)
        .then(res => res.json())
        .then(data => {
          hiddenId.value = data.id;
          userName.value = data.nome;
          email.value = data.email;
          age.value = data.idade;
          address.value = data.endereco;
          occupation.value = data.ocupacao;
        })
        .catch(err => {
          console.error('Erro ao carregar dados:', err);
          alert('Erro ao carregar dados da pessoa.');
        });
    }
  }

  // --- Listagem + exclusão ---
  const tabela = document.querySelector("#pessoas-table tbody");
  if (tabela) {
    async function carregarPessoas() {
      try {
        const response = await fetch("http://localhost:8081/api/pessoa");
        const pessoas = await response.json();

        tabela.innerHTML = "";

        pessoas.forEach((pessoa) => {
          const tr = document.createElement("tr");

          tr.innerHTML = `
            <td>${pessoa.nome}</td>
            <td>${pessoa.email}</td>
            <td>${pessoa.idade}</td>
            <td>${pessoa.endereco}</td>
            <td>${pessoa.ocupacao}</td>
            <td>
              <button class="edit-btn" onclick="editarPessoa(${pessoa.id})">Editar</button>
              <button class="delete-btn" onclick="excluirPessoa(${pessoa.id})">Excluir</button>
            </td>
          `;

          tabela.appendChild(tr);
        });
      } catch (error) {
        console.error("Erro ao carregar pessoas:", error);
        alert("Erro ao buscar as pessoas.");
      }
    }

    window.editarPessoa = function (id) {
      window.location.href = `editarPessoa.html?id=${id}`;
    };

    window.excluirPessoa = async function (id) {
      const confirmacao = confirm("Tem certeza que deseja excluir?");
      if (!confirmacao) return;

      try {
        const response = await fetch(`http://localhost:8081/api/pessoa/${id}`, {
          method: "DELETE"
        });

        if (!response.ok) throw new Error("Erro ao excluir.");

        alert("Pessoa excluída com sucesso!");
        carregarPessoas();
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir pessoa.");
      }
    };

    carregarPessoas();
  }
});