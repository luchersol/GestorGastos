package com.luchersol.gestorgastos.movimiento;

import org.springframework.stereotype.Service;

import com.luchersol.gestorgastos.shared.base.BaseService;


@Service 
public class MovimientoService extends BaseService<MovimientoRepository, Movimiento> {

    public MovimientoService(MovimientoRepository repository) {
        super(repository);
    }
    
}
