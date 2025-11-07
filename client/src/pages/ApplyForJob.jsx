import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth-context";
import { toast } from "react-toastify";

const ApplyForJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, API, isLoggedIn } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      toast.info("Please login to apply for this job");
      navigate(`/login?redirect=/apply/${jobId}`);
    }
  }, [isLoggedIn, jobId, navigate]);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`${API}/api/careers/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJob(data);
        } else {
          toast.error("Failed to load job details");
          navigate("/careers");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("An error occurred while loading job details");
        navigate("/careers");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, API, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // For file inputs, we need to handle them differently
    if (name === 'resume' && files && files.length > 0) {
      // Validate file type and size
      const file = files[0];
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid file type (PDF, DOC, or DOCX)');
        return;
      }
      
      if (file.size > maxSize) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: file,
      }));
    } else {
      // For regular inputs
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.error("Please login to submit the application");
      return;
    }

    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.resume) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("jobId", jobId);
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("coverLetter", formData.coverLetter || "");
      formDataToSend.append("resume", formData.resume);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${API}/api/applications`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          // Don't set Content-Type header when using FormData with files
          // The browser will set it automatically with the correct boundary
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      toast.success("Application submitted successfully!");
      navigate("/careers");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(error.message || "An error occurred while submitting your application. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading">Loading job details...</div>;
  }

  if (!job) {
    return <div className="error">Job not found</div>;
  }

  return (
    <section className="apply-job-section">
      <div className="container">
        <h1>Apply for: {job.jobTitle}</h1>
        <div className="apply-form-container">
          <form onSubmit={handleSubmit} className="apply-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="resume">Resume/CV (PDF, DOC, DOCX) *</label>
              <input
                type="file"
                id="resume"
                name="resume"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="coverLetter">Cover Letter</label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                rows="6"
                placeholder="Tell us why you're a good fit for this position..."
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ApplyForJob;
