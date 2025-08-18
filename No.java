import java.util.HashMap;
import java.util.Map;

public class No {
    private String nome;
    private Map<No, Integer> vizinhos;
    private int nArestas; 

    public No(String nome) {
        this.nome = nome;
        this.vizinhos = new HashMap<>();
        this.nArestas = 0;
    }

    public String getNome() {
        return nome;
    }

    public Map<No, Integer> getVizinhos() {
        return vizinhos;
    }

    public int getNArestas() {
        return nArestas;
    }

    public void addVizinho(No no, int peso) {
        if (!vizinhos.containsKey(no)) {
            nArestas++;
        }
        vizinhos.put(no, peso);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(nome).append(" -> ");
        for (Map.Entry<No, Integer> entry : vizinhos.entrySet()) {
            sb.append(entry.getKey().getNome())
              .append("(").append(entry.getValue()).append(") ");
        }
        sb.append("Número de arestas: ").append(nArestas);
        return sb.toString();
    }
}
