import { useState, useEffect } from 'react'
import FlightTable from './FlightTable'
import AuthBox from './AuthBox'

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [flights, setFlights] = useState([])

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await fetch('http://localhost:53140/flights/all', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
          })
        if (res.ok) {
          const flightsArray = await res.json()
          setFlights(flightsArray)
        } else {
          console.error('Error fetching flights: ', res.statusText)
        }
      } catch (err) {
        console.error('Error fetching flights: ', err)
      }
    }
    fetchFlights()
  }, [])

  return (
    <div>
      <div className="header">
        <h1 className="display-3">Flight Tracker</h1>
      </div>
      <hr/>
      <div>
        <FlightTable userLoggedIn={userLoggedIn} flights={flights} setFlights={setFlights}/>
      </div>
      <hr/>
      <div>
        <AuthBox setUserLoggedIn={setUserLoggedIn} setFlights={setFlights} />
      </div>
    </div>
  )
}

export default App
