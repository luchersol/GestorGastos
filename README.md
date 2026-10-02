# Gestor de Gastos

Aplicación de escritorio en Python para gestionar gastos almacenados en Google Sheets.

## Funciones

- Añadir, editar y eliminar gastos.
- Seleccionar conceptos desde la hoja `Configuración`.
- Resumen mensual para 2026 y 2027.
- Filtro por concepto.
- Configuración de Google Sheets desde la propia aplicación.
- Importación de credenciales JSON desde la interfaz.
- La URL del Google Sheet se guarda localmente y solo es necesario introducirla una vez.
- Preparado para generar un `.exe` con PyInstaller.

## 1. Requisitos para ejecutar desde código

- Python 3.10 o superior.
- Una cuenta de Google.
- Un Google Sheet con las hojas `Gastos`, `Resumen` y `Configuración`.

Instala las dependencias:

```bash
pip install -r requirements.txt
```

Ejecuta:

```bash
python main.py
```

## 2. Crear las credenciales de Google

Entra en Google Cloud Console:

https://console.cloud.google.com/

### Crear proyecto

Crea un proyecto nuevo, por ejemplo `GestorGastos`.

### Activar APIs

En **APIs y servicios → Biblioteca**, activa:

- Google Sheets API
- Google Drive API

### Crear cuenta de servicio

Ve a **IAM y administración → Cuentas de servicio** y crea una cuenta de servicio.

Después entra en la cuenta creada:

**Claves → Agregar clave → Crear clave nueva → JSON**

Google descargará un archivo JSON. No lo publiques ni lo subas a GitHub.

## 3. Compartir el Google Sheet

El JSON contiene una dirección parecida a:

```text
gestor-gastos@mi-proyecto.iam.gserviceaccount.com
```

Comparte tu Google Sheet con esa dirección y dale permiso de **Editor**.

No es necesario hacer público el documento.

## 4. Estructura del Google Sheet

Debe haber tres hojas exactamente:

```text
Gastos
Resumen
Configuración
```

### Gastos

La primera fila debe contener:

| Fecha | Compra | Concepto | Valor |
|---|---|---|---|
| 01/10/2026 | Mercadona | Alimentación | 25,50 |

### Configuración

Debe existir una columna:

```text
Conceptos
```

Por ejemplo:

| Conceptos |
|---|
| Alimentación |
| Ocio |
| Transporte |
| Vivienda |

### Resumen

La aplicación utiliza esta hoja como parte de la estructura del documento. El resumen mostrado por la aplicación se calcula a partir de `Gastos`.

## 5. Configurar la aplicación

Abre la aplicación y entra en:

**⚙ Ajustes**

Introduce la URL del Google Sheet y selecciona el JSON descargado de Google Cloud.

La aplicación validará el JSON y copiará las credenciales a una carpeta privada del usuario.

Después de guardar correctamente la configuración, la URL queda almacenada localmente. En las siguientes ejecuciones no será necesario introducirla de nuevo.

## 6. ¿Dónde se guardan las credenciales?

En Windows:

```text
%LOCALAPPDATA%\GestorGastos\
```

Normalmente será:

```text
C:\Users\TU_USUARIO\AppData\Local\GestorGastos\
```

Dentro se guardan:

```text
credentials.json
config.json
```

`credentials.json` contiene la clave privada de la cuenta de servicio, por lo que debe mantenerse privada.

`config.json` contiene la URL del Google Sheet.

La aplicación **no guarda estos archivos junto al `.exe`**.

## 7. Generar el `.exe`

Instala PyInstaller:

```bash
pip install pyinstaller
```

Genera el ejecutable:

```bash
pyinstaller --onefile --windowed --name GestorGastos main.py
```

El ejecutable aparecerá en:

```text
dist/GestorGastos.exe
```

Puedes distribuir ese archivo. El usuario tendrá que configurar sus propias credenciales y su propio Google Sheet.

## 8. Seguridad

No incluyas nunca en Git:

- `credentials.json`
- claves privadas
- credenciales de Google
- configuraciones privadas

El `.gitignore` del proyecto ya excluye los archivos sensibles.

La cuenta de servicio solo debería tener acceso al Google Sheet que el usuario haya compartido expresamente con ella.

## 9. Solución de problemas

### `ModuleNotFoundError: No module named 'services'`

Ejecuta la aplicación desde la raíz:

```bash
python main.py
```

No ejecutes directamente:

```bash
python ui/app.py
```

### No se puede conectar con Google Sheets

Comprueba:

1. Google Sheets API está habilitada.
2. Google Drive API está habilitada.
3. El JSON corresponde a una cuenta de servicio.
4. El Sheet está compartido con `client_email` del JSON.
5. El permiso de la cuenta de servicio es `Editor`.
6. Las hojas se llaman exactamente `Gastos`, `Resumen` y `Configuración`.

### Los importes dan error

Se aceptan formatos como:

```text
2,85
2,85 €
10.50
1.234,56 €
```

## Licencia

Añade aquí la licencia que quieras utilizar para el proyecto.
