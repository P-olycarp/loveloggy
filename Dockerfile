### Multi-stage Dockerfile for LoveLoggy (demo)
# Builds server dependencies and runs the Node Express server which also serves static files

FROM node:18-alpine AS builder
WORKDIR /app

# Copy server package manifest and install production deps
COPY server/package.json server/package-lock.json* ./server/
WORKDIR /app/server
RUN npm install --production --silent

# Final image
FROM node:18-alpine
WORKDIR /app

# Copy server (with installed node_modules)
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY server ./server

# Copy the rest of the project (frontend static files)
COPY . .

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

WORKDIR /app/server
CMD ["node", "index.js"]
