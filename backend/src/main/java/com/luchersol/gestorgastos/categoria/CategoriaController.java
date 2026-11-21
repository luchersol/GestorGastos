package com.luchersol.gestorgastos.categoria;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luchersol.gestorgastos.shared.base.BaseController;


@RestController 
@RequestMapping("/api/categorias")
public class CategoriaController extends BaseController<CategoriaService, Categoria> {

    public CategoriaController(CategoriaService service) {
        super(service);
    }

}
