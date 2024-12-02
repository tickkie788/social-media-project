import "./UploadStory.scss";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { useState } from "react";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function UploadStory({ setIsShowUpload }) {
  const [file, setFile] = useState(null);

  async function handleClick() {
    let imgURL = "";
    if (file) {
      imgURL = await uploadImage();
      mutation.mutate({ img: imgURL });
    }

    setFile(null);
    setIsShowUpload(false);
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

  // use react-query Mutations to refetch stories after creating one
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newStory) => {
      return makeRequest.post("/stories", newStory);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  return (
    <div className="update-story-overlay">
      <div className="update-story-modal">
        <h2>Upload an Image Story</h2>

        <label htmlFor="story">
          {!file && <AddPhotoAlternateOutlinedIcon className="upload" />}
          <input
            type="file"
            name="story"
            id="story"
            required
            onChange={(event) => setFile(event.target.files[0])}
          />
          {file && (
            <img src={URL.createObjectURL(file)} alt="added story"></img>
          )}
        </label>

        <div className="btn-group">
          <button
            disabled={!file}
            style={{ backgroundColor: !file && "lightgray" }}
            onClick={handleClick}
          >
            Upload
          </button>
          <button onClick={() => setIsShowUpload(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default UploadStory;
