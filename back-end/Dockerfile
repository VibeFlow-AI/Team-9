# Stage 1: Builder
# This stage installs all dependencies (including dev) and builds the TypeScript code.
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install all dependencies
# Using --legacy-peer-deps for compatibility if needed, but trying without first.
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Prune development dependencies for a cleaner final build
RUN npm prune --production


# Stage 2: Production
# This stage creates the final, lean image with only production dependencies and built code.
FROM node:20-alpine AS production

# Set the working directory
WORKDIR /app

# Create and use a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy package.json and package-lock.json
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --omit=dev

# Copy built code and prisma client from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/server.js"] 