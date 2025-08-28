package com.example.busca.controller;

import com.example.busca.model.Grafo;
import com.example.busca.service.DijkstraService;
import com.example.busca.util.Leitor;
import com.example.busca.dto.Resposta;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class GrafoController {

    @GetMapping
    public Resposta buscarCaminho(
            @RequestParam String origem,
            @RequestParam String destino) {

        Grafo grafo = Leitor.lerGrafo("grafo.json");
        List<String> caminho = DijkstraService.caminhoMinimo(grafo, origem, destino);
        int custo = DijkstraService.calcularCusto(grafo, caminho);

        return new Resposta(caminho, custo);
    }
}
