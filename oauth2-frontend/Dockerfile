# Multi-stage Dockerfile for React application
# This approach creates a smaller final image by separating build and runtime stages

# ===========================================
# STAGE 1: BUILD STAGE
# ===========================================
# Use Node.js 18 with Alpine Linux for building the React application
# Alpine Linux is much smaller than other Linux distributions
# This image contains Node.js runtime and npm package manager
FROM node:18-alpine AS build

# Set the working directory inside the container
# All subsequent commands will run from this directory
WORKDIR /app

# Copy package.json and package-lock.json first
# This is done separately to leverage Docker layer caching
# If package.json hasn't changed, this layer will be cached
# The package-lock.json ensures consistent dependency versions
COPY package*.json ./

# Install npm dependencies
# npm ci is faster and more reliable than npm install
# --only=production installs only production dependencies (not devDependencies)
# This reduces the image size significantly
RUN npm ci --only=production

# Copy all source code into the container
# This includes React components, CSS, assets, and configuration files
COPY . .

# Build the React application
# This creates optimized static files in the 'build' directory
# The build process includes minification, bundling, and optimization
RUN npm run build

# ===========================================
# STAGE 2: RUNTIME STAGE
# ===========================================
# Use Nginx Alpine image for serving static files
# Nginx is much faster and more efficient than Node.js for serving static content
# Alpine Linux keeps the image size small (~50MB vs ~500MB for Node.js)
FROM nginx:alpine

# Copy the built static files from the build stage
# The --from=build flag copies from the previous stage
# /usr/share/nginx/html is the default Nginx document root
# This includes HTML, CSS, JS, and other assets
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx configuration file
# This file handles React Router, API proxying, and other server configurations
# /etc/nginx/conf.d/default.conf is the default Nginx configuration location
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (HTTP default port)
# This documents which port the web server uses
# Note: This doesn't actually publish the port, it's just documentation
EXPOSE 80

# Define the command to run when the container starts
# This tells Docker how to start the Nginx web server
# The -g flag sets global directives
# "daemon off" runs Nginx in foreground mode (required for Docker)
CMD ["nginx","-g","daemon off;"]