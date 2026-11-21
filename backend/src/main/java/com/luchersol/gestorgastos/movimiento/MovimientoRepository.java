package com.luchersol.gestorgastos.movimiento;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.repository.NoRepositoryBean;

import com.luchersol.gestorgastos.shared.base.BaseRepository;

@NoRepositoryBean 
public interface MovimientoRepository<T extends Movimiento> extends BaseRepository<T> {

    List<T> findByFechaBetween(
        LocalDate inicio,
        LocalDate fin
    );

    List<T> findByCategoriaId(Long categoriaId);
}