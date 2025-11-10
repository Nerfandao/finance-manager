package com.fernandogigliotti.finance_manager.repository;

import com.fernandogigliotti.finance_manager.model.Despesa;
import com.fernandogigliotti.finance_manager.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    List<Despesa> findByUsuario(Usuario usuario);

    @Query("SELECT DISTINCT d.categoria FROM Despesa d WHERE d.usuario = :usuario")
    List<String> findDistinctCategoriasByUsuario(@Param("usuario") Usuario usuario);
}
