package application;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Leitor {

    public static Grafo lerGrafo(String caminhoArquivo) {
        Grafo grafo = new Grafo();

        try (Scanner scanner = new Scanner(new File(caminhoArquivo))) {
            StringBuilder jsonStr = new StringBuilder();
            while (scanner.hasNextLine()) {
                jsonStr.append(scanner.nextLine().trim());
            }

            String conteudo = jsonStr.toString();
            conteudo = conteudo.substring(1, conteudo.length() - 1).trim();
            String[] nos = conteudo.split("},\\s*\"");

            for (String noStr : nos) {
                noStr = noStr.replaceAll("^\"|\"$", "");
                String[] partes = noStr.split(":\\s*\\{", 2);
                String nomeNo = partes[0].replaceAll("\"", "");
                String corpo = partes[1];

                String arestasStr = corpo.replaceAll(".*\"arestas\"\\s*:\\s*\\{(.*)\\}.*", "$1");

                for (String par : arestasStr.split(",")) {
                    String[] kv = par.split(":");
                    String vizinho = kv[0].replaceAll("\"", "").trim();
                    String valorStr = kv[1].replaceAll("[^0-9]", "").trim();
                    int peso = Integer.parseInt(valorStr);
                    grafo.addAresta(nomeNo, vizinho, peso);
                }
            }

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        return grafo;
    }
}
