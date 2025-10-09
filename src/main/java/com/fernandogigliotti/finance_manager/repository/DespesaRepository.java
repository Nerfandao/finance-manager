package com.fernandogigliotti.finance_manager.repository;

import com.fernandogigliotti.finance_manager.model.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DespesaRepository extends JpaRepository<Despesa, Long> {
}
