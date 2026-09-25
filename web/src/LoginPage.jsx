import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const data = await loginUser(email, password);

      if (data.message !== "Login successful!") {
        alert(data.message);
        return;
      }

      localStorage.setItem("userId", data.id);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email);

      alert(data.message);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h1>Welcome back</h1>
        <p>Login to continue your StudyMate journey.</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

        <p className="login-text">
          Don't have an account?{" "}
          <a href="/signup">Create Account</a>
        </p>
      </div>
    </div>
  );
}

export default Login;