document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('form');
  const mensagem = document.getElementById('mensagem');

  // --- Cadastro e Edição ---
  if (form) {
    const userName = document.getElementById('name');
    const email = document.getElementById('email');
    const age = document.getElementById('age');
    const occupation = document.getElementById('opcoes');
    const password = document.getElementById('password');
    const passwordConfirmation = document.getElementById('passwordconfirmation');
    const hiddenId = document.getElementById('pessoa-id');

    // Novos campos de endereço
    const rua = document.getElementById('rua');
    const numero = document.getElementById('numero');
    const bairro = document.getElementById('bairro');
    const cidade = document.getElementById('cidade');
    const cep = document.getElementById('cep');

    const campos = [
      { input: userName, errorId: 'name-error', obrigatorioId: 'name-obrigatorio' },
      { input: email, errorId: 'email-error', obrigatorioId: 'email-obrigatorio' },
      { input: age, errorId: 'age-error', obrigatorioId: 'age-obrigatorio' },
      { input: occupation, errorId: 'opcoes-error', obrigatorioId: 'opcoes-obrigatorio' },
      { input: rua, errorId: 'rua-error', obrigatorioId: 'rua-obrigatorio' },
      { input: numero, errorId: 'numero-error', obrigatorioId: 'numero-obrigatorio' },
      { input: bairro, errorId: 'bairro-error', obrigatorioId: 'bairro-obrigatorio' },
      { input: cidade, errorId: 'cidade-error', obrigatorioId: 'cidade-obrigatorio' },
      { input: cep, errorId: 'cep-error', obrigatorioId: 'cep-obrigatorio' }
    ];

    if (password && passwordConfirmation) {
      campos.push(
        { input: password, errorId: 'password-error', obrigatorioId: 'password-obrigatorio' },
        { input: passwordConfirmation, errorId: 'passwordconfirmation-error', obrigatorioId: 'passwordconfirmation-obrigatorio' }
      );
    }

    campos.forEach(({ input, errorId, obrigatorioId }) => {
      if (input) {
        input.addEventListener('input', () => {
          const erroElemento = document.getElementById(errorId);
          const obrigatorioElemento = document.getElementById(obrigatorioId);
          if (erroElemento) erroElemento.style.display = 'none';
          if (obrigatorioElemento) obrigatorioElemento.style.display = 'none';
          if (mensagem) mensagem.style.display = 'none';
        });
      }
    });

    function exibirMensagem(texto, tipo = 'erro') {
      if (!mensagem) return;
      mensagem.className = `mensagem-usuario mensagem-${tipo}`;
      mensagem.textContent = texto;
      mensagem.style.display = 'block';
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      let formIsValid = true;

      document.querySelectorAll('.error-message').forEach(msg => msg.style.display = 'none');
      document.querySelectorAll('.mensagem-obrigatoria').forEach(msg => msg.style.display = 'none');
      if (mensagem) mensagem.style.display = 'none';

      campos.forEach(({ input, errorId, obrigatorioId }) => {
        const erroElemento = document.getElementById(errorId);
        const obrigatorioElemento = document.getElementById(obrigatorioId);

        if (!input.value.trim()) {
          if (obrigatorioElemento) obrigatorioElemento.style.display = 'inline';
          formIsValid = false;
        } else {
          if (input === email && !/^[^@]+@[^@]+\.[^@]+$/.test(input.value)) {
            if (erroElemento) erroElemento.style.display = 'inline';
            formIsValid = false;
          }

          if (
            password && passwordConfirmation &&
            input === passwordConfirmation &&
            password.value !== passwordConfirmation.value
          ) {
            if (erroElemento) erroElemento.style.display = 'inline';
            formIsValid = false;
          }
        }
      });

      if (!hiddenId && password && !password.value.trim()) {
        const obrigatorio = document.getElementById('password-obrigatorio');
        if (obrigatorio) obrigatorio.style.display = 'inline';
        formIsValid = false;
      }

      if (!formIsValid) {
        exibirMensagem('Por favor, preencha todos os campos obrigatórios corretamente.', 'erro');
        return;
      }

      const pessoa = {
        nome: userName.value,
        email: email.value,
        idade: parseInt(age.value),
        ocupacao: occupation.value,
        endereco: {
          rua: rua.value,
          numero: numero.value,
          bairro: bairro.value,
          cidade: cidade.value,
          cep: cep.value
        }
      };

      if (!hiddenId && password) {
        pessoa.senha = password.value;
      }

      try {
        const metodo = hiddenId ? 'PUT' : 'POST';
        const url = hiddenId
          ? `http://localhost:8081/api/pessoa/${hiddenId.value}`
          : `http://localhost:8081/api/pessoa`;

        const response = await fetch(url, {
          method: metodo,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pessoa)
        });

        if (!response.ok) throw new Error('Erro ao enviar dados');

        exibirMensagem(
          hiddenId ? 'Pessoa atualizada com sucesso!' : 'Pessoa cadastrada com sucesso!',
          'sucesso'
        );

        setTimeout(() => {
          window.location.href = 'listarPessoas.html';
        }, 3000);
      } catch (error) {
        console.error('Erro:', error);
        exibirMensagem('Erro ao salvar os dados. Tente novamente.', 'erro');
      }
    });

  const id = new URLSearchParams(window.location.search).get('id');
    if (id && hiddenId) {
      fetch(`http://localhost:8081/api/pessoa/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Erro ao buscar dados');
          return res.json();
        })
        .then(data => {
          hiddenId.value = data.id;
          userName.value = data.nome;
          email.value = data.email;
          age.value = data.idade;
          occupation.value = data.ocupacao;

          rua.value = data.endereco?.rua || '';
          numero.value = data.endereco?.numero || '';
          bairro.value = data.endereco?.bairro || '';
          cidade.value = data.endereco?.cidade || '';
          cep.value = data.endereco?.cep || '';
        })
        .catch(err => {
          console.error('Erro ao carregar dados:', err);
          exibirMensagem('Erro ao carregar dados da pessoa.', 'erro');
        });
    }
  }

  // --- Listagem + Exclusão ---
  const tabela = document.querySelector("#pessoas-table tbody");
  if (tabela) {
    const mensagemListagem = document.getElementById('mensagem');

    function exibirMensagemListagem(texto, tipo = 'erro') {
      if (!mensagemListagem) return;
      mensagemListagem.className = `mensagem-usuario mensagem-${tipo}`;
      mensagemListagem.textContent = texto;
      mensagemListagem.style.display = 'block';
    }

    async function carregarPessoas() {
      try {
        const response = await fetch("http://localhost:8081/api/pessoa");
        const pessoas = await response.json();

        tabela.innerHTML = "";

        pessoas.forEach((pessoa) => {
          const enderecoFormatado = pessoa.endereco
            ? `${pessoa.endereco.rua}, ${pessoa.endereco.numero} - ${pessoa.endereco.bairro}, ${pessoa.endereco.cidade} - ${pessoa.endereco.cep}`
            : '';

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${pessoa.nome}</td>
            <td>${pessoa.email}</td>
            <td>${pessoa.idade}</td>
            <td>${enderecoFormatado}</td>
            <td>${pessoa.ocupacao}</td>
            <td>
              <div class="action-buttons">
                <button class="edit-btn" onclick="editarPessoa(${pessoa.id})">Editar</button>
                <button class="delete-btn" onclick="excluirPessoa(${pessoa.id})">Excluir</button>
              </div>
            </td>
          `;
          tabela.appendChild(tr);
        });
      } catch (error) {
        console.error("Erro ao carregar pessoas:", error);
        exibirMensagemListagem("Erro ao buscar as pessoas.", "erro");
      }
    }

    window.editarPessoa = function (id) {
      window.location.href = `editarPessoa.html?id=${id}`;
    };

    window.excluirPessoa = async function (id) {
      try {
        const response = await fetch(`http://localhost:8081/api/pessoa/${id}`, {
          method: "DELETE"
        });

        if (!response.ok) throw new Error("Erro ao excluir.");

        exibirMensagemListagem("Pessoa excluída com sucesso!", "sucesso");
        carregarPessoas();
      } catch (error) {
        console.error("Erro ao excluir:", error);
        exibirMensagemListagem("Erro ao excluir pessoa.", "erro");
      }
    };

    carregarPessoas();
  }
});
