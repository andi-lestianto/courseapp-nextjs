import mysql from "serverless-mysql";

const pool = mysql({
    config: {
        host: "localhost",
        user: "samuutbe_courseuser",
        password: "Bismillah1234",
        port: 3306,
        database: "samuutbe_coursedb",
    },
});

// const pool = mysql({
//     config: {
//         host: "localhost",
//         user: "root",
//         password: "",
//         port: 3306,
//         database: "courseappdb",
//     },
// });

export { pool };
