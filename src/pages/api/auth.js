import { pool } from "config/db";

export default async function handler(req, res) {
    console.log(req.body);
    switch (req.method) {
        case "POST":
            return await login(req, res);
        default:
            return res.status(400).json({ message: "bad request" });
    }
}

const login = async (req, res) => {
    try {
        const result = await pool.query("select * from user where email = ? and password = ?", [
            req.body.email,
            req.body.password
        ]);
        if (result.length == 0) {
            return res.status(200).json({
                message: 'Login gagal, data tidak ditemukan',
                data: {},
            });
        }
        return res.status(200).json({
            message: 'Login berhasil',
            data: result[0],
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};