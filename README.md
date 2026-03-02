# Real-Time Multi-Asset Portfolio Tracker

A production-ready full-stack application designed to simulate a high-frequency trading platform. It tracks user portfolios, updates valuations in real-time utilizing an Apache Kafka streaming engine, and visualizes live market data on a React dashboard utilizing STOMP/SockJS web sockets.

## Features

- **Microservice Backend (Spring Boot 3 + Java 17):** Built with Clean Architecture principles, leveraging Spring Data JPA for data persistence.
- **Message Broker (Apache Kafka KRaft):** Ingests real-time market price updates with high throughput. An intelligent in-memory delta cache isolates unnecessary database transactions.
- **Glassmorphic Frontend (React + Vite + Tailwind CSS):** A responsive Dashboard providing live portfolio tracking, visual price flash indicators, animations, and Recharts performance visualization.
- **Real-Time Push (Spring WebSockets - STOMP protocol):** Pushes updated portfolio total valuations out to all specific connected clients precisely when the backend finalizes database changes.
- **Enterprise DevSecOps Configuration:**
  - Standardized stateless Authentication/Authorization using JSON Web Tokens (JWT).
  - Method-Level endpoint security leveraging Spring's `@PreAuthorize` tags (Owner-based Access).
  - Robust Docker-Compose multi-container deployment logic across isolated internal networks.
  - Multi-stage lightweight `Dockerfile` pipelines enforcing non-root user creation principles.
  - Integrated Micrometer and Spring Boot Actuator reporting server/JVM metrics sequentially to a Prometheus database.
  - GitHub Actions CI/CD workflow executing Maven tests and frontend UI verification before allowing regressions to hit the `main` branch.

## Technology Stack

### Backend
- **Core:** Java 17, Spring Boot 3
- **Data & Messaging:** PostgreSQL 15, Spring Data JPA, Apache Kafka (KRaft), Spring WebSockets
- **Security:** Spring Security 6, JJWT (JSON Web Token)
- **Monitoring:** Spring Boot Actuator, Micrometer Registry Prometheus

### Frontend
- **Core:** React 18+, Vite
- **Styling:** Tailwind CSS (Glassmorphism), Lucide-React 
- **Sockets:** @stomp/stompjs, sockjs-client
- **Charting:** Recharts

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx (Alpine)
- **CI/CD:** GitHub Actions

---

## Getting Started

### Prerequisites
- [Docker & Docker Compose](https://docs.docker.com/get-docker/) installed.
- (Optional) Java 17 JDK and Node.js 20+ if running locally without containers.

### Quick Start (Containerized - Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SHIVANINANDE/Real-Time-Multi-Asset-Portfolio-Tracker.git
   cd Real-Time-Multi-Asset-Portfolio-Tracker
   ```

2. **Spin up the ecosystem via Docker Compose:**
   It will boot up PostgreSQL, Kafka, Prometheus, the Spring Boot Backend, and the React Nginx Frontend all across a shared local Docker network.
   ```bash
   docker-compose up -d --build
   ```

3. **Access the Application:**
   - **Frontend Dashboard:** [http://localhost:80](http://localhost:80)
   - **Backend API:** [http://localhost:8080](http://localhost:8080)
   - **Prometheus Metrics:** [http://localhost:9090](http://localhost:9090)

### Running Locally (Development Mode)

#### 1. Start External Dependencies
Ensure PostgreSQL and Kafka are running. Alternatively, simply spin up the database and message broker from docker-compose:
```bash
docker-compose up -d postgres kafka
```

#### 2. Start the Spring Boot Backend
```bash
cd portfolio-tracker
./mvnw clean spring-boot:run
```

#### 3. Start the React Frontend
```bash
cd portfolio-frontend
npm ci
npm run dev
```
Navigate to `http://localhost:5173/` or `http://localhost:5174/` to view the UI.

---

## System Architecture

### Kafka Streams & Business Engine
A producer (simulated initially, or linked to real sources later) sends JSON payloads like `{"ticker": "AAPL", "currentPrice": 150.00}` to the `market-price-updates` topic. The backend `PortfolioService` listens to this topic, calculates total value adjustments referencing cached quantities from `TradeRepository`, stores the delta, and pushes only updated asset values via web sockets.

### Security
Users require a valid Bearer Token for REST access. The `/api/v1/portfolios/{userId}` endpoint is constrained strictly by SpEL (`@PreAuthorize("#userId == authentication.name or hasRole('ADMIN')")`). Unauthenticated errors are captured by `@ControllerAdvice` and returned as sanitized JSON error payloads, preventing trace-dump leakages.

---

## Phase Roadmap
- [x] **Phase 1:** Core Data Entities, Setup Kafka Stream Consumer, WebSocket Config.
- [x] **Phase 2:** Responsive React Dashboard, Glassmorphic styling, Real-Time Charting.
- [x] **Phase 3:** JWT Integration, CI/CD Actions, Nginx & Java Dockerization, Prometheus Observability.
- [ ] **Phase 4:** Mock Kafka Producer (Market Data Simulator component) and User Accounts/Authentication Controllers.
