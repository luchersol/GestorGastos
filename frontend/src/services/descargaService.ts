const descargaService = {
    descargar(blob: Blob, nombre: string): void {
        const url = window.URL.createObjectURL(blob);

        const enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = nombre;

        document.body.appendChild(enlace);
        enlace.click();

        enlace.remove();
        window.URL.revokeObjectURL(url);
    }
};

export default descargaService;