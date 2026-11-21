package com.luchersol.gestorgastos.shared.base;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor 
public abstract class BaseController<S extends BaseService<?, T>, T> {

    protected final S service;


    @PostMapping
    public ResponseEntity<T> guardar(@RequestBody T entity) {
        return ResponseEntity.ok(service.guardar(entity));
    }

    @GetMapping
    public ResponseEntity<List<T>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping ("/{id}")
    public ResponseEntity<T> obtenerPorId(@PathVariable Long id) {
        return service.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
