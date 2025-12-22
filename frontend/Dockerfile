# Use Node.js as the base image
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the container
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the app's source code to the container
COPY . .

# Build the Next app
RUN pnpm build

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Set PORT environment variable for Cloud Run
ENV PORT=8080

# Serve the production build
CMD ["pnpm", "start"]
