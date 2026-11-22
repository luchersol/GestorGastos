package com.luchersol.gestorgastos.movimiento;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.luchersol.gestorgastos.categoria.Categoria;

import lombok.Getter;
import lombok.Setter;


@Getter 
@Setter 
public class MovimientoCSV {
    
    private String concepto;
    private BigDecimal importe;
    private LocalDate fecha;
    private String descripcion;
    private String categoria;

}
