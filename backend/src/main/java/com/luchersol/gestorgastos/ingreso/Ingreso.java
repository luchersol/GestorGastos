package com.luchersol.gestorgastos.ingreso;

import com.luchersol.gestorgastos.movimiento.Movimiento;
import com.luchersol.gestorgastos.shared.base.Actualizable;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;


@Entity 
@Table(name = "ingresos")
public final class Ingreso extends Movimiento {

}
