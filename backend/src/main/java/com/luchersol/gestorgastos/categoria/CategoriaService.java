package com.luchersol.gestorgastos.categoria;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.luchersol.gestorgastos.gasto.GastoRepository;
import com.luchersol.gestorgastos.ingreso.IngresoRepository;
import com.luchersol.gestorgastos.movimiento.Movimiento;
import com.luchersol.gestorgastos.shared.base.BaseService;

import jakarta.persistence.EntityNotFoundException;

@Service 
public class CategoriaService extends BaseService<CategoriaRepository, Categoria> {

    private final IngresoRepository ingresoRepository;
    private final GastoRepository gastoRepository;

    public CategoriaService(CategoriaRepository repository, GastoRepository gastoRepository, IngresoRepository ingresoRepository) {
        super(repository);
        this.ingresoRepository = ingresoRepository;
        this.gastoRepository = gastoRepository;
    }

    @Override 
    @Transactional(readOnly = true)
    public List<Categoria> obtenerTodos() {
        List<Categoria> categorias = super.obtenerTodos();
        categorias.sort(Comparator.comparing(Categoria::getTipo).thenComparing(Categoria::getNombre));
        return categorias;
    }

    public Map<String, Categoria> obtenerClasificadoPorNombre() {
        return super.obtenerTodos().stream().collect(Collectors.toMap(Categoria::getNombre, Function.identity()));
    }
    
    @Override 
    @Transactional 
    public void eliminar(Long id) {

        Categoria categoria = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                "Categoría no encontrada"
            ));

        // Evitar eliminar las categorías predeterminadas
        if (categoria.getNombre().equals("Otros gastos")
                || categoria.getNombre().equals("Otros ingresos")) {
            throw new IllegalArgumentException(
                "No puedes eliminar una categoría predeterminada"
            );
        }

        TipoMovimiento tipo = categoria.getTipo();

        String nombreCategoriaDestino =
            tipo == TipoMovimiento.GASTO
                ? "Otros gastos"
                : "Otros ingresos";

        Categoria categoriaDestino = repository
            .findByNombreAndTipo(nombreCategoriaDestino, tipo)
            .orElseThrow(() -> new EntityNotFoundException(
                "No existe la categoría predeterminada: "
                    + nombreCategoriaDestino
            ));

        if (tipo == TipoMovimiento.GASTO) {
            gastoRepository.reasignarCategoria(id, categoriaDestino);
        } else {
            ingresoRepository.reasignarCategoria(id, categoriaDestino);
        }

        repository.delete(categoria);
    }

    @Override
    @Transactional
    public List<Categoria> guardar(Iterable<Categoria> entity) {
        List<Categoria> categorias = StreamSupport.stream(entity.spliterator(), false)
                .filter(c -> !c.getNombre().equalsIgnoreCase("Otros Gastos"))
                .filter(c -> !c.getNombre().equalsIgnoreCase("Otros Ingresos"))
                .toList();

        return super.guardar(categorias);
    }

    @Override
    public Categoria guardar(Categoria entity) {
        String nombre = entity.getNombre();
        if(nombre.equalsIgnoreCase("Otros Gastos") 
            || nombre.equalsIgnoreCase("Otros Ingresos")) {
            return null;
        }
        return super.guardar(entity);
    }

}
