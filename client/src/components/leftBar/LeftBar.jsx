import "./LeftBar.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

// Images
import Friends from "../../assets/friend.png";
import Groups from "../../assets/groups.png";
import Market from "../../assets/market.png";
import Watch from "../../assets/watch.png";
import Memories from "../../assets/memories.png";
import Events from "../../assets/events.png";
import Gaming from "../../assets/gaming.png";
import Gallery from "../../assets/gallery.png";
import Videos from "../../assets/videos.png";
import Messages from "../../assets/messages.png";
import Tutorials from "../../assets/tutorials.png";
import Courses from "../../assets/courses.png";
import Fund from "../../assets/fund.png";

// Context
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export default function LeftBar() {
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
    <div className="leftBar">
      {error ? (
        <p>Error: {error.message}</p>
      ) : isPending ? (
        <p>Loading...</p>
      ) : (
        <div className="container">
          <div className="menu">
            <Link
              to={`/profile/${currentUser.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="user">
                <img src={"/upload/" + data.profile_pic} alt="profile" />
                <span>{data.name}</span>
              </div>
            </Link>

            <div className="item">
              <img src={Friends} alt="friend" />
              <span>Friends</span>
            </div>
            <div className="item">
              <img src={Groups} alt="groups" />
              <span>Groups</span>
            </div>
            <div className="item">
              <img src={Market} alt="market" />
              <span>Marketplace</span>
            </div>
            <div className="item">
              <img src={Watch} alt="watch" />
              <span>Watch</span>
            </div>
            <div className="item">
              <img src={Memories} alt="memories" />
              <span>Memories</span>
            </div>
          </div>

          <hr />

          <div className="menu">
            <span>Your shortcuts</span>
            <div className="item">
              <img src={Events} alt="events" />
              <span>Events</span>
            </div>
            <div className="item">
              <img src={Gaming} alt="gaming" />
              <span>Gaming</span>
            </div>
            <div className="item">
              <img src={Gallery} alt="gallery" />
              <span>Gallery</span>
            </div>
            <div className="item">
              <img src={Videos} alt="videos" />
              <span>Videos</span>
            </div>
            <div className="item">
              <img src={Messages} alt="messages" />
              <span>Messages</span>
            </div>
          </div>

          <hr />

          <div className="menu">
            <span>Others</span>
            <div className="item">
              <img src={Fund} alt="fund" />
              <span>Fundraiser</span>
            </div>
            <div className="item">
              <img src={Tutorials} alt="tutorials" />
              <span>Tutorials</span>
            </div>
            <div className="item">
              <img src={Courses} alt="courses" />
              <span>Courses</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
