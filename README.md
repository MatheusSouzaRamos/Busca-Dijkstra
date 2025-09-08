# Algoritmos de busca

Aplicação web interativa para visualização e execução de algoritmos de busca em grafos.

## 🧭 Funcionamento

O usuário pode visualizar um grafo, escolher os nós de origem e destino e calcular o caminho mínimo entre eles usando os seguintes algoritmos: Dijkstra, Busca Gulosa, A* e A* ponderada.  
O frontend exibe o grafo de forma dinâmica e interativa, enquanto o backend processa o algoritmo e retorna o resultado para a interface.  
O grafo pode ser customizado e visualizado em tempo real, facilitando o entendimento do funcionamento do algoritmo.

## 🛠️ Tecnologias Utilizadas

- **Frontend:**

  - HTML, CSS e JavaScript puro para interface e manipulação do DOM.
  - Visualização SVG para desenhar e animar o grafo.
  - Consumo de API REST para comunicação com o backend.
  - Servido via Node.js com `http-server` (Dockerfile incluso em `front/`).

- **Backend:**

  - Java 17 com Spring Boot para API REST.
  - Implementação do algoritmo de Dijkstra.
  - Leitura de grafos em JSON.
  - Configuração de CORS para integração com o frontend.
  - Estrutura pronta para containerização (Dockerfile pode ser adicionado em `back/`).

- **Containerização e Deploy:**
  - Docker para orquestrar frontend e backend.
  - Deploy realizado no Railway, facilitando a publicação online dos containers (frontend e backend são publicados separadamente).

## 📂 Estrutura

```
Algoritmos_de_busca/
│
├── back/         # Backend Spring Boot (Java)
│   └── src/main/java/com/example/main/...
│   └── src/main/java/com/example/entrada/grafo.json
│
├── front/        # Frontend JavaScript (HTML, CSS, JS)
│   └── public/index.html, styles.css, assets/
│   └── src/api.js, dom.js, nodes.js, script.js, svg.js, assets/grafo.json
│   └── Dockerfile
│
├── target/       # Build do backend (gerado pelo Maven)
│
├── pom.xml       # Configuração Maven do backend
│
└── README.md     # Este arquivo
```

## ✨ Objetivo

O objetivo do projeto é demonstrar, de forma visual e interativa, como os algoritmos de busca encontram o menor caminho em um grafo, tornando o aprendizado mais acessível e intuitivo.

---

Sinta-se à vontade para explorar, contribuir ou adaptar para seus estudos!
