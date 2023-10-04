import BlogCard from "@/components/BlogCard";
import { blogs } from "@/lib/data";
import Image from "next/image";

export async function fetchBlogs() {
  const res = await fetch("http://localhost:3000/api/blog", {
    cache: "no-store",
  });

  return res.json();
}

export default async function Home() {
  const blogs = await fetchBlogs();

  return (
    <div className={`h-full w-full`}>
      {blogs?.length > 0 && (
        <h2 className="text-center mt-6 text-3xl">
          AashutoshSingh&apos;s Blog Website
        </h2>
      )}
      <div className={`h-full w-[85%] mx-auto mt-10 flex flex-wrap gap-5`}>
        {blogs?.length > 0 ? (
          blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        ) : (
          <h3 className={classes.noBlogs}>No blogs are currently in the</h3>
        )}
      </div>
    </div>
  );
}
