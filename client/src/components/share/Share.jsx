import "./Share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { makeRequest } from "../../axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

function Share() {
  // States
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

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

  // use react-query Mutations to refetch posts after creating one
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  async function handleClick() {
    let imgURL = "";
    if (file) {
      imgURL = await uploadImage();
    }

    mutation.mutate({ description, img: imgURL });

    setDescription("");
    setFile(null);
  }

  async function uploadImage() {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await makeRequest.post("/upload", formData);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          {error ? (
            <p>Error: {error.message}</p>
          ) : isPending ? (
            <p>Loading...</p>
          ) : (
            <div className="left">
              <img src={"/upload/" + data.profile_pic} alt="avatar" />
              <input
                type="text"
                placeholder={`What's on your mind ${data.name}?`}
                onChange={(event) => setDescription(event.target.value)}
                value={description}
              />
            </div>
          )}

          <div className="right">
            {file && (
              <img src={URL.createObjectURL(file)} alt="added file"></img>
            )}
          </div>
        </div>

        <hr />

        <div className="bottom">
          <div className="left">
            <input
              type="file"
              name="file"
              id="file"
              style={{ display: "none" }}
              onChange={(event) => setFile(event.target.files[0])}
            />

            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="add file" />
                <span>Add Image</span>
              </div>
            </label>

            <div className="item">
              <img src={Map} alt="map" />
              <span>Add Place</span>
            </div>

            <div className="item">
              <img src={Friend} alt="friend" />
              <span>Tag Friends</span>
            </div>
          </div>

          <div className="right">
            <button type="button" onClick={handleClick}>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Share;
