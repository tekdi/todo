FROM node:20 as dependencies
WORKDIR /app
COPY . ./
RUN npm install 
RUN apt-get update 
EXPOSE 3000
CMD ["npm", "start"]
