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

      if (!password.value) {
          document.getElementById('password-error').style.display = 'inline';
          formIsValid = false;
      }

      if (password.value !== passwordConfirmation.value) {
          document.getElementById('passwordconfirmation-error').style.display = 'inline';
          formIsValid = false;
      }

      if (!formIsValid) {
          return;
      }

      const pessoa = {
          nome: userName.value,
          email: email.value,
          idade: age.value,
          endereco: address.value,
          ocupacao: occupation.value,
          senha: password.value
      }

      try {
          const response = await fetch('http://localhost:8080/api/pessoa', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(pessoa)
          });
      
          if (!response.ok) {
              throw new Error('Erro ao cadastrar pessoa');
          }
      
          const data = await response.text(); // ou .json() dependendo do retorno da API
          console.log('Pessoa cadastrada com sucesso:', data);
          alert('Pessoa cadastrada com sucesso!');
          form.reset(); // limpa o formulário
      } catch (error) {
          console.error('Ocorreu um erro:', error);
          alert('Ocorreu um erro ao cadastrar a pessoa. Tente novamente mais tarde.');
      }
  });
});

        document.addEventListener("DOMContentLoaded", async () => {
            const tabela = document.querySelector("#pessoas-table tbody");
          
            async function carregarPessoas() {
              try {
                const response = await fetch("http://localhost:8080/api/pessoa");
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
                alert("Erro ao buscar as pessoas. Verifique a conexão com o servidor.");
              }
            }
          
            window.editarPessoa = function (id) {
              alert(`Função de edição ainda não implementada. ID: ${id}`);
              // Aqui você poderia abrir um modal ou redirecionar para outro formulário
            };
          
            window.excluirPessoa = async function (id) {
              const confirmacao = confirm("Tem certeza que deseja excluir esta pessoa?");
              if (!confirmacao) return;
          
              try {
                const response = await fetch(`http://localhost:8080/api/pessoa/${id}`, {
                  method: "DELETE"
                });
          
                if (response.ok) {
                  alert("Pessoa excluída com sucesso!");
                  carregarPessoas(); // Atualiza a lista
                } else {
                  throw new Error("Erro ao excluir pessoa.");
                }
              } catch (error) {
                console.error("Erro ao excluir:", error);
                alert("Erro ao excluir pessoa. Tente novamente.");
              }
            };
          
            carregarPessoas();
          });
          

          // script.js
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (id) {
    // Aqui você faz uma requisição para buscar os dados da pessoa com esse ID
    // Supondo que você tenha um endpoint como /pessoa?id={id} que retorne os dados no formato JSON
    fetch(`/pessoa?id=${id}`)
      .then(response => response.json())
      .then(data => {
        // Preenchendo os campos do formulário com os dados recebidos
        document.getElementById('id').value = data.id;
        document.getElementById('nome').value = data.nome;
        document.getElementById('email').value = data.email;
        document.getElementById('idade').value = data.idade;
        document.getElementById('endereco').value = data.endereco;
        document.getElementById('ocupacao').value = data.ocupacao;
      })
      .catch(error => console.error('Erro ao carregar os dados:', error));
  }
});
