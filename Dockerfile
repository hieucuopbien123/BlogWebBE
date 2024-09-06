# Use the official Node.js 16 base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy your application files to the container
COPY . .

# Install dependencies if needed
RUN npm install

# Specify the command to run your application
CMD [ "node", "index.js" ]