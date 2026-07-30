# Etapa 1: build
FROM node:22-alpine AS builder

WORKDIR /app

# Copiamos package.json y lockfile primero para aprovechar cache
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Build de producción
RUN npm run build

# Etapa 2: runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copiamos solo lo necesario desde el builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

# Comando de arranque: app Next.js en modo producción
CMD ["npm", "start"]
