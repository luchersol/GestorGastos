package com.luchersol.gestorgastos.gasto;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luchersol.gestorgastos.shared.base.BaseController;

@RestController 
@RequestMapping("/api/gastos")
public class GastoController extends BaseController<GastoService, Gasto> {

    public GastoController(GastoService service) {
        super(service);
    }
    
}
