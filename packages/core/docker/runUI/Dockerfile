ARG port=80

FROM nginx:1.15.2-alpine

COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE $port
ENTRYPOINT ["nginx","-g","daemon off;"]