# Use the official Node.js image.
# Use 'node:alpine' for a lightweight image.
FROM node:14

# Create and change to the app directory.
WORKDIR /app

# Copy 'package.json' and 'package-lock.json' to the working directory.
COPY package*.json ./

# Install dependencies.
RUN npm install --production

# Copy the rest of the application code.
COPY . .

# Expose the port the app runs on.
EXPOSE 3000

# Use the following command to run your app.
CMD ["npm", "start"]
