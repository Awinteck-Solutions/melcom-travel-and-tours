# Use the official Node.js image
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Copy swagger-output.json to build directory
RUN cp src/swagger-output.json build/swagger-output.json

# Debug: List files in build directory to verify swagger file exists
RUN ls -la build/ | grep swagger

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001

# Change ownership of the app directory to the appuser
RUN chown -R appuser:nodejs /app
USER appuser

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=production

# Start the Express TypeScript application
CMD ["npm", "start"]
