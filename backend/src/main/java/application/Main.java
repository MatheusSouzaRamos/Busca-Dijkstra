package application;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        Grafo grafo = Leitor.lerGrafo("backend/src/main/java/application/grafo/grafoCidades.json");

        String inicio = "Arad";
        String destino = "Vaslui";

        List<String> caminho = Dijkstra.caminhoMinimo(grafo, inicio, destino);

        if (caminho.isEmpty()) {
            System.out.println("Não existe caminho de " + inicio + " até " + destino);
        } else {
            System.out.println("Caminho mínimo " + inicio + " -> " + destino + ": " + caminho);

            int custo = 0;
            for (int i = 0; i < caminho.size() - 1; i++) {
                No noAtual = grafo.getNos().get(caminho.get(i));
                No proximoNo = grafo.getNos().get(caminho.get(i + 1));
                custo += noAtual.getVizinhos().get(proximoNo);
            }
            System.out.println("Custo total caminho: " + custo);
        }
    }
}
