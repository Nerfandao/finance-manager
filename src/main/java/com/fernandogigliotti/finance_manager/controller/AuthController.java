package com.fernandogigliotti.finance_manager.controller;

import com.fernandogigliotti.finance_manager.model.Usuario;
import com.fernandogigliotti.finance_manager.security.JwtUtil;
import com.fernandogigliotti.finance_manager.service.UsuarioService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioService usuarioService, JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Usuario credenciais) {
        Usuario usuario = usuarioService.autenticar(
                credenciais.getEmail(),
                credenciais.getSenha()
        );

        String token = jwtUtil.generateToken(usuario.getEmail());

        Map<String, String> resposta = new HashMap<>();
        resposta.put("token", token);
        return resposta;
    }

}
