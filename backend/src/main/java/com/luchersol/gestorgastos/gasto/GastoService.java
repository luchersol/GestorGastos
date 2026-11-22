package com.luchersol.gestorgastos.gasto;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.luchersol.gestorgastos.categoria.Categoria;
import com.luchersol.gestorgastos.categoria.CategoriaRepository;
import com.luchersol.gestorgastos.dto.GastoDTO;
import com.luchersol.gestorgastos.shared.base.BaseService;


@Service 
public class GastoService extends BaseService<GastoRepository, Gasto> {


    public GastoService(GastoRepository repository, CategoriaRepository categoriaRepository) {
        super(repository);
    }

}
