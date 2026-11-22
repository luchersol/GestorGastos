package com.luchersol.gestorgastos.shared.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.luchersol.gestorgastos.categoria.Categoria;
import com.luchersol.gestorgastos.categoria.CategoriaRepository;
import com.luchersol.gestorgastos.categoria.TipoMovimiento;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final CategoriaRepository categoriaRepository;

    @Override
    public void run(ApplicationArguments args) {

        crearCategoriaPorDefecto(
            "Otros gastos",
            "Categoría para gastos sin clasificar",
            "#808080",
            TipoMovimiento.GASTO
        );

        crearCategoriaPorDefecto(
            "Otros ingresos",
            "Categoría para ingresos sin clasificar",
            "#808080",
            TipoMovimiento.INGRESO
        );
    }

    private void crearCategoriaPorDefecto(
            String nombre,
            String descripcion,
            String color,
            TipoMovimiento tipo) {

        boolean existe = categoriaRepository
            .existsByNombreAndTipo(nombre, tipo);

        if (!existe) {
            Categoria categoria = new Categoria();

            categoria.setNombre(nombre);
            categoria.setDescripcion(descripcion);
            categoria.setColor(color);
            categoria.setTipo(tipo);
            categoria.setActiva(true);

            categoriaRepository.save(categoria);
        }
    }
}
