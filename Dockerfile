FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set default environment variable for static fil
ENV STATIC_DIR=client

EXPOSE 3000

CMD ["npm", "start"]

