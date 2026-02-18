# Use the official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port that the application will run on
EXPOSE 3000

# Define the startup command
CMD ["node", "server.js"]