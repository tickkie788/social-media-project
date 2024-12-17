import "./Login.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  // States
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);

  // Login context
  const { login } = useContext(AuthContext);

  // Navigate
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setInput((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await login(input);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(error.response.data);
    }
  }

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Social Media</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Id dolorum
            repudiandae nulla veniam enim pariatur, quam expedita est, nobis
            consectetur explicabo eveniet quasi animi voluptates? Deserunt,
            tempora aperiam! Perferendis, nemo?
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>

        <div className="right">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              required
              name="username"
              onChange={handleChange}
              value={input.username}
            />
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              onChange={handleChange}
              value={input.password}
            />
            {error && <p className="error-message">{error}</p>}
            <button>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
