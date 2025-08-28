# Usa uma imagem leve do nginx
FROM nginx:alpine

# Remove a página padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia todos os arquivos do seu front para a pasta padrão do nginx
COPY . /usr/share/nginx/html

# Expõe a porta padrão do nginx
EXPOSE 80

# O nginx já inicia automaticamente