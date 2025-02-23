# Base image
FROM mcr.microsoft.com/devcontainers/base:alpine

# Switch to root user to install dependencies
USER root

# Install node.js and npm
RUN apk add --no-cache nodejs npm

# Set working directory
WORKDIR /workspace

# Copy package files (package.json and package-lock.json)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Expose the port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]

