package com.fernandogigliotti.finance_manager.service;

import com.fernandogigliotti.finance_manager.model.Despesa;
import com.fernandogigliotti.finance_manager.repository.DespesaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DespesaService {

    private final DespesaRepository despesaRepository;

    public DespesaService(DespesaRepository despesaRepository) {
        this.despesaRepository = despesaRepository;
    }

    public List<Despesa> listarTodas() {
        return despesaRepository.findAll();
    }

    public Optional<Despesa> buscarPorId(Long id) {
        return despesaRepository.findById(id);
    }

    public Despesa criar(Despesa despesa) {
        if (despesa.getValor().floatValue() < 0) {
            throw new IllegalArgumentException("O valor da despesa não pode ser negativo");
        }

        return despesaRepository.save(despesa);
    }

    public void deletar(Long id) {
        despesaRepository.deleteById(id);
    }

    public Despesa atualizar(Long id, Despesa novaDespesa) {
        return despesaRepository.findById(id)
                .map(despesa -> {
                    despesa.setDescricao(novaDespesa.getDescricao());
                    despesa.setValor(novaDespesa.getValor());
                    despesa.setCategoria(novaDespesa.getCategoria());
                    despesa.setData(novaDespesa.getData());
                    return despesaRepository.save(despesa);
                })
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada"));
    }
}
