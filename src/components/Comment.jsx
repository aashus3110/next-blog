import React from "react";
import { useSession } from "next-auth/react";
import { format } from "timeago.js";
import Daco from "@/components/assets/Daco.png";
import { BsTrash } from "react-icons/bs";
import Image from "next/image";

const Comment = ({ comment, setComments }) => {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const handleDeleteComment = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/comment/${comment?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "DELETE",
        }
      );

      setComments((prev) => {
        return [...prev].filter((c) => c?._id !== comment?._id);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white p-4 mb-4 rounded-lg shadow-lg">
      <div className="flex items-center">
        <div className="mr-4">
          <Image src={Daco} width={45} height={45} alt="" className="rounded-full" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold">{comment?.authorId?.username}</h4>
          <span className="text-gray-500 text-sm">{format(comment?.createdAt)}</span>
        </div>
        <div>
          {session?.user?._id === comment?.authorId?._id && (
            <BsTrash
              className="text-red-500 cursor-pointer"
              onClick={handleDeleteComment}
            />
          )}
        </div>
      </div>
      <p className="mt-2 font-semibold mx-auto w-fit">{comment?.text}</p>
    </div>
  );
};

export default Comment;
