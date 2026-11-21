package com.luchersol.gestorgastos.movimiento;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luchersol.gestorgastos.shared.base.BaseController;

@RestController 
@RequestMapping("/api/movimientos")
public class MovimientoController extends BaseController<MovimientoService, Movimiento> {

    protected MovimientoController(MovimientoService service) {
        super(service);
    }
    
}
