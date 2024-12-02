import "./Story.scss";
import moment from "moment";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

function Story({ activeStory, setActiveStory }) {
  //State
  const [isShowDelete, setIsShowDelete] = useState(false);

  //Context
  const { currentUser } = useContext(AuthContext);

  function handleDeleteStory() {
    storyMutation.mutate(activeStory.id);
    setActiveStory(false);
    setIsShowDelete(false);
  }

  // use react-query Mutations to delete a story
  const queryClient = useQueryClient();
  const storyMutation = useMutation({
    mutationFn: (storyId) => {
      return makeRequest.delete(`/stories/${storyId}`);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  return (
    <div className="story-overlay">
      <div className="story-modal">
        <Link to={`/profile/${activeStory.user_id}`}>
          <div className="creator-info">
            <img src={"/upload/" + activeStory.profile_pic} alt="profile" />
            <span className="creator">{activeStory.name}</span>
            <span className="date">
              {moment(activeStory.createat).fromNow()}
            </span>
          </div>
        </Link>

        <button className="close-btn" onClick={() => setActiveStory(false)}>
          X
        </button>

        <img
          className="story-img"
          src={"/upload/" + activeStory.img}
          alt="story"
        />

        {currentUser.id === activeStory.user_id && (
          <MoreHorizIcon
            className="more-btn"
            onClick={() => setIsShowDelete(!isShowDelete)}
          />
        )}

        {isShowDelete && (
          <button className="delete-story-btn" onClick={handleDeleteStory}>
            Delete Story
          </button>
        )}
      </div>
    </div>
  );
}

export default Story;
