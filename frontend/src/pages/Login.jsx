import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserPool,
} from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "ap-south-1_A9hMJ4TDH",
    ClientId: "5nsmvbovqr6e7hri29dm12fkph",
};

const userPool = new CognitoUserPool(poolData);

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = () => {
        const authenticationData = {
            Username: email,
            Password: password,
        };

        const authDetails = new AuthenticationDetails(authenticationData);

        const userData = {
            Username: email,
            Pool: userPool,
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.authenticateUser(authDetails, {
            onSuccess: (result) => {
                const token = result.getIdToken().getJwtToken();

                localStorage.setItem("token", token);

                alert("Login Successful");

                navigate("/");
            },

            onFailure: (err) => {
                alert(err.message);
            },
        });
    };

    return (
        <div style={{ padding: "30px" }}>
            <h1>Login</h1>

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br />
            <br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br />
            <br />

            <button onClick={login}>Login</button>
        </div>
    );
}
