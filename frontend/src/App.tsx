import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import ResumenPage from "./features/resumen/pages/ResumenPage";
import MovimientosPage from "./features/movimientos/pages/MovimientosPage";
import EstadisticasPage from "./features/estadisticas/pages/EstadisticasPage";
import CategoriasPage from "./features/categorias/pages/CategoriasPage";

function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<ResumenPage />} />
                <Route path="/movimientos" element={<MovimientosPage />} />
                <Route path="/estadisticas" element={<EstadisticasPage />} />
                <Route path="/categorias" element={<CategoriasPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
