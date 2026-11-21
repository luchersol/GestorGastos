package com.luchersol.gestorgastos.gasto;

import com.luchersol.gestorgastos.shared.base.Movimiento;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity 
@Table(name = "gastos")
public class Gasto extends Movimiento {

}
