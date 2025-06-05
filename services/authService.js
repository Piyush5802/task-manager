const db = require('../config/dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService{

    async register(req, res, next){
        const { email, password } = req.body;
        try {
            const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

            if(users.length > 0) return res.status(400).json({ error: 'User already exists!' });

            const hashed = await bcrypt.hash(password, 10);
            await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashed]);
            
            return res.status(200).json({ message: 'User registered' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: false, message: error.message });
        }
    }

    async login(req, res, next){
        const { email, password } = req.body;
        try {
            const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            
              if (users.length === 0) return res.status(400).json({ error: 'User not found' });
            
              const isMatch = await bcrypt.compare(password, users[0].password);
              if (!isMatch) return res.status(400).json({ error: 'Invalid password' });
              
              const token = jwt.sign({ id: users[0].id, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRY });
              const data = {
                id: users[0].id,
                email: email,
                token: token
              }
            return res.status(201).json({ message: 'Login Successful', data: data });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: false, message: error.message });
        }
    }

}

module.exports = new AuthService();