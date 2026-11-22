package com.luchersol.gestorgastos.shared.base;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

import com.luchersol.gestorgastos.categoria.Categoria;
import com.luchersol.gestorgastos.movimiento.Movimiento;

@NoRepositoryBean 
public interface BaseMovimientoRepository<T extends Movimiento> extends BaseRepository<T> {

    List<T> findByFechaBetween(
        LocalDate inicio,
        LocalDate fin
    );

    List<T> findByCategoriaId(Long categoriaId);

    @Modifying
    @Query("""
        UPDATE #{#entityName} m
        SET m.categoria = :categoria
        WHERE m.categoria.id = :categoriaId
    """)
    void reasignarCategoria(
        @Param("categoriaId") Long categoriaId,
        @Param("categoria") Categoria categoria
    );
}