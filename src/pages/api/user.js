// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { pool } from "config/db";
import md5 from "md5";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            if (req.query.iduser == null) {
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
        const result = await pool.query("select * from user where iduser = ?", [
            req.query.iduser,
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
            req.body.password = md5(req.body.password);
            await pool.query("insert into user set ?", [req.body])
            const insertData = await pool.query("select * from user where email = ?", [req.body.email]);
            return res.status(200).json({
                message: "Data berhasil ditambahkan!",
                data: insertData[0]
            });
        } else {
            return res.status(500).json({
                message: `Data dengan email ${req.body.email} sudah ada!`,
                data: {}
            })
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteuser = async (req, res) => {
    try {
        const result = await pool.query("select * from user where iduser = ?", [req.query.iduser]);

        if (!result.length == 0) {
            await pool.query("delete from user where iduser = ?", [req.query.iduser]);
            return res.status(200).json({
                message: `User dengan nama ${result[0].name} berhasil dihapus!`,
                data: {},
            });
        } else {
            return res.status(404).json({
                message: `User dengan id ${req.query.iduser} tidak ditemukan!`,
                data: {},
            })
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateuser = async (req, res) => {
    try {
        const result = await pool.query("select * from user where iduser = ?", [req.query.iduser]);

        if (!result.length == 0) {
            req.body.password = md5(req.body.password),
                await pool.query("update user set ? where iduser = ?", [
                    req.body,
                    req.query.iduser,
                ]);

            const updatedData = await pool.query("select * from user where iduser = ?", [req.query.iduser]);

            return res.status(200).json({
                message: 'Data berhasil diupdate!',
                data: updatedData[0],
            });
        } else {
            return res.status(500).json({
                message: `Data dengan iduser ${req.query.iduser} tidak ditemukan`,
                data: {},
            })
        }


    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};




