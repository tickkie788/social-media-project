import "./Stories.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import UploadStory from "../modals/UploadStory";
import Story from "./Story";

function Stories() {
  // State
  const [isShowUpload, setIsShowUpload] = useState(false);
  const [activeStory, setActiveStory] = useState(null); // Store active story ID

  // Context
  const { currentUser } = useContext(AuthContext);

  // use react-query to fetch user data
  const {
    isPending: isUserPending,
    error: isUserError,
    data: userData,
  } = useQuery({
    queryKey: ["user", currentUser.id],
    queryFn: async () => {
      const res = await makeRequest.get(`/users/find/${currentUser.id}`);
      return res.data;
    },
  });

  // use react-query to fetch stories
  const {
    isPending: isStoriesPending,
    error: isStoriesError,
    data: storiesData,
  } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const res = await makeRequest.get(`/stories`);
      return res.data;
    },
  });

  return (
    <div className="stories">
      {isUserError ? (
        <p>Error: {isUserError.message}</p>
      ) : isUserPending ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="story">
            <img src={"/upload/" + userData.profile_pic} alt="profile" />
            <span>{userData.name}</span>
            <button onClick={() => setIsShowUpload(true)}>+</button>
          </div>

          {isStoriesError ? (
            <p>Error: {isStoriesError.message}</p>
          ) : isStoriesPending ? (
            <p>Loading...</p>
          ) : (
            storiesData.map((story) => (
              <div className="story" key={story.id}>
                <img
                  src={"/upload/" + story.img}
                  alt="story"
                  onClick={() => setActiveStory(story)}
                />
                <span>{story.name}</span>
              </div>
            ))
          )}
        </>
      )}

      {isShowUpload && <UploadStory setIsShowUpload={setIsShowUpload} />}
      {activeStory && (
        <Story activeStory={activeStory} setActiveStory={setActiveStory} />
      )}
    </div>
  );
}

export default Stories;
