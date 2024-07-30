# Ursula Document Management API DEV

Este projeto é uma API para gerenciamento de documentos utilizando Node.js, Express, Prisma e Swagger. A API permite o upload de documentos, a busca de documentos por `secretToken` e a exclusão de documentos com base no `secretToken`.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework para construção de APIs.
- **Prisma**: ORM (Object-Relational Mapping) para interagir com o banco de dados.
- **Multer**: Middleware para manipulação de multipart/form-data (uploads de arquivos).
- **pdf-parse**: Biblioteca para extração de texto de arquivos PDF.
- **mammoth**: Biblioteca para extração de texto de arquivos Word.
- **csv-parse**: Biblioteca para manipulação de arquivos CSV.
- **axios**: Biblioteca para fazer requisições HTTP.
- **Swagger**: Ferramenta para documentação da API.

## Funcionalidades

1. **Registro de Usuário**: Permite a criação de novos usuários.
2. **Login de Usuário**: Permite aos usuários logarem na aplicação.
3. **Upload de Documento**: Permite o upload de documentos nos formatos `.txt`, `.pdf`, `.docx`, `.doc` e `.csv`.
4. **Busca de Documentos**: Permite buscar todos os documentos associados a um `secretToken` específico.
5. **Exclusão de Documentos**: Permite deletar todos os documentos associados a um `secretToken` específico.

## Requisitos

- Node.js
- PostgreSQL

## Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure o banco de dados**:
   Crie um banco de dados PostgreSQL e configure o arquivo `.env` com suas credenciais de banco de dados:
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/seu_banco_de_dados"
   ```

4. **Execute as migrações do Prisma**:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Gere o cliente Prisma**:
   ```bash
   npx prisma generate
   ```

## Executando o Projeto

1. **Inicie o servidor**:
   ```bash
   npm start
   ```

2. **Acesse a documentação Swagger**:
   Abra o navegador e vá para `https://grantosegurosapimanagement-production.up.railway.app/api-docs` para acessar a documentação da API.

## Rotas da API

### Registro de Usuário

- **Rota**: `/users/register`
- **Método**: `POST`
- **Descrição**: Cria um novo usuário.
- **Parâmetros**:
  - `name` (string)
  - `email` (string)
  - `phone` (string)
  - `password` (string)

### Login de Usuário

- **Rota**: `/users/login`
- **Método**: `POST`
- **Descrição**: Faz login do usuário.
- **Parâmetros**:
  - `email` (string)
  - `password` (string)

### Upload de Documento

- **Rota**: `/ursula/upload`
- **Método**: `POST`
- **Descrição**: Faz upload de um documento.
- **Headers**:
  - `accept` (string) - Secret token do usuário
- **Parâmetros**:
  - `file` (arquivo) - Documento a ser enviado

### Busca de Documentos

- **Rota**: `/ursula/documents`
- **Método**: `GET`
- **Descrição**: Busca documentos pelo `secretToken`.
- **Headers**:
  - `accept` (string) - Secret token do usuário

### Exclusão de Documentos

- **Rota**: `/ursula/documents`
- **Método**: `DELETE`
- **Descrição**: Apaga todos os documentos pelo `secretToken`.
- **Headers**:
  - `accept` (string) - Secret token do usuário