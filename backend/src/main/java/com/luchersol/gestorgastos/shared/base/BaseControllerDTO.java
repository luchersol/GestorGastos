package com.luchersol.gestorgastos.shared.base;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


public abstract class BaseControllerDTO<
        S extends BaseService<?, T>, 
        T extends BaseEntity, 
        D> extends BaseController<S, T> {

    protected BaseControllerDTO(S service) {
        super(service);
    }

    @PostMapping("/dto")
    public ResponseEntity<T> guardarDTO(@RequestBody D dto) {
        T entity = convertir(dto);
        return ResponseEntity.ok(service.guardar(entity));
    }

    protected abstract T convertir(D dto);
}
