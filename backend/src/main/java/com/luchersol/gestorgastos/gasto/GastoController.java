package com.luchersol.gestorgastos.gasto;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luchersol.gestorgastos.categoria.Categoria;
import com.luchersol.gestorgastos.categoria.CategoriaService;
import com.luchersol.gestorgastos.movimiento.MovimientoDTO;
import com.luchersol.gestorgastos.shared.base.BaseController;
import com.luchersol.gestorgastos.shared.base.BaseControllerDTO;
import com.luchersol.gestorgastos.shared.exception.ResourceNotFoundException;

@RestController 
@RequestMapping("/api/gastos")
public class GastoController extends BaseControllerDTO<GastoService, Gasto, MovimientoDTO> {

    private final CategoriaService categoriaService;

    public GastoController(GastoService service, CategoriaService categoriaService) {
        super(service);
        this.categoriaService = categoriaService;
    }

    @Override
    protected Gasto convertir(MovimientoDTO dto) {
        Gasto gasto = dto.toGasto();
        Categoria categoria = categoriaService.obtenerPorId(dto.getCategoriaId())
            .orElseThrow(() -> new ResourceNotFoundException("Not found category by id: " + dto.getCategoriaId()));
        gasto.setCategoria(categoria);
        return gasto;
    }
    
}
