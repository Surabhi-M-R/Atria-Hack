import { useEffect, useState } from "react";
import { useAuth } from "../store/auth-context";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { API } = useAuth();

  const getAllBlogs = async () => {
    try {
      console.log('Fetching blogs from:', `${API}/api/blogs`);
      const response = await fetch(`${API}/api/blogs`);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Blogs data received:', data);
      if (response.ok) {
        setBlogs(data);
      } else {
        console.error('Failed to fetch blogs:', data);
        toast.error("Failed to fetch blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Error loading blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  return (
    <section className="section-blog">
      <div className="container">
        <h1>Our Blog</h1>
        <div className="blog-grid">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog._id} className="blog-card">
                <h2>{blog.title}</h2>
                <p className="blog-date">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <div className="blog-content">
                  {blog.content.split("\n").map((paragraph, index) => (
                    <p key={index}>
                      {paragraph}
                      <br />
                    </p>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="no-blogs">
              <p>No blog posts available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;
