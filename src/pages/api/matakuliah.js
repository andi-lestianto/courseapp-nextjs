// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { pool } from "config/db";
import convertDate from "../../../helper/convertDate";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            if (req.query.id_matkul == null) {
                return await getallmata_kuliah(req, res);
            } else {
                return await getmata_kuliah(req, res);
            }
        case "POST":
            return await insertmata_kuliah(req, res);
        case "DELETE":
            return await deletemata_kuliah(req, res);
        case "PUT":
            return await updatemata_kuliah(req, res);
        default:
            return res.status(400).json({ message: "bad request" });
    }
}

const getallmata_kuliah = async (req, res) => {
    try {
        const result = await pool.query("select * from mata_kuliah");
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getmata_kuliah = async (req, res) => {
    try {
        const result = await pool.query("select * from mata_kuliah where id_matkul = ?", [
            req.query.id_matkul,
        ]);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const insertmata_kuliah = async (req, res) => {
    try {

        const checkData = await pool.query("select * from mata_kuliah where id_matkul = ?", [req.body.id_matkul]);

        if (checkData.length == 0) {
            await pool.query("insert into mata_kuliah set ?", [req.body])
            const insertData = await pool.query("select * from mata_kuliah where id_matkul = ?", [req.body.id_matkul]);
            return res.status(200).json({
                message: "Data berhasil ditambahkan!",
                data: insertData[0]
            });
        } else {
            return res.status(500).json({
                message: `Data dengan id_matkul ${req.body.id_matkul} sudah ada!`,
                data: checkData[0]
            })
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deletemata_kuliah = async (req, res) => {
    try {
        const result = await pool.query("select * from mata_kuliah where id_matkul = ?", [req.query.id_matkul]);


        if (!result.length == 0) {

            await pool.query("delete from mata_kuliah where id_matkul = ?", [req.query.id_matkul]);
            return res.status(500).json({
                message: `Data dengan id_matkul ${req.query.id_matkul} berhasil dihapus!`,
                data: {},
            });
        } else {
            return res.status(404).json({
                message: `Data dengan id_matkul ${req.query.id_matkul} tidak ditemukan!`,
                data: {},
            })
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updatemata_kuliah = async (req, res) => {
    try {

        const result = await pool.query("select * from mata_kuliah where id_matkul = ?", [req.query.id_matkul]);


        if (!result.length == 0) {
            await pool.query("update mata_kuliah set ? where id_matkul = ?", [
                req.body,
                req.query.id_matkul,
            ]);

            const updatedData = await pool.query("select * from mata_kuliah where id_matkul = ?", [req.query.id_matkul]);

            return res.status(200).json({
                message: 'Data berhasil diupdate!',
                data: updatedData[0],
            });
        } else {
            return res.status(200).json({
                message: `Data dengan id_matkul ${req.query.id_matkul} tidak ditemukan`,
                data: {},
            })
        }


    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



