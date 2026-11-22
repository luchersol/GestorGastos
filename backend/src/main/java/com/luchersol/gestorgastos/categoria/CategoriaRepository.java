package com.luchersol.gestorgastos.categoria;

import java.util.Optional;

import com.luchersol.gestorgastos.shared.base.BaseRepository;

public interface CategoriaRepository extends BaseRepository<Categoria> {
    
    boolean existsByNombreAndTipo(String nombre, TipoMovimiento tipo);

    Optional<Categoria> findByNombreAndTipo(
        String nombre,
        TipoMovimiento tipo
    );
    
}
