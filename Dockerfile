# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json /app

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

# Deffault inside port
EXPOSE 3000

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]