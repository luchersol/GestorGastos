package com.luchersol.gestorgastos.shared.base;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor 
public abstract class BaseService<R extends JpaRepository<E,Long> ,E> {
    
    protected final R repository;

    public E guardar(E entity) {
        return repository.save(entity);
    }

    public List<E> guardar(Iterable<E> entity) {
        return repository.saveAll(entity);
    }

    public List<E> obtenerTodos() {
        return repository.findAll();
    }

    public Optional<E> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    public boolean existe(Long id) {
        return repository.existsById(id);
    }
}
