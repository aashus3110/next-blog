"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BsFillPencilFill } from "react-icons/bs";
import { AiFillDelete, AiFillLike, AiOutlineLike } from "react-icons/ai";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "timeago.js";
import { useRouter } from "next/navigation";
import Comment from "@/components/Comment";
import Daco from "@/components/assets/Daco.png";

const BlogDetails = (ctx) => {
  const [blogDetails, setBlogDetails] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [blogLikes, setBlogLikes] = useState(0);

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function fetchComments() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/comment/${ctx.params.id}`,
        {
          cache: "no-store",
        }
      );
      const comments = await res.json();

      setComments(comments);
    }
    fetchComments();
  }, []);

  useEffect(() => {
    async function fetchBlog() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/blog/${ctx.params.id}`,
        {
          cache: "no-store",
        }
      );
      const blog = await res.json();

      setBlogDetails(blog);
      setIsLiked(blog?.likes?.includes(session?.user?._id));
      setBlogLikes(blog?.likes?.length || 0);
    }
    session && fetchBlog();
  }, [session]);

  const handleDelete = async () => {
    try {
      const confirmModal = confirm(
        "Are you sure you want to delete your blog?"
      );

      if (confirmModal) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/blog/${ctx.params.id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
            method: "DELETE",
          }
        );

        if (res.ok) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/blog/${ctx.params.id}/like`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          method: "PUT",
        }
      );

      console.log(res);
      if (res.ok) {
        if (isLiked) {
          setIsLiked((prev) => !prev);
          setBlogLikes((prev) => prev - 1);
        } else {
          setIsLiked((prev) => !prev);
          setBlogLikes((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    if (commentText?.length < 2) {
      toast.error("Comment must be at least 2 characters long");
      return;
    }

    try {
      const body = {
        blogId: ctx.params.id,
        authorId: session?.user?._id,
        text: commentText,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/comment`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(body),
      });

      const newComment = await res.json();

      setComments((prev) => {
        return [newComment, ...prev];
      });

      setCommentText("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <Image
              alt="Blog Img "
              src={blogDetails?.imageUrl}
              width="250"
              height="250"
              className="lg:w-1/2 w-full lg:h-[35rem] h-64 object-fill object-center rounded-md"
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                Category :- <span>{blogDetails?.category}</span>
              </h2>
              <div className="flex justify-around">
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                  {blogDetails?.title}
                </h1>
                <div className="flex items-center gap-2">
                  {blogLikes}{" "}
                  {isLiked ? (
                    <AiFillLike size={20} onClick={handleLike} />
                  ) : (
                    <AiOutlineLike size={20} onClick={handleLike} />
                  )}
                </div>
              </div>
              <div className="my-5">
                {blogDetails?.authorId?._id.toString() ===
                session?.user?._id.toString() ? (
                  <div className="flex items-center justify-center gap-3">
                    <Link
                      className="flex gap-3 items-center border border-emerald-600 rounded-md px-4 py-1 bg-emerald-400 hover:border-2 text-emerald-900"
                      href={`/blog/edit/${ctx.params.id}`}
                    >
                      Edit <BsFillPencilFill />
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="flex gap-3 items-center border border-rose-600 rounded-md px-4 py-1 bg-rose-400 hover:border-2 text-emerald-900"
                    >
                      Delete
                      <AiFillDelete />
                    </button>
                  </div>
                ) : (
                  <div className="">
                    Author: <span>{blogDetails?.authorId?.username}</span>
                  </div>
                )}
              </div>

              <p className="leading-relaxed text-black text-sm overflow-y-scroll h-80 ">
                {blogDetails?.desc}
              </p>

              <p className="text-black text-sm font-semibold my-4">
                Posted: <span>{format(blogDetails?.createdAt)}</span>
              </p>
            </div>
          </div>
          <div className="my-10 mx-4 sm:mx-20">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-2 mb-4 gap-4">
                <Image
                  src={Daco}
                  width="45"
                  height="45"
                  alt=""
                  className="w-10 h-10 sm:w-16 sm:h-16 rounded-full"
                />
                <input
                  value={commentText}
                  type="text"
                  placeholder="Type message..."
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full sm:w-1/2 border rounded-md py-2 px-3"
                />
                <button
                  onClick={handleComment}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  Post
                </button>
              </div>
              <div className="space-y-4">
                {comments?.length > 0 ? (
                  comments.map((comment) => (
                    <Comment
                      key={comment._id}
                      comment={comment}
                      setComments={setComments}
                    />
                  ))
                ) : (
                  <h4 className="text-gray-600">
                    No comments. Be the first one to leave a comment!
                  </h4>
                )}
              </div>
            </div>
            <ToastContainer />
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
