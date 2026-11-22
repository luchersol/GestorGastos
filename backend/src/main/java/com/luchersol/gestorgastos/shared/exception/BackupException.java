package com.luchersol.gestorgastos.shared.exception;

public class BackupException extends RuntimeException {

    public BackupException(String mensaje) {
        super(mensaje);
    }

    public BackupException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
