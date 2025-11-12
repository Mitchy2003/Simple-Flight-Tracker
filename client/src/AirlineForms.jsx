import { useState, useEffect } from 'react'

//AirlineForms is the function that handles rendering of the forms for the database.
function AirlineForms({ setFlights }) {
    const [airlines, setAirlines] = useState([])
    const [locations, setLocations] = useState([])
    
    //Fetch all of the airlines and locations on startup for the dropdown.
    useEffect(() => {
        const fetchAirlines = async () => {
            try {
                const res = await fetch('http://localhost:53140/airlines/all', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'}
                })
                if (res.ok) {
                    const responseAirlines = await res.json()
                    setAirlines(responseAirlines)
                }
            } catch (err) {
                console.error(err)
            }
        }
        fetchAirlines()
        const fetchLocations = async () => {
            try {
                const res = await fetch('http://localhost:53140/locations/all', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'}
                })
                if (res.ok) {
                    const responseLocations = await res.json()
                    setLocations(responseLocations)
                }
            } catch (err) {
                console.error(err)
            }
        }
        fetchLocations()
    }, [])

    //Add a location to the database
    //Locations have an Airport Name, an Abbreviation of that name, a City and Country Name, with an optional Province/State Name.
    async function addLocation(event) {
        event.preventDefault()
        try {
            const airportName = event.target.Airport.value
            const airportAbbreviation = event.target.AirportAbbreviation.value
            const city = event.target.City.value
            const province = event.target.Province.value
            const country = event.target.Country.value
            const res = await fetch('http://localhost:53140/locations/add', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    airportName: airportName,
                    airportAbbreviation: airportAbbreviation,
                    city: city,
                    province: province,
                    country: country
                })
            })
            if (res.ok) {
                const responseLocations = await res.json()
                setLocations(responseLocations)
                event.target.Airport.value = ''
                event.target.AirportAbbreviation.value = ''
                event.target.City.value = ''
                event.target.Province.value = ''
                event.target.Country.value = ''
            }
        } catch (err) {
            console.error(err)
        }
    }
    //Add an airline to the database
    //Airlines have just a Name, and an Abbreviation for that name.
    async function addAirline(event) {
        event.preventDefault()
        try {
            const airlineName = event.target.Airline.value
            const airlineAbbreviation = event.target.AirlineAbbreviation.value
            const res = await fetch('http://localhost:53140/airlines/add', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    airlineName: airlineName,
                    airlineAbbreviation: airlineAbbreviation
                })
            })
            if (res.ok) {
                const responseAirlines = await res.json()
                setAirlines(responseAirlines)
            }
        } catch (err) {
            console.error(err)
        }
    }
    //Add a flight to the database
    /*
    Flights have a Flight Code (Format: 'AA-1234' Two letter airline abbreviation, with a unique four digit number, seperated by a dash.) 
    flight codes are unique identifiers for flights.
    Flights have an Airline (which is retreived from the database), an origin location and a destination location. (retreived from the database.)
    Flights also have a boarding, takeoff, and landing time which are inputted by the user, in addition to a boolean indicating 
    whether the flight has been cancelled or not which can be modified later.
    */
    async function addFlight(event) {
        event.preventDefault()
        try {
            const flightCode = event.target.FlightCode.value
            const airline = event.target.AirlineOptions.value
            const origin = event.target.Origin.value
            const destination = event.target.Destination.value
            const boardingTime = event.target.BoardingTime.value
            const takeoffTime = event.target.TakeoffTime.value
            const landingTime = event.target.LandingTime.value
            const cancelled = event.target.Cancelled.value
            const res = await fetch('http://localhost:53140/flights/add', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    flightCode: flightCode,
                    airline: airline,
                    origin: origin,
                    destination: destination,
                    boardingTime: boardingTime,
                    takeoffTime: takeoffTime,
                    landingTime: landingTime,
                    cancelled: cancelled
                })
            })
            if (res.ok) {
                const responseFlights = await res.json()
                setFlights(responseFlights)
                event.target.FlightCode.value = ''
                event.target.Airline.value = ''
                event.target.Origin.value = ''
                event.target.Destination.value = ''
            }
        } catch (err) {
            console.error(err)
        }
    }

    //AirlineForms consists of three forms that all interact with the database.
    
    /*
    A form for adding a location.
    A form for adding an airline.
    A form for adding a flight.

    Options in the dropdown menus are all pulled directly from the database.
    */
    return (
        <div>
            <div className="container">
                <h3>Add New Location</h3>
                <form onSubmit={addLocation}>
                    <div className="form-group row">
                        <div className="col-3 top-padding">
                            <label htmlFor="Airport">Airport Name</label>
                        </div>
                        <div className="col-9">
                            <input type="text" className="form-control" placeholder="Airport" name="Airport" id="Airport" />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-3 top-padding">
                            <label htmlFor="AirportAbbreviation">Airport Abbreviation</label>
                        </div>
                        <div className="col-9">
                            <input type="text" className="form-control" placeholder="Abbreviation (Format: 'AAA')" name="AirportAbbreviation" id="AirportAbbreviation" />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-3 top-padding">
                            <label htmlFor="City">City</label>
                        </div>
                        <div className="col-9">
                            <input type="text" className="form-control" placeholder="City" name="City" id="City" />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-3 top-padding">
                            <label htmlFor="Province">State/Province</label>
                        </div>
                        <div className="col-9">
                            <input type="text" className="form-control" placeholder="State/Province" name="Province" id="Province" />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-3 top-padding">
                            <label htmlFor="Country">Country</label>
                        </div>
                        <div className="col-9">
                            <input type="text" className="form-control" placeholder="Country" name="Country" id="Country" />
                        </div>
                    </div>
                    <button type="submit" className="btn hover-to-red">Add Location</button>
                </form>
            </div>
            <hr/>
            <div className="container">
                <h3>Add Airline</h3>
                <form onSubmit={addAirline}>
                    <div className="form-group row">
                        <div className="col-3 top-padding">
                            <label htmlFor="Airline">Airline Name</label>
                        </div>
                        <div className="col-9">
                            <input type="text" className="form-control" placeholder="Airline Name" name="Airline" id="Airline" />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-3 top-padding">
                            <label htmlFor="AirlineAbbreviation">Airline Abbreviation</label>
                        </div>
                        <div className="col-9">
                            <input type="text" className="form-control" placeholder="Abbreviation (Format: 'AA')" name="AirlineAbbreviation" id="AirlineAbbreviation"  />
                        </div>
                    </div>
                    <button type="submit" className="btn hover-to-red">Add Airline</button>
                </form>
            </div>
            <hr/>
            <div className="container">
                <h3>Add New Flight</h3>
                <form onSubmit={addFlight}>
                    <div className="form-group row">
                        <div className="col-3 top-padding">
                            <label htmlFor="FlightCode">Flight Code</label>
                        </div>
                        <div className="col-9">
                            <input type="number" className="form-control" placeholder="Format: '0000'" name="FlightCode" id="FlightCode" />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-3"></div>
                        <div className="col-3 top-padding">
                            <label htmlFor="AirlineOptions">Airline</label>
                        </div>
                        <div className="col-6">
                            <select name="AirlineOptions">
                                <option value=""></option>
                                {airlines.map(a => {return (<option key={a.Name} value={a.Name}>{a.Name}</option>)})}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-3"></div>
                        <div className="col-3 top-padding">
                            <label htmlFor="Origin">Origin</label>
                        </div>
                        <div className="col-6">
                            <select name="Origin">
                                <option value=""></option>
                                {locations.map(l => {return (<option key={l.AirportName} value={l.AirportName}>{l.AirportName}</option>)})}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-3"></div>
                        <div className="col-3 top-padding">
                            <label htmlFor="Destination">Destination</label>
                        </div>
                        <div className="col-6">
                            <select name="Destination">
                                <option value=""></option>
                                {locations.map(l => {return (<option key={l.AirportName} value={l.AirportName}>{l.AirportName}</option>)})}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-3 top-padding">
                            <label htmlFor="BoardingTime">Boarding Time</label>
                        </div>
                        <div className="col-9">
                            <input type="datetime-local" className="form-control" name="BoardingTime" id="BoardingTime" />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-3 top-padding">
                            <label htmlFor="TakeoffTime">Takeoff Time</label>
                        </div>
                        <div className="col-9">
                            <input type="datetime-local" className="form-control" name="TakeoffTime" id="TakeoffTime" />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-3 top-padding">
                            <label htmlFor="LandingTime">Landing Time</label>
                        </div>
                        <div className="col-9">
                            <input type="datetime-local" className="form-control" name="LandingTime" id="LandingTime" />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-3"></div>
                        <div className="col-3 top-padding">
                            <label htmlFor="Cancelled">Cancelled?</label>
                        </div>
                        <div className="col-3 top-padding">
                            <input type="checkbox" name="Cancelled" id="Cancelled" />
                        </div>
                        <div className="col-3"></div>
                    </div>
                    <button type="submit" className="btn hover-to-red">Add Flight</button>
                </form>
            </div>
        </div>
    )
}

export default AirlineForms