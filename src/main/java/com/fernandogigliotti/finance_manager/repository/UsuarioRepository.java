package com.fernandogigliotti.finance_manager.repository;

import com.fernandogigliotti.finance_manager.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

}
