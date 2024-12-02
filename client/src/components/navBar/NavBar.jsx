import "./NavBar.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

// Icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

// Contexts
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";

export default function NavBar() {
  // State
  const { darkMode, toggle } = useContext(DarkModeContext);

  // Context
  const { currentUser } = useContext(AuthContext);

  // use react-query to fetch user data
  const { isPending, error, data } = useQuery({
    queryKey: ["user", currentUser.id],
    queryFn: async () => {
      const res = await makeRequest.get(`/users/find/${currentUser.id}`);
      return res.data;
    },
  });

  return (
    <div className="navbar">
      {error ? (
        <p>Error: {error.message}</p>
      ) : isPending ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="left">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <span>Social Media</span>
            </Link>

            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <HomeOutlinedIcon />
            </Link>

            {darkMode ? (
              <WbSunnyOutlinedIcon className="theme-btn" onClick={toggle} />
            ) : (
              <DarkModeOutlinedIcon className="theme-btn" onClick={toggle} />
            )}

            <GridViewOutlinedIcon />

            <div className="search">
              <SearchOutlinedIcon />
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <div className="right">
            <Link
              to="/friends"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <PersonOutlinedIcon className="person-icon" />
            </Link>
            <EmailOutlinedIcon className="email-icon" />
            <NotificationsOutlinedIcon className="notification-icon" />
            <Link
              to={`/profile/${currentUser.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="user">
                <img src={"/upload/" + data.profile_pic} alt="avatar" />
                <span className="username">{data.name}</span>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
