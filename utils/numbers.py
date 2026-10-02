def parse_euro(value):
    if value is None:
        return 0.0

    value = str(value).strip().replace("€", "").strip()
    if not value:
        return 0.0

    if "," in value:
        value = value.replace(".", "").replace(",", ".")

    return float(value)


def format_euro(value):
    formatted = f"{float(value):,.2f}"
    formatted = formatted.replace(",", "TEMP").replace(".", ",").replace("TEMP", ".")
    return f"{formatted} €"
