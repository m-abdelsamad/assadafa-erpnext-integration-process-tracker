# --------- Build stage ---------
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
# If you're using CRA and the output is "build" instead of "dist",
# change "dist" accordingly in this file and nginx.conf.
RUN npm run build

# --------- Runtime stage (nginx) ---------
FROM nginx:alpine

# Copy built static files
# If your build output is "build" instead of "dist", update this path.
COPY --from=build /app/dist /usr/share/nginx/html

# We will mount nginx.conf from the host at runtime,
# so we don't copy any nginx config here.
# Default command is already "nginx -g 'daemon off;'" so no need to override.
