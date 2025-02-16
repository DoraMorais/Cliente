from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite requisições de diferentes origens

# Configuração do banco de dados PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://usuario:senha@localhost:5432/seu_banco'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Definição do modelo de dados
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String(200), nullable=False)
    occupation = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(200), nullable=False)  # Idealmente, hash aqui

# Rota para receber os dados do formulário
@app.route('/api/form', methods=['POST'])
def receive_form():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Nenhum dado recebido'}), 400

    try:
        new_user = User(
            name=data['name'],
            email=data['email'],
            age=data['age'],
            address=data['address'],
            occupation=data['occupation'],
            password=data['password']  # Importante: Use hashing para senhas reais
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({'message': 'Usuário cadastrado com sucesso!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    db.create_all()  # Cria as tabelas no banco de dados
    app.run(debug=True) 
