package com.luchersol.gestorgastos.backup;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.luchersol.gestorgastos.dto.BackupDTO;
import com.luchersol.gestorgastos.shared.config.BackupProperties;
import com.luchersol.gestorgastos.shared.exception.BackupException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BackupServiceImpl implements BackupService {

    private final DataSource dataSource;
    private final BackupProperties properties;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss-SSS");

    private static final String PREFIX = "backup_";
    private static final String EXTENSION = ".db";
    private static final String NAME_BACKUP_REGEX = "^backup_\\d{4}-\\d{2}-\\d{2}_\\d{2}-\\d{2}-\\d{2}-\\d{3}\\.db$";

    private Path obtenerDirectorio(TipoBackup tipo) {
        String carpeta = switch (tipo) {
            case DIARIO -> "diarias";
            case SEMANAL -> "semanales";
            case MENSUAL -> "mensuales";
        };

        return obtenerDirectorio().resolve(carpeta);
    }

    private Path obtenerDirectorio() {

        return Paths.get(properties.getDirectory())
                .toAbsolutePath()
                .normalize();
    }

    // ==========================================
    // CREAR BACKUP
    // ==========================================

    @Override
    public BackupDTO crearBackup(TipoBackup tipo) {

        try {

            Path directorio = obtenerDirectorio(tipo);
            Files.createDirectories(directorio);

            String nombre = PREFIX
                    + LocalDateTime.now().format(FORMATTER)
                    + EXTENSION;

            Path destino = directorio.resolve(nombre);
            String rutaSQL = destino.toString()
                    .replace("'", "''");

            try (Connection conexion = dataSource.getConnection();
                    Statement sentencia = conexion.createStatement()) {

                if (!conexion.getAutoCommit()) {
                    throw new BackupException(
                            "No se puede crear un backup dentro de una transacción.");
                }

                sentencia.execute("VACUUM INTO '" + rutaSQL + "'");
            }

            if (!comprobarIntegridad(nombre)) {
                Files.deleteIfExists(destino);
                throw new BackupException(
                        "La copia de seguridad no ha superado la comprobación de integridad.");
            }

            return obtenerDTO(destino);
        } catch (BackupException e) {
            throw e;
        } catch (Exception e) {
            throw new BackupException(
                    "Error al crear la copia de seguridad.", e);
        }
    }

    // ==========================================
    // OBTENER BACKUPS
    // ==========================================

    @Override
    public List<BackupDTO> obtenerBackups() {
        Path directorio = obtenerDirectorio();

        if (!Files.exists(directorio)) return Collections.emptyList();

        try (Stream<Path> archivos = Files.walk(directorio)) {
            return archivos
                    .filter(Files::isRegularFile)
                    .filter(this::esBackupValido)
                    .map(this::obtenerDTO)
                    .sorted(Comparator.comparing(BackupDTO::getFecha).reversed())
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new BackupException(
                "No se pudieron recuperar las copias de seguridad.", e);
        }
    }

    // ==========================================
    // ELIMINAR BACKUP
    // ==========================================

    @Override
    public void eliminarBackup(String nombre) {

        Path archivo = obtenerRutaBackup(nombre);

        try {

            if (!Files.exists(archivo)) {
                throw new BackupException(
                        "La copia de seguridad no existe.");
            }

            Files.delete(archivo);

        } catch (IOException e) {

            throw new BackupException(
                    "No se pudo eliminar la copia de seguridad.", e);
        }
    }

    // ==========================================
    // COMPROBAR INTEGRIDAD
    // ==========================================

    @Override
    public boolean comprobarIntegridad(String nombre) {
        Path archivo = obtenerRutaBackup(nombre);
        return comprobarIntegridad(archivo);
    }

    private boolean comprobarIntegridad(Path archivo) {
        if (archivo == null || !Files.isRegularFile(archivo)) return false;

        String url = "jdbc:sqlite:" + archivo.toAbsolutePath().normalize();

        try (Connection conexion = DriverManager.getConnection(url);
              Statement sentencia = conexion.createStatement();
              ResultSet resultado = sentencia.executeQuery("PRAGMA integrity_check")) {

            return resultado.next()
                    && "ok".equalsIgnoreCase(resultado.getString(1));
        } catch (SQLException e) {
            return false;
        }
    }

    // ==========================================
    // LIMPIAR BACKUPS ANTIGUOS
    // ==========================================

    @Override
    public void limpiarBackupsAntiguos() {
        limpiarDirectorio(TipoBackup.DIARIO, properties.getDailyRetention());

        limpiarDirectorio(TipoBackup.SEMANAL, properties.getWeeklyRetention());

        limpiarDirectorio(TipoBackup.MENSUAL, properties.getMonthlyRetention());
    }

    private void limpiarDirectorio(TipoBackup tipo, int limite) {
        Path directorio = obtenerDirectorio(tipo);

        if (!Files.exists(directorio))
            return;

        try (Stream<Path> archivos = Files.list(directorio)) {

            List<Path> backups = archivos
                    .filter(Files::isRegularFile)
                    .filter(this::esBackupValido)
                    .sorted(Comparator.comparing(this::obtenerFechaArchivo).reversed())
                    .collect(Collectors.toList());

            for (int i = limite; i < backups.size(); i++) {
                try {
                    Files.deleteIfExists(backups.get(i));
                } catch (IOException e) {
                    throw new BackupException(
                            "No se pudo eliminar el backup antiguo: " + backups.get(i).getFileName(), e);
                }
            }
        } catch (IOException e) {
            throw new BackupException(
                    "No se pudieron recuperar los backups para su limpieza.", e);
        }
    }

    // ==========================================
    // OBTENER BACKUPS SEGÚN RETENCIÓN
    // ==========================================

    private List<Path> obtenerRetenidos(List<Path> backups, int tipo) {

        int limite = switch (tipo) {
            case 0 -> properties.getDailyRetention();
            case 1 -> properties.getWeeklyRetention();
            case 2 -> properties.getMonthlyRetention();
            default -> 0;
        };

        Set<String> periodos = new HashSet<>();
        List<Path> retenidos = new ArrayList<>();

        for (Path backup : backups) {

            LocalDateTime fecha = obtenerFechaArchivo(backup);

            String periodo = switch (tipo) {

                case 0 -> fecha.toLocalDate().toString();

                case 1 -> fecha.getYear()
                        + "-W"
                        + fecha.get(java.time.temporal.WeekFields.ISO.weekOfWeekBasedYear());

                case 2 -> fecha.getYear()
                        + "-"
                        + fecha.getMonthValue();

                default -> "";
            };

            if (!periodos.contains(periodo)) {
                if (periodos.size() >= limite)
                    break;

                periodos.add(periodo);
                retenidos.add(backup);
            }
        }

        return retenidos;
    }

    // ==========================================
    // OBTENER INFORMACIÓN DEL BACKUP
    // ==========================================

    private BackupDTO obtenerDTO(Path archivo) {

        try {

            String nombre = archivo.getFileName().toString();

            return new BackupDTO(
                    nombre,
                    obtenerFechaArchivo(archivo),
                    Files.size(archivo),
                    comprobarIntegridad(nombre),
                    obtenerTipoBackup(archivo));

        } catch (IOException e) {

            throw new BackupException(
                    "No se pudo obtener la información del backup.", e);
        }
    }

    private TipoBackup obtenerTipoBackup(Path archivo) {
        String carpeta = archivo.getParent()
                .getFileName()
                .toString();

        return switch (carpeta) {
            case "diarias" -> TipoBackup.DIARIO;
            case "semanales" -> TipoBackup.SEMANAL;
            case "mensuales" -> TipoBackup.MENSUAL;
            default -> throw new BackupException(
                    "Tipo de copia de seguridad no válido.");
        };
    }

    // ==========================================
    // VALIDAR NOMBRE DEL ARCHIVO
    // ==========================================

    private boolean esBackupValido(Path archivo) {
        String nombre = archivo.getFileName().toString();
        return nombre.matches(NAME_BACKUP_REGEX);
    }

    private Path obtenerRutaBackup(String nombre) {

        if (nombre == null || !nombre.matches(NAME_BACKUP_REGEX)) {
            throw new BackupException(
                    "Nombre de copia de seguridad no válido.");
        }

        for (TipoBackup tipo : TipoBackup.values()) {

            Path carpeta = obtenerDirectorio(tipo);
            Path archivo = carpeta.resolve(nombre).normalize();

            if (archivo.getParent().equals(carpeta) && Files.exists(archivo)) {
                return archivo;
            }
        }

        throw new BackupException("No se ha encontrado la copia de seguridad.");
    }

    // ==========================================
    // RECUPERAR FECHA DEL NOMBRE
    // ==========================================

    private LocalDateTime obtenerFechaArchivo(Path archivo) {
        String nombre = archivo.getFileName().toString();
        String fecha = nombre.substring(
                PREFIX.length(),
                nombre.length() - EXTENSION.length()
        );
        return LocalDateTime.parse(fecha, FORMATTER);
    }
}
