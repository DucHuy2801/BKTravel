FROM node:18
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . /src
CMD npm run start