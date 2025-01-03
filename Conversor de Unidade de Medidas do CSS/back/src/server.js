const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'cadastrantes', 
    password: 'postgres', 
    port: 5432, 
});


app.use(cors());
app.use(express.json());


app.get('/usuarios', async (req, res) => {
   
    try {
   
        const result = await pool.query('SELECT * FROM usuarios');
        res.json(result.rows);
   
    } catch (err) {
   
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar usuarios' });
    };
});


app.get('/usuarios/:id', async (req, res) => {
   
    const { id } = req.params;
   
    try {
   
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
   
        if (result.rows.length === 0) {
   
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
   
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar cliente' });
    };
});


app.post('/usuarios', async (req, res) => {
   
    const { nome, email, senha } = req.body;
   
    try {
   
        const result = await pool.query(
   
            'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
            [nome, email, senha]
   
        );
   
        res.status(201).json(result.rows[0]);
   
    } catch (err) {
   
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar cliente' });
    };
});


app.put('/usuarios/:id', async (req, res) => {
   
    const { id } = req.params;
    const { nome, email, senha } = req.body;
   
    try {
   
        const result = await pool.query(
            'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id_usuarios = $4 RETURNING *',
            [nome, email, senha, id]
        );
   
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
   
        res.json(result.rows[0]);
   
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao atualizar cliente' });
    };
});


app.delete('/usuarios/:id', async (req, res) => {
   
    const { id } = req.params;
   
    try {
   
        const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
   
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
   
        res.json({ message: 'Cliente deletado com sucesso' });
   
    } catch (err) {
   
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
});

app.listen(3000, () => {
    
    console.log('Servidor rodando na porta 3000');
});

