package br.com.poolcontrol.marcas.controller;

import br.com.poolcontrol.marcas.entity.Marca;
import br.com.poolcontrol.marcas.service.MarcaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marcas")
public class MarcaController {

    private final MarcaService marcaService;

    public MarcaController(MarcaService marcaService) {
        this.marcaService = marcaService;
    }

    @PostMapping
    public ResponseEntity<Marca> cadastrar(
            @RequestBody Marca marca) {

        return ResponseEntity.ok(
                marcaService.salvar(marca)
        );
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<Marca>> listarPorEmpresa(
            @PathVariable Long empresaId) {

        return ResponseEntity.ok(
                marcaService.listarPorEmpresa(empresaId)
        );
    }

    @GetMapping("/{id}/empresa/{empresaId}")
    public ResponseEntity<Marca> buscarPorId(
            @PathVariable Long id,
            @PathVariable Long empresaId) {

        return ResponseEntity.ok(
                marcaService.buscarPorId(id, empresaId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marca> atualizar(
            @PathVariable Long id,
            @RequestBody Marca marca) {

        return ResponseEntity.ok(
                marcaService.atualizar(id, marca)
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> alterarStatus(
            @PathVariable Long id,
            @RequestParam boolean ativo) {

        marcaService.alterarStatus(id, ativo);

        return ResponseEntity.noContent().build();
    }
}