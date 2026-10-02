import gspread
from google.oauth2.service_account import Credentials

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]


class GoogleSheetsService:
    def __init__(self, credentials_file):
        self.credentials_file = credentials_file
        self.client = None
        self.sheet = None
        self.gastos = None
        self.resumen = None
        self.configuracion = None

    def connect(self, spreadsheet_url):
        if not self.credentials_file.exists():
            raise FileNotFoundError("No se han configurado las credenciales de Google.")

        credentials = Credentials.from_service_account_file(
            self.credentials_file,
            scopes=SCOPES,
        )
        self.client = gspread.authorize(credentials)
        self.sheet = self.client.open_by_url(spreadsheet_url)

        self.gastos = self.sheet.worksheet("Gastos")
        self.resumen = self.sheet.worksheet("Resumen")
        self.configuracion = self.sheet.worksheet("Configuración")

    def get_gastos(self):
        return self.gastos.get_all_records()

    def add_gasto(self, fecha, compra, concepto, valor):
        self.gastos.append_row([fecha, compra, concepto, valor])

    def update_gasto(self, row, fecha, compra, concepto, valor):
        self.gastos.update(f"A{row}:D{row}", [[fecha, compra, concepto, valor]])

    def delete_gasto(self, row):
        self.gastos.delete_rows(row)

    def get_configuracion(self):
        return self.configuracion.get_all_records()
