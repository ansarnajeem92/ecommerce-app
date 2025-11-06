import { pool } from "../config/db.js";

export const createTable = async () => {
  const client = await pool.connect();
  try {
    // Create products table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        stock_status VARCHAR(50)
      )
    `);
    console.log("Products table ready");

    // Check if table already has data
    const { rows } = await client.query("SELECT COUNT(*) FROM products");
    const count = parseInt(rows[0].count);

    if (count === 0) {
      // Insert dummy data
      await client.query(`
        INSERT INTO products (name, price, category, stock_status)
        VALUES 
          ('Wireless Mouse', 29.99, 'Electronics', 'In Stock'),
          ('Bluetooth Headphones', 89.50, 'Electronics', 'In Stock'),
          ('Office Chair', 149.00, 'Furniture', 'Out of Stock'),
          ('Water Bottle', 12.99, 'Home & Kitchen', 'In Stock'),
          ('Desk Lamp', 39.99, 'Home & Kitchen', 'In Stock'),
          ('Running Shoes', 79.99, 'Sports', 'In Stock');
      `);
      console.log("Dummy data inserted");
    } else {
      console.log("Table already contains data, skipping seed.");
    }
  } catch (err) {
    console.error("Error setting up database:", err);
  } finally {
    client.release();
  }
};
