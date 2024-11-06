# Use the official Node.js 18 image as a parent image
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the Next.js app
RUN npm run build

# Use a lightweight image to serve the app
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app ./

# Install only production dependencies
RUN npm install --production

# Expose the port the app runs on
EXPOSE 4000

# Define the command to run the app
CMD ["npm", "run", "start", "--", "-p", "4000"]