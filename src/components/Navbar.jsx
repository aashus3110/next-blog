"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Daco from "@/components/assets/Daco.png";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: session } = useSession();

  const handleShowDropdown = () => setShowDropdown((prev) => true);

  const handleHideDropdown = () => setShowDropdown((prev) => false);

  const loggedIn = false;

  return (
    <div
      className={`sticky z-[999] h-16 w-full bg-white shadow-lg rounded-b-md flex justify-center items-center top-0 left-0`}
    >
      <div
        className={`w-[85%] mx-auto flex justify-between items-center relative`}
      >
        <h2 className={`text-3xl text-emerald-500 font-bold`}>
          <Link href="/">AashutoshSingh</Link>
        </h2>
        <ul className={`flex items-center gap-5`}>
          {session?.user ? (
            <div>
              <Image
                className="object-cover rounded-full cursor-pointer"
                onClick={handleShowDropdown}
                src={Daco}
                width="45"
                height="45"
                alt="Picture of the author"
              />
              {showDropdown && (
                <div
                  className={`absolute bg-slate-400 py-6 px-2 flex flex-col items-center gap-5 top-10 -right-6 rounded-lg`}
                >
                  <AiOutlineClose
                    className={`absolute top-[0.3rem] right-1.5 cursor-pointer`}
                    onClick={handleHideDropdown}
                  />
                  <button
                    onClick={() => {
                      signOut();
                      handleHideDropdown();
                    }}
                    className={`mx-auto px-4 m-2 py-1 border-none text-white rounded-lg font-bold text-sm bg-emerald-500`}
                  >
                    Logout
                  </button>
                  <Link
                    onClick={handleHideDropdown}
                    href="/create-blog"
                    className={`text-white text-sm font-medium`}
                  >
                    Create
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => {
                  signIn();
                }}
                className={`outline-none border-none px-6 py-1.5 text-sm bg-green-500 text-white rounded-xl cursor-pointer`}
              >
                Log in
              </button>
              <Link href="/register">Register</Link>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
