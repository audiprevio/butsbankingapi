const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const app = express()

const commonResponse = function (data, error) {
    if (error) {
        return {
            success: false,
            error: error
        }
    }

    return {
        success: true,
        data: data
    }
}

const mysqlCon = mysql.createConnection({
    host: 'fdaa:2:c0d6:a7b:80:a027:395b:2',
    user: 'root',
    password: 'nautical89',
    database: 'usertransactions',
})

const query = (query, values) => {
    return new Promise((resolve, reject) => {
        mysqlCon.query(query, values, (err, result, fields) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

mysqlCon.connect((err) => {
    if (err) throw err

    console.log("MySQL successfully connected. Ready to roll.")
})

app.use(bodyParser.json())

app.get('/users/:id', async (request, response) => {
    try {
        const id = request.params.id;

        const dbData = await query(`
            SELECT
                u.id,
                u.name,
                u.address,
                SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) - SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) AS balance,
                SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) AS expense
            FROM
                users u
                LEFT JOIN transactions t ON u.id = t.user_id
            WHERE
                u.id = ?
            GROUP BY
                u.id
        `, [id]);

        if (dbData.length === 0) {
            return response.status(404).json(commonResponse(null, "User not found"));
        }

        const responseData = dbData[0];

        response.status(200).json(commonResponse(responseData, null));
    } catch (err) {
        console.error(err);
        response.status(500).json(commonResponse(null, "Server error"));
    }
});

app.post('/transactions', async (request, response) => {
    try {
        const body = request.body;

        const { type, amount, user_id } = body;

        const dbData = await query(`
            INSERT INTO transactions (user_id, type, amount)
            VALUES (?, ?, ?)`,
            [user_id, type, amount]
        );

        if (dbData.length === 0) {
            return response.status(404).json(commonResponse(null, "User not found"));
        }

        response.status(200).json(commonResponse({
            id: dbData.insertId
        }, null));
    } catch (err) {
        console.error(err);
        response.status(500).json(commonResponse(null, "server error"));
    }
})

app.put('/transactions/:id', async (request, response) => {
    try {
        const transactionId = request.params.id;
        const body = request.body;

        const { type, amount } = body;

        await query(`
            UPDATE transactions
            SET type = ?, amount = ?
            WHERE id = ?`,
            [type, amount, transactionId]
        );
        response.status(200).json(commonResponse({ message: 'Transaction updated successfully' }, null));
    } catch (err) {
        console.error(err);
        response.status(500).json(commonResponse(null, "Server error"));
    }
});


app.delete('/transactions/:id', async (request, response) => {
    try {
        const transactionId = request.params.id;

        await query(`
            DELETE FROM transactions
            WHERE id = ?`,
            [transactionId]
        );

        response.status(200).json(commonResponse({ message: 'Transaction deleted successfully' }, null));
    } catch (err) {
        console.error(err);
        response.status(500).json(commonResponse(null, "Server error"));
    }
});

app.listen(3000, () => {
    console.log("running in 3000")
})
