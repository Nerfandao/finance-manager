package com.fernandogigliotti.finance_manager.repository;

import com.fernandogigliotti.finance_manager.model.Despesa;
import com.fernandogigliotti.finance_manager.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    List<Despesa> findByUsuario(Usuario usuario);
}
