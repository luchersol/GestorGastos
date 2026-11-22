package com.luchersol.gestorgastos.dto;

import java.time.LocalDateTime;

import com.luchersol.gestorgastos.backup.TipoBackup;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor 
@NoArgsConstructor 
@Getter 
@Setter 
public class BackupDTO {

    private String nombre;
    private LocalDateTime fecha;
    private long tamano;
    private boolean valido;
    private TipoBackup tipo;

}