FROM node:16-alpine as build-step
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build


FROM nginx:1.17.1-alpine
COPY --from=build-step /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
