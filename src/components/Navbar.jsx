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
    <div>
      <div className="flex justify-around items-center py-4 bg-rose-500 rounded-b-lg text-white text-sm shadow-md shadow-rose-950">
        <span className="text-3xl font-mono font-semibold hover:text-red-200 duration-300">
          <Link href="/">Singh&apos;s</Link>
        </span>
        <ul>
          {session?.user ? (
            <div>
              <Image
                onClick={handleShowDropdown}
                src={Daco}
                width="45"
                height="45"
                alt="Picture of the author"
                loading="lazy"
              />
              {showDropdown && (
                <div className="absolute border border-rose-300 shadow-sm shadow-rose-700  flex flex-col px-5 py-6 right-10 sm:right-[10rem] md:right-[15rem] lg:right-[17rem] text-black text-base bg-rose-50 rounded-md">
                  <AiOutlineClose
                    onClick={handleHideDropdown}
                    className="absolute right-2 top-1 border border-rose-300 text-rose-300 hover:text-rose-800 hover:border-rose-800 duration-500 rounded-full p-1 text-xl"
                  />
                  <div className="flex flex-col gap-3 mt-2 font-semibold">
                    <button
                      className="hover:text-rose-400"
                      onClick={() => {
                        signOut();
                        handleHideDropdown();
                      }}
                    >
                      Logout
                    </button>
                    <Link
                      onClick={handleHideDropdown}
                      href="/create-blog"
                      className="hover:text-rose-400"
                    >
                      Create
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm font-semibold">
              <button
                className="border border-red-300 hover:bg-red-400 hover:text-red-600 rounded-lg py-1 px-4 mx-4 duration-300"
                onClick={() => {
                  signIn();
                }}
              >
                Log in
              </button>
              <Link
                className="hover:text-red-200 duration-300"
                href="/register"
              >
                Register
              </Link>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
