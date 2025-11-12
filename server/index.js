'use strict'
//FlightTracker Backend
//Node Packages
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const session = require('express-session')
const bcrypt = require('bcrypt')
const cors = require('cors')
const path = require('path')
//Custom DBAbstraction
const DBAbstraction = require('./DBAbstraction')
const db = new DBAbstraction(path.join('./data/flights.sqlite'))
const app = express()
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static(path.join(__dirname, '../client/dist')))
app.use(session({
    secret: 'Carthage-Firebirds',
    resave: false,
    saveUninitialized: true
}))
//Initialization on port 53140
db.init()
    .then(() => {
        app.listen(53140, () => {
            console.log('Server is running')
            console.log()
        })
    })
    .catch(err => {
        console.log('Database Setup Failed')
        console.error(err)
    })
//end initialization
//helper functions
function formatDateAndTime(datestring) {
    //converts from '2025-04-04T20:30' format to '4/4/2025, 8:30 PM'
    const date = new Date(datestring)
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(date)
}
async function formatFlight(flight) {
    //format the flights to display before being sent to the FlightTable
    try {
        const airline = await db.getAirlineById(flight.AirlineId)
        const origin = await db.getLocationById(flight.OriginId)
        const destination = await db.getLocationById(flight.DestinationId)
        return {
            flightCode: `${airline.Abbreviation}-${flight.FlightCode}`,
            airlineName: airline.Name,
            originName: origin.AirportAbbreviation,
            destinationName: destination.AirportAbbreviation,
            boardingTime: flight.BoardingTime,
            takeoffTime: flight.TakeoffTime,
            landingTime: flight.LandingTime,
            cancelled: flight.Cancelled
        }
    } catch (err) {
        console.log(err)
    }
}
//routes
app.post('/flights/all', async (req, res) => {
    try {
        //get all of the flights and then format them.
        const flights = Array.from(await db.getAllFlights())
        const formattedFlights = []
        for (let i = 0; i < flights.length; i++) {
            const currentFlight = await formatFlight(flights[i])
            formattedFlights.push(currentFlight)
        }
        res.json(formattedFlights)
    } catch (err) {
        console.error(err)
    }
})
app.post('/login', async (req, res) => {
    //check empty parameters
    if (req.body.username === '' || req.body.password === '') {
        res.json({error: 'Error: The username and password fields cannot be empty.'})
    }
    //get the username and password
    const username = req.body.username
    const password = req.body.password
    //try logging in
    try {
        //get the user associated with the username
        const user = await db.getUserByUsername(username)
        //then compare the hashed password against the input password
        if (user && await bcrypt.compare(password, user.HashedPass)) {
            //if they are the same, then set the username and send it
            req.session.user = username
            res.json({username: username})
        } else {
            //login was incorrect
            res.status(500).json({error: 'Error: Invalid Credentials.'})
        }
    } catch (err) {
        console.log(err)
    }
})
app.post('/register', async (req, res) => {
    //check empty parameters
    if (req.body.Username === '' || req.body.Password === '') {
        res.json({error: 'Error: The username and password fields cannot be empty.'})
    }
    //get the username
    const username = req.body.username
    //get the password and hash it
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    //try registering an account
    try {
        await db.register(username, hashedPassword)
        //if the account was inserted into the database, then set the username and send it
        req.session.user = username
        res.json({username: username})
    } catch (err) {
        console.log(err)
    }
})
//logging out kills a session
app.post('/logout', async (req, res) => {req.session.destroy(() => {res.status(200).json({result: 'Logout Successful'})})})
app.post('/flights/cancel/:flightCode', async (req, res) => {
    //check empty parameter
    if (req.params.flightCode === '') {
        res.json({error: 'Error: The flightCode parameter cannot be empty.'})
    }
    //split the flight code into the two pieces
    const splitFlightCode = req.params.flightCode.split('-')
    const airlineAbbreviation = splitFlightCode[0]
    const flightCode = parseInt(splitFlightCode[1])
    //then try to cancel the flight
    try {
        //get the airline for the airlineId, then get the flight for the flightId to cancel
        const airline = await db.getAirlineByAbbreviation(airlineAbbreviation)
        const flight = await db.getFlightByFlightCode(flightCode, airline.Id)
        await db.cancelFlight(flight.Id)
        const flights = Array.from(await db.getAllFlights())
        const formattedFlights = []
        for (let i = 0; i < flights.length; i++) {
            const currentFlight = await formatFlight(flights[i])
            formattedFlights.push(currentFlight)
        }
        res.json(formattedFlights)
    } catch (err) {
        console.log(err)
    }
})
app.post('/flights/open/:flightCode', async (req, res) => {
    //check empty parameter
    if (req.params.flightCode === '') {
        res.json({error: 'Error: The flightCode parameter cannot be empty.'})
    }
    //split the flight code into the two pieces
    const splitFlightCode = req.params.flightCode.split('-')
    const airlineAbbreviation = splitFlightCode[0]
    const flightCode = parseInt(splitFlightCode[1])
    //try to cancel the flight
    try {
        //get the airline for the airlineId, then get the flight for the flightId to open
        const airline = await db.getAirlineByAbbreviation(airlineAbbreviation)
        const flight = await db.getFlightByFlightCode(flightCode, airline.Id)
        await db.openFlight(flight.Id)
        const flights = Array.from(await db.getAllFlights())
        const formattedFlights = []
        for (let i = 0; i < flights.length; i++) {
            const currentFlight = await formatFlight(flights[i])
            formattedFlights.push(currentFlight)
        }
        res.json(formattedFlights)
    } catch (err) {
        console.log(err)
    }
})
app.post('/flights/delete/:flightCode', async (req, res)  => {
    //check empty paremeter
    if (req.params.flightCode === '') {
        res.json({error: 'Error: The flightCode parameter cannot be empty.'})
    }
    //split the flight code into the two pieces
    const splitFlightCode = req.params.flightCode.split('-')
    const airlineAbbreviation = splitFlightCode[0]
    const flightCode = parseInt(splitFlightCode[1])
    //try to delete the flight
    try {
        //get the airline for the airlineId, then get the flight for the flightId to delete
        const airline = await db.getAirlineByAbbreviation(airlineAbbreviation)
        const flight = await db.getFlightByFlightCode(flightCode, airline.Id)
        await db.deleteFlight(flight.Id)
        const flights = Array.from(await db.getAllFlights())
        const formattedFlights = []
        for (let i = 0; i < flights.length; i++) {
            const currentFlight = await formatFlight(flights[i])
            formattedFlights.push(currentFlight)
        }
        res.json(formattedFlights)
    } catch (err) {
        console.log(err)
    }
})
app.post('/airlines/all', async (req, res) => {
    try {
        //try to get all of the airlines, then send them
        const airlines = await db.getAllAirlines()
        res.json(airlines)
    } catch (err) {
        console.log(err)
    }
})
app.post('/locations/all', async (req, res) => {
    try {
        //try to get all of the locations, then send them
        const locations = await db.getAllLocations()
        res.json(locations)
    } catch (err) {
        console.log(err)
    }
})
app.post('/locations/add', async (req, res) => {
    //check empty paremeters
    if (req.body.airportName === '' || req.body.airportAbbreviation === '' || req.body.city === '' || req.body.country === '') {
        res.json({error: 'Error: One or more of the non-null paremeters were empty.'})
    }
    //get the airportName, airportAbbreviation, city, province, and country
    const airport = req.body.airportName
    const airportAbbreviation = req.body.airportAbbreviation
    const city = req.body.city
    const province = req.body.province ? req.body.province : '' //this parameter may be empty
    const country = req.body.country
    //try inserting the location
    try {
        await db.insertLocation(airport, airportAbbreviation, city, province, country)
        const locations = await db.getAllLocations()
        res.json(locations)
    } catch (err) {
        console.log(err)
    }
})
app.post('/airlines/add', async (req, res) => {
    //check empty paremeters
    if (req.body.airlineName === '' || req.body.airlineAbbreviation === '') {
        res.json({error: 'Error: One or more of the parameters were empty.'})
    }
    //get the airlineName, and airlineAbbreviation
    const airlineName = req.body.airlineName
    const airlineAbbreviation = req.body.airlineAbbreviation
    //try inserting the airline
    try {
        await db.insertAirline(airlineName, airlineAbbreviation)
        const airlines = await db.getAllAirlines()
        res.json(airlines)
    } catch (err) {
        console.log(err)
    }
})
app.post('/flights/add', async (req, res) => {
    //check empty parameters
    if (req.body.airline === '' || req.body.origin === '' || req.body.destination === '' || req.body.boardingTime === '' || req.body.takeoffTime === '' || req.body.landingTime === '') {
        res.json({error: 'Error: One or more of the non-null paremeters were empty.'})
    }
    //check NaN
    if (isNaN(parseInt(req.body.flightCode))) {
        res.json({error: 'Error: The flight code parameter must be an integer.'})
    }
    //get the flightCode, boardingTime, takeoffTime, and landingTime
    const flightCode = parseInt(req.body.flightCode)
    const boardingTime = formatDateAndTime(req.body.boardingTime)
    const takeoffTime = formatDateAndTime(req.body.takeoffTime)
    const landingTime = formatDateAndTime(req.body.landingTime)
    try {
        //then try getting the airline, origin, and destination
        const airline = await db.getAirlineByName(req.body.airline)
        const origin = await db.getLocationByAirportName(req.body.origin)
        const destination = await db.getLocationByAirportName(req.body.destination)
        //and determine whether the flight is cancelled or not
        const cancelled = req.body.cancelled ? 'Cancelled' : 'Not Cancelled'
        //then try to insert the flight
        try {
            await db.insertFlight(flightCode, airline.Id, origin.Id, destination.Id, boardingTime, takeoffTime, landingTime, cancelled)
            const flights = Array.from(await db.getAllFlights())
            const formattedFlights = []
            for (let i = 0; i < flights.length; i++) {
                const currentFlight = await formatFlight(flights[i])
                formattedFlights.push(currentFlight)
            }
            res.json(formattedFlights)
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        console.log(err)
    }
})
//404
app.use((req, res) => {res.status(404).send(`<h2>Uh Oh!</h2> The route ${req.url} was not found.`)})