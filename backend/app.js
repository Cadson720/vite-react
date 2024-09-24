const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Connect to DB
const db = mysql.createConnection({
    host: 'localhost', // Don't change
    user: 'root', // Username
    password: '1Cricketmad!', // Password
    database: 'FoodSystem' // Database Name
});

db.connect(err => {
    if (err) {
        console.error('Failed to connect to database: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});

// API for table menu
app.get('/api/menu', (req, res) => {
    const query = 'SELECT * FROM menu';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.get('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM menu WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(result[0]);  // Send the item details as a JSON response
    });
});


// Delete API for Inventory
app.delete('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM menu WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'Item deleted successfully' });
    });
});

// Update API for Inventory
app.put('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    const { item_name, description, price, category, SOH } = req.body;
    const query = 'UPDATE menu SET item_name = ?, description = ?, price = ?, category = ?, SOH = ? WHERE id = ?';

    db.query(query, [item_name, description, price, category, SOH, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'Item updated successfully' });
    });
});

// Add API for Inventory
app.post('/api/menu', (req, res) => {
    const { item_name, description, price, category, SOH } = req.body;
    const query = 'INSERT INTO menu (item_name, description, price, category, SOH) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [item_name, description, price, category, SOH], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'Item added successfully', id: result.insertId });
    });
});

/// API to transfer cart data to orderlist and update SOH in the menu table
app.post('/api/submit-order', (req, res) => {
    // Start a transaction to ensure data consistency
    db.beginTransaction((transactionErr) => {
        if (transactionErr) {
            return res.status(500).send('Error starting transaction');
        }

        // Insert data from cart into orderlist
        const insertOrderQuery = `
            INSERT INTO orderlist (cart_id, menu_id, quantity)
            SELECT cart_id, menu_id, quantity FROM cart
        `;

        db.query(insertOrderQuery, (insertErr, result) => {
            if (insertErr) {
                return db.rollback(() => {
                    return res.status(500).send('Error inserting order: ' + insertErr);
                });
            }

            // Update SOH in menu table
            const updateSohQuery = `
                UPDATE menu
                SET SOH = SOH - 1
                WHERE id IN (SELECT menu_id FROM cart)
                  AND SOH > 0  -- To prevent negative SOH
            `;

            db.query(updateSohQuery, (updateErr, updateResult) => {
                if (updateErr) {
                    return db.rollback(() => {
                        return res.status(500).send('Error updating SOH: ' + updateErr);
                    });
                }

                // Commit the transaction
                db.commit((commitErr) => {
                    if (commitErr) {
                        return db.rollback(() => {
                            return res.status(500).send('Error committing transaction: ' + commitErr);
                        });
                    }


                });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
