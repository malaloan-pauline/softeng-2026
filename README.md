# SOFTENG-2026 — "Match IT" Webapp

This project will be a web application to promote the Computer Science department,
featuring mini-games, a personality quiz...


## Team 

* Katché Paule-Iris Djeni
* Pauline Aquilina Malalo-an
* Sandrya SANDANASSAMY
* Yasmine ZERAIDI

## Tech Stack

| Layer | Technology|
|----|----|
| Front-end   | React + Vite + Tailwind CSS       |
| Back-end    | Node.js + Express                 |
| Database    | PostgreSQL 16                     |
| Environment | Docker + Docker Compose           |
| Versioning  | Git + GitHub                      |


## Getting Started

### Prerequisites

Make sure you have these installed on your machine:
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:
```
   git clone https://github.com/malaloan-pauline/softeng-2026.git
   cd softeng-2026
```

2. Start the entire environment:  
On a new Teminal Window :
```
   docker-compose up --build
```
3. Open your browser:
   - **Front-end:** http://localhost:5173
   - **Back-end API:** http://localhost:3000
   - **Database** runs on port `5432` (internal)

### Stopping the app 
On the Terminal window :
``` 
docker-compose down
```

## Project Structure
```
softeng-2026/
├── client/               # React front-end (Vite)
│   ├── src/
│   │   ├── games/        # One folder per mini-game
│   │   ├── quiz/         # Personality quiz
│   │   ├── leaderboard/  # Leaderboard page
│   │   └── components/   # Shared components (NavBar, etc.)
│   └── Dockerfile
├── server/               # Node.js + Express back-end
│   ├── index.js
│   └── Dockerfile
├── docker-compose.yml    # Runs client + server + database
├── Meeting Reports/      # Team meeting notes
└── README.md
```

## Database

PostgreSQL is configured automatically by Docker with these default credentials (for local development only):

| Field | Value |
|----|----|
| Host     | `localhost`  |
| Port     | `5432`       |
| Database | `webapp_db`  |
| User     | `webapp_user`|
| Password | `webapp_pass`|

---

## Useful Commands

| Command | Description |
|----|----|
| `docker-compose up --build`  | First-time start (builds images)   |
| `docker-compose up`          | Start (already built)              |
| `docker-compose down`        | Stop all containers                |
| `docker-compose logs server` | View server logs                   |
| `docker-compose ps`          | Check what's running               |

---

## Development Status

- [x] Docker environment (client + server + database)
- [ ] React Router + Tailwind CSS setup
- [ ] Sliding navigation bar
- [ ] Mini-games (Tic-tac-toe, Hangman, ...)
- [ ] Personality quiz
- [ ] Leaderboard + REST API
- [ ] QR Code
- [ ] Deployment