package com.luchersol.gestorgastos.movimiento;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.luchersol.gestorgastos.categoria.Categoria;
import com.luchersol.gestorgastos.categoria.CategoriaRepository;
import com.luchersol.gestorgastos.categoria.CategoriaService;
import com.luchersol.gestorgastos.categoria.TipoMovimiento;
import com.luchersol.gestorgastos.gasto.Gasto;
import com.luchersol.gestorgastos.ingreso.Ingreso;
import com.luchersol.gestorgastos.shared.base.BaseController;

@RestController
@RequestMapping("/api/movimientos")
public class MovimientoController extends BaseController<MovimientoService, Movimiento> {

    private final CategoriaService categoriaService;

    protected MovimientoController(MovimientoService service, CategoriaService categoriaService) {
        super(service);
        this.categoriaService = categoriaService;
    }

    @Override
    @GetMapping("/exportar")
    public ResponseEntity<String> exportar(
            @RequestParam(defaultValue = "movimientos.csv") String nombre) throws IOException {

        List<Movimiento> movimientos = service.obtenerTodos();

        List<MovimientoCSV> datos = movimientos.stream()
                .map(movimiento -> {
                    MovimientoCSV dto = new MovimientoCSV();

                    dto.setConcepto(movimiento.getConcepto());
                    dto.setImporte(movimiento.getImporte());
                    dto.setFecha(movimiento.getFecha());
                    dto.setDescripcion(movimiento.getDescripcion());
                    dto.setCategoria(movimiento.getCategoria().getNombre());

                    return dto;
                })
                .toList();

        String csv = csvService.toCsv(datos, MovimientoCSV.class);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"%s\"".formatted(nombre))
                .contentType(
                        new MediaType("text", "csv", StandardCharsets.UTF_8))
                .body("\uFEFF" + csv);
    }

    @Override
    @PostMapping(value = "/importar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> importar(@RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String contenido = new String(file.getBytes(), StandardCharsets.UTF_8);

        List<MovimientoCSV> datos = csvService.fromCsv(
                contenido,
                MovimientoCSV.class);

        Map<String, Categoria> dictCategorias = categoriaService.obtenerClasificadoPorNombre();

        List<Movimiento> movimientos = datos.stream()
                .map(dto -> {
                    Categoria categoria = dictCategorias.getOrDefault(dto.getCategoria(), null);

                    if(categoria == null) {
                        throw new IllegalArgumentException("No existe la categoría: " + dto.getCategoria());
                    }

                    Movimiento movimiento = categoria.getTipo() == TipoMovimiento.GASTO ?
                        new Gasto():
                        new Ingreso();
                    
                    movimiento.setConcepto(dto.getConcepto());
                    movimiento.setImporte(dto.getImporte());
                    movimiento.setFecha(dto.getFecha());
                    movimiento.setDescripcion(dto.getDescripcion());
                    movimiento.setCategoria(categoria);

                    return movimiento;
                })
                .toList();

        service.guardar(movimientos);

        return ResponseEntity.ok().build();
    }
}
