import tkinter as tk
from tkinter import ttk, messagebox, filedialog


class SettingsDialog(tk.Toplevel):
    def __init__(self, parent, current_url, credential_manager):
        super().__init__(parent)
        self.title("Ajustes")
        self.geometry("720x500")
        self.resizable(False, False)
        self.result = None
        self.credential_manager = credential_manager
        self.transient(parent)
        self.grab_set()

        frame = ttk.Frame(self, padding=32)
        frame.pack(fill="both", expand=True)

        ttk.Label(frame, text="Ajustes", style="Title.TLabel").pack(anchor="w")
        ttk.Label(
            frame,
            text="Configura una vez tu Google Sheet y las credenciales.",
            style="Subtitle.TLabel",
        ).pack(anchor="w", pady=(3, 28))

        ttk.Label(frame, text="Google Sheets", style="Section.TLabel").pack(anchor="w")
        ttk.Label(frame, text="URL del Google Sheet").pack(anchor="w", pady=(12, 5))

        self.url = ttk.Entry(frame)
        self.url.pack(fill="x", ipady=5)
        self.url.insert(0, current_url)

        ttk.Label(
            frame,
            text="La URL se guarda localmente para no tener que introducirla de nuevo.",
            style="Hint.TLabel",
        ).pack(anchor="w", pady=(6, 25))

        ttk.Label(frame, text="Credenciales de Google", style="Section.TLabel").pack(anchor="w")
        status = "✓ Credenciales configuradas" if credential_manager.exists() else "⚠ Credenciales no configuradas"

        self.status = ttk.Label(
            frame,
            text=status,
            style="Success.TLabel" if credential_manager.exists() else "Warning.TLabel",
        )
        self.status.pack(anchor="w", pady=(10, 8))

        buttons = ttk.Frame(frame)
        buttons.pack(fill="x")

        ttk.Button(
            buttons,
            text="Seleccionar archivo JSON…",
            command=self.select_credentials,
        ).pack(side="left")

        ttk.Button(
            buttons,
            text="Eliminar credenciales",
            command=self.delete_credentials,
        ).pack(side="left", padx=10)

        ttk.Label(
            frame,
            text="El archivo se copia a AppData\\Local\\GestorGastos y no se guarda junto al .exe.",
            style="Hint.TLabel",
            wraplength=620,
        ).pack(anchor="w", pady=(12, 0))

        bottom = ttk.Frame(frame)
        bottom.pack(side="bottom", fill="x", pady=(25, 0))

        ttk.Button(bottom, text="Cancelar", command=self.destroy).pack(side="right", padx=(8, 0))
        ttk.Button(bottom, text="Guardar y conectar", command=self.save).pack(side="right")

    def select_credentials(self):
        path = filedialog.askopenfilename(
            parent=self,
            title="Seleccionar credenciales de Google",
            filetypes=[("Archivo JSON", "*.json"), ("Todos los archivos", "*.*")],
        )
        if not path:
            return

        success, message = self.credential_manager.import_credentials(path)
        if success:
            self.status.configure(text="✓ Credenciales configuradas", style="Success.TLabel")
            messagebox.showinfo("Credenciales", message, parent=self)
        else:
            messagebox.showerror("Credenciales inválidas", message, parent=self)

    def delete_credentials(self):
        if not self.credential_manager.exists():
            messagebox.showinfo("Credenciales", "No hay credenciales guardadas.", parent=self)
            return

        if not messagebox.askyesno(
            "Eliminar credenciales",
            "¿Quieres eliminar las credenciales guardadas?",
            parent=self,
        ):
            return

        if self.credential_manager.delete_credentials():
            self.status.configure(text="⚠ Credenciales no configuradas", style="Warning.TLabel")
        else:
            messagebox.showerror("Error", "No se pudieron eliminar las credenciales.", parent=self)

    def save(self):
        url = self.url.get().strip()

        if not url:
            messagebox.showwarning("URL", "Introduce la URL del Google Sheet.", parent=self)
            return

        if "docs.google.com/spreadsheets" not in url:
            messagebox.showwarning("URL", "La URL no parece ser un Google Sheet válido.", parent=self)
            return

        if not self.credential_manager.exists():
            messagebox.showwarning(
                "Credenciales",
                "Selecciona primero el JSON de credenciales.",
                parent=self,
            )
            return

        self.result = url
        self.destroy()
