# Oris Cloud Backend - NestJS

Backend da plataforma Oris Cloud Gaming, desenvolvido com NestJS, PostgreSQL, OAuth 2.0 e arquitetura REST.

## 🚀 Tecnologias

- **Framework**: NestJS 11
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT + OAuth 2.0 (Google)
- **Validação**: Class Validator + Class Transformer
- **Documentação**: Swagger/OpenAPI
- **Rate Limiting**: @nestjs/throttler
- **ORM**: TypeORM

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 12+
- pnpm (recomendado)

## 🔧 Instalação

1. **Clone o repositório**
```bash
cd oris-cloud-backend
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/oris_cloud_db
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=oris_cloud_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=3600

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:5173

# Server
NODE_ENV=development
PORT=3001
```

4. **Configure o PostgreSQL**

No Render (produção):
- Crie um banco de dados PostgreSQL
- Copie a `DATABASE_URL` para `.env`

Localmente:
```bash
# Crie um banco de dados
createdb oris_cloud_db

# Ou use Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres:15
```

5. **Execute as migrações**
```bash
pnpm run typeorm migration:run
```

## 🏃 Executar o Backend

**Desenvolvimento:**
```bash
pnpm run start:dev
```

**Produção:**
```bash
pnpm run build
pnpm run start:prod
```

O servidor estará disponível em `http://localhost:3001`

## 📚 Documentação da API

Acesse a documentação Swagger em: `http://localhost:3001/api/docs`

### Endpoints Principais

#### Autenticação
- `GET /api/v1/auth/google` - Inicia login com Google
- `GET /api/v1/auth/google/callback` - Callback do Google OAuth

#### Usuários
- `GET /api/v1/users` - Listar todos os usuários
- `GET /api/v1/users/me` - Obter usuário atual (requer JWT)
- `GET /api/v1/users/:id` - Obter usuário por ID
- `POST /api/v1/users` - Criar novo usuário
- `PUT /api/v1/users/:id` - Atualizar usuário (requer JWT)
- `DELETE /api/v1/users/:id` - Deletar usuário (requer JWT)

## 🔐 Segurança

### Headers de Segurança
- CORS configurado para aceitar apenas o frontend
- Rate limiting: 100 requisições por minuto
- Validação de input com whitelist
- JWT com expiração configurável
- Senhas com bcrypt (quando implementado)

### Proteções OWASP
- ✅ Validação de input
- ✅ SQL Injection prevention (TypeORM + Prepared Statements)
- ✅ XSS prevention (JSON responses)
- ✅ CSRF protection (SameSite cookies)
- ✅ Rate limiting
- ✅ CORS seguro
- ✅ Autenticação JWT

## 🗄️ Banco de Dados

### Entidades

**User**
- `id` (UUID, PK)
- `name` (varchar)
- `email` (varchar, unique)
- `avatar` (varchar)
- `provider` (varchar) - 'google', 'github', 'local'
- `providerId` (varchar)
- `bio` (text)
- `emailVerified` (boolean)
- `isActive` (boolean)
- `role` (varchar) - 'user', 'admin', 'moderator'
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## 🚀 Deploy no Render

1. **Conecte seu repositório GitHub**
2. **Crie um novo Web Service no Render**
3. **Configure as variáveis de ambiente** (copie do `.env`)
4. **Crie um banco PostgreSQL no Render**
5. **Configure a `DATABASE_URL`** com a URL do banco
6. **Deploy automático** a cada push

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm run start:dev      # Inicia com hot reload
pnpm run start          # Inicia em produção
pnpm run build          # Build para produção

# Testes
pnpm run test           # Executa testes
pnpm run test:watch     # Testes com watch
pnpm run test:cov       # Cobertura de testes

# Linting
pnpm run lint           # Verifica linting
pnpm run lint:fix       # Corrige linting

# Database
pnpm run typeorm migration:generate -n MigrationName
pnpm run typeorm migration:run
pnpm run typeorm migration:revert
```

## 🐛 Troubleshooting

**Erro de conexão com banco de dados:**
- Verifique se PostgreSQL está rodando
- Verifique as credenciais em `.env`
- Verifique se o banco existe

**Erro de CORS:**
- Verifique se `FRONTEND_URL` está correto em `.env`
- Verifique se o frontend está fazendo requisições para o backend correto

**Erro de OAuth:**
- Verifique se `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretos
- Verifique se `GOOGLE_CALLBACK_URL` está registrado no Google Console

## 📞 Suporte

Para dúvidas ou problemas:
- Email: suporte@oriscloud.com.br
- Discord: https://discord.gg/3pT7NJGZ97

---

**Desenvolvido com ❤️ para Oris Cloud Gaming**
