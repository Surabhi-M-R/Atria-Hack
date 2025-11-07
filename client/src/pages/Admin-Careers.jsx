import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth-context";
import "./AdminContent.css";

const initialJobForm = {
    title: "",
    description: "",
    location: "",
    employmentType: "Full-time",
    salaryRange: "",
    closingDate: "",
};

export const AdminCareers = () => {
    const { API, authorizationToken } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [formData, setFormData] = useState(initialJobForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchJobs = useCallback(async () => {
        try {
            const response = await fetch(`${API}/api/admin/careers`, {
                headers: {
                    Authorization: authorizationToken,
                },
            });

            if (!response.ok) {
                throw new Error(`Unable to fetch jobs. Status ${response.status}`);
            }

            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error("Failed to load job postings", error);
            toast.error("Unable to load job postings");
        }
    }, [API, authorizationToken]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateJob = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API}/api/admin/careers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                },
                body: JSON.stringify({
                    ...formData,
                    closingDate: formData.closingDate || null,
                }),
            });

            if (!response.ok) {
                const body = await response.json();
                throw new Error(body.message || "Unable to create job posting");
            }

            toast.success("Job posting created");
            setFormData(initialJobForm);
            fetchJobs();
        } catch (error) {
            console.error("Failed to create job posting", error);
            toast.error(error.message || "Unable to create job posting");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this job posting?")) return;

        try {
            const response = await fetch(`${API}/api/admin/careers/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: authorizationToken,
                },
            });

            if (!response.ok) {
                const body = await response.json();
                throw new Error(body.message || "Unable to delete job posting");
            }

            toast.success("Job posting deleted");
            fetchJobs();
        } catch (error) {
            console.error("Failed to delete job posting", error);
            toast.error(error.message || "Unable to delete job posting");
        }
    };

    return (
        <section className="admin-section admin-section--careers">
            <div className="admin-header">
                <h1>Careers Hub</h1>
                <p>
                    Highlight open roles, internships, and contracting gigs. Keep candidates in the loop with
                    real-time updates and beautifully presented listings.
                </p>
            </div>

            <div className="admin-grid">
                <div className="admin-card admin-form-card">
                    <h2>Post a New Job</h2>
                    <form className="admin-form" onSubmit={handleCreateJob}>
                        <div className="admin-form-group">
                            <label htmlFor="job-title">Job Title</label>
                            <input
                                id="job-title"
                                name="title"
                                type="text"
                                placeholder="Eg. Senior React Developer"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label htmlFor="job-location">Location</label>
                            <input
                                id="job-location"
                                name="location"
                                type="text"
                                placeholder="Eg. Remote, Bengaluru"
                                required
                                value={formData.location}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label htmlFor="employment-type">Employment Type</label>
                            <select
                                id="employment-type"
                                name="employmentType"
                                value={formData.employmentType}
                                onChange={handleInputChange}
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label htmlFor="salary-range">Salary Range</label>
                            <input
                                id="salary-range"
                                name="salaryRange"
                                type="text"
                                placeholder="₹6,00,000 - ₹8,00,000"
                                value={formData.salaryRange}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label htmlFor="closing-date">Closing Date</label>
                            <input
                                id="closing-date"
                                name="closingDate"
                                type="date"
                                value={formData.closingDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label htmlFor="job-description">Description</label>
                            <textarea
                                id="job-description"
                                name="description"
                                rows={6}
                                placeholder="Describe the responsibilities, expectations, and perks..."
                                required
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        <button className="admin-primary-btn" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Publishing..." : "Post Job"}
                        </button>
                    </form>
                </div>

                <div className="admin-card admin-table-card">
                    <div className="admin-table-header">
                        <h2>Open Positions</h2>
                        <p>{jobs.length} role{jobs.length === 1 ? "" : "s"} listed</p>
                    </div>
                    <div className="admin-table-wrapper" role="region" aria-live="polite">
                        {jobs.length === 0 ? (
                            <div className="empty-state">
                                <p>No active roles right now. Post a new opportunity to get started.</p>
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Title</th>
                                        <th scope="col">Location</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Salary</th>
                                        <th scope="col">Closing Date</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job._id}>
                                            <td>{job.title}</td>
                                            <td>{job.location}</td>
                                            <td>
                                                <span className="career-type-chip">{job.employmentType}</span>
                                            </td>
                                            <td>{job.salaryRange || "—"}</td>
                                            <td className="closing-date-chip">
                                                {job.closingDate
                                                    ? new Date(job.closingDate).toLocaleDateString()
                                                    : "Open"}
                                            </td>
                                            <td>
                                                <button
                                                    className="admin-delete-btn"
                                                    type="button"
                                                    onClick={() => handleDelete(job._id)}
                                                    aria-label={`Delete job ${job.title}`}
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

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth-context";

const initialJobForm = {
    title: "",
    description: "",
    location: "",
    employmentType: "Full-time",
    salaryRange: "",
    closingDate: "",
};

export const AdminCareers = () => {
    const { API, authorizationToken } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [formData, setFormData] = useState(initialJobForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchJobs = useCallback(async () => {
        try {
            const response = await fetch(`${API}/api/admin/careers`, {
                headers: {
                    Authorization: authorizationToken,
                },
            });

            if (!response.ok) {
                throw new Error(`Unable to fetch jobs. Status ${response.status}`);
            }

            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error("Failed to load job postings", error);
            toast.error("Unable to load job postings");
        }
    }, [API, authorizationToken]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateJob = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API}/api/admin/careers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                },
                body: JSON.stringify({
                    ...formData,
                    closingDate: formData.closingDate || null,
                }),
            });

            if (!response.ok) {
                const body = await response.json();
                throw new Error(body.message || "Unable to create job posting");
            }

            toast.success("Job posting created");
            setFormData(initialJobForm);
            fetchJobs();
        } catch (error) {
            console.error("Failed to create job posting", error);
            toast.error(error.message || "Unable to create job posting");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this job posting?")) return;

        try {
            const response = await fetch(`${API}/api/admin/careers/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: authorizationToken,
                },
            });

            if (!response.ok) {
                const body = await response.json();
                throw new Error(body.message || "Unable to delete job posting");
            }

            toast.success("Job posting deleted");
            fetchJobs();
        } catch (error) {
            console.error("Failed to delete job posting", error);
            toast.error(error.message || "Unable to delete job posting");
        }
    };

    return (
        <section className="admin-careers-section">
            <div className="container">
                <h1>Careers Management</h1>
                <p className="mb-3">
                    Post new openings and manage active opportunities for candidates.
                </p>

                <form className="admin-form" onSubmit={handleCreateJob}>
                    <div className="grid grid-two-cols">
                        <div>
                            <label htmlFor="job-title">Job Title</label>
                            <input
                                id="job-title"
                                name="title"
                                type="text"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="job-location">Location</label>
                            <input
                                id="job-location"
                                name="location"
                                type="text"
                                required
                                value={formData.location}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-two-cols">
                        <div>
                            <label htmlFor="employment-type">Employment Type</label>
                            <select
                                id="employment-type"
                                name="employmentType"
                                value={formData.employmentType}
                                onChange={handleInputChange}
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="salary-range">Salary Range</label>
                            <input
                                id="salary-range"
                                name="salaryRange"
                                type="text"
                                placeholder="₹6,00,000 - ₹8,00,000"
                                value={formData.salaryRange}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-two-cols">
                        <div>
                            <label htmlFor="closing-date">Closing Date</label>
                            <input
                                id="closing-date"
                                name="closingDate"
                                type="date"
                                value={formData.closingDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="job-description">Description</label>
                        <textarea
                            id="job-description"
                            name="description"
                            rows={6}
                            required
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button className="btn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Publishing..." : "Post Job"}
                    </button>
                </form>

                <div className="admin-list mt-4">
                    {jobs.length === 0 ? (
                        <p>No job postings yet.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Location</th>
                                    <th>Type</th>
                                    <th>Salary</th>
                                    <th>Closing Date</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job) => (
                                    <tr key={job._id}>
                                        <td>{job.title}</td>
                                        <td>{job.location}</td>
                                        <td>{job.employmentType}</td>
                                        <td>{job.salaryRange || "—"}</td>
                                        <td>
                                            {job.closingDate
                                                ? new Date(job.closingDate).toLocaleDateString()
                                                : "Open"}
                                        </td>
                                        <td>
                                            <button
                                                className="btn"
                                                type="button"
                                                onClick={() => handleDelete(job._id)}
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
        </section>
    );
};

