FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY . /app

# Install app dependencies
RUN npm install

# Expose the port your app runs on
EXPOSE 3002

CMD npm start