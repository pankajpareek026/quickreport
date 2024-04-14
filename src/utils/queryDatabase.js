const conn = require("../config/connection");
const user=1234
async function queryDatabase(query) {
    return new Promise((resolve, reject) => {
        conn.query(query, (err, result) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(result);
            }
        });
    });
}
// queryDatabase('SELECT * FROM 12345_portfolio').then(err => { console.log(err); console })

queryDatabase

  console.table(fundingResult,Fbalance,results)