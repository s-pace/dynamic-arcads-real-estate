# Dynamic Arcads Real Estate

![Dynamic Arcads Real Estate Logo](dynamic-arcad-logo.png)

**Dynamic Arcads Real Estate** is a backend API built with **NestJS** and **PostgreSQL** to manage and report real estate transactions for Arcads Estates. The project leverages **Clean Architecture principles** (as championed by Uncle Bob) to ensure maintainability, scalability, and testability.

---

## 🚀 Quick Project Overview

✅ **Register new transactions**  
✅ **List all transactions**  
✅ **Fetch top 5 highest-margin transactions**  
✅ **Clean Architecture**: separation of domain, application, interfaces, and infrastructure  
✅ **Zod** for robust runtime data validation  
✅ **Environment-based configuration** for deployment flexibility  

---

## 🏗️ Clean Architecture at a Glance

> **Clean Architecture** (by Uncle Bob) promotes:
>
> - **Independence** of frameworks and UI.
> - **Testability** by isolating business logic.
> - **Ease of maintenance** by enforcing boundaries.
>
> At its core:
>
> - **Domain Layer**: Business models and rules (e.g., `Transaction` entity).  
> - **Application Layer**: Use cases and orchestration (`TransactionService`).  
> - **Infrastructure Layer**: External concerns (DB connections).  
> - **Interfaces Layer**: Adapters (HTTP controllers).  
>
> The **outer layers depend on inner layers**, never the reverse!

---


Here's the **README.md** section extracted in full **Markdown** format – ready to copy-paste:

---

## 🚀 Getting Started

Here's how to set up and run the project from the moment you've **cloned the code**:

### Install dependencies:

```bash
yarn install
```

### Set up environment variables:

Copy the provided `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` to include your actual PostgreSQL database credentials:

```dotenv
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=arcads_db
```

### Start PostgreSQL with Docker Compose:

We use Docker Compose to manage our development environment. The configuration is in `docker-compose.yml`. To start the database:

```bash
docker compose up -d
```

To stop all services:
```bash
docker compose down
```

To view logs:
```bash
docker compose logs -f
```

### Start the development server:

```bash
yarn start:dev
```

The server will start at **[http://localhost:3000](http://localhost:3000)**.

---

## 📄 API Documentation (Swagger)

We use **Swagger** to provide interactive API documentation. Once the app is running, you can access it at:

```
http://localhost:3000/api
```

Swagger will display:

* **All endpoints** with their methods and request/response schemas
* **Example requests and responses** for easy testing
* **Live documentation** that stays in sync with the actual implementation

---