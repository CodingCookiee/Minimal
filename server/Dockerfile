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

#Set environment variable
ENV NODE_ENV=production

# Expose port
EXPOSE 8800

# Start the server
CMD [ "npm", "start" ]