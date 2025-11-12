function FlightTable({ userLoggedIn, flights, setFlights }) {
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
    
    if (userLoggedIn === true && flights) {
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
    } else {
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