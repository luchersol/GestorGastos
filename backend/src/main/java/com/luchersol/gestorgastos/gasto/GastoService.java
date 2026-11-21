package com.luchersol.gestorgastos.gasto;

import org.springframework.stereotype.Service;

import com.luchersol.gestorgastos.shared.base.BaseService;

@Service 
public class GastoService extends BaseService<GastoRepository, Gasto> {

    public GastoService(GastoRepository repository) {
        super(repository);
    }
    

}
