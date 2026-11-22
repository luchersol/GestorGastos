package com.luchersol.gestorgastos.movimiento;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.luchersol.gestorgastos.categoria.Categoria;
import com.luchersol.gestorgastos.gasto.Gasto;
import com.luchersol.gestorgastos.ingreso.Ingreso;
import com.luchersol.gestorgastos.shared.base.Actualizable;
import com.luchersol.gestorgastos.shared.base.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Movimiento extends BaseEntity {

    @Column (nullable = false) 
    protected String concepto;

    @Column(nullable = false, precision = 12, scale = 2)
    protected BigDecimal importe;

    @Column(nullable = false)
    protected LocalDate fecha;

    protected String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    protected Categoria categoria;

    @Override
    protected <T> void actualizar(T otro) {
        Movimiento nuevoDato;
        if(otro instanceof Gasto) {
            nuevoDato = (Gasto) otro;
        } else if(otro instanceof Ingreso) {
            nuevoDato = (Ingreso) otro;
        } else {
            nuevoDato = (Movimiento) otro;
        }
        this.categoria = nuevoDato.getCategoria();
        this.concepto = nuevoDato.getConcepto();
        this.descripcion = nuevoDato.getDescripcion();
        this.fecha = nuevoDato.getFecha();
        this.importe = nuevoDato.getImporte();
    }

}
