package com.luchersol.gestorgastos.shared.task;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.luchersol.gestorgastos.backup.BackupService;
import com.luchersol.gestorgastos.backup.TipoBackup;

import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class BackupScheduler {

    private static final Logger log = LoggerFactory.getLogger(BackupScheduler.class);

    private final BackupService backupService;

    // Backup diario: todos los días a las 03:00
    @Scheduled(cron = "0 0 3 * * *")
    public void backupDiario() {
        ejecutarBackup(TipoBackup.DIARIO);
    }

    // Backup semanal: todos los lunes a las 03:00
    @Scheduled(cron = "0 0 3 * * MON")
    public void backupSemanal() {
        ejecutarBackup(TipoBackup.SEMANAL);
    }

    // Backup mensual: el día 1 de cada mes a las 03:00
    @Scheduled(cron = "0 0 3 1 * *")
    public void backupMensual() {
        ejecutarBackup(TipoBackup.MENSUAL);
    }

    private void ejecutarBackup(TipoBackup tipo) {

        try {
            log.info("Iniciando backup {}...", tipo);
            backupService.crearBackup(tipo);
            log.info("Backup {} creado correctamente.", tipo);
            backupService.limpiarBackupsAntiguos();
            log.info("Limpieza de backups antiguos completada.");
        } catch (Exception e) {
            log.error(
                "Error durante la ejecución del backup {}.",
                tipo, e
            );
        }
    }
}
