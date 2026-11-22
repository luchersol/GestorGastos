package com.luchersol.gestorgastos.shared.base;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor 
public abstract class BaseService<
        R extends JpaRepository<E, Long>,
        E extends BaseEntity>{
    
    protected final R repository;

    @Transactional(readOnly = true)
    public List<E> obtenerTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<E> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    @Transactional 
    public E guardar(E entity) {
        return repository.save(entity);
    }

    @Transactional
    public List<E> guardar(Iterable<E> entity) {
        return repository.saveAll(entity);
    }

    @Transactional
    public E actualizar(Long id, E datos) {
        E entity = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                "No se ha encontrado la entidad con ID: " + id
            ));

        entity.actualizar(datos);

        return repository.save(entity);
    }

    @Transactional
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean existe(Long id) {
        return repository.existsById(id);
    }
}
