package com.example.main.controller;

import com.example.main.model.Grafo;
import com.example.main.service.AEstrelaService;
import com.example.main.util.Leitor;
import com.example.main.dto.Resposta;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api-aestrela")
public class AEstrelaController {

    @GetMapping
    public Resposta buscarCaminho(
            @RequestParam String origem,
            @RequestParam String destino,
            @RequestParam(defaultValue = "1.0") double peso) {

        Grafo grafo = Leitor.lerGrafo("grafo.json");
        List<String> caminho = AEstrelaService.buscarCaminho(grafo, origem, destino, peso);
        int custo = AEstrelaService.calcularCusto(grafo, caminho);

        return new Resposta(caminho, custo);
    }

}
