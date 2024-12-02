import "./UpdateProfile.scss";
import { useState } from "react";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

function UpdateProfile({ setShowUpdateModal, user }) {
  //States
  const [inputs, setInputs] = useState({
    name: user.name || "",
    city: user.city || "",
    website: user.website || "",
  });
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setInputs((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  // use mutation for updating user data and trigger a refetch
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (user) => {
      return makeRequest.put("/users", user);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  async function handleSubmit(event) {
    event.preventDefault();

    // If an image is uploaded through a file input
    let coverURL = coverImg ? await uploadImage(coverImg) : user.cover_pic;
    let profileURL = profileImg
      ? await uploadImage(profileImg)
      : user.profile_pic;

    mutation.mutate({
      ...inputs,
      cover_pic: coverURL,
      profile_pic: profileURL,
    });

    setShowUpdateModal(false);
  }

  async function uploadImage(file) {
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
    <div className="update-profile-overlay">
      <div className="update-profile-modal">
        <div className="top-section">
          <h2>Update Profile</h2>
          <button onClick={() => setShowUpdateModal(false)}>X</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-img">
            <label htmlFor="cover">
              Change Cover
              <AddPhotoAlternateOutlinedIcon />
            </label>
            <input
              type="file"
              name="cover"
              id="cover"
              onChange={(event) => setCoverImg(event.target.files[0])}
            />
            {coverImg && (
              <img src={URL.createObjectURL(coverImg)} alt="added cover"></img>
            )}

            <label htmlFor="profile">
              Change Profile
              <AddPhotoAlternateOutlinedIcon />
            </label>
            <input
              type="file"
              name="profile"
              id="profile"
              onChange={(event) => setProfileImg(event.target.files[0])}
            />
            {profileImg && (
              <img
                src={URL.createObjectURL(profileImg)}
                alt="added profile"
              ></img>
            )}
          </div>

          <div className="form-text">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              autoComplete="off"
              spellCheck="false"
              required
              onChange={handleChange}
              value={inputs.name}
            />
            <label htmlFor="city">City</label>
            <input
              type="city"
              name="city"
              placeholder="City"
              autoComplete="off"
              spellCheck="false"
              onChange={handleChange}
              value={inputs.city}
            />
            <label htmlFor="website">Website</label>
            <input
              type="website"
              name="website"
              placeholder="Website"
              autoComplete="off"
              spellCheck="false"
              onChange={handleChange}
              value={inputs.website}
            />
          </div>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
