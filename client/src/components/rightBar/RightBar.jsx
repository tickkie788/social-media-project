import "./RightBar.scss";
import { makeRequest } from "../../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function RightBar() {
  // Use react-query to fetch users for friend suggestions
  const {
    isPending: isSuggestionsPending,
    error: isSuggestionsError,
    data: suggestionsData,
  } = useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => {
      const res = await makeRequest.get("/users/suggestions");
      return res.data;
    },
  });

  // Use react-query to fetch friends
  const {
    isPending: isFriendsPending,
    error: isFriendsError,
    data: friendsData,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const res = await makeRequest.get("/users/friends");
      return res.data;
    },
  });

  function handleFollow(id) {
    if (isSuggestionsPending || isFriendsPending) return; // Prevent mutation if data is still loading

    let isFollowing;
    if (!friendsData) {
      // If don't have any friend
      isFollowing = false;
    } else {
      isFollowing = friendsData.map((friend) => friend.id).includes(id);
    }

    mutation.mutate({ isFollowing, id });
  }

  // use react-query Mutations to follow or unfollow a user
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ isFollowing, id }) => {
      if (isFollowing) {
        return makeRequest.delete(`/follow?userId=${id}`);
      } else {
        return makeRequest.post(`/follow`, { userId: id });
      }
    },
    onSuccess: () => {
      // Invalidate and refetch suggestions and friends
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["followersId"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  return (
    <div className="rightBar">
      <div className="container">
        {/* Suggestions tab */}
        <div className="item">
          <span>Suggestions</span>
          {isSuggestionsError ? (
            <p>Error: {isSuggestionsError.message}</p>
          ) : isSuggestionsPending ? (
            <p>Loading...</p>
          ) : !suggestionsData ? (
            <p>No friends to suggest.</p>
          ) : (
            suggestionsData.map((user) => (
              <div key={user.id} className="user">
                <Link
                  to={`/profile/${user.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="userInfo">
                    <img src={"/upload/" + user.profile_pic} alt="profile" />
                    <span>{user.name}</span>
                  </div>
                </Link>

                <div className="buttons">
                  <button onClick={() => handleFollow(user.id)}>Follow</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Online friends tab */}
        <div className="item">
          <span>Online Friends</span>
          {isFriendsError ? (
            <p>Error: {isFriendsError.message}</p>
          ) : isFriendsPending ? (
            <p>Loading...</p>
          ) : !friendsData ? (
            <p>You have no friends.</p>
          ) : (
            friendsData.map((friend) => (
              <div key={friend.id} className="user">
                <Link
                  to={`/profile/${friend.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="userInfo">
                    <img src={"/upload/" + friend.profile_pic} alt="profile" />
                    <div className="online" />
                    <span>{friend.name}</span>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
