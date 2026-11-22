package com.luchersol.gestorgastos.shared.base;

import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.luchersol.gestorgastos.shared.mapper.CsvService;


public abstract class BaseController<
        S extends BaseService<?, T>, 
        T extends BaseEntity> {

    protected final S service;
    protected final Class<T> entityType;

    @Autowired 
    protected CsvService csvService;

    @SuppressWarnings("unchecked")
    protected BaseController(S service) {
        this.service = service;

        this.entityType = (Class<T>) (
            (ParameterizedType) getClass()
                .getGenericSuperclass()
        ).getActualTypeArguments()[1];
    }

    @PostMapping
    public ResponseEntity<T> guardar(@RequestBody T entity) {
        return ResponseEntity.ok(service.guardar(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<T> actualizar(@PathVariable Long id, @RequestBody T entity) {
        return ResponseEntity.ok(service.actualizar(id, entity));
    }

    @GetMapping
    public ResponseEntity<List<T>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping ("/{id}")
    public ResponseEntity<T> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exportar")
    public ResponseEntity<String> exportar(@RequestParam(defaultValue = "exportacion") String nombre) throws IOException {

        List<T> datos = service.obtenerTodos();
        String csv = csvService.toCsv(datos, this.entityType);

        return ResponseEntity.ok()
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"%s\"".formatted(nombre)
                )
                .contentType(
                    new MediaType("text", "csv", StandardCharsets.UTF_8)
                )
                .body("\uFEFF" + csv);
    }

    @PostMapping(
        value = "/importar",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Void> importar(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty())
            return ResponseEntity.badRequest().build();

        String contenido = new String(file.getBytes(), StandardCharsets.UTF_8);
        List<T> datos = csvService.fromCsv(contenido, this.entityType);

        service.guardar(datos);

        return ResponseEntity.ok().build();
    }
}
