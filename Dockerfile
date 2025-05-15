
# Stage 1: Builder
# Use an official Node.js Alpine image as a parent image for the build stage
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Install necessary build tools and dependencies for native modules if any
# For Alpine, common tools are python3, make, g++
# Add git for fetching dependencies if needed from git repos
RUN apk add --no-cache python3 make g++ git

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json ./
COPY package-lock.json ./
# If you are using yarn, uncomment the next line and comment out the npm ci line
# COPY yarn.lock ./

# Install app dependencies
# Use --frozen-lockfile for reproducible builds
RUN npm ci
# If you are using yarn, uncomment the next line and comment out the npm ci line
# RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Set environment variable for Next.js to output standalone build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js application for production
# The standalone output will copy only necessary files into the .next/standalone folder
RUN npm run build


# Stage 2: Runner
# Use a minimal Node.js Alpine image for the runtime stage
FROM node:20-alpine AS runner

# Set the working directory
WORKDIR /app

# Create a non-root user for security best practices
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Copy the standalone Next.js build output from the builder stage
COPY --from=builder /app/.next/standalone ./
# Copy the public directory (if it exists and contains assets needed at runtime)
COPY --from=builder /app/public ./public
# Copy the .next/static directory for serving static assets efficiently
COPY --from=builder /app/.next/static ./.next/static

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1
# The GOOGLE_API_KEY should be passed in at runtime via `docker run -e`

# Change ownership of the app files to the non-root user
RUN chown -R nextjs:nextjs /app

# Switch to the non-root user
USER nextjs

# Expose the port the app runs on (Next.js default is 3000)
EXPOSE 3000

# Define the command to run the app
# This uses the server.js file from the standalone output
CMD ["node", "server.js"]
