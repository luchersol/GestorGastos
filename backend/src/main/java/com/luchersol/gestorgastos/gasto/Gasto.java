package com.luchersol.gestorgastos.gasto;

import com.luchersol.gestorgastos.ingreso.Ingreso;
import com.luchersol.gestorgastos.movimiento.Movimiento;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity 
@Table(name = "gastos")
@Getter 
@Setter 
public final class Gasto extends Movimiento {

}
