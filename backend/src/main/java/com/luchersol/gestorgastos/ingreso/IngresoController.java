package com.luchersol.gestorgastos.ingreso;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luchersol.gestorgastos.categoria.Categoria;
import com.luchersol.gestorgastos.categoria.CategoriaService;
import com.luchersol.gestorgastos.dto.MovimientoDTO;
import com.luchersol.gestorgastos.gasto.Gasto;
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
    protected Ingreso convertirToSave(MovimientoDTO dto) {
        Ingreso ingreso = dto.toIngreso();
        Categoria categoria = categoriaService.obtenerPorId(dto.getCategoriaId());
        ingreso.setCategoria(categoria);
        return ingreso;
    }

    @Override
    protected Ingreso convertirToUpdate(Long id, MovimientoDTO dto) {
        Ingreso ingreso = service.obtenerPorId(id);
        Categoria categoria = categoriaService.obtenerPorId(dto.getCategoriaId());

        ingreso.setConcepto(dto.getConcepto());
        ingreso.setImporte(dto.getImporte());
        ingreso.setFecha(dto.getFecha());
        ingreso.setDescripcion(dto.getDescripcion());
        ingreso.setCategoria(categoria);

        return service.actualizar(id, ingreso);
    }
    
}
