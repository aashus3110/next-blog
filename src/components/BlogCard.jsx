"use client";

import React, { useState, useEffect } from "react"; // Import useState and useEffect
import Image from "next/image";
import Link from "next/link";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useSession } from "next-auth/react";

const BlogCard = ({
  blog: { title, desc, imageUrl, likes, _id, category },
}) => {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [blogLikes, setBlogLikes] = useState(0);

  useEffect(() => {
    if (session && likes) {
      setIsLiked(likes.includes(session?.user?._id));
      setBlogLikes(likes.length);
    }
  }, [likes, session]);

  const truncatedDesc = desc.slice(0, 100);
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
    <>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            <div className="p-4 md:w-1/3 ">
              <div className="h-full p-4 bg-white border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <Link href={`/blog/${_id}`}>
                  <Image
                    src={imageUrl}
                    width="500"
                    height="500"
                    className="hover:scale-x-125 duration-500 h-60 w-full"
                    alt="Picture of the author"
                    
                  />
                </Link>
                <div className="p-6">
                  <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                    {category}
                  </h2>
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                    {title}
                  </h1>
                  <p className="leading-relaxed mb-3">
                    {truncatedDesc}
                    {desc.length > 100 ? "..." : ""}
                  </p>
                  <div className="flex justify-around">
                    <Link
                      href={`/blog/${_id}`}
                      class="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0 hover:text-rose-400"
                    >
                      Read More
                    </Link>
                    <span className="text-gray-400 flex gap-2 items-center leading-none text-base">
                      {blogLikes}
                      {isLiked ? (
                        <AiFillLike onClick={handleLike} size={20} />
                      ) : (
                        <AiOutlineLike onClick={handleLike} size={20} />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogCard;
