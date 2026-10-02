import json
import os
import shutil
from pathlib import Path


class CredentialManager:
    """Gestiona las credenciales y configuración local del usuario."""

    def __init__(self, app_name="GestorGastos"):
        local_app_data = os.environ.get("LOCALAPPDATA")
        if local_app_data:
            self.app_data_dir = Path(local_app_data) / app_name
        else:
            self.app_data_dir = Path.home() / f".{app_name}"

        self.app_data_dir.mkdir(parents=True, exist_ok=True)
        self.credentials_file = self.app_data_dir / "credentials.json"
        self.config_file = self.app_data_dir / "config.json"

    def exists(self):
        return self.credentials_file.exists()

    def get_path(self):
        return self.credentials_file

    def load_config(self):
        if not self.config_file.exists():
            return {}
        try:
            return json.loads(self.config_file.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return {}

    def save_config(self, data):
        self.config_file.write_text(
            json.dumps(data, indent=4, ensure_ascii=False),
            encoding="utf-8",
        )

    def validate_file(self, source_path):
        source_path = Path(source_path)
        if not source_path.exists():
            return False, "El archivo seleccionado no existe."
        if source_path.suffix.lower() != ".json":
            return False, "El archivo seleccionado no es un JSON."

        try:
            data = json.loads(source_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return False, "El archivo no contiene un JSON válido."
        except OSError as exc:
            return False, f"No se pudo leer el archivo:\n{exc}"

        required = ("type", "project_id", "private_key", "client_email")
        missing = [field for field in required if field not in data]
        if missing:
            return False, (
                "No parece ser una credencial válida de una cuenta de servicio.\n\n"
                "Faltan:\n" + "\n".join(f"• {field}" for field in missing)
            )

        if data.get("type") != "service_account":
            return False, "El JSON no corresponde a una cuenta de servicio de Google."

        return True, data

    def import_credentials(self, source_path):
        valid, result = self.validate_file(source_path)
        if not valid:
            return False, result

        try:
            shutil.copy2(source_path, self.credentials_file)
            return True, "Credenciales importadas correctamente."
        except OSError as exc:
            return False, f"No se pudieron guardar las credenciales:\n{exc}"

    def delete_credentials(self):
        try:
            if self.credentials_file.exists():
                self.credentials_file.unlink()
            return True
        except OSError:
            return False

    def get_client_email(self):
        if not self.exists():
            return None
        try:
            data = json.loads(self.credentials_file.read_text(encoding="utf-8"))
            return data.get("client_email")
        except (OSError, json.JSONDecodeError):
            return None
