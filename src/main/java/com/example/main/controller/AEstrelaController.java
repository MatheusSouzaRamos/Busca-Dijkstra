package com.example.main.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.main.dto.AEstrelaRequest;
import com.example.main.dto.Resposta;
import com.example.main.model.Grafo;
import com.example.main.service.AEstrelaService;
import com.example.main.util.Leitor;

@RestController
@RequestMapping("/api")
public class AEstrelaController {

@PostMapping("/aestrela")
public Resposta buscarCaminhoComHeuristica(@RequestBody AEstrelaRequest req) {
    Grafo grafo = Leitor.lerGrafo("grafo.json");
    List<String> caminho = AEstrelaService.buscarCaminho(grafo, req.origem, req.destino, req.peso, req.heuristica);
    int custo = AEstrelaService.calcularCusto(grafo, caminho);
    return new Resposta(caminho, custo);
}


}
