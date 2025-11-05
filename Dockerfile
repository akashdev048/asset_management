FROM node:18.2.0 AS build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install --legacy-peer-deps

# RUN npm install
RUN npm install cdbreact --legacy-peer-deps
COPY . /app
RUN npm run build
 
FROM nginx:stable-alpine
# Replace default.conf configuration to remove unnecessary rules
#RUN sed -i "s/}/application\/wasm wasm;\n}/g" /etc/nginx/mime.types
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/nginx.conf
COPY --from=build /app/build/ /usr/share/nginx/html/
#ENTRYPOINT ["tail", "-f", "/dev/null"]
#COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/nginx.conf
EXPOSE 80
CMD ["nginx","-g", "daemon off;"]