import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime
from utils.numbers import parse_euro


class GastoDialog(tk.Toplevel):
    def __init__(self, parent, title, conceptos, gasto=None):
        super().__init__(parent)
        self.title(title)
        self.geometry("480x430")
        self.resizable(False, False)
        self.result = None
        self.transient(parent)
        self.grab_set()

        frame = ttk.Frame(self, padding=28)
        frame.pack(fill="both", expand=True)

        self._label(frame, "Fecha")
        self.fecha = ttk.Entry(frame)
        self.fecha.pack(fill="x", pady=(5, 16))

        self._label(frame, "Compra")
        self.compra = ttk.Entry(frame)
        self.compra.pack(fill="x", pady=(5, 16))

        self._label(frame, "Concepto")
        self.concepto = ttk.Combobox(frame, values=conceptos, state="readonly")
        self.concepto.pack(fill="x", pady=(5, 16))

        self._label(frame, "Valor (€)")
        self.valor = ttk.Entry(frame)
        self.valor.pack(fill="x", pady=(5, 24))

        buttons = ttk.Frame(frame)
        buttons.pack(fill="x")
        ttk.Button(buttons, text="Cancelar", command=self.destroy).pack(side="right", padx=(8, 0))
        ttk.Button(buttons, text="Guardar", command=self.save).pack(side="right")

        if gasto:
            self.fecha.insert(0, gasto.get("Fecha", ""))
            self.compra.insert(0, gasto.get("Compra", ""))
            self.concepto.set(gasto.get("Concepto", ""))
            self.valor.insert(0, str(gasto.get("Valor", "")))
        else:
            self.fecha.insert(0, datetime.now().strftime("%d/%m/%Y"))

        self.after(50, self.fecha.focus_set)

    @staticmethod
    def _label(parent, text):
        ttk.Label(parent, text=text).pack(anchor="w")

    def save(self):
        fecha = self.fecha.get().strip()
        compra = self.compra.get().strip()
        concepto = self.concepto.get().strip()
        valor_texto = self.valor.get().strip()

        try:
            datetime.strptime(fecha, "%d/%m/%Y")
        except ValueError:
            messagebox.showwarning("Fecha", "Usa el formato DD/MM/YYYY.", parent=self)
            return

        if not compra:
            messagebox.showwarning("Datos", "Introduce la compra.", parent=self)
            return
        if not concepto:
            messagebox.showwarning("Datos", "Selecciona un concepto.", parent=self)
            return

        try:
            valor = parse_euro(valor_texto)
        except ValueError:
            messagebox.showwarning(
                "Valor",
                "Introduce un valor válido, por ejemplo 2,85 o 2,85 €.",
                parent=self,
            )
            return

        if valor < 0:
            messagebox.showwarning("Valor", "El valor no puede ser negativo.", parent=self)
            return

        self.result = (fecha, compra, concepto, valor)
        self.destroy()
