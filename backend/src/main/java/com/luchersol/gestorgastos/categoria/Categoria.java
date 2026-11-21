package com.luchersol.gestorgastos.categoria;

import com.luchersol.gestorgastos.shared.base.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity 
@Table (
    name = "categorias",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"nombre", "tipo"})
    }
)
public class Categoria extends BaseEntity {

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(length = 7)
    private String color;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoCategoria tipo;

    @Column(nullable = false)
    private Boolean activa = true;

}
