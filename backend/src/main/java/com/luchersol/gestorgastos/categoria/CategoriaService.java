package com.luchersol.gestorgastos.categoria;

import org.springframework.stereotype.Service;

import com.luchersol.gestorgastos.shared.base.BaseService;

@Service 
public class CategoriaService extends BaseService<CategoriaRepository, Categoria> {

    public CategoriaService(CategoriaRepository repository) {
        super(repository);
    }
    

}
