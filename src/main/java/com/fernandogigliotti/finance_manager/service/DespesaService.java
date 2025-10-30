package com.fernandogigliotti.finance_manager.service;

import com.fernandogigliotti.finance_manager.model.Despesa;
import com.fernandogigliotti.finance_manager.model.Usuario;
import com.fernandogigliotti.finance_manager.repository.DespesaRepository;
import com.fernandogigliotti.finance_manager.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DespesaService {

    private final DespesaRepository despesaRepository;
    private final UsuarioRepository usuarioRepository;

    public DespesaService(DespesaRepository despesaRepository, UsuarioRepository usuarioRepository) {
        this.despesaRepository = despesaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Despesa> listarTodas() {
        return despesaRepository.findAll();
    }

    public Optional<Despesa> buscarPorId(Long id) {
        return despesaRepository.findById(id);
    }

    public List<Despesa> listarPorUsuario(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return despesaRepository.findByUsuario(usuario);
    }

    public Despesa salvar(Despesa despesa, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        despesa.setUsuario(usuario);
        return despesaRepository.save(despesa);
    }

    public Despesa criar(Despesa despesa) {
        if (despesa.getValor().floatValue() < 0) {
            throw new IllegalArgumentException("O valor da despesa não pode ser negativo");
        }

        return despesaRepository.save(despesa);
    }

    public void deletar(Long id, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Optional<Despesa> despesa = despesaRepository.findById(id);

        if (despesa.isPresent() && despesa.get().getUsuario().equals(usuario)) {
            despesaRepository.delete(despesa.get());
        } else {
            throw new RuntimeException("Despesa não encontrada ou não pertence ao usuário");
        }
    }

    public Despesa atualizar(Long id, Despesa despesaAtualizada, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return despesaRepository.findById(id)
                .map(despesa -> {
                    if (!despesa.getUsuario().equals(usuario)) {
                        throw new RuntimeException("A despesa não pertence ao usuário");
                    }
                    despesa.setDescricao(despesaAtualizada.getDescricao());
                    despesa.setValor(despesaAtualizada.getValor());
                    despesa.setCategoria(despesaAtualizada.getCategoria());
                    despesa.setData(despesaAtualizada.getData());
                    return despesaRepository.save(despesa);
                })
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada"));
    }
}
