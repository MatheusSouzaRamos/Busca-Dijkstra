package com.example.main.service;

import com.example.main.model.Grafo;

import java.util.*;

public class AEstrelaService {

    private static final Map<String, Integer> HEURISTICA;
    static {
        Map<String, Integer> heuristica = new HashMap<>();
        heuristica.put("Arad", 365);
        heuristica.put("Bucharest", 0);
        heuristica.put("Craiova", 160);
        heuristica.put("Drobeta", 240);
        heuristica.put("Eforie", 160);
        heuristica.put("Fagaras", 175);
        heuristica.put("Giurgiu", 75);
        heuristica.put("Hirsova", 150);
        heuristica.put("Iasi", 225);
        heuristica.put("Lugoj", 245);
        heuristica.put("Mehadia", 240);
        heuristica.put("Neamt", 235);
        heuristica.put("Oradea", 380);
        heuristica.put("Pitesti", 100);
        heuristica.put("Rimnicu Vilcea", 190);
        heuristica.put("Sibiu", 255);
        heuristica.put("Timisoara", 330);
        heuristica.put("Urziceni", 80);
        heuristica.put("Vaslui", 200);
        heuristica.put("Zerind", 375);
        HEURISTICA = Collections.unmodifiableMap(heuristica);
    }

    public static List<String> buscarCaminho(Grafo grafo, String inicio, String destino, double peso) {

        PriorityQueue<Nodo> fila = new PriorityQueue<>(Comparator.comparingDouble(n -> n.custo + n.heuristica));
        Map<String, Nodo> todosNodos = new HashMap<>();

        Nodo nodoInicial = new Nodo(inicio, null, 0, heuristica(inicio, destino, peso));
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
                    vizinho.heuristica = heuristica(vizinhoNome, destino, peso);
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

    private static double heuristica(String atual, String destino, double peso) {
        return HEURISTICA.getOrDefault(atual, 0) * peso;
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
