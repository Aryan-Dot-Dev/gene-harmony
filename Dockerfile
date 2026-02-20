# ---------- Build Stage ----------
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json bun.lockb ./
RUN npm install -g bun && bun install

COPY . .
RUN bun run build


# ---------- Production Stage ----------
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 5173

CMD ["sh", "-c", "serve -s dist -l $PORT"]
