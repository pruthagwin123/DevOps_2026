const request = require("supertest");
const app = require("../app");

describe("Integration Tests - Personal Finance Tracker APIs", () => {
  beforeEach(() => {
    // Reset in-memory data before each test
    app._internal._resetData();
  });

  test("Dashboard API returns correct summary data", async () => {
    const res = await request(app).get("/api/dashboard");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("totalIncome");
    expect(res.body).toHaveProperty("totalExpenses");
    expect(res.body).toHaveProperty("balance");

    // Check correctness based on seeded data:
    // income: 10000 + 2000 = 12000
    // expenses: 500 + 300 = 800
    // balance: 12000 - 800 = 11200
    expect(res.body.totalIncome).toBe(12000);
    expect(res.body.totalExpenses).toBe(800);
    expect(res.body.balance).toBe(11200);
  });

  test("Get all expenses returns correct data", async () => {
    const res = await request(app).get("/api/expenses");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("title");
    expect(res.body[0]).toHaveProperty("amount");
  });

  test("Add new expense successfully", async () => {
    const newExpense = { title: "Rent", amount: 1000 };
    const res = await request(app)
      .post("/api/expenses")
      .send(newExpense);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Rent");
    expect(res.body.amount).toBe(1000);
    expect(res.body).toHaveProperty("id");
  });

  test("Add expense without required fields returns error", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .send({ title: "Rent" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("Get all income returns correct data", async () => {
    const res = await request(app).get("/api/income");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("source");
    expect(res.body[0]).toHaveProperty("amount");
  });

  test("Add new income successfully", async () => {
    const newIncome = { source: "Bonus", amount: 5000 };
    const res = await request(app)
      .post("/api/income")
      .send(newIncome);

    expect(res.statusCode).toBe(201);
    expect(res.body.source).toBe("Bonus");
    expect(res.body.amount).toBe(5000);
    expect(res.body).toHaveProperty("id");
  });

  test("Add income without required fields returns error", async () => {
    const res = await request(app)
      .post("/api/income")
      .send({ source: "Bonus" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("Dashboard reflects new expense", async () => {
    // Add new expense
    await request(app)
      .post("/api/expenses")
      .send({ title: "Utilities", amount: 200 });

    // Check dashboard
    const res = await request(app).get("/api/dashboard");

    expect(res.statusCode).toBe(200);
    expect(res.body.totalExpenses).toBe(1000); // 500 + 300 + 200
    expect(res.body.balance).toBe(11000); // 12000 - 1000
  });

  test("Dashboard reflects new income", async () => {
    // Add new income
    await request(app)
      .post("/api/income")
      .send({ source: "Interest", amount: 1000 });

    // Check dashboard
    const res = await request(app).get("/api/dashboard");

    expect(res.statusCode).toBe(200);
    expect(res.body.totalIncome).toBe(13000); // 10000 + 2000 + 1000
    expect(res.body.balance).toBe(12200); // 13000 - 800
  });
});
