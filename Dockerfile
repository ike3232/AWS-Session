FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

<<<<<<< HEAD
# Set default environment variable for static fil
=======
>>>>>>> 3f4fcac (editing)
ENV STATIC_DIR=client

EXPOSE 3000

CMD [ "npm", "start" ]

