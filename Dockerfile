# Use an official Node.js runtime as a base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Create an SSH directory
ARG SSH_PRIVATE_KEY
RUN mkdir /root/.ssh/
RUN echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa

# Set correct permissions for the SSH key
RUN chmod 600 /root/.ssh/id_rsa

# Add GitHub's SSH host key to known_hosts
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy your application source code into the container
COPY . .

# Specify the command to run when the container starts
CMD [ "node", "app.js" ]

