package com.luchersol.gestorgastos.shared.base;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.luchersol.gestorgastos.categoria.Categoria;


public abstract class BaseControllerDTO<
        S extends BaseService<?, T>, 
        T extends BaseEntity, 
        D> extends BaseController<S, T> {

    protected BaseControllerDTO(S service) {
        super(service);
    }

    @PostMapping("/dto")
    public ResponseEntity<T> guardarDTO(@RequestBody D dto) {
        T entity = convertirToSave(dto);
        return ResponseEntity.ok(service.guardar(entity));
    }

    @PutMapping("/dto")
    public ResponseEntity<Void> actualizarDTO(@RequestBody D dto) {

        return ResponseEntity.ok().build();
    }

    protected abstract T convertirToSave(D dto);
    protected abstract T convertirToUpdate(Long id, D dto);
}
