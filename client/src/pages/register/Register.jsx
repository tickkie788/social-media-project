import "./Register.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  // States
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState(null);

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
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        input
      );
      navigate("/login");
    } catch (error) {
      console.error(error);
      setError(error.response.data);
    }
  }

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Register</h1>
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
              type="email"
              placeholder="Email"
              required
              name="email"
              onChange={handleChange}
              value={input.email}
            />
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              onChange={handleChange}
              value={input.password}
            />
            <input
              type="text"
              placeholder="Name"
              required
              name="name"
              onChange={handleChange}
              value={input.name}
            />

            {error && <p className="error-message">{error}</p>}

            <button>Register</button>
          </form>
        </div>

        <div className="right">
          <h1>Social Media</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Id dolorum
            repudiandae nulla veniam enim pariatur, quam expedita est, nobis
            consectetur explicabo eveniet quasi animi voluptates? Deserunt,
            tempora aperiam! Perferendis, nemo?
          </p>
          <span>Already have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
