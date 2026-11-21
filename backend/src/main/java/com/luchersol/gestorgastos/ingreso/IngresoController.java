package com.luchersol.gestorgastos.ingreso;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luchersol.gestorgastos.shared.base.BaseController;

@RestController 
@RequestMapping("/api/ingresos")
public class IngresoController extends BaseController<IngresoService, Ingreso> {

    protected IngresoController(IngresoService service) {
        super(service);
    }
    
}
