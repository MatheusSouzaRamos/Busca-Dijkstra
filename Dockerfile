# Usa uma imagem leve do nginx
FROM nginx:alpine

# Remove a página padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia tudo da pasta public para a pasta padrão do nginx
COPY public/ /usr/share/nginx/html

# Copia a pasta src para dentro do html (para servir os JS)
COPY src/ /usr/share/nginx/html/src

EXPOSE 80