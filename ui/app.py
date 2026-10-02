import json
import tkinter as tk
from tkinter import ttk, messagebox

from datetime import datetime

from services.credential_manager import CredentialManager
from services.google_sheets import GoogleSheetsService
from ui.gasto_dialog import GastoDialog
from ui.settings_dialog import SettingsDialog
from utils.numbers import parse_euro, format_euro


class ExpenseApp(tk.Tk):
    def __init__(self):
        super().__init__()

        self.credential_manager = CredentialManager("GestorGastos")
        self.config_data = self.credential_manager.load_config()

        self.service = GoogleSheetsService(
            self.credential_manager.get_path()
        )
        self.gastos_data = []

        self.title("Gestor de Gastos")
        self.geometry("1120x720")
        self.minsize(950, 620)

        self._configure_style()
        self._build_ui()

        saved_url = self.config_data.get("spreadsheet_url", "")
        if saved_url and self.credential_manager.exists():
            try:
                self.connect_sheet(saved_url)
            except Exception as exc:
                self._set_connection_status("Sin conexión")
                messagebox.showwarning(
                    "Conexión",
                    f"No se pudo conectar automáticamente.\n\n{exc}\n\n"
                    "Puedes revisar Ajustes.",
                )

    def _configure_style(self):
        style = ttk.Style(self)
        try:
            style.theme_use("vista")
        except tk.TclError:
            pass

        style.configure("Title.TLabel", font=("Segoe UI", 22, "bold"))
        style.configure("Subtitle.TLabel", font=("Segoe UI", 10))
        style.configure("Section.TLabel", font=("Segoe UI", 12, "bold"))
        style.configure("Hint.TLabel", foreground="#666666")
        style.configure("Success.TLabel", foreground="#16803c", font=("Segoe UI", 10, "bold"))
        style.configure("Warning.TLabel", foreground="#b45309", font=("Segoe UI", 10, "bold"))
        style.configure("Status.TLabel", font=("Segoe UI", 9))
        style.configure("Treeview", rowheight=32, font=("Segoe UI", 10))
        style.configure("Treeview.Heading", font=("Segoe UI", 10, "bold"))

    def _build_ui(self):
        header = ttk.Frame(self, padding=(24, 20, 24, 10))
        header.pack(fill="x")

        title_box = ttk.Frame(header)
        title_box.pack(side="left")

        ttk.Label(title_box, text="Gestor de Gastos", style="Title.TLabel").pack(anchor="w")
        ttk.Label(
            title_box,
            text="Controla tus gastos directamente desde Google Sheets",
            style="Subtitle.TLabel",
        ).pack(anchor="w", pady=(3, 0))

        right = ttk.Frame(header)
        right.pack(side="right")

        self.connection_status = ttk.Label(
            right,
            text="Sin configurar",
            style="Warning.TLabel",
        )
        self.connection_status.pack(side="left", padx=(0, 16))

        ttk.Button(right, text="⚙  Ajustes", command=self.open_settings).pack(side="right")

        self.notebook = ttk.Notebook(self)
        self.notebook.pack(fill="both", expand=True, padx=24, pady=(10, 24))

        self.gastos_frame = ttk.Frame(self.notebook)
        self.resumen_frame = ttk.Frame(self.notebook)

        self.notebook.add(self.gastos_frame, text="  Gastos  ")
        self.notebook.add(self.resumen_frame, text="  Resumen  ")

        self._build_gastos()
        self._build_resumen()

    def _set_connection_status(self, text):
        self.connection_status.configure(text=text)

    def _build_gastos(self):
        toolbar = ttk.Frame(self.gastos_frame, padding=15)
        toolbar.pack(fill="x")

        ttk.Button(toolbar, text="+  Nuevo gasto", command=self.new_gasto).pack(side="left")
        ttk.Button(toolbar, text="Editar", command=self.edit_selected_gasto).pack(side="left", padx=7)
        ttk.Button(toolbar, text="Eliminar", command=self.delete_selected_gasto).pack(side="left")
        ttk.Button(toolbar, text="↻  Actualizar", command=self.load_gastos).pack(side="right")

        container = ttk.Frame(self.gastos_frame)
        container.pack(fill="both", expand=True, padx=15, pady=(0, 15))

        columns = ("fecha", "compra", "concepto", "valor")
        self.gastos_tree = ttk.Treeview(container, columns=columns, show="headings")

        headings = {
            "fecha": "Fecha",
            "compra": "Compra",
            "concepto": "Concepto",
            "valor": "Valor (€)",
        }
        widths = {"fecha": 120, "compra": 320, "concepto": 220, "valor": 140}

        for column in columns:
            self.gastos_tree.heading(column, text=headings[column])
            self.gastos_tree.column(
                column,
                width=widths[column],
                anchor="e" if column == "valor" else "w",
            )

        scrollbar = ttk.Scrollbar(container, orient="vertical", command=self.gastos_tree.yview)
        self.gastos_tree.configure(yscrollcommand=scrollbar.set)

        self.gastos_tree.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

    def _build_resumen(self):
        top = ttk.Frame(self.resumen_frame, padding=15)
        top.pack(fill="x")

        ttk.Label(top, text="Filtrar por concepto:").pack(side="left")

        self.concepto_filter = ttk.Combobox(top, state="readonly", width=28)
        self.concepto_filter.pack(side="left", padx=10)
        self.concepto_filter.bind("<<ComboboxSelected>>", lambda _event: self.update_resumen())

        ttk.Button(top, text="Todos", command=self.reset_filter).pack(side="left")
        ttk.Button(top, text="↻  Actualizar", command=self.update_resumen).pack(side="right")

        self.total_label = ttk.Label(
            self.resumen_frame,
            text="Total: 0,00 €",
            font=("Segoe UI", 18, "bold"),
        )
        self.total_label.pack(anchor="w", padx=35, pady=(5, 15))

        container = ttk.Frame(self.resumen_frame)
        container.pack(fill="both", expand=True, padx=15, pady=(0, 15))

        columns = ("mes", "2026", "2027")
        self.resumen_tree = ttk.Treeview(container, columns=columns, show="headings")

        for column, text, width in [
            ("mes", "Mes", 280),
            ("2026", "2026", 220),
            ("2027", "2027", 220),
        ]:
            self.resumen_tree.heading(column, text=text)
            self.resumen_tree.column(column, width=width, anchor="e" if column != "mes" else "w")

        self.resumen_tree.pack(fill="both", expand=True)

    def connect_sheet(self, url):
        self.service.connect(url)
        self.config_data["spreadsheet_url"] = url
        self.credential_manager.save_config(self.config_data)

        self._set_connection_status("● Conectado")
        self.load_gastos()

        conceptos = self.get_conceptos()
        self.concepto_filter["values"] = ["Todos"] + conceptos
        self.concepto_filter.set("Todos")
        self.update_resumen()

    def load_gastos(self):
        if not self.service.gastos:
            return

        try:
            self.gastos_data = self.service.get_gastos()

            for item in self.gastos_tree.get_children():
                self.gastos_tree.delete(item)

            for index, gasto in enumerate(self.gastos_data):
                valor = parse_euro(gasto.get("Valor", 0))
                self.gastos_tree.insert(
                    "",
                    "end",
                    iid=str(index),
                    values=(
                        gasto.get("Fecha", ""),
                        gasto.get("Compra", ""),
                        gasto.get("Concepto", ""),
                        format_euro(valor),
                    ),
                )
        except Exception as exc:
            messagebox.showerror("Error", f"No se pudieron cargar los gastos:\n\n{exc}")

    def get_conceptos(self):
        try:
            return [
                str(row.get("Conceptos", "")).strip()
                for row in self.service.get_configuracion()
                if str(row.get("Conceptos", "")).strip()
            ]
        except Exception:
            return []

    def new_gasto(self):
        dialog = GastoDialog(self, "Nuevo gasto", self.get_conceptos())
        self.wait_window(dialog)

        if not dialog.result:
            return

        try:
            self.service.add_gasto(*dialog.result)
            self.load_gastos()
            self.update_resumen()
        except Exception as exc:
            messagebox.showerror("Error", str(exc))

    def edit_selected_gasto(self):
        selected = self.gastos_tree.selection()
        if not selected:
            messagebox.showwarning("Editar", "Selecciona un gasto.")
            return

        index = int(selected[0])
        dialog = GastoDialog(
            self,
            "Editar gasto",
            self.get_conceptos(),
            self.gastos_data[index],
        )
        self.wait_window(dialog)

        if not dialog.result:
            return

        try:
            self.service.update_gasto(index + 2, *dialog.result)
            self.load_gastos()
            self.update_resumen()
        except Exception as exc:
            messagebox.showerror("Error", str(exc))

    def delete_selected_gasto(self):
        selected = self.gastos_tree.selection()
        if not selected:
            messagebox.showwarning("Eliminar", "Selecciona un gasto.")
            return

        index = int(selected[0])

        if not messagebox.askyesno(
            "Eliminar gasto",
            "¿Quieres eliminar este gasto?",
        ):
            return

        try:
            self.service.delete_gasto(index + 2)
            self.load_gastos()
            self.update_resumen()
        except Exception as exc:
            messagebox.showerror("Error", str(exc))

    def update_resumen(self):
        if not self.gastos_data and self.service.gastos:
            self.load_gastos()

        concepto = self.concepto_filter.get()
        if concepto == "Todos":
            concepto = ""

        meses = [
            "Enero", "Febrero", "Marzo", "Abril",
            "Mayo", "Junio", "Julio", "Agosto",
            "Septiembre", "Octubre", "Noviembre", "Diciembre",
        ]

        resumen = {
            year: {mes: 0.0 for mes in meses}
            for year in (2026, 2027)
        }

        for gasto in self.gastos_data:
            if concepto and gasto.get("Concepto") != concepto:
                continue

            try:
                fecha = datetime.strptime(str(gasto.get("Fecha", "")), "%d/%m/%Y")
                valor = parse_euro(gasto.get("Valor", 0))
            except (ValueError, TypeError):
                continue

            if fecha.year in resumen:
                resumen[fecha.year][meses[fecha.month - 1]] += valor

        for item in self.resumen_tree.get_children():
            self.resumen_tree.delete(item)

        total = 0.0
        for mes in meses:
            v2026 = resumen[2026][mes]
            v2027 = resumen[2027][mes]
            total += v2026 + v2027

            self.resumen_tree.insert(
                "",
                "end",
                values=(mes, format_euro(v2026), format_euro(v2027)),
            )

        self.total_label.configure(text=f"Total: {format_euro(total)}")

    def reset_filter(self):
        self.concepto_filter.set("Todos")
        self.update_resumen()

    def open_settings(self):
        dialog = SettingsDialog(
            self,
            self.config_data.get("spreadsheet_url", ""),
            self.credential_manager,
        )
        self.wait_window(dialog)

        if not dialog.result:
            return

        try:
            self.connect_sheet(dialog.result)
            messagebox.showinfo(
                "Configuración completada",
                "Google Sheets se ha configurado correctamente.",
            )
        except Exception as exc:
            messagebox.showerror(
                "Error de conexión",
                f"No se pudo conectar con Google Sheets.\n\n{exc}",
            )
