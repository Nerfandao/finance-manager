package com.fernandogigliotti.finance_manager.service;

import com.fernandogigliotti.finance_manager.model.Despesa;
import com.fernandogigliotti.finance_manager.model.Usuario;
import com.fernandogigliotti.finance_manager.repository.DespesaRepository;
import com.fernandogigliotti.finance_manager.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.fernandogigliotti.finance_manager.exception.InvalidDataException;
import com.fernandogigliotti.finance_manager.exception.ResourceNotFoundException;

import java.nio.file.AccessDeniedException;

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

    public Despesa buscarPorIdEUsuario(Long id, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        Despesa despesa = despesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Despesa não encontrada"));

        if (!despesa.getUsuario().equals(usuario)) {
            throw new ResourceNotFoundException("A despesa não pertence ao usuário");
        }
        return despesa;
    }

    public List<Despesa> listarPorUsuario(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        return despesaRepository.findByUsuario(usuario);
    }

    public List<String> buscarCategoriasPorUsuario(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        return despesaRepository.findDistinctCategoriasByUsuario(usuario);
    }

    public Despesa salvar(Despesa despesa, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        if (despesa.getValor().floatValue() <= 0) {
            throw new InvalidDataException("O valor da despesa deve ser positivo");
        }
        despesa.setUsuario(usuario);
        return despesaRepository.save(despesa);
    }

    public void deletar(Long id, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        Despesa despesa = despesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Despesa não encontrada"));

        if (!despesa.getUsuario().equals(usuario)) {
            throw new ResourceNotFoundException("A despesa não pertence ao usuário");
        }
        despesaRepository.delete(despesa);
    }

    public Despesa atualizar(Long id, Despesa despesaAtualizada, String email) throws ResourceNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        return despesaRepository.findById(id)
                .map(despesa -> {
                    if (!despesa.getUsuario().equals(usuario)) {
                        try {
                            throw new AccessDeniedException("A despesa não pertence ao usuário");
                        } catch (AccessDeniedException e) {
                            throw new RuntimeException(e);
                        }
                    }
                    despesa.setDescricao(despesaAtualizada.getDescricao());
                    despesa.setValor(despesaAtualizada.getValor());
                    despesa.setCategoria(despesaAtualizada.getCategoria());
                    despesa.setData(despesaAtualizada.getData());
                    return despesaRepository.save(despesa);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Despesa não encontrada"));
    }
}
