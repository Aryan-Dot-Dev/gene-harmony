# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies using bun
RUN npm install -g bun && bun install

# Copy source code
COPY . .

# Build the project
RUN bun run build
