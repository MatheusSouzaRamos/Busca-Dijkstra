package com.example.busca.util;

import java.io.InputStream;
import java.util.Scanner;

import com.example.busca.model.Grafo;

public class Leitor {

    public static Grafo lerGrafo(String nomeArquivo) {
        Grafo grafo = new Grafo();

        try (InputStream is = Leitor.class.getClassLoader().getResourceAsStream(nomeArquivo)) {
            if (is == null) {
                throw new IllegalArgumentException("Arquivo não encontrado: " + nomeArquivo);
            }

            StringBuilder jsonStr = new StringBuilder();
            try (Scanner scanner = new Scanner(is)) {
                while (scanner.hasNextLine()) {
                    jsonStr.append(scanner.nextLine().trim());
                }
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
                    int peso = Integer.parseInt(kv[1].replaceAll("[^0-9]", "").trim());
                    grafo.addAresta(nomeNo, vizinho, peso);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return grafo;
    }
}
