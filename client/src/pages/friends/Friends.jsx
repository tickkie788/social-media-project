import "./Friend.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Link } from "react-router-dom";

function Friends() {
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
    <div className="friends">
      <div className="container">
        <h3>
          {isFriendsError ? (
            <p>Error: {isFriendsError.message}</p>
          ) : isFriendsPending ? (
            <p>Loading...</p>
          ) : friendsData.length > 0 ? (
            `${friendsData.length} Friends`
          ) : (
            "You have no friends."
          )}
        </h3>

        <div className="list">
          {isFriendsError ? (
            <p>Error: {isFriendsError.message}</p>
          ) : isFriendsPending ? (
            <p>Loading...</p>
          ) : !friendsData ? (
            ""
          ) : (
            friendsData.map((friend) => (
              <Link
                to={`/profile/${friend.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                key={friend.id}
              >
                <div className="card">
                  <img src={"/upload/" + friend.profile_pic} alt="profile" />
                  <span>{friend.name}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="container">
        <h3>Suggestions</h3>

        <div className="list">
          {isSuggestionsError ? (
            <p>Error: {isSuggestionsError.message}</p>
          ) : isSuggestionsPending ? (
            <p>Loading...</p>
          ) : !suggestionsData ? (
            <p>No suggestion.</p>
          ) : (
            suggestionsData.map((user) => (
              <div className="suggestion-card" key={user.id}>
                <Link
                  to={`/profile/${user.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="info">
                    <img src={"/upload/" + user.profile_pic} alt="profile" />
                    <span>{user.name}</span>
                  </div>
                </Link>

                <button onClick={() => handleFollow(user.id)}>Follow</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Friends;
