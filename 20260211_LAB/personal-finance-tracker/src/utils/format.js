export const getMonthKey = (value) => {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
};

export const formatCurrency = (value, currency = "INR") => {
  const safeValue = Number(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(safeValue);
};

export const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

export const toCsv = (rows, categoryMap, accountMap) => {
  const headers = [
    "date",
    "type",
    "amount",
    "category",
    "account",
    "notes"
  ];

  const lines = rows.map((row) => {
    const category = categoryMap.get(row.categoryId)?.name || "Uncategorized";
    const account = accountMap.get(row.accountId)?.name || "Unknown";
    return [
      row.date,
      row.type,
      row.amount,
      category,
      account,
      row.notes || ""
    ]
      .map((value) => `${String(value).replace(/"/g, '""')}`)
      .map((value) => `"${value}"`)
      .join(",");
  });

  return [headers.join(","), ...lines].join("\n");
};
