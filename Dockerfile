# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
# If you're using yarn, you might have yarn.lock instead
# COPY yarn.lock ./

# Install dependencies based on the lock file
# Using --frozen-lockfile or --ci is recommended for reproducible builds
RUN npm ci --include=dev # Include devDependencies if build scripts need them

# Copy the rest of the application code
COPY . .

# Set environment variables for the build stage if necessary
# For example, if your build process requires specific ENV VARS
# ENV NEXT_PUBLIC_SOME_VAR="some_value"

# Build the Next.js application
# The `next build` command will use the .env.production if it exists,
# or you can pass build-time env vars directly.
# Ensure GOOGLE_API_KEY is available if build step needs it (unlikely for client-side)
RUN npm run build

# Prune development dependencies if they were installed with `npm ci`
# If you used `npm install --production` earlier, this might not be needed.
# RUN npm prune --production


# Stage 2: Production image - Copy only necessary files from the builder stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1 # Recommended for production, already in your Dockerfile
ENV PORT 3000

# Create a non-root user for security (optional but recommended)
# RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
# USER nextjs
# Note: If you use a non-root user, ensure file permissions are correct for /app

# Copy the standalone Next.js output from the builder stage.
# This output is created by `next build` when `output: 'standalone'` is implicitly or explicitly active.
# It should include your .next/static, public folder contents (if any), and server.js.
COPY --from=builder /app/.next/standalone ./

# The public and .next/static directories should be part of the standalone output.
# Therefore, the explicit COPY commands below are usually redundant and can be removed
# if 'standalone' output is correctly configured and working.
# The error encountered was due to /app/public not existing in the builder stage.
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next/static ./.next/static


# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
# This will start the Next.js server using the server.js file from the standalone output.
CMD ["node", "server.js"]
