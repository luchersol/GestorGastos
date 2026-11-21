package com.luchersol.gestorgastos.ingreso;

import com.luchersol.gestorgastos.shared.base.Movimiento;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity 
@Table(name = "ingresos")
public class Ingreso extends Movimiento {

}
