import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { useContext, useState } from "react";

const Login = () => {
  // form state

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // auth context
  const { login } = useContext(AuthContext);

  // navigate
  const navigate = useNavigate();

  //   submit handler
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      // login user
      const data = await loginUser(email, password);

      // save user + token to context
      login(data);
            alert("login successful");


      // navigate to dashboard
      navigate("/");
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <div>
      <h1>login</h1>

      <form onSubmit={submitHandler}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
