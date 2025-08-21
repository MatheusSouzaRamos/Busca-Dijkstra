package application;

import java.util.HashMap;
import java.util.Map;

public class Grafo {
    private Map<String, No> nos;

    public Grafo() {
        nos = new HashMap<>();
    }

    public No getOuCriaNo(String nome) {
        nos.putIfAbsent(nome, new No(nome));
        return nos.get(nome);
    }

    public void addAresta(String origem, String destino, int peso) {
        No noOrigem = getOuCriaNo(origem);
        No noDestino = getOuCriaNo(destino);
        noOrigem.addVizinho(noDestino, peso);
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
