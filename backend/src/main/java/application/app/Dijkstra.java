package application.app;

import java.util.*;

public class Dijkstra {

    public static Map<String, Integer> calcularDistancias(Grafo grafo, String inicio) {
        Map<String, Integer> dist = new HashMap<>();
        Set<String> visitados = new HashSet<>();
        List<String> fila = new ArrayList<>();

        for (String nome : grafo.getNos().keySet()) {
            dist.put(nome, Integer.MAX_VALUE);
        }
        dist.put(inicio, 0);
        fila.add(inicio);

        while (!fila.isEmpty()) {
            fila.sort(Comparator.comparingInt(dist::get));
            String atual = fila.remove(0);
            if (visitados.contains(atual)) continue;
            visitados.add(atual);

            No noAtual = grafo.getNos().get(atual);
            for (Map.Entry<No, Integer> viz : noAtual.getVizinhos().entrySet()) {
                String vizNome = viz.getKey().getNome();
                int peso = viz.getValue();
                int novaDist = dist.get(atual) + peso;
                if (novaDist < dist.get(vizNome)) {
                    dist.put(vizNome, novaDist);
                    fila.add(vizNome);
                }
            }
        }

        return dist;
    }

    public static List<String> caminhoMinimo(Grafo grafo, String inicio, String destino) {
        Map<String, Integer> dist = new HashMap<>();
        Map<String, String> anteriores = new HashMap<>();
        Set<String> visitados = new HashSet<>();
        List<String> fila = new ArrayList<>();

        for (String nome : grafo.getNos().keySet()) {
            dist.put(nome, Integer.MAX_VALUE);
        }
        dist.put(inicio, 0);
        fila.add(inicio);

        while (!fila.isEmpty()) {
            fila.sort(Comparator.comparingInt(dist::get));
            String atual = fila.remove(0);
            if (visitados.contains(atual)) continue;
            visitados.add(atual);

            No noAtual = grafo.getNos().get(atual);
            for (Map.Entry<No, Integer> viz : noAtual.getVizinhos().entrySet()) {
                String vizNome = viz.getKey().getNome();
                int peso = viz.getValue();
                int novaDist = dist.get(atual) + peso;
                if (novaDist < dist.get(vizNome)) {
                    dist.put(vizNome, novaDist);
                    anteriores.put(vizNome, atual);
                    fila.add(vizNome);
                }
            }
        }

        List<String> caminho = new ArrayList<>();
        String passo = destino;
        while (passo != null) {
            caminho.add(0, passo);
            passo = anteriores.get(passo);
        }

        if (!caminho.get(0).equals(inicio)) {
            return Collections.emptyList();
        }

        return caminho;
    }
}
