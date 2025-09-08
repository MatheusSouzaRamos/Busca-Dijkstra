package com.example.main.service;

import com.example.main.model.Grafo;
import com.example.main.model.No;

import java.util.*;

public class GulosaService {
    public static List<String> buscarCaminho(Grafo grafo, String inicio, String destino) {
        Map<String, String> anteriores = new HashMap<>();
        Set<String> visitados = new HashSet<>();

        PriorityQueue<String> fila = new PriorityQueue<>(Comparator.comparingInt(no -> heuristica(no, destino)));
        fila.add(inicio);

        while (!fila.isEmpty()) {
            String atual = fila.poll();
            if (atual.equals(destino)) break;
            if (visitados.contains(atual)) continue;
            visitados.add(atual);

            No noAtual = grafo.getNos().get(atual);
            for (No vizinho : noAtual.getVizinhos().keySet()) {
                if (!visitados.contains(vizinho.getNome())) {
                    anteriores.put(vizinho.getNome(), atual);
                    fila.add(vizinho.getNome());
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

    private static int heuristica(String no, String destino) {
        return Math.abs(no.hashCode() - destino.hashCode()) % 100;
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
