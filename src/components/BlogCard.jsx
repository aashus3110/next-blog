"use client";

import React, { useState, useEffect } from "react"; // Import useState and useEffect
import Image from "next/image";
import Link from "next/link";
import classes from "@/components/css/blogCard.module.css";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useSession } from "next-auth/react";

const BlogCard = ({ blog: { title, desc, imageUrl, likes, _id } }) => {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [blogLikes, setBlogLikes] = useState(0);

  useEffect(() => {
    if (session && likes) {
      setIsLiked(likes.includes(session?.user?._id));
      setBlogLikes(likes.length);
    }
  }, [likes, session]);

  const truncatedDesc = desc.slice(0, 15);

  const handleLike = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/blog/${_id}/like`,
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
          setIsLiked(false);
          setBlogLikes((prev) => prev - 1);
        } else {
          setIsLiked(true);
          setBlogLikes((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`w-[23%] h-[450px] shadow-md duration-150 rounded-xl hover:shadow-xl`}
    >
      <div className={`p-5 w-full h-full flex flex-col`}>
        <Link className={classes.imgContainer} href={`/blog/${_id}`}>
          <Image
            src={imageUrl}
            width="350"
            height="350"
            className="object-cover rounded-3xl w-full mx-auto shadow-md"
            alt="Picture of the author"
          />
        </Link>
        <div className={`ml-3 flex justify-between items-center`}>
          <div className={``}>
            <h3 className="text-lg font-bold my-6">{title}</h3>
            <p className="text-lg font-semibold my-6">
              {truncatedDesc}
              {desc.length > 15 ? "..." : ""}
            </p>
          </div>

          <div className={`flex gap-2`}>
            {blogLikes}{" "}
            {isLiked ? (
              <AiFillLike onClick={handleLike} size={20} />
            ) : (
              <AiOutlineLike onClick={handleLike} size={20} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
