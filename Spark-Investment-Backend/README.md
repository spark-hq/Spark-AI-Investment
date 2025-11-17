# Spark Investment Backend

## Quick Start

### 1. Start Docker
```powershell
docker-compose up -d
```

### 2. Setup Node Service
```powershell
cd node-service
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Setup Python Service
```powershell
cd python-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 4. Start Services

Terminal 1 (Node):
```powershell
cd node-service
npm run dev
```

Terminal 2 (Python):
```powershell
cd python-service
.\venv\Scripts\Activate.ps1
uvicorn src.main:app --reload --port 8000
```

## Access Points
- Node API: http://localhost:5000
- Python API: http://localhost:8000
- pgAdmin: http://localhost:5050
- Redis Commander: http://localhost:8081

## Credentials
PostgreSQL: spark_admin / spark_password_2024
Redis: redis_password_2024
pgAdmin: admin@sparkinvestment.com / admin123
