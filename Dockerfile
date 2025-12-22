# -------- Build stage --------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy code + env
COPY . .


# Build Next.js
RUN npm run build

# -------- Serve stage --------
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000
CMD ["npm", "start"]
