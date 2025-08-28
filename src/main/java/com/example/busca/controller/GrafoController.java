package com.example.busca.controller;

import com.example.busca.model.Grafo;
import com.example.busca.service.DijkstraService;
import com.example.busca.util.Leitor;
import com.example.busca.dto.Resposta;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
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

    @PostMapping("/upload-grafo")
    public ResponseEntity<String> uploadGrafo(@RequestPart("file") MultipartFile file) {
    try {
        Path destino = Path.of("src/main/resources/grafo.json");
        Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

        return ResponseEntity.ok("Arquivo grafo.json atualizado com sucesso!");
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Erro ao salvar arquivo: " + e.getMessage());
    }
}
}
