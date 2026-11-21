package com.luchersol.gestorgastos.ingreso;

import org.springframework.stereotype.Service;

import com.luchersol.gestorgastos.shared.base.BaseService;


@Service 
public class IngresoService extends BaseService<IngresoRepository, Ingreso> {

    public IngresoService(IngresoRepository repository) {
        super(repository);
    }
    
}
