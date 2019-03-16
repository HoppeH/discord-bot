FROM node:11.11.0-alpine

# Create app directory
WORKDIR /usr/src/app
# RUN apk --no-cache add --virtual native-deps \
#     g++ gcc libgcc libstdc++ linux-headers make python && \
#     npm install --quiet node-gyp -g &&\
#     npm install --quiet && \
#     apk del native-deps

RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python
RUN npm install --quiet node-gyp -g

# Install nodemon globally in the container
RUN npm i -g nodemon
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