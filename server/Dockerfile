# server/Dockerfile

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose the Express server port
EXPOSE 3000

# Start the server (adjust if your start script is different)
CMD ["npm", "run", "dev"]