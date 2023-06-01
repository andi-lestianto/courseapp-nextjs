// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { pool } from "config/db";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            if (req.query.email == null) {
                return await getalluser(req, res);
            } else {
                return await getuser(req, res);
            }
        case "POST":
            return await insertuser(req, res);
        case "DELETE":
            return await deleteuser(req, res);
        case "PUT":
            return await updateuser(req, res);
        default:
            return res.status(400).json({ message: "bad request" });
    }
}

const getalluser = async (req, res) => {
    try {
        const result = await pool.query("select * from user");
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getuser = async (req, res) => {
    try {
        const result = await pool.query("select * from user where email = ?", [
            req.query.email,
        ]);
        return res.status(200).json(result[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const insertuser = async (req, res) => {
    try {
        const checkData = await pool.query("select * from user where email = ?", [req.body.email]);

        if (checkData.length == 0) {
            await pool.query("insert into user set ?", [req.body])
            const insertData = await pool.query("select * from user where email = ?", [req.body.email]);
            return res.status(200).json({
                message: "Data berhasil ditambahkan!",
                data: insertData[0]
            });
        } else {
            return res.status(500).json({
                message: `Data dengan email ${req.body.email} sudah ada!`,
                data: checkData[0]
            })
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteuser = async (req, res) => {
    try {
        const result = await pool.query("select * from user where email = ?", [req.query.email]);

        if (!result.length == 0) {
            await pool.query("delete from user where email = ?", [req.query.email]);
            return res.status(500).json({
                message: `Data dengan email ${req.query.email} berhasil dihapus!`,
                data: {},
            });
        } else {
            return res.status(404).json({
                message: `Data dengan email ${req.query.email} tidak ditemukan!`,
                data: {},
            })
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateuser = async (req, res) => {
    try {
        const result = await pool.query("select * from user where email = ?", [req.body.email]);


        if (!result.length == 0) {
            await pool.query("update user set password = ? where email = ?", [
                req.body.password,
                req.body.email,
            ]);

            const updatedData = await pool.query("select * from user where email = ?", [req.body.email]);

            return res.status(200).json({
                message: 'Data berhasil diupdate!',
                data: updatedData[0],
            });
        } else {
            return res.status(200).json({
                message: `Data dengan email ${req.body.email} tidak ditemukan`,
                data: {},
            })
        }


    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};




