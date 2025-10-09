package com.fernandogigliotti.finance_manager.controller;

import com.fernandogigliotti.finance_manager.model.Despesa;
import com.fernandogigliotti.finance_manager.service.DespesaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/despesas")
public class DespesaController {

    private final DespesaService despesaService;

    public DespesaController(DespesaService despesaService) {
        this.despesaService = despesaService;
    }

    @GetMapping
    public List<Despesa> listarTodas() {
        return despesaService.listarTodas();
    }

    @GetMapping("/{id}")
    public Despesa buscarPorId(@PathVariable Long id) {
        return despesaService.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada"));
    }

    @PostMapping
    public Despesa criar(@RequestBody Despesa despesa) {
        return despesaService.criar(despesa);
    }

    @PutMapping("/{id}")
    public Despesa atualizar(@PathVariable Long id, @RequestBody Despesa despesa) {
        return despesaService.atualizar(id, despesa);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        despesaService.deletar(id);
    }
}
