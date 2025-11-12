//The FlightTable is the table that will display all of the flights to the user, it will also take into account if the user is logged in or not.
function FlightTable({ userLoggedIn, flights, setFlights }) {
    //To cancel a flight, the user simply can click on the "Cancel Flight" button that will be displayed if they are logged in.
    async function cancelFlight(event) {
        event.preventDefault()
        try {
            const flightCode = event.target.getAttribute('id')
            const res = await fetch(`http://localhost:53140/flights/cancel/${flightCode}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            })
            if (res.ok) {
                const responseFlights = await res.json()
                setFlights(responseFlights)
            }
        } catch (err) {
            console.error(err)
        }
    }
    //To open a flight, the user can conversely click on the "Open Flight" button which is only visible when the user is logged in and the flight is cancelled.
    async function openFlight(event) {
        event.preventDefault()
        try {
            const flightCode = event.target.getAttribute('id')
            const res = await fetch(`http://localhost:53140/flights/open/${flightCode}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            })
            if (res.ok) {
                const responseFlights = await res.json()
                setFlights(responseFlights)
            }
        } catch (err) {
            console.error(err)
        }
    }
    //To delete a flight, the user can click on the "Delete Flight" Button which is only visible when the user is logged in.
    async function deleteFlight(event) {
        event.preventDefault()
        try {
            const flightCode = event.target.getAttribute('id')
            const res = await fetch(`http://localhost:53140/flights/delete/${flightCode}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            })
            if (res.ok) {
                const responseFlights = await res.json()
                setFlights(responseFlights)
            }
        } catch (err) {
            console.error(err)
        }
    }
    
    //Generate HTML based on if the user is logged in or not and if there are any flights in the database.
    if (userLoggedIn === true && flights) {
        //if so, return an HTML Table with the columns (Airline, Route, Boarding, Takeoff, Landing, Cancelled?, Edit, and Delete)
        return (
            <table className="table table-bordered table-hover table-secondary">
                <thead>
                    <tr>
                        <th colSpan="2">Airline</th>
                        <th colSpan="2">Route</th>
                        <th colSpan="1">Boarding</th>
                        <th colSpan="1">Takeoff</th>
                        <th colSpan="1">Landing</th>
                        <th colSpan="1">Cancelled?</th>
                        <th colSpan="1">Edit</th>
                        <th colSpan="1">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {flights.map(f => {
                        return (
                            <tr key={f.flightCode}>
                                <td>{f.flightCode}</td>
                                <td>{f.airlineName}</td>
                                <td>{f.originName}</td>
                                <td>{f.destinationName}</td>
                                <td>{f.boardingTime}</td>
                                <td>{f.takeoffTime}</td>
                                <td>{f.landingTime}</td>
                                <td>{f.cancelled}</td>
                                {f.cancelled === 'Not Cancelled' ? 
                                (<td><button id={f.flightCode} onClick={cancelFlight} className="btn hover-to-white">Cancel</button></td>)
                                : (<td><button id={f.flightCode} onClick={openFlight} className="btn hover-to-white">Open</button></td>)}
                                <td><button id={f.flightCode} onClick={deleteFlight} className="btn hover-to-red">Delete</button></td>
                            </tr>
                        )})}
                </tbody>
            </table>
        )
        /*
        At line 84, the table is simply checking to see if the flight is in fact cancelled or not, 
        and will output the Open button HTML if it is and the Cancel button HTML if it isnt.
        This is important because the correct button needs to be present so the table calls the correct function when the button is clicked.
        */
    } else {
        //if not, return the same table without the Edit or Delete Columns.
        //meaning the user does not have to be logged in to see the flights but they must be logged in to modify them.
        return (
            <table className="table table-bordered table-hover table-secondary">
                <thead>
                    <tr>
                        <th colSpan="2">Airline</th>
                        <th colSpan="2">Route</th>
                        <th colSpan="1">Boarding</th>
                        <th colSpan="1">Takeoff</th>
                        <th colSpan="1">Landing</th>
                        <th colSpan="1">Cancelled?</th>
                    </tr>
                </thead>
                <tbody>
                    {flights.map(f => {
                        return (
                            <tr key={f.flightCode}>
                                <td>{f.flightCode}</td>
                                <td>{f.airlineName}</td>
                                <td>{f.originName}</td>
                                <td>{f.destinationName}</td>
                                <td>{f.boardingTime}</td>
                                <td>{f.takeoffTime}</td>
                                <td>{f.landingTime}</td>
                                <td>{f.cancelled}</td>
                            </tr>
                    )})}
                </tbody>
            </table>
        )
    }
}

export default FlightTable