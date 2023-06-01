// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { pool } from "config/db";
import convertDate from "../../../helper/convertDate";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      if (req.query.nidn == null) {
        return await getalldosen(req, res);
      } else {
        return await getdosen(req, res);
      }
    case "POST":
      return await insertdosen(req, res);
    case "DELETE":
      return await deletedosen(req, res);
    case "PUT":
      return await updatedosen(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const getalldosen = async (req, res) => {
  try {
    const result = await pool.query("select * from dosen");
    for (let index = 0; index < result.length; index++) {
      let date = convertDate(result[index].tgl_lahir);
      result[index].tgl_lahir = date;
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getdosen = async (req, res) => {
  try {
    const result = await pool.query("select * from dosen where nidn = ?", [
      req.query.nidn,
    ]);
    let date = convertDate(result[0].tgl_lahir);
    result[0].tgl_lahir = date;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const insertdosen = async (req, res) => {
  try {
    let isnum = /^\d+$/.test(req.body.nidn);
    if (isnum) {
      const checkData = await pool.query("select * from dosen where nidn = ?", [req.body.nidn]);

      if (checkData.length == 0 && isnum) {
        await pool.query("insert into dosen set ?", [req.body])
        const insertData = await pool.query("select * from dosen where nidn = ?", [req.body.nidn]);
        let date = convertDate(insertData[0].tgl_lahir);
        insertData[0].tgl_lahir = date;
        return res.status(200).json({
          message: "Data berhasil ditambahkan!",
          data: insertData[0]
        });
      } else {
        let date = convertDate(checkData[0].tgl_lahir);
        checkData[0].tgl_lahir = date;
        return res.status(500).json({
          message: `Data dengan nidn ${req.body.nidn} sudah ada!`,
          data: checkData[0]
        })
      }
    } else {
      return res.status(500).json({
        message: `Nidn harus berupa angka!`,
        data: {}
      })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const deletedosen = async (req, res) => {
  try {
    const result = await pool.query("select * from dosen where nidn = ?", [req.query.nidn]);

    let isnum = /^\d+$/.test(req.query.nidn);

    if (!result.length == 0 && isnum) {

      await pool.query("delete from dosen where nidn = ?", [req.query.nidn]);
      return res.status(500).json({
        message: `Data dengan nidn ${req.query.nidn} berhasil dihapus!`,
        data: {},
      });
    } else {
      return res.status(404).json({
        message: `Data dengan nidn ${req.query.nidn} tidak ditemukan!`,
        data: {},
      })
    }

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatedosen = async (req, res) => {
  try {

    const result = await pool.query("select * from dosen where nidn = ?", [req.query.nidn]);

    let isnum = /^\d+$/.test(req.query.nidn);

    if (!result.length == 0 && isnum) {
      await pool.query("update dosen set ? where nidn = ?", [
        req.body,
        req.query.nidn,
      ]);

      const updatedData = await pool.query("select * from dosen where nidn = ?", [req.query.nidn]);
      let date = convertDate(updatedData[0].tgl_lahir);
      updatedData[0].tgl_lahir = date;

      return res.status(200).json({
        message: 'Data berhasil diupdate!',
        data: updatedData[0],
      });
    } else {
      return res.status(200).json({
        message: `Data dengan nidn ${req.query.nidn} tidak ditemukan`,
        data: {},
      })
    }


  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




