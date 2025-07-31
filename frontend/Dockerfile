# Bygga
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# server och ngninx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# en nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf


# docker får port 80 men applikationen körs fortf på 5173
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
