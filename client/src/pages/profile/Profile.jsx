import "./Profile.scss";
import Posts from "../../components/posts/Posts";
import { makeRequest } from "../../axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import UpdateProfile from "../../components/modals/UpdateProfile";

// Icons
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function Profile() {
  // State
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Context
  const { currentUser } = useContext(AuthContext);

  // Extract the user ID from the URL of the currently viewed profile
  const userId = useLocation().pathname.split("/")[2];

  // use react-query to fetch data of the profile being viewed
  const {
    isPending: isUserPending,
    error: isUserError,
    data: userData,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await makeRequest.get(`/users/find/${userId}`);
      return res.data;
    },
  });

  // use react-query to fetch followers of the profile being viewed
  const { isPending: isFollowersIdPending, data: followersId } = useQuery({
    queryKey: ["followersId", userId],
    queryFn: async () => {
      const res = await makeRequest.get(`/follow?userId=${userId}`);
      return res.data;
    },
  });

  // use react-query Mutations to follow or unfollow a user
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (isFollowing) => {
      if (isFollowing) {
        return makeRequest.delete(`/follow?userId=${userId}`);
      } else {
        return makeRequest.post(`/follow`, { userId });
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["followersId"] });
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  async function handleFollow() {
    mutation.mutate(followersId.includes(currentUser.id));
  }

  // Navigate
  const navigate = useNavigate();

  async function logout() {
    await makeRequest.post("/auth/logout");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="profile">
      {isUserError ? (
        <p>Error: {isUserError.message}</p>
      ) : isUserPending ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="images">
            <img
              src={"/upload/" + userData.cover_pic}
              alt="cover"
              className="cover"
            />
            <img
              src={"/upload/" + userData.profile_pic}
              alt="profile"
              className="profile-pic"
            />
          </div>

          <div className="profileContainer">
            <div className="userInfo">
              <div className="left">
                <a href="https://www.facebook.com/">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="https://www.facebook.com/">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="https://www.facebook.com/">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="https://www.facebook.com/">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="https://www.facebook.com/">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>

              <div className="center">
                <span>{userData.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{userData.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{userData.website}</span>
                  </div>
                </div>

                {isFollowersIdPending ? (
                  <p>Loading...</p>
                ) : currentUser.id == userId ? (
                  <button
                    className="update-btn"
                    onClick={() => setShowUpdateModal(true)}
                  >
                    Update
                  </button>
                ) : (
                  <button className="update-btn" onClick={handleFollow}>
                    {followersId.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}

                {currentUser.id == userId && (
                  <button className="logout-btn" onClick={logout}>
                    Logout
                  </button>
                )}
              </div>

              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
          </div>

          <Posts userId={userId} />
        </>
      )}

      {showUpdateModal && (
        <UpdateProfile
          setShowUpdateModal={setShowUpdateModal}
          user={userData}
        />
      )}
    </div>
  );
}
