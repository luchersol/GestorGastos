package com.luchersol.gestorgastos.gasto;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luchersol.gestorgastos.categoria.Categoria;
import com.luchersol.gestorgastos.categoria.CategoriaService;
import com.luchersol.gestorgastos.dto.MovimientoDTO;
import com.luchersol.gestorgastos.shared.base.BaseController;
import com.luchersol.gestorgastos.shared.base.BaseControllerDTO;
import com.luchersol.gestorgastos.shared.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@RestController 
@RequestMapping("/api/gastos")
public class GastoController extends BaseControllerDTO<GastoService, Gasto, MovimientoDTO> {

    private final CategoriaService categoriaService;

    public GastoController(GastoService service, CategoriaService categoriaService) {
        super(service);
        this.categoriaService = categoriaService;
    }

    @Override
    protected Gasto convertirToSave(MovimientoDTO dto) {
        Gasto gasto = dto.toGasto();
        Categoria categoria = categoriaService.obtenerPorId(dto.getCategoriaId());
        gasto.setCategoria(categoria);
        return gasto;
    }
    

    @Override
    protected Gasto convertirToUpdate(Long id, MovimientoDTO dto) {
        Gasto gasto = service.obtenerPorId(id);
        Categoria categoria = categoriaService.obtenerPorId(dto.getCategoriaId());

        gasto.setConcepto(dto.getConcepto());
        gasto.setImporte(dto.getImporte());
        gasto.setFecha(dto.getFecha());
        gasto.setDescripcion(dto.getDescripcion());
        gasto.setCategoria(categoria);

        return service.actualizar(id, gasto);
    }
}
