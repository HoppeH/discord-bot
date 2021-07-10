FROM node:16.1.0-alpine

# Create app directory
WORKDIR /usr/src/app


# RUN apk add g++ gcc libgcc libstdc++ linux-headers make python
# RUN npm install 

# Install nodemon globally in the container
RUN npm i -g nodemon

# RUN npm i better-sqlite-pool
# RUN npm i enmap
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install




# Bundle app source
COPY . .




CMD [ "npm", "run", "start" ]