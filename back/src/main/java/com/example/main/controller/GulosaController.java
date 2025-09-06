package com.example.main.controller;

import com.example.main.dto.Resposta;
import com.example.main.model.Grafo;
import com.example.main.service.GulosaService;
import com.example.main.service.GulosaService;
import com.example.main.util.Leitor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api-gulosa")
public class GulosaController {

    @GetMapping
    public Resposta buscarCaminho(
            @RequestParam String origem,
            @RequestParam String destino) {

        Grafo grafo = Leitor.lerGrafo("grafo.json");
        List<String> caminho = GulosaService.buscarCaminho(grafo, origem, destino);
        int custo = GulosaService.calcularCusto(grafo, caminho);

        return new Resposta(caminho, custo);
    }
}
