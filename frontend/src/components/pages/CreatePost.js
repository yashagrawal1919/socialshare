import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Materialize from "materialize-css";
import useInput from "../../Hooks/useInput";

function CreatePost() {
  const [title, clearTitle, setTitle] = useInput("");
  const [description, clearDescription, setDescription] = useInput("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const history = useHistory();

  useEffect(async () => {
    try {
      if (imageUrl) {
        console.log({
          title,
          description,
          image: imageUrl,
        });
        const res = await fetch("/create-post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            title,
            description,
            image: imageUrl,
          }),
        });
        const createdPost = await res.json();
        if (createdPost.error) {
          Materialize.toast({
            html: createdPost.error,
            classes: "#c62828 red darken-3",
          });
        } else {
          Materialize.toast({
            html: createdPost.message,
            classes: "#2e7d32 green darken-3",
          });
          clearTitle();
          clearDescription();
          setImageUrl("");
          history.push("/profile");
        }
      }
    } catch (e) {
      Materialize.toast({
        html: "Something went wrong",
        classes: "#c62828 red darken-3",
      });
    }
  }, [imageUrl]);

  const uploadImage = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "social");
      formData.append("cloud_name", "dtxxxxxx");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dtxxxxxxx/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const uploadedImageData = await res.json();
      setImageUrl(uploadedImageData.url);
      setImage("");
    } catch (e) {
      Materialize.toast({
        html: "Something went wrong",
        classes: "#c62828 red darken-3",
      });
    }
  };

  return (
    <div className="card create-post-card input-field">
      <div className="form-title">Add New Post</div>
      <form onSubmit={uploadImage} encType="multipart/form-data">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          type="text"
          placeholder="Title"
        />
        <input
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          type="text"
          placeholder="Description"
        />
        <div className="selected-images-list">
          <div className="selected-image-name">
            {image && <span>{image.name}</span>}
          </div>
        </div>
        <div className="upload-btn-wrapper">
          <button className="btn">Add Image</button>
          <input
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
            type="file"
            name="image"
          />
        </div>
        <button
          style={{ margin: "15px 0", borderRadius: "5px" }}
          className="btn waves-effect waves-light #64b5f6 blue"
        >
          Add Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
