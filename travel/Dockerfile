FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install --production

# Copy application files
COPY server/ ./server/
COPY public/ ./public/
COPY data/ ./data/

# Create media directories
RUN mkdir -p /app/public/media/images /app/public/media/videos

EXPOSE 3002

CMD ["node", "server/index.js"]
