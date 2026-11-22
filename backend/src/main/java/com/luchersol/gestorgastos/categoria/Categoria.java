package com.luchersol.gestorgastos.categoria;

import com.luchersol.gestorgastos.shared.base.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity 
@Table (
    name = "categorias",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"nombre", "tipo"})
    }
)
@Getter 
@Setter 
public class Categoria extends BaseEntity {

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(length = 7)
    private String color;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMovimiento tipo;

    @Column(nullable = false)
    private Boolean activa = true;

    @Override
    protected <T> void actualizar(T otro) {
        if(otro instanceof Categoria) {
            Categoria nuevoDato = (Categoria) otro;
            this.nombre = nuevoDato.nombre;
            this.descripcion = nuevoDato.descripcion;
            this.color = nuevoDato.color;
            // El tipo de una categoría debe ser inmodificable
            this.activa = nuevoDato.activa; 
        }
    }

}
