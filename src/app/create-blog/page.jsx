"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineFileImage } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";

const CreateBlog = () => {
  const CLOUD_NAME = "dfosuqxur";
  const UPLOAD_PRESET = "my_blog_project";

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Nature");
  const [photo, setPhoto] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p className={classes.accessDenied}>Access Denied</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo || !title || !category || !desc) {
      toast.error("All fields are required");
      return;
    }

    try {
      const imageUrl = await uploadImage();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/blog`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify({
          title,
          desc,
          category,
          imageUrl,
          authorId: session?.user?._id,
        }),
      });

      if (!res.ok) {
        throw new Error("Error occurred");
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
    <div className="container mx-auto mt-10">
      <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden">
        <h2 className="text-2xl font-semibold p-4">Create Post</h2>
        <form onSubmit={handleSubmit} className="p-4">
          <input
            type="text"
            placeholder="Title..."
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 w-full mb-4"
          />
          <textarea
            placeholder="Description..."
            rows={10}
            onChange={(e) => setDesc(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 w-full mb-4"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 w-full mb-4"
          >
            <option value="Nature">Nature</option>
            <option value="Mountain">Mountain</option>
            <option value="Ocean">Ocean</option>
            <option value="Wildlife">Wildlife</option>
            <option value="Forest">Forest</option>
          </select>
          <label
            htmlFor="image"
            className="cursor-pointer border border-gray-300 rounded-md py-2 px-3 w-full mb-4 text-center flex items-center gap-3"
          >
            Upload Image <AiOutlineFileImage />
          </label>
          <input
            id="image"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600"
            type="submit"
          >
            Create
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateBlog;
