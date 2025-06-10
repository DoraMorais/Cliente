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

        const mensagemTexto = hiddenId
          ? 'Pessoa atualizada com sucesso!'
          : 'Pessoa cadastrada com sucesso!';
        const tipoMensagem = 'sucesso';

        exibirMensagem(mensagemTexto, tipoMensagem);

        setTimeout(() => {
          window.location.href = `listarPessoas.html?mensagem=${encodeURIComponent(mensagemTexto)}&tipo=${tipoMensagem}`;
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

  // --- Login ---
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Oculta mensagens de erro por padrão
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita o recarregamento da página

    // Limpa mensagens de erro
    emailError.style.display = "none";
    passwordError.style.display = "none";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    let isValid = true;

    // Validação básica do email
    if (!validateEmail(email)) {
      emailError.style.display = "block";
      isValid = false;
    }

    // Validação básica da senha
    if (password.length === 0) {
      passwordError.style.display = "block";
      isValid = false;
    }

    if (!isValid) {
      return; // Sai se houver erro
    }

    // Aqui você pode simular a verificação do usuário
    // (Exemplo: checar no localStorage ou chamar o backend)
    // Vamos simular com localStorage:
    const usuariosCadastrados = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioEncontrado = usuariosCadastrados.find(
      (user) => user.email === email && user.password === password
    );

    if (usuarioEncontrado) {
      // Login bem-sucedido
      alert("Login bem-sucedido! 🎉");
      window.location.href = "incluirPessoas.html"; // Substitua pela página desejada
    } else {
      // Usuário não encontrado
      alert("Usuário não encontrado! Vamos te redirecionar para o cadastro.");
      window.location.href = "registroPessoas.html"; // Redireciona para a página de cadastro
    }
  });

  function validateEmail(email) {
    // Regex simples para validar email
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
});













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

    // Mostrar mensagem vinda da query string (ex: sucesso no cadastro)
    const params = new URLSearchParams(window.location.search);
    const mensagemTexto = params.get('mensagem');
    const tipoMensagem = params.get('tipo');
    if (mensagemTexto && tipoMensagem) {
      exibirMensagemListagem(mensagemTexto, tipoMensagem);
      // Limpar a query string para não repetir a mensagem ao recarregar
      window.history.replaceState({}, document.title, window.location.pathname);
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
