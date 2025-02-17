import { React, useState } from "react"
import axion from "axios";

const Login = ({name, setName, onLogin}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axion.post("http://localhost:3000/login", { username, password });
            onLogin(response.data.token); // przekazanie tokenu do onLogin

        } catch (error) {
            setError("Nieprawidłowe dane logowania");
        }
    };

    const setUser = (name) => {
        setUsername(name);
        setName(name);
    }

    return (
        <div className="card p-4">
            <h2>Logowanie</h2>
            <form onSubmit={handleSubmit} className="mb-3">
                <input
                    type="text"
                    placeholder="Nazwa użytkownika"
                    value={username}
                    className="form-control"
                    onChange={(e) => setUser(e.target.value)} 
                />
                <br/>
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br/>
                <button className="btn btn-primary" type="submit">Zaloguj</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
    
};

export default Login;