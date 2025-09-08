package com.example.main.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.main.dto.Resposta;
import com.example.main.model.Grafo;
import com.example.main.service.GulosaService;
import com.example.main.util.Leitor;

@RestController
@RequestMapping("/api")
public class GulosaController {

    @GetMapping("/guloso")
    public Resposta buscarCaminho(
            @RequestParam String origem,
            @RequestParam String destino) {

        Grafo grafo = Leitor.lerGrafo("grafo.json");
        List<String> caminho = GulosaService.buscarCaminho(grafo, origem, destino);
        int custo = GulosaService.calcularCusto(grafo, caminho);

        return new Resposta(caminho, custo);
    }
}
