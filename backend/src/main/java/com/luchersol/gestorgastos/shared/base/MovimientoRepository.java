package com.luchersol.gestorgastos.shared.base;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean 
public interface MovimientoRepository<T extends Movimiento> extends BaseRepository<T> {

    List<T> findByFechaBetween(
        LocalDate inicio,
        LocalDate fin
    );

    List<T> findByCategoriaId(Long categoriaId);
}