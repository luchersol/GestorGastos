package com.luchersol.gestorgastos.backup;

import java.util.List;

import com.luchersol.gestorgastos.dto.BackupDTO;

public interface  BackupService {

    BackupDTO crearBackup(TipoBackup tipo);
    List<BackupDTO> obtenerBackups();
    void eliminarBackup(String nombre);
    boolean comprobarIntegridad(String nombre);
    void limpiarBackupsAntiguos();

}
