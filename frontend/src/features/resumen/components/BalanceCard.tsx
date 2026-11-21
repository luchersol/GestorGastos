
interface Props {
    balance: number;
}

function BalanceCard({ balance }: Props) {
    const formatoImporte = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR"
    });

    const positivo = balance >= 0;

    return (
        <article className="summary-card balance-card">
            <span>Balance</span>

            <strong className={positivo ? "income-text" : "expense-text"}>
                {formatoImporte.format(balance)}
            </strong>

            <small>
                {positivo
                    ? "Tus ingresos superan tus gastos"
                    : "Tus gastos superan tus ingresos"}
            </small>
        </article>
    );
}

export default BalanceCard;
