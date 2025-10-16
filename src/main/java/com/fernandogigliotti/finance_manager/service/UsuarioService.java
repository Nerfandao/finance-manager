package com.fernandogigliotti.finance_manager.service;

import com.fernandogigliotti.finance_manager.model.Usuario;
import com.fernandogigliotti.finance_manager.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario salvar(Usuario usuario) {
        if (usuario.getEmail() == null || usuario.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email não pode ser vazio");
        }
        return usuarioRepository.save(usuario);
    }

    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario autenticar(String email, String senha) {
        return usuarioRepository.findAll().stream()
                .filter(u -> u.getEmail().equals(email) && u.getSenha().equals(senha))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Email ou senha inválidos"));
    }
}
