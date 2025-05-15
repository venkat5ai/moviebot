# ---- Builder Stage ----
# Using CentOS 8 Stream as the base image for the builder stage.
FROM Quay.io/centos/centos:stream8 AS builder

# Install Node.js v20.x using NodeSource repository, and git
RUN yum update -y && \
    yum install -y curl && \
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash - && \
    yum install -y nodejs git && \
    yum clean all && \
    rm -rf /var/cache/yum

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install all dependencies (including devDependencies needed for the build)
RUN npm install

# Copy the rest of the application code
COPY . .

# Set build-time environment variables if any (e.g., for public URLs, not secrets)
# Example: ENV NEXT_PUBLIC_API_URL="/api"

# Build the Next.js application
RUN npm run build

# ---- Runner Stage ----
# Using CentOS 8 Stream as the base image for the runner stage.
FROM Quay.io/centos/centos:stream8

# Install Node.js v20.x for the runtime environment
RUN yum update -y && \
    yum install -y curl && \
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash - && \
    yum install -y nodejs && \
    # Next.js apps might need libuuid for crypto, and fontconfig for canvas-based image processing if used
    # For basic Next.js serving, Node.js itself is usually sufficient.
    # yum install -y libuuid fontconfig && \
    yum clean all && \
    rm -rf /var/cache/yum

# Set the working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
# The GOOGLE_API_KEY should be passed at runtime when starting the container.
# ENV GOOGLE_API_KEY="your_api_key_goes_here_if_not_passed_at_runtime" # Not recommended for secrets
ENV PORT=3000

# Copy necessary artifacts from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./next.config.ts
# If you have a .env.production that is NOT for secrets but for build/runtime config, copy it.
# COPY --from=builder /app/.env.production ./.env.production

# Install production dependencies only
# This ensures that the node_modules are built against the runner's environment,
# which is good practice if there are any native modules.
RUN npm install --production

# Expose the port the app runs on
EXPOSE 3000

# Set the default command to start the Next.js application
# This will use the "start" script from package.json (i.e., "next start")
CMD ["npm", "start"]
