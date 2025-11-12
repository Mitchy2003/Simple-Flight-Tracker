import { useState } from 'react'
import AirlineForms from './AirlineForms'

//The AuthBox tracks whether or not the user is logged in, and displays the correct HTML corresponding to whether or not the user is logged in.
/*
If the user is not logged in, the will see the FlightTable and then below it they will see two forms, one to register an account,
and the other, to log into an account.
If the user is logged in, they will see the FlightTable with additional columns for Edit and Delete, and they will see the AirlineForms component below.
*/
function AuthBox({ setUserLoggedIn, setFlights }) {
    const [username, setUsername] = useState('')
    //Simple Login Function
    async function login(event) {
        event.preventDefault()
        try {
            const loginUsername = event.target.loginUsername.value
            const loginPassword = event.target.loginPassword.value
            const res = await fetch('http://localhost:53140/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: loginUsername,
                    password: loginPassword
                })
            })
            if (res.ok) {
                const responseUsername = await res.json()
                setUsername(responseUsername.username)
                //set userLoggedIn to true after a successful login to display the correct HTML after login.
                setUserLoggedIn(true)
            }
        } catch (err) {
            console.error(err)
        }
    }
    //Simple Register Function
    async function register(event) {
        event.preventDefault()
        try {
            const registerUsername = event.target.registerUsername.value
            const registerPassword = event.target.registerPassword.value
            const res = await fetch('http://localhost:53140/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: registerUsername,
                    password: registerPassword
                })
            })
            if (res.ok) {
                const responseUsername = await res.json()
                setUsername(responseUsername.username)
                ////set userLoggedIn to true after to display the correct HTML after registering.
                setUserLoggedIn(true)
            }
        } catch (err) {
            console.error(err)
        }
    }
    //Simple Logout
    async function logout(event) {
        event.preventDefault()
        try {
            const res = await fetch('http://localhost:53140/logout', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            })
            if (res.ok) {
                await res.json()
                //nullify the username attribute, and set userLoggedIn to false to display the correct HTML.
                setUsername('')
                setUserLoggedIn(false)
            }
        } catch (err) {
            console.error(err)
        }
    }

    //checks to see whether or not the user is logged in.
    if (username !== '' && username) {
        //if so, display a little welcome message, add a logout button, and display the AirlineForms component.
        return (
            <div>
                <h2>Welcome, {username}!</h2>
                <button onClick={logout} className="btn hover-to-white">Logout</button>
                <hr/>
                <AirlineForms setFlights={setFlights} />
            </div>
        )
    } else {
        //if not, display a login and register form.
        return (
            <div>
                <h2>Login</h2>
                <form onSubmit={login}>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Username" name="loginUsername" id="loginUsername" />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" placeholder="Password" name="loginPassword" id="loginPassword" />
                    </div>
                    <button type="submit" className="btn hover-to-red">Login</button>
                </form>
                <hr/>
                <h2>Register</h2>
                <form onSubmit={register}>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Username" name="registerUsername" id="registerUsername" />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" placeholder="Password" name="registerPassword" id="registerPassword" />
                    </div>
                    <button type="submit" className="btn hover-to-white">Register</button>
                </form>
            </div>
        )
    }
}

export default AuthBox