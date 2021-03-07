import React, { useState, useEffect, useContext } from "react";
import { userContext } from "../../App";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import Materialize from "materialize-css";

function Explore() {
  const [posts, setPosts] = useState("");
  const [currentPageNum, setCurrentPageNum] = useState(1);
  let { state, dispatch } = useContext(userContext);

  const history = useHistory();
  useEffect(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      state = user;
      dispatch({ type: "USER", payload: user });
    }
    const res = await fetch("/posts?page=" + currentPageNum, {
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
    }
    if (state) {
      setPosts([
        ...posts,
        ...data.posts.map((post) => {
          let hasLiked;
          if (post.likes.toString().indexOf(state._id) === -1) {
            hasLiked = false;
          } else {
            hasLiked = true;
          }
          return {
            ...post,
            hasLiked: hasLiked,
          };
        }),
      ]);
    } else {
      history.push("/login");
    }
  }, [currentPageNum]);

  const updateLikes = async (e, postId) => {
    try {
      const targetPost = posts.filter((post) => post._id === postId);
      const res = await fetch("/updateLikes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          postId: postId,
          hasLiked: targetPost[0].hasLiked,
          userId: state._id,
        }),
      });
      const updatedPost = await res.json();
      if (updatedPost.error) {
        Materialize.toast({
          html: updatedPost.error,
          classes: "#c62828 red darken-3",
        });
      } else {
        setPosts(
          posts.map((post) => {
            if (post._id.toString() === postId) {
              return { ...updatedPost.updatedPost, hasLiked: !post.hasLiked };
            } else {
              return post;
            }
          })
        );
      }
    } catch (e) {
      Materialize.toast({
        html: "Something went wrong",
        classes: "#c62828 red darken-3",
      });
    }
  };
  const addComment = async (text, postId) => {
    try {
      const res = await fetch("/comments", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          postId,
          text,
        }),
      });
      const updatedPost = await res.json();
      if (updatedPost.error) {
        Materialize.toast({
          html: updatedPost.error,
          classes: "#c62828 red darken-3",
        });
      } else {
        const updatedPosts = posts.map((post) => {
          if (post._id === postId) {
            const newPost = { ...post };
            newPost.comments = updatedPost.updatedPost.comments;
            return newPost;
          } else {
            return post;
          }
        });
        setPosts(updatedPosts);
      }
    } catch (e) {
      Materialize.toast({
        html: "Something went wrong",
        classes: "#c62828 red darken-3",
      });
    }
  };
  const handleSubmit = (e, postId) => {
    const text = e.target[0].value;
    addComment(text, postId);
    e.target[0].value = "";
  };
  // const deletePost = async (postId) => {
  //   try {
  //     console.log(postId);
  //     const res = await fetch(`/posts/${postId}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-type": "application/json",
  //         Authorization: localStorage.getItem("token"),
  //       },
  //     });
  //     const posts = await res.json();
  //     if (posts.error) {
  //       Materialize.toast({
  //         html: posts.error,
  //         classes: "#c62828 red darken-3",
  //       });
  //     } else {
  //       setPosts(posts.posts);
  //     }
  //   } catch (e) {
  //     Materialize.toast({
  //       html: "Something went wrong",
  //       classes: "#c62828 red darken-3",
  //     });
  //   }
  // };
  window.onscroll = function () {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
      setCurrentPageNum(currentPageNum + 1);
    }
  };
  return (
    <div className="Home">
      {posts && posts.length ? (
        posts.map((post, index) => {
          return (
            <div key={post._id} className="card">
              <div className="Home-username">
                <Link
                  to={
                    post.postedBy._id === state._id
                      ? "/profile"
                      : "/profile/" + post.postedBy._id
                  }
                >
                  {post.postedBy.name}
                </Link>
              </div>
              <div
                style={{ cursor: "pointer" }}
                onDoubleClick={(e) => {
                  updateLikes(e, post._id);
                }}
                className="image-card"
              >
                <img src={post.imageUrl} />
              </div>
              <div className="card-content">
                {post.hasLiked ? (
                  <i
                    style={{
                      fontSize: "30px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    className="fas fa-heart"
                    onClick={(e) => {
                      updateLikes(e, post._id);
                    }}
                  ></i>
                ) : (
                  <i
                    onClick={(e) => {
                      updateLikes(e, post._id);
                    }}
                    style={{ fontSize: "30px", cursor: "pointer" }}
                    className="far fa-heart"
                  ></i>
                )}
                <div>{post.likes.length} Likes</div>
                <div className="Home-post-title">{post.title}</div>

                <p>{post.description}</p>
                <div>
                  <div style={{ fontWeight: 600 }}>Comments</div>
                  {post.comments.length ? "" : <div> No commnet </div>}
                  {post.comments.map((comment) => {
                    return (
                      <div key={comment._id}>
                        <span style={{ fontSize: "1rem", fontWeight: 700 }}>
                          {comment.commenter.name}
                        </span>
                        <span>
                          {"      "}
                          {comment.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e, post._id);
                  }}
                >
                  <input type="text" placeholder="add a comment" />
                </form>
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-posts">No Posts</div>
      )}
    </div>
  );
}

export default Explore;
