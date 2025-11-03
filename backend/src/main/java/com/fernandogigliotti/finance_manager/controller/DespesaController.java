package com.fernandogigliotti.finance_manager.controller;

import com.fernandogigliotti.finance_manager.model.Despesa;
import com.fernandogigliotti.finance_manager.model.Usuario;
import com.fernandogigliotti.finance_manager.repository.DespesaRepository;
import com.fernandogigliotti.finance_manager.repository.UsuarioRepository;
import com.fernandogigliotti.finance_manager.security.JwtUtil;
import com.fernandogigliotti.finance_manager.service.DespesaService;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/despesas")
public class DespesaController {

    private final DespesaService despesaService;
    private final DespesaRepository despesaRepository;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;

    public DespesaController(DespesaService despesaService, DespesaRepository despesaRepository, UsuarioRepository usuarioRepository, JwtUtil jwtUtil) {
        this.despesaService = despesaService;
        this.despesaRepository = despesaRepository;
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<List<Despesa>> listar() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Despesa> despesas = despesaService.listarPorUsuario(email);
        return ResponseEntity.ok(despesas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Despesa> buscarPorId(@PathVariable Long id) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Despesa despesa = despesaService.buscarPorIdEUsuario(id, email);
        return ResponseEntity.ok(despesa);
    }

    @PostMapping
    public ResponseEntity<Despesa> criar(@Valid @RequestBody Despesa despesa) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Despesa nova = despesaService.salvar(despesa, email);
        return ResponseEntity.ok(nova);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Despesa> atualizar(@PathVariable Long id, @Valid @RequestBody Despesa despesa) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Despesa despesaAtualizada = despesaService.atualizar(id, despesa, email);
        return ResponseEntity.ok(despesaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        despesaService.deletar(id, email);
        return ResponseEntity.noContent().build();
    }

}
