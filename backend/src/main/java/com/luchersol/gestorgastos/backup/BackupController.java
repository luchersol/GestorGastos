package com.luchersol.gestorgastos.backup;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.luchersol.gestorgastos.dto.BackupDTO;

import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/backups")
@RequiredArgsConstructor
public class BackupController {

    private final BackupService backupService;

    @GetMapping 
    public ResponseEntity<List<BackupDTO>> obtenerBackups() {
        return ResponseEntity.ok(
                backupService.obtenerBackups()
        );
    }

    @PostMapping 
    public ResponseEntity<BackupDTO> crearBackup() {
        BackupDTO backup = backupService.crearBackup(TipoBackup.DIARIO);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(backup);
    }

    @GetMapping("/{nombre}/validar")
    public ResponseEntity<Boolean> comprobarIntegridad(@PathVariable String nombre) {
        return ResponseEntity.ok(
                backupService.comprobarIntegridad(nombre)
        );
    }

    @DeleteMapping("/{nombre}")
    public ResponseEntity<Void> eliminarBackup(@PathVariable String nombre) {
        backupService.eliminarBackup(nombre);
        return ResponseEntity.noContent().build();
    }

}
