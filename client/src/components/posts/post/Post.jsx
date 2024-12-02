import "./Post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import moment from "moment";
import Comments from "../../comments/Comments";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { AuthContext } from "../../../context/authContext";

function Post({ post }) {
  // States
  const [isShowComments, setIsShowComments] = useState(false);
  const [isShowDelete, setIsShowDelete] = useState(false);

  // Context
  const { currentUser } = useContext(AuthContext);

  // ****** LIKE AND UNLIKE ******
  // use react-query to fetch IDs of users who liked this post
  const {
    isPending: isLikesPending,
    error: isLikesError,
    data: likesData,
  } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: async () => {
      const res = await makeRequest.get(`/likes?postId=${post.id}`);
      return res.data;
    },
  });

  // use react-query Mutations to like or unlike
  const queryClient = useQueryClient();
  const likeMutation = useMutation({
    mutationFn: (isLike) => {
      if (isLike) {
        return makeRequest.delete(`/likes?postId=${post.id}`);
      } else {
        return makeRequest.post(`/likes`, { postId: post.id });
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });

  // Function to handle the like/unlike post button
  async function handleLike() {
    // Check if the current user's ID is already in the list of users who liked the post
    await likeMutation.mutate(likesData.includes(currentUser.id));
  }

  // ****** DELETE POST ******
  // use react-query Mutations to delete a post
  const deletePostMutation = useMutation({
    mutationFn: (postId) => {
      return makeRequest.delete(`/posts/${postId}`);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Function to handle the delete post button
  function handleDelete() {
    deletePostMutation.mutate(post.id);
  }

  // ****** USER DATA AND COMMENTS ******
  // use react-query to fetch user data
  const {
    isPending: isUserPending,
    error: isUserError,
    data: userData,
  } = useQuery({
    queryKey: ["user", post.user_id],
    queryFn: async () => {
      const res = await makeRequest.get(`/users/find/${post.user_id}`);
      return res.data;
    },
  });

  // use react-query to fetch comments
  const {
    isPending: isCommentsPending,
    error: isCommentsError,
    data: commentsData,
  } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: async () => {
      const res = await makeRequest.get(`/comments?postId=${post.id}`);
      return res.data;
    },
  });

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="info">
            {isUserError ? (
              <p>Error: {isUserError.message}</p>
            ) : isUserPending ? (
              <p>Loading...</p>
            ) : (
              <img src={"/upload/" + userData.profile_pic} alt="profile" />
            )}

            <div className="details">
              <Link
                to={`/profile/${post.user_id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
                <span className="date">{moment(post.createat).fromNow()}</span>
              </Link>
            </div>
          </div>

          <MoreHorizIcon
            className="more-btn"
            onClick={() => setIsShowDelete(!isShowDelete)}
          />
          {isShowDelete && post.user_id === currentUser.id && (
            <button className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>

        <div className="content">
          <p>{post.description}</p>
          {post.img && <img src={"/upload/" + post.img} alt="post" />}
        </div>

        <div className="btn">
          <div className="item">
            {isLikesError ? (
              <p>Error: {isLikesError.message}</p>
            ) : isLikesPending ? (
              <p>Loading...</p>
            ) : likesData.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "lightcoral" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}

            {likesData && `${likesData.length} Likes`}
          </div>

          <div
            className="item"
            onClick={() => setIsShowComments(!isShowComments)}
          >
            <TextsmsOutlinedIcon />
            {isCommentsError ? (
              <p>Error: {isCommentsError.message}</p>
            ) : isCommentsPending ? (
              <p>Loading...</p>
            ) : (
              `${commentsData.length} Comments`
            )}
          </div>

          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>

        {isShowComments && <Comments postId={post.id} />}
      </div>
    </div>
  );
}

export default Post;
