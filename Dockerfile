# syntax=docker/dockerfile:1

# ---------- Stage 1: build ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Instalar dependencias
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copiar el resto del código y buildear
COPY . .
RUN yarn build

# ---------- Stage 2: runtime ----------
FROM node:22-alpine
WORKDIR /app

# Artefactos del build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# PDF templates (usadas por pdfml/html-pdf-node en el flujo de contratos)
COPY --from=builder /app/templates ./templates

# Email templates (referenciadas por mailer.module.ts con path relativo
# 'src/mailer/templates/' — los .ejs NO se compilan, hay que copiarlos)
COPY --from=builder /app/src/mailer/templates ./src/mailer/templates

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main"]
