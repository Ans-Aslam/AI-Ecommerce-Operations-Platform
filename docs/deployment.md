# Deployment Guide

## Overview

The AI E-Commerce Operations Platform can be run locally in development mode or as a production-style Docker deployment.

The production deployment uses:

- Docker Compose
- PostgreSQL
- FastAPI
- React
- Nginx
- Environment-based configuration

The production Compose configuration keeps PostgreSQL and FastAPI internal to the Docker network while exposing the frontend through Nginx.

## Repository Structure

```text
AI-Ecommerce-Operations-Platform/
├── backend/
├── database/
│   ├── migrations/
│   └── seed.sql
├── docs/
├── frontend/
├── n8n/
├── source-workflows/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
└── .env.production.example