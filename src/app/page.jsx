import BlogCard from "@/components/BlogCard";
import { blogs } from "@/lib/data";

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
        <h2 className="text-center mt-6 text-3xl">Singh&apos;s Blog Site</h2>
      )}
      <div className={`w-[85%] mx-auto flex flex-wrap gap-5`}>
        {blogs?.length > 0 ? (
          blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        ) : (
          <h3 className="text-center text-3xl font-bold border-2 border-pink-500 py-2 px-5 rounded-md my-6">
            No blogs are currently in the
          </h3>
        )}
      </div>
    </div>
  );
}
