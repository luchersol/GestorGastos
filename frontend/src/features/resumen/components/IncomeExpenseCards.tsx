
interface Props {
    ingresos: number;
    gastos: number;
}

const formatoImporte = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
});

function IncomeExpenseCards({ ingresos, gastos }: Props) {
    return (
        <>
            <article className="summary-card income-card">
                <span>Ingresos</span>
                <strong>{formatoImporte.format(ingresos)}</strong>
                <small>Total de ingresos del periodo</small>
            </article>

            <article className="summary-card expense-card">
                <span>Gastos</span>
                <strong>{formatoImporte.format(gastos)}</strong>
                <small>Total de gastos del periodo</small>
            </article>
        </>
    );
}

export default IncomeExpenseCards;
