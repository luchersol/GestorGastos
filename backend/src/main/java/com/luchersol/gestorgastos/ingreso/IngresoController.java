package com.luchersol.gestorgastos.ingreso;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luchersol.gestorgastos.categoria.Categoria;
import com.luchersol.gestorgastos.categoria.CategoriaService;
import com.luchersol.gestorgastos.gasto.Gasto;
import com.luchersol.gestorgastos.movimiento.MovimientoDTO;
import com.luchersol.gestorgastos.shared.base.BaseController;
import com.luchersol.gestorgastos.shared.base.BaseControllerDTO;
import com.luchersol.gestorgastos.shared.exception.ResourceNotFoundException;

@RestController 
@RequestMapping("/api/ingresos")
public class IngresoController extends BaseControllerDTO<IngresoService, Ingreso, MovimientoDTO> {

    private CategoriaService categoriaService;

    protected IngresoController(IngresoService service, CategoriaService categoriaService) {
        super(service);
        this.categoriaService = categoriaService;
    }

    @Override
    protected Ingreso convertir(MovimientoDTO dto) {
        Ingreso ingreso = dto.toIngreso();
        Categoria categoria = categoriaService.obtenerPorId(dto.getCategoriaId())
            .orElseThrow(() -> new ResourceNotFoundException("Not found category by id: " + dto.getCategoriaId()));
        ingreso.setCategoria(categoria);
        return ingreso;
    }
    
}
