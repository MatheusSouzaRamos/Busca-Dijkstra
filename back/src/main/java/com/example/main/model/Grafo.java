package com.example.main.model;

import java.util.HashMap;
import java.util.Map;

public class Grafo {

    private Map<String, No> nos;

    public Grafo() {
        this.nos = new HashMap<>();
    }

    public No getOuCriaNo(String nome) {
        nos.putIfAbsent(nome, new No(nome));
        return nos.get(nome);
    }

    public void addAresta(String origem, String destino, int peso) {
        No noOrigem = getOuCriaNo(origem);
        No noDestino = getOuCriaNo(destino);
        noOrigem.addVizinho(noDestino, peso);
        noDestino.addVizinho(noOrigem, peso);
    }


    public Map<String, Integer> getArestas(String nome) {
        No no = nos.get(nome);
        if (no == null) return new HashMap<>();
        Map<String, Integer> vizinhos = new HashMap<>();
        for (Map.Entry<No, Integer> entry : no.getVizinhos().entrySet()) {
            vizinhos.put(entry.getKey().getNome(), entry.getValue());
        }
        return vizinhos;
    }

    public Map<String, No> getNos() {
        return nos;
    }

    public void imprimirGrafo() {
        for (No no : nos.values()) {
            System.out.println(no);
        }
    }
}
