# Busca Dijkstra

Este projeto é uma aplicação web interativa para visualização e execução do algoritmo de Dijkstra em grafos.

## 🧭 Funcionamento

A aplicação permite ao usuário visualizar um grafo, selecionar nós de origem e destino, e calcular o caminho mínimo entre eles utilizando o algoritmo de Dijkstra. O frontend exibe o grafo de forma dinâmica e interativa, enquanto o backend realiza o processamento do algoritmo e retorna o resultado para ser exibido na interface.

O grafo pode ser customizado e visualizado em tempo real, facilitando o entendimento do funcionamento do algoritmo e suas etapas.

## 🛠️ Tecnologias Utilizadas

- **Frontend:**  
  - HTML, CSS e JavaScript puro para a interface e manipulação do DOM.
  - Visualização SVG para desenhar e animar o grafo.
  - Consumo de API REST para comunicação com o backend.
  - Servido via Node.js utilizando o pacote `http-server` (ou similar).

- **Backend:**  
  - Java 17 com Spring Boot para criação de API REST.
  - Implementação do algoritmo de Dijkstra e manipulação de grafos.
  - Leitura de grafos a partir de arquivos JSON.
  - Configuração de CORS para integração com o frontend.

- **Containerização:**  
  - Docker para facilitar o deploy e a execução em ambientes isolados.

## 📂 Estrutura

- `front/` — Código fonte do frontend, arquivos estáticos e scripts JS.
- `back/` — Código fonte do backend em Java/Spring Boot.
- `public/` — Arquivos públicos do frontend (HTML, CSS, imagens, etc).
- `src/` — Scripts do frontend para manipulação do grafo e integração com a API.
- `target/` — Build do backend gerado pelo Maven.

## ✨ Objetivo

O projeto tem como objetivo didático demonstrar, de forma visual e interativa, como o algoritmo de Dijkstra encontra o menor caminho em um grafo, tornando o aprendizado mais acessível e intuitivo.

---

Sinta-se à vontade para explorar, contribuir ou adaptar para seus estudos!
