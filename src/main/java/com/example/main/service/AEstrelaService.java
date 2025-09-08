package com.example.main.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Set;

import com.example.main.model.Grafo;

public class AEstrelaService {

public static List<String> buscarCaminho(Grafo grafo, String inicio, String destino, double peso, Map<String, Double> heuristica) {
        PriorityQueue<Nodo> fila = new PriorityQueue<>(Comparator.comparingDouble(n -> n.custo + n.heuristica));
        Map<String, Nodo> todosNodos = new HashMap<>();

        Nodo nodoInicial = new Nodo(inicio, null, 0, heuristica(heuristica, inicio, peso));
        fila.add(nodoInicial);
        todosNodos.put(inicio, nodoInicial);

        Set<String> visitados = new HashSet<>();

        while (!fila.isEmpty()) {
            Nodo atual = fila.poll();

            if (visitados.contains(atual.nome)) continue;
            visitados.add(atual.nome);

            if (atual.nome.equals(destino)) {
                List<String> caminho = new ArrayList<>();
                Nodo n = atual;
                while (n != null) {
                    caminho.add(0, n.nome);
                    n = n.pai;
                }
                return caminho;
            }

            Map<String, Integer> vizinhos = grafo.getArestas(atual.nome);
            for (Map.Entry<String, Integer> entry : vizinhos.entrySet()) {
                String vizinhoNome = entry.getKey();
                int custoAresta = entry.getValue();
                double novoCusto = atual.custo + custoAresta;

                Nodo vizinho = todosNodos.getOrDefault(vizinhoNome, new Nodo(vizinhoNome));
                if (novoCusto < vizinho.custo) {
                    vizinho.nome = vizinhoNome;
                    vizinho.pai = atual;
                    vizinho.custo = novoCusto;
                    vizinho.heuristica = heuristica(heuristica, vizinhoNome, peso);
                    todosNodos.put(vizinhoNome, vizinho);
                    fila.add(vizinho);
                }
            }
        }

        return Collections.emptyList();
    }

    public static int calcularCusto(Grafo grafo, List<String> caminho) {
        int custoTotal = 0;
        for (int i = 0; i < caminho.size() - 1; i++) {
            custoTotal += grafo.getArestas(caminho.get(i)).get(caminho.get(i + 1));
        }
        return custoTotal;
    }

    private static double heuristica(Map<String, Double> heuristica, String atual, double peso) {
        return heuristica.getOrDefault(atual, 0.0) * peso;
    }

    private static class Nodo {
        String nome;
        Nodo pai;
        double custo;
        double heuristica;

        Nodo(String nome) {
            this.nome = nome;
            this.custo = Double.POSITIVE_INFINITY;
            this.heuristica = 0;
        }

        Nodo(String nome, Nodo pai, double custo, double heuristica) {
            this.nome = nome;
            this.pai = pai;
            this.custo = custo;
            this.heuristica = heuristica;
        }
    }
}