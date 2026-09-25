import { useState } from "react";

import { signupUser } from "./api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
  try {
    const data = await signupUser(name, email, password);

    console.log(data);
    alert(data.message);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h1>Create your account</h1>
        <p>Start your StudyMate journey.</p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button onClick={handleSignup}>Create Account</button>

        <p className="login-text">
          Already have an account? <a href="/">Back to Home</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;