'use strict'

const mysql = require('mysql');
const {db: {host, user, password, database}} = require('../config/config.mysql')

// connect database
const con = mysql.createConnection({
    host: `${host}` || 'localhost',
    user: `${user}` || 'root',
    password: `${password}`,
    database: `${database}`
  })

class Database {
    constructor(){
        this.connect();
    }

    connect(type = 'mysql') {
        con.connect((err) => {
            if (err) {
              console.log(err)
            } else {
              console.log("Connect to MySQL successfully !!")
            }
        })
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMySQL = Database.getInstance();

module.exports = {
    instanceMySQL,
    con
}