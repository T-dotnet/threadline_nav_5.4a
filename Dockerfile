# Dev image for running the Vite dev server inside Docker
FROM node:20-alpine

# Install build tooling needed by some native deps
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install dependencies first for better layer caching
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the source
COPY . .

# Vite dev server runs on 3000 and binds to all interfaces
EXPOSE 3000

# Keep the dev server running with HMR enabled
CMD ["npm", "run", "dev"]
