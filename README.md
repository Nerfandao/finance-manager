💰 Finance Manager

O Finance Manager é um sistema de controle financeiro pessoal desenvolvido com Spring Boot (Java) no backend e Angular no frontend.
O projeto tem como objetivo permitir que cada usuário registre, visualize e gerencie suas despesas de forma simples, segura e organizada.

🚀 Tecnologias Utilizadas

Backend

☕ Java 17

🌱 Spring Boot (Web, Security, JPA, Validation)

🗄️ PostgreSQL

🔐 JWT (JSON Web Token) para autenticação

🧩 Maven

Frontend

⚡ Angular

🎨 TypeScript, HTML, CSS

Outros

🧠 REST API

🧪 Postman (para testes de rotas)

🐙 Git e GitHub

⚙️ Funcionalidades

✅ Cadastro e login de usuários
✅ Geração de token JWT para autenticação
✅ CRUD completo de despesas
✅ Associação automática das despesas ao usuário logado
✅ Proteção de rotas e controle de acesso via token
✅ Listagem de despesas filtradas por usuário

🧭 Estrutura do Projeto
finance-manager/
├── backend/
│   ├── src/main/java/com/fernandogigliotti/finance_manager/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   └── security/
│   ├── src/main/resources/
│   │   ├── application.properties
│   └── pom.xml
└── frontend/
    ├── src/app/
    ├── package.json
    └── angular.json

🧰 Como Rodar o Projeto
🔹 Pré-requisitos

Java 17+

Maven

Node.js e Angular CLI

PostgreSQL em execução

🔹 Passos (Backend)
# Clone o repositório
git clone https://github.com/Nerfandao/finance-manager.git

# Acesse o backend
cd finance-manager/backend

# Configure o banco no application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/finance_manager
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

# Execute o projeto
mvn spring-boot:run

🔹 Passos (Frontend)
cd ../frontend
npm install
ng serve


A aplicação será executada em:
🔗 Frontend: http://localhost:4200

🔗 Backend: http://localhost:8080

🔒 Exemplo de Autenticação
Login (POST)
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "senha": "123456"
}


➡️ Retorna um token JWT.

Acesso às rotas protegidas

Use o header:

Authorization: Bearer SEU_TOKEN

🎯 Próximos Passos

 Implementar criptografia de senha com BCrypt

 Adicionar filtros e relatórios de despesas

 Deploy da aplicação (Render / Vercel / AWS)

 Melhorar UI/UX no frontend

👨‍💻 Autor

Fernando Gigliotti
LinkedIn
 • GitHub
