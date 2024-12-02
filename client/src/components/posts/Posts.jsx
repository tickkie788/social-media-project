import "./Posts.scss";
import Post from "./post/Post";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

function Posts({ userId }) {
  // use react-query to fetch posts
  const { isPending, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await makeRequest.get(`/posts?userId=${userId}`);
      return res.data;
    },
  });

  return (
    <div className="posts">
      {error ? (
        <p>Opps!, Something went wrong.</p>
      ) : isPending ? (
        <p>Loading feed...</p>
      ) : (
        data.map((item) => <Post key={item.id} post={item} />)
      )}
    </div>
  );
}

export default Posts;
