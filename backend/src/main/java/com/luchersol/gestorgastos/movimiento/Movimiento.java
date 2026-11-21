package com.luchersol.gestorgastos.movimiento;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.luchersol.gestorgastos.categoria.Categoria;
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
    private String concepto;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal importe;

    @Column(nullable = false)
    private LocalDate fecha;

    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

}
