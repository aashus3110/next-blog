"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { AiOutlineFileImage } from "react-icons/ai";

const Edit = (ctx) => {
  const CLOUD_NAME = "dfosuqxur";
  const UPLOAD_PRESET = "my_blog_project";
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Nature");
  const [photo, setPhoto] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function fetchBlog() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/blog/${ctx.params.id}`
      );

      const blog = await res.json();

      setTitle(blog.title);
      setDesc(blog.desc);
      setCategory(blog.category);
    }
    fetchBlog();
  }, []);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p className={classes.accessDenied}>Access Denied</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title === "" || category === "" || desc === "") {
      toast.error("All fields are required");
      return;
    }

    try {
      let imageUrl = null;
      if (photo) {
        imageUrl = await uploadImage();
      }

      const body = {
        title,
        desc,
        category,
      };

      if (imageUrl != null) {
        body.imageUrl = imageUrl;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/blog/${ctx.params.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          method: "PUT",
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        throw new Error("Error has occured");
      }

      const blog = await res.json();

      router.push(`/blog/${blog?._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async () => {
    if (!photo) return;

    const formData = new FormData();

    formData.append("file", photo);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      const imageUrl = data["secure_url"];

      return imageUrl;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              value={title}
              type="text"
              placeholder="Title..."
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="mb-4">
            <textarea
              value={desc}
              rows={10}
              placeholder="Description..."
              onChange={(e) => setDesc(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="mb-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-400"
            >
              <option value="Nature">Nature</option>
              <option value="Mountain">Mountain</option>
              <option value="Ocean">Ocean</option>
              <option value="Wildlife">Wildlife</option>
              <option value="Forest">Forest</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="cursor-pointer flex gap-3 items-center">
              Upload Image <AiOutlineFileImage />
              <input
                id="image"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </label>
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            type="submit"
          >
            Edit
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Edit;
