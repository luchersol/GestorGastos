package com.luchersol.gestorgastos.movimiento;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.function.Supplier;

import com.luchersol.gestorgastos.gasto.Gasto;
import com.luchersol.gestorgastos.ingreso.Ingreso;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class MovimientoDTO {

    private String concepto;
    private BigDecimal importe;
    private LocalDate fecha;
    private String descripcion;
    private Long categoriaId;

    public Gasto toGasto() {
        return toMovimiento(Gasto::new);
    }

    public Ingreso toIngreso() {
        return toMovimiento(Ingreso::new);
    }

    private <T extends Movimiento> T toMovimiento(Supplier<T> constructor) {
        T movimiento = constructor.get();

        movimiento.setConcepto(concepto);
        movimiento.setImporte(importe);
        movimiento.setFecha(fecha);
        movimiento.setDescripcion(descripcion);

        return movimiento;
    }
}
