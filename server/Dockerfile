# Use Node.js LTS version
FROM node:23-alpine3.20

# Set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Intall dependencies
RUN npm install --force

# Copy Source Code
COPY . . 

# Set default environment variables
ENV PORT=8800
ENV NODE_ENV=production
ENV CLIENT_URL=http://localhost:5173


# Expose port
EXPOSE 8800

# Start the server
CMD [ "npm", "start" ]