
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    ArrowLeftRight,
    ChartNoAxesCombined,
    Tags,
    FileSpreadsheet
} from "lucide-react";

const navigation = [
    {
        label: "Resumen",
        path: "/",
        icon: LayoutDashboard
    },
    {
        label: "Movimientos",
        path: "/movimientos",
        icon: ArrowLeftRight
    },
    {
        label: "Estadísticas",
        path: "/estadisticas",
        icon: ChartNoAxesCombined
    },
    {
        label: "Categorías",
        path: "/categorias",
        icon: Tags
    },
    {
        label: "Importa / Exportar",
        path: "/importacion-exportacion",
        icon: FileSpreadsheet
    }
];

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-logo">G</div>
                <span>GestorGastos</span>
            </div>

            <nav className="sidebar-navigation">
                <span className="sidebar-section-title">
                    GENERAL
                </span>

                {navigation.map(({ label, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === "/"}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <Icon size={19} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <span>GestorGastos</span>
                <small>Gestión personal</small>
            </div>
        </aside>
    );
}

export default Sidebar;
