
# --- Builder Stage ---
# Use official Node.js Alpine image as a base image
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
# Using --legacy-peer-deps as it was in your setup, adjust if not needed
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Next.js application
# Ensure NEXT_TELEMETRY_DISABLED is set if you want to disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# --- Runner Stage ---
# Use a clean Alpine image for the runner
FROM node:20-alpine AS runner
WORKDIR /app

# Set the NODE_ENV to production
ENV NODE_ENV production

# Create a non-root user and group for security
# GID and UID 1001 are common choices
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output from the builder stage.
# This should include server.js, .next/server, and potentially .next/static and public assets
# depending on the Next.js version's standalone implementation.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Explicitly copy the .next/static directory from the builder stage.
# The server.js in standalone output expects to serve static assets from ./.next/static
# This ensures they are definitely in the right place with correct ownership.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Note: The 'public' directory's assets (if any) should be bundled into 
# /app/.next/standalone/public by the `next build` with `output: 'standalone'`.
# If you had a public directory and assets were still missing, you might need:
# COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# But ensure /app/public exists in the builder stage to avoid errors.
# For now, we rely on standalone output to handle this.

# Set the user to the non-root user
USER nextjs

EXPOSE 3000
# ENV PORT 3000 # PORT is often set by the hosting environment, but can be defaulted here.

# The CMD will run "node server.js" which is part of the standalone output.
CMD ["node", "server.js"]
