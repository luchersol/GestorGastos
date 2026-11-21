package com.luchersol.gestorgastos.ingreso;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/ingresos")
@RequiredArgsConstructor 
public class IngresoController {
    
    private final IngresoService service;
}
