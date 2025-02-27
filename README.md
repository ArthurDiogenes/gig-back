# Gig Backend

Este projeto contém a aplicação backend para o Projeto Aplicado gig construída com NestJS e um banco de dados PostgreSQL, ambos rodando em containers Docker.

## Integrantes do Grupo
- Matheus Cavalcante
- Arthur Diógenes
- Paulo Luan
- Maria Juliane

## Pré-requisitos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Primeiros Passos

### Clone o repositório

```bash
git clone https://github.com/ArthurDiogenes/gig-back.git
cd gig-back
```

### Configuração do Ambiente

Crie um arquivo `.env` no diretório raiz com o seguinte conteúdo:

```
# Descrição: Variáveis de ambiente para a aplicação
DB_HOST=db
DB_PORT=5432
DB_USER=root
DB_PASSWORD=root
DB_NAME=gig
JWT_SECRET=secret_jwt
URL_FRONTEND=http://localhost:3000
```

### Inicie a aplicação

```bash
docker-compose up -d
```

Este comando irá:
- Construir e iniciar o serviço de backend NestJS
- Iniciar o serviço de banco de dados PostgreSQL
- Configurar a rede entre os serviços

A API backend estará disponível em: `http://localhost:5500`

## Estrutura do Projeto

```
├── docker-compose.yml     # Configuração do Docker Compose
├── Dockerfile             # Configuração Docker para o backend
├── .env                   # Variáveis de ambiente
├── src/                   # Código fonte da aplicação NestJS
├── ...
```

## Serviços

### Backend (NestJS)

O serviço de backend é uma aplicação NestJS que fornece a API para o frontend. Ele se conecta ao banco de dados PostgreSQL usando as credenciais definidas no arquivo `.env`.

### Banco de Dados (PostgreSQL)

O banco de dados PostgreSQL armazena todos os dados da aplicação. O banco de dados é inicializado com as configurações especificadas no arquivo `.env`.

## Desenvolvimento

### Visualizar logs

```bash
docker-compose logs -f
```

### Reconstruir containers

Se você fizer alterações no código ou no Dockerfile:

```bash
docker-compose up -d --build
```

### Parar containers

```bash
docker-compose down
```

Para remover volumes também:

```bash
docker-compose down -v
```

## Documentação da API

Uma vez que a aplicação esteja rodando, você pode acessar a documentação da API Swagger em:

```
http://localhost:5500/api
```

## Solução de Problemas

- **Problemas de conexão com o banco de dados**: Certifique-se de que o arquivo `.env` possui a configuração correta e que o container do banco de dados está rodando.
- **Problemas de inicialização do container**: Verifique os logs usando `docker-compose logs -f` para ver quaisquer erros durante a inicialização.
