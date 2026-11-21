package com.luchersol.gestorgastos.ingreso;

import com.luchersol.gestorgastos.movimiento.Movimiento;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;


@Entity 
@Table(name = "ingresos")
public final class Ingreso extends Movimiento {

}
