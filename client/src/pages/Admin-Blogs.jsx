import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth-context";
import "./AdminContent.css";

const initialFormState = {
    title: "",
    content: "",
    author: "",
    tags: "",
};

export const AdminBlogs = () => {
    const { API, authorizationToken } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchBlogs = useCallback(async () => {
        try {
            const response = await fetch(`${API}/api/admin/blogs`, {
                headers: {
                    Authorization: authorizationToken,
                },
            });

            if (!response.ok) {
                throw new Error(`Unable to fetch blogs. Status ${response.status}`);
            }

            const data = await response.json();
            setBlogs(data);
        } catch (error) {
            console.error("Failed to load blogs", error);
            toast.error("Unable to load blogs");
        }
    }, [API, authorizationToken]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateBlog = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                tags: formData.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
            };

            const response = await fetch(`${API}/api/admin/blogs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const body = await response.json();
                throw new Error(body.message || "Unable to create blog post");
            }

            toast.success("Blog post published");
            setFormData(initialFormState);
            fetchBlogs();
        } catch (error) {
            console.error("Failed to create blog", error);
            toast.error(error.message || "Unable to publish blog");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this blog post?")) return;

        try {
            const response = await fetch(`${API}/api/admin/blogs/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: authorizationToken,
                },
            });

            if (!response.ok) {
                const body = await response.json();
                throw new Error(body.message || "Unable to delete blog post");
            }

            toast.success("Blog deleted");
            fetchBlogs();
        } catch (error) {
            console.error("Failed to delete blog", error);
            toast.error(error.message || "Unable to delete blog");
        }
    };

    return (
        <section className="admin-section admin-section--blogs">
            <div className="admin-header">
                <h1>Blog Management</h1>
                <p>
                    Publish fresh stories, product updates, and behind-the-scenes news. Share your
                    narrative with the world in just a few clicks.
                </p>
            </div>

            <div className="admin-grid">
                <div className="admin-card admin-form-card">
                    <h2>Publish a New Blog</h2>
                    <form className="admin-form" onSubmit={handleCreateBlog}>
                        <div className="admin-form-group">
                            <label htmlFor="blog-title">Title</label>
                            <input
                                id="blog-title"
                                name="title"
                                type="text"
                                placeholder="Eg. 5 Ways AI is Transforming Healthcare"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label htmlFor="blog-author">Author</label>
                            <input
                                id="blog-author"
                                name="author"
                                type="text"
                                placeholder="Eg. Surabhi M R"
                                required
                                value={formData.author}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label htmlFor="blog-tags">Tags (comma separated)</label>
                            <input
                                id="blog-tags"
                                name="tags"
                                type="text"
                                placeholder="technology, culture, case study"
                                value={formData.tags}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label htmlFor="blog-content">Content</label>
                            <textarea
                                id="blog-content"
                                name="content"
                                rows={6}
                                placeholder="Start writing engaging content for your readers..."
                                required
                                value={formData.content}
                                onChange={handleInputChange}
                            />
                        </div>

                        <button className="admin-primary-btn" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Publishing..." : "Publish Blog"}
                        </button>
                    </form>
                </div>

                <div className="admin-card admin-table-card">
                    <div className="admin-table-header">
                        <h2>Live Posts</h2>
                        <p>{blogs.length} post{blogs.length === 1 ? "" : "s"} published</p>
                    </div>
                    <div className="admin-table-wrapper" role="region" aria-live="polite">
                        {blogs.length === 0 ? (
                            <div className="empty-state">
                                <p>No blog posts published yet. Be the first to share a story!</p>
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Title</th>
                                        <th scope="col">Author</th>
                                        <th scope="col">Tags</th>
                                        <th scope="col">Published</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blogs.map((blog) => (
                                        <tr key={blog._id}>
                                            <td>{blog.title}</td>
                                            <td>{blog.author}</td>
                                            <td>
                                                {(blog.tags || []).length === 0 ? (
                                                    <span className="tag-chip">general</span>
                                                ) : (
                                                    (blog.tags || []).map((tag) => (
                                                        <span key={tag} className="tag-chip">
                                                            {tag}
                                                        </span>
                                                    ))
                                                )}
                                            </td>
                                            <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    className="admin-delete-btn"
                                                    type="button"
                                                    onClick={() => handleDelete(blog._id)}
                                                    aria-label={`Delete blog ${blog.title}`}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
