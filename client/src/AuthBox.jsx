import { useState } from 'react'
import AirlineForms from './AirlineForms'

function AuthBox({ setUserLoggedIn, setFlights }) {
    const [username, setUsername] = useState('')
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
                setUserLoggedIn(true)
            }
        } catch (err) {
            console.error(err)
        }
    }
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
                setUserLoggedIn(true)
            }
        } catch (err) {
            console.error(err)
        }
    }
    async function logout(event) {
        event.preventDefault()
        try {
            const res = await fetch('http://localhost:53140/logout', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            })
            if (res.ok) {
                await res.json()
                setUsername('')
                setUserLoggedIn(false)
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (username !== '' && username) {
        return (
            <div>
                <h2>Welcome, {username}!</h2>
                <button onClick={logout} className="btn hover-to-white">Logout</button>
                <hr/>
                <AirlineForms setFlights={setFlights} />
            </div>
        )
    } else {
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