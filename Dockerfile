# Frontend build
FROM node:22 AS frontend

WORKDIR /frontend

COPY frontend .

RUN npm install

RUN npm run build


# Backend
FROM python:3.12-slim

WORKDIR /app

COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt


COPY backend/app .


# Copy frontend build into backend static folder
COPY --from=frontend /frontend/dist ./static


EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
