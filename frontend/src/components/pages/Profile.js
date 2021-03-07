import React, { useEffect, useState, useContext } from "react";
import { userContext } from "../../App";
import Materialize from "materialize-css";

function Profile() {
  let { state, dispatch } = useContext(userContext);
  const [posts, setPosts] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [showImgPreview, setShowImgPreview] = useState(false);
  const [imagePreview, setimagePreview] = useState("");
  useEffect(async () => {
    const res = await fetch("/myposts", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    const data = await res.json();
    if (data.error) {
      Materialize.toast({
        html: data.error,
        classes: "#c62828 red darken-3",
      });
    } else {
      setPosts(data.myPosts);
    }
    const response = await fetch("/user/" + state._id, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const userData = await response.json();
    dispatch({ type: "USER", payload: userData.user });
    state = userData.user;
  }, []);
  useEffect(() => {
    if (profilePic) {
      getImgData();
      setShowImgPreview(true);
    }
  }, [profilePic]);

  useEffect(async () => {
    try {
      if (profilePicUrl) {
        const res = await fetch("/updateProfilePic", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            image: profilePicUrl,
          }),
        });

        const updatedUser = await res.json();
        if (!updatedUser.error) {
          localStorage.setItem("user", JSON.stringify(updatedUser));
          dispatch({ type: "USER", payload: updatedUser });
          setShowImgPreview(false);
          setimagePreview("");
          setProfilePicUrl("");
        } else {
          Materialize.toast({
            html: updatedUser.error,
            classes: "#c62828 red darken-3",
          });
        }
      }
    } catch (e) {
      Materialize.toast({
        html: "Something went wrong",
        classes: "#c62828 red darken-3",
      });
    }
  }, [profilePicUrl]);

  const uploadProfilePic = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", profilePic);
      formData.append("upload_preset", "social");
      formData.append("cloud_name", "dtxxxx");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dtxxxxxxx/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const uploadedImageData = await res.json();
      setProfilePicUrl(uploadedImageData.url);
      setProfilePic("");
    } catch (e) {
      Materialize.toast({
        html: "Something went wrong",
        classes: "#c62828 red darken-3",
      });
    }
  };
  function getImgData() {
    const files = profilePic;
    if (files) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.onloadend = function () {
        setimagePreview(this.result);
      };
    }
  }
  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px auto",
          gap: "20px",
          paddingBottom: "15px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div className="profile-details" style={{ flexGrow: 1 }}>
          <form onSubmit={uploadProfilePic} encType="multipart/form-data">
            <div className="upload-btn-wrapper">
              {showImgPreview ? (
                <img className="profile-image" src={imagePreview} />
              ) : (
                <img
                  className="profile-image"
                  src={state ? `${state.profilePic}` : ""}
                />
              )}
              <input
                onChange={(e) => {
                  setProfilePic(e.target.files[0]);
                }}
                type="file"
                name="image"
              />
            </div>
            {showImgPreview && (
              <button
                style={{ borderRadius: "5px" }}
                className="btn waves-effect waves-light #64b5f6 blue update-profile-pic-btn"
              >
                upload
              </button>
            )}
          </form>
        </div>
        <div style={{ flexGrow: 2 }}>
          <div className="profile-username"> {state ? state.name : ""}</div>
          <div
            className="profile-follow-details"
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            <div>{posts.length} posts</div>
            <div>{state ? state.followers.length : 0} followers</div>
            <div>{state ? state.following.length : 0} followings</div>
          </div>
        </div>
      </div>
      <div className="post-list">
        {posts.map((post) => {
          return <img key={post._id} src={post.imageUrl} className="post" />;
        })}
      </div>
    </div>
  );
}

export default Profile;
