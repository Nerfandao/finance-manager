package com.fernandogigliotti.finance_manager.controller;

import com.fernandogigliotti.finance_manager.dto.LoginRequest;
import com.fernandogigliotti.finance_manager.security.JwtUtil;
import com.fernandogigliotti.finance_manager.service.UsuarioService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
    private final AuthenticationManager authenticationManager;

    public AuthController(UsuarioService usuarioService, JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest credenciais) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(credenciais.getEmail(), credenciais.getSenha())
        );

        String token = jwtUtil.generateToken(credenciais.getEmail());

        Map<String, String> resposta = new HashMap<>();
        resposta.put("token", token);
        return resposta;
    }

}
