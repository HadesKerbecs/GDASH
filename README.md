# SkyPulse – Plataforma Full‑Stack com Autenticação JWT, CRUD de Usuários e Integrações

Este projeto consiste em uma aplicação full‑stack com autenticação JWT, CRUD de usuários, consultas a APIs externas (PokéAPI, Open-Meteo, SWAPI) e gerenciamento de sessão com expiração automática.

---

## 🚀 Como Executar com Docker (Recomendado)

### 1. Suba tudo com:
```
docker-compose up --build
```

### 2. Serviços disponíveis:
| Serviço | URL |
|--------|-----|
| **Backend API (NestJS)** | http://localhost:3000 |
| **Frontend (React/Vite)** | http://localhost:5173 |
| **Swagger** | http://localhost:3000/api |
| **Pokémon Worker** | executa automaticamente |
| **Weather Worker** | executa automaticamente |

---

## ▶️ Executar Manualmente (Sem Docker)

### **Backend**
Requer: Node 18+

```
cd backend-api
npm install
npm run dev
```

```
cd weather-producer
docker-compose up --build
```

### **Frontend**
```
cd frontend
npm install
npm run dev
```

Backend iniciará em `http://localhost:3000`  
Frontend iniciará em `http://localhost:5173`

---

## 🔐 Usuário Padrão

| Campo | Valor |
|-------|-------|
| Email | admin@example.com |
| Senha | admin123 |

Esse usuário é criado automaticamente caso não exista.

---

## 📚 Endpoints Principais

### **Auth**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /auth/login | Login e geração de token |
| POST | /auth/register | Registro |

### **Users**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /users | Lista todos os usuários |
| GET | /users/:id | Busca usuário por ID |
| PATCH | /users/:id | Atualiza usuário |
| DELETE | /users/:id | Remove usuário |

> Todos requerem **Bearer Token** no header.

---

## 🎨 Frontend – Páginas

| Página | URL | Função |
|--------|------|--------|
| Login | /login | Autenticação |
| Registro | /register | Criar conta |
| Dashboard | /dashboard | Dados gerais |
| Pokémon | /pokemon | Listagem e filtro |
| Detalhes | /pokemon/:id | Detalhes do Pokémon |
| Usuários | /users | CRUD completo |

---

## ⚙️ Estrutura do Projeto

```
/
├── backend-api (NestJS)
|   ├── src/
│   ├   ├── auth/
│   ├   ├── users/
│   ├   ├── pokemon/
│   ├   ├── weather/
│   ├   └── main.ts
│
├── frontend (React + Vite)
│   ├── src/
│   ├   ├── pages/
│   ├   ├── components/
│   ├   ├── layouts/
│   ├   └── App.tsx
│
├── go-worker/
│   ├── main.go
│
├── weather-producer
└── ├── docker-compose.yml
```

```
+-----------------------------+
|        Frontend (React)     |
|  Vite, Theme System, Toast  |
+-------------+---------------+
              |
              v
+-----------------------------+
|        API (NestJS)         |
| Auth, Users, Pokémon, Meteo |
+-------------+---------------+
              |
     +--------+---------+
     |                  |
     v                  v
+-----------+    +--------------+
| WorkerPy  |    | WorkerGo     |
| Tasks/API |    | Paralelas    |
+-----------+    +--------------+
```

---

## 📝 Observações
- O sistema automaticamente **desloga** caso o token expire.
- Toasts personalizados exibem erros, sucessos e avisos.
- A arquitetura foi organizada priorizando **clareza, coesão e integração**.

---

