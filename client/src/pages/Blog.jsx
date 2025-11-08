import { useEffect, useState } from "react";
import { useAuth } from "../store/auth-context";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiCalendar, FiClock, FiUser } from "react-icons/fi";

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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Latest news, updates, and insights from our team
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article key={blog._id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                {blog.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="flex items-center mr-4">
                      <FiCalendar className="mr-1" />
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    {blog.author && (
                      <span className="flex items-center">
                        <FiUser className="mr-1" />
                        {blog.author.name || 'Admin'}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    <Link to={`/blog/${blog.slug || blog._id}`}>{blog.title}</Link>
                  </h2>
                  
                  <div className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt || blog.content.substring(0, 150) + '...'}
                  </div>
                  
                  <Link 
                    to={`/blog/${blog.slug || blog._id}`}
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    Read More
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">📭</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600">Check back soon for new content!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
