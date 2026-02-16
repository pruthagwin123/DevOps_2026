const filterTransactions = (transactions, filters = {}) => {
  const type = filters.type && filters.type !== "all" ? filters.type : null;
  const category =
    filters.category && filters.category !== "all" ? filters.category : null;
  const month = filters.month || null;
  const search = filters.search ? filters.search.toLowerCase() : null;

  return transactions.filter((item) => {
    if (type && item.type !== type) {
      return false;
    }

    if (category && item.category !== category) {
      return false;
    }

    if (month) {
      const date = new Date(item.createdAt);
      if (Number.isNaN(date.getTime())) {
        return false;
      }
      const formatted = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      if (formatted !== month) {
        return false;
      }
    }

    if (search && !String(item.description || "").toLowerCase().includes(search)) {
      return false;
    }

    return true;
  });
};

const sortTransactions = (transactions) =>
  transactions
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

module.exports = {
  filterTransactions,
  sortTransactions
};
