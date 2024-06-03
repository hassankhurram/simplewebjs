# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

ENV PORT=7896


# Copy the rest of the application code to the working directory
COPY . .

RUN npm install

RUN npm i -g nodemon

# Expose the port on which the application will run
EXPOSE 7896

# Start the application with nodemon
CMD ["npm", "run", "dev"]
