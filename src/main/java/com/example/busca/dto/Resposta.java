package com.example.busca.dto;

import java.util.List;

public class Resposta {
    private List<String> caminho;
    private int custo;

    public Resposta(List<String> caminho, int custo) {
        this.caminho = caminho;
        this.custo = custo;
    }

    public List<String> getCaminho() {
        return caminho;
    }

    public int getCusto() {
        return custo;
    }
}
