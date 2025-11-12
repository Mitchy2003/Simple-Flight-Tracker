const sqlite3 = require('sqlite3')
class DBAbstraction {
    constructor(path) {
        this.dbPath = path
    }
    init() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, async (err) => {
                if (err) {
                    reject(err)
                } else {
                    try {
                        await this.createTables()
                        resolve()
                    } catch (err) {
                        reject(err)
                    }
                }
            })
        })
    }
    createTables() {
        //create tables sql
        const sql = `
            CREATE TABLE IF NOT EXISTS 'Users' (
                'Id' INTEGER PRIMARY KEY,
                'Username' TEXT UNIQUE NOT NULL,
                'HashedPass' TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS 'Locations' (
                'Id' INTEGER PRIMARY KEY,
                'AirportName' TEXT NOT NULL,
                'AirportAbbreviation' TEXT NOT NULL,
                'City' TEXT NOT NULL,
                'Province' TEXT,
                'Country' TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS 'Airlines' (
                'Id' INTEGER PRIMARY KEY,
                'Name' TEXT NOT NULL,
                'Abbreviation' TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS 'Flights' (
                'Id' INTEGER PRIMARY KEY,
                'FlightCode' INTEGER,
                'AirlineId' INTEGER,
                'OriginId' INTEGER,
                'DestinationId' INTEGER,
                'BoardingTime' TEXT NOT NULL,
                'TakeoffTime' TEXT NOT NULL,
                'LandingTime' TEXT NOT NULL,
                'Cancelled' INTEGER,
                FOREIGN KEY('AirlineId') REFERENCES Airlines('Id'),
                FOREIGN KEY('OriginId') REFERENCES Locations('Id'),
                FOREIGN KEY('DestinationId') REFERENCES Locations('Id')
            );
        `
        return new Promise((resolve, reject) => {
            //this.db.exec to run multiple sql statements
            this.db.exec(sql, (err) => {
                //if err !=== null
                if (err) {
                    reject(err)
                } else {    
                    resolve()
                }
            })
        })
    }
    //end initialization
    //register query
    register(username, hashedPassword) {
        //self explanatory sql
        const sql = `INSERT INTO 'Users' (Username, HashedPass) VALUES (?, ?);`
        return new Promise((resolve, reject) => {
            //run the sql, sanitize the inputs, this will not return anything
            this.db.run(sql, Array.from(arguments), (err) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
    //insert queries
    insertFlight(flightCode, airlineId, originId, destinationId, boardingTime, takeoffTime, landingTime, cancelled) {
        //self explanatory sql
        const sql = `INSERT INTO 'Flights' (FlightCode, AirlineId, OriginId, DestinationId, BoardingTime, TakeoffTime, LandingTime, Cancelled) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
        return new Promise((resolve, reject) => {
            //run the sql, sanitize the inputs, this will not return anything
            this.db.run(sql, Array.from(arguments), (err) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
    insertAirline(name, abbreviation) {
        //self explanatory sql
        const sql = `INSERT INTO 'Airlines' (Name, Abbreviation) VALUES (?, ?);`
        return new Promise((resolve, reject) => {
            //run the sql, sanitize the inputs, this will not return anything
            this.db.run(sql, Array.from(arguments), (err) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
    insertLocation(airportName, airportAbbreviation, city, province, country) {
        //self explanatory sql
        const sql = `INSERT INTO 'Locations' (AirportName, AirportAbbreviation, City, Province, Country) VALUES (?, ?, ?, ?, ?);` 
        return new Promise((resolve, reject) => {
            //run the sql, sanitize the inputs, this will not return anything
            this.db.run(sql, Array.from(arguments), (err) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
    //get all queries
    getAllFlights() {
        //self explanatory sql
        const sql = `
            SELECT *
            FROM 'Flights'
            ORDER BY BoardingTime;
        `
        return new Promise((resolve, reject) => {
            //run the sql, this will return zero to many rows
            this.db.all(sql, [], (err, rows) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
    getAllAirlines() {
        //self explanatory sql
        const sql = `
            SELECT *
            FROM 'Airlines';
        `
        return new Promise((resolve, reject) => {
            //run the sql, this will return zero to many rows
            this.db.all(sql, [], (err, rows) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
    getAllLocations() {
        //self explanatory sql
        const sql = `
            SELECT *
            FROM 'Locations';
        `
        return new Promise((resolve, reject) => {
            //run the sql, this will return zero to many rows
            this.db.all(sql, [], (err, rows) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
    //selection queries
    getUserByUsername(username) {
        //self explanatory sql
        const sql = `
            SELECT *
            FROM Users
            WHERE Username = ?;
        `
        return new Promise((resolve, reject) => {
            //run the sql, sanitize the input, this will return one row
            this.db.get(sql, [username], (err, row) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }
    getFlightById(id) {
        //self explanatory sql
        const sql = `
            SELECT *
            FROM 'Flights'
            WHERE Id = ?;
        `
        return new Promise((resolve, reject) => {
            //run the sql, sanitize the input, this will return one row
            this.db.get(sql, [id], (err, row) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }
    getFlightByFlightCode(flightCode, airlineId) {
        //self explanatory sql
        const sql = `
            SELECT *
            FROM 'Flights'
            WHERE FlightCode = ? AND AirlineId = ?;
        `
        return new Promise((resolve, reject) => {
            //run the sql, sanitize the inputs, this will return one row
            this.db.get(sql, Array.from(arguments), (err, row) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }
    getAirlineById(id) {
        //self explanatory sql
        const sql = `
            SELECT *
            FROM 'Airlines'
            WHERE Id = ?;
        `
        return new Promise((resolve, reject) => {
            //run the sql, sanitize the input, this will return one row
            this.db.get(sql, [id], (err, row) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }
    getAirlineByName(name) {
        //self explanatory sql
        const sql = `
            SELECT *
            FROM 'Airlines'
            WHERE Name = ?;
        `
        return new Promise((resolve, reject) => {
            //run the sql, sanitize the input, this will return one row
            this.db.get(sql, [name], (err, row) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }
    getAirlineByAbbreviation(airlineAbbreviation) {
        //self explanatory sql
        const sql = `
           SELECT *
           FROM 'Airlines'
           WHERE Abbreviation = ?; 
        `
        return new Promise((resolve, reject) => {
            //run the sql, sanitize the input, this will return one row
            this.db.get(sql, [airlineAbbreviation], (err, row) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }
    getLocationById(id) {
        //self explanatory sql
        const sql = `
            SELECT *
            FROM 'Locations'
            WHERE Id = ?;
        `
        return new Promise((resolve, reject) => {
            //run the sql, sanitize the input, this will return one row
            this.db.get(sql, [id], (err, row) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }
    getLocationByAirportName(airportName) {
        //self explanatory sql
        const sql = `
            SELECT *
            FROM 'Locations'
            WHERE AirportName = ?;
        `
        return new Promise((resolve, reject) => {
            //run the sql, sanitize the input, this will return one row
            this.db.get(sql, [airportName], (err, row) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }
    //update queries
    cancelFlight(id) {
        //self explanatory sql
        const sql = `
            UPDATE 'Flights'
            SET Cancelled = 'Cancelled'
            WHERE Id = ?;
        `
        return new Promise((resolve, reject) => {
            //run the sql, sanitize the input, this will not return anything
            this.db.run(sql, [id], (err) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
    openFlight(id) {
        //self explanatory sql
        const sql = `
            UPDATE 'Flights'
            SET Cancelled = 'Not Cancelled'
            WHERE Id = ?;
        `
        return new Promise((resolve, reject) => {
            //run the sql, sanitize the input, this will not return anything
            this.db.run(sql, [id], (err) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
    //delete queries
    deleteFlight(id) {
        //self explanatory sql
        const sql = `DELETE FROM 'Flights' WHERE Id = ?;`
        return new Promise((resolve, reject) => {
            //run the sql, sanitize the input, this will not return anything
            this.db.run(sql, [id], (err) => {
                //if err !== null
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
}
module.exports = DBAbstraction