import "./Comments.scss";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

function Comments({ postId }) {
  // State
  const [description, setDescription] = useState("");

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

  // use react-query to fetch comments
  const {
    isPending: isCommentsPending,
    error: isCommentsError,
    data: commentsData,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await makeRequest.get(`/comments?postId=${postId}`);
      return res.data;
    },
  });

  // use react-query Mutations to refetch comments after creating one
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  // Create a comment
  function handleSubmit(event) {
    event.preventDefault();
    mutation.mutate({ description, postId });
    setDescription("");
  }

  return (
    <div className="comments">
      {isUserError ? (
        <p>Error: {isUserError.message}</p>
      ) : isUserPending ? (
        <p>Loading...</p>
      ) : (
        <div className="create-comment">
          <img src={"/upload/" + userData.profile_pic} alt="user profile" />
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="comment"
              placeholder="Write a comment"
              required
              autoComplete="off"
              onChange={(event) => setDescription(event.target.value)}
              value={description}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}

      {isCommentsError ? (
        <p>Error: {isCommentsError.message}</p>
      ) : isCommentsPending ? (
        <p>Loading comments...</p>
      ) : (
        commentsData.map((comment) => (
          <div key={comment.id} className="comment">
            <img src={"/upload/" + comment.profile_pic} alt="profile" />
            <div className="details">
              <span>{comment.name}</span>
              <p>{comment.description}</p>
            </div>
            <div className="date">{moment(comment.createat).fromNow()}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default Comments;
