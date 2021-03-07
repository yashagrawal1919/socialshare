import React, { useEffect, useState, useContext } from "react";
import { userContext } from "../../App";
import { useParams } from "react-router-dom";
import Materialize from "materialize-css";

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const { state, dispatch } = useContext(userContext);
  const { userId } = useParams();
  const [showfollow, setShowFollow] = useState(true);
  useEffect(async () => {
    const res = await fetch(`/user/${userId}`, {
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
      setUserProfile(data);
    }
    const userData = JSON.parse(localStorage.getItem("user"));
    setShowFollow(data.user.followers.includes(userData._id) ? false : true);
  }, []);
  const followUser = async () => {
    try {
      const res = await fetch("/follow", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          followId: userId,
        }),
      });
      const updatedUser = await res.json();
      dispatch({
        type: "UPDATE",
        payload: {
          following: updatedUser.user.following,
          followers: updatedUser.user.followers,
        },
      });
      localStorage.setItem("user", JSON.stringify(updatedUser.user));
      setUserProfile((prevState) => {
        let index = prevState.user.followers.indexOf(updatedUser.user._id);
        if (index !== -1) {
          return prevState;
        } else {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, updatedUser.user._id],
            },
          };
        }
      });
      setShowFollow(false);
    } catch (e) {
      console.log(e);
    }
  };
  const unfollowUser = async () => {
    try {
      const res = await fetch("/unfollow", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          unfollowId: userId,
        }),
      });
      const updatedUser = await res.json();
      dispatch({
        type: "UPDATE",
        payload: {
          following: updatedUser.user.following,
          followers: updatedUser.user.followers,
        },
      });
      localStorage.setItem("user", JSON.stringify(updatedUser.user));
      setUserProfile((prevState) => {
        const newFollower = prevState.user.followers.filter(
          (item) => item != updatedUser.user._id
        );
        return {
          ...prevState,
          user: {
            ...prevState.user,
            followers: newFollower,
          },
        };
      });
      setShowFollow(true);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="container">
      {userProfile && (
        <div>
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
              <img
                className="profile-image"
                src={userProfile.user.profilePic}
              />
            </div>
            <div style={{ flexGrow: 2 }}>
              <div className="profile-username">
                {" "}
                {userProfile ? userProfile.user.name : ""}
              </div>
              {showfollow ? (
                <button
                  onClick={() => followUser()}
                  style={{
                    margin: "15px 0",
                    borderRadius: "5px",
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                >
                  follow
                </button>
              ) : (
                <button
                  onClick={() => unfollowUser()}
                  style={{
                    margin: "15px 0",
                    borderRadius: "5px",
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                >
                  unfollow
                </button>
              )}
              <div
                className="profile-follow-details"
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                <div>{userProfile.posts.length} posts</div>
                <div>{userProfile.user.followers.length} followers</div>
                <div>{userProfile.user.following.length} followings</div>
              </div>
            </div>
          </div>
          <div className="post-list">
            {userProfile.posts.map((post) => {
              return (
                <img key={post._id} src={post.imageUrl} className="post" />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
