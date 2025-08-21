package com.example.busca.service;

import java.util.*;

import com.example.busca.model.Grafo;
import com.example.busca.model.No;

public class DijkstraService {

    private Grafo grafo;

    public DijkstraService(Grafo grafo) {
        this.grafo = grafo;
    }

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

    public static int calcularCusto(Grafo grafo, List<String> caminho) {
        int custo = 0;
        for (int i = 0; i < caminho.size() - 1; i++) {
            String atual = caminho.get(i);
            String proximo = caminho.get(i + 1);
            custo += grafo.getNos().get(atual).getVizinhos().get(grafo.getNos().get(proximo));
        }
        return custo;
    }

}
