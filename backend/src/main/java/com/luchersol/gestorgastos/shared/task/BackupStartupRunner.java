package com.luchersol.gestorgastos.shared.task;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.luchersol.gestorgastos.backup.BackupService;
import com.luchersol.gestorgastos.backup.TipoBackup;
import com.luchersol.gestorgastos.dto.BackupDTO;

import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor 
public class BackupStartupRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(BackupStartupRunner.class);

    private final BackupService backupService;


    @Override
    public void run(ApplicationArguments args) {

        try {
            log.info("Comprobando estado de las copias de seguridad...");
            List<BackupDTO> backups = backupService.obtenerBackups();

            if (backups.isEmpty()) {
                log.info("No existen backups. Creando primera copia...");
                backupService.crearBackup(TipoBackup.DIARIO);
                return;
            }

            BackupDTO ultimoBackup = backups.get(0);
            LocalDateTime fechaLimite = LocalDateTime.now().minusHours(24);

            if (ultimoBackup.getFecha().isBefore(fechaLimite)) {
                log.info("La última copia tiene más de 24 horas. Creando una nueva...");
                backupService.crearBackup(TipoBackup.DIARIO);
            } else {
                log.info("Existe una copia reciente. No es necesario crear otra.");
            }

        } catch (Exception e) {
            log.error("No se pudo comprobar o crear el backup de inicio.", e);
        }
    }
}