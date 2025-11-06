import { pool } from "../config/db.js";

export const getProducts = async (req, res) => {

 try {
    const { search = "", page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search
      ? `WHERE name ILIKE $1 OR category ILIKE $1`
      : "";
    const values = search ? [`%${search}%`, limit, offset] : [limit, offset];

    const query = `
      SELECT * FROM products
      ${whereClause}
      ORDER BY id DESC
      LIMIT $${search ? 2 : 1} OFFSET $${search ? 3 : 2};
    `;

    const countQuery = `
      SELECT COUNT(*) FROM products ${search ? `WHERE name ILIKE $1 OR category ILIKE $1` : ""};
    `;

    const [products, countResult] = await Promise.all([
      pool.query(query, values),
      pool.query(countQuery, search ? [`%${search}%`] : []),
    ]);

    res.json({
      data: products.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products" });
  }

};

export const addProduct = async (req, res) => {
  const { name, price, category, stock_status } = req.body;
  await pool.query(
    "INSERT INTO products (name, price, category, stock_status) VALUES ($1,$2,$3,$4)",
    [name, price, category, stock_status]
  );
  res.status(201).json({ message: "Product added successfully" });
};
