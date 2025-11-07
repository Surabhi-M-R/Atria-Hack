import { useEffect, useState } from "react";
import { useAuth } from "../store/auth-context";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { API } = useAuth();

  const getAllJobs = async () => {
    try {
      const response = await fetch(`${API}/api/careers`);
      const data = await response.json();
      if (response.ok) {
        setJobs(data);
      } else {
        toast.error("Failed to fetch job postings");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Error loading job postings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  if (loading) {
    return <div className="loading">Loading job postings...</div>;
  }

  return (
    <section className="section-careers">
      <div className="container">
        <h1>Career Opportunities</h1>
        <div className="jobs-grid">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id} className="job-card">
                <h2>{job.jobTitle}</h2>
                <div className="job-details">
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Type:</strong> {job.jobType}</p>
                  <p><strong>Salary:</strong> {job.salaryRange}</p>
                  <p><strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="job-description">
                  <h3>Job Description:</h3>
                  <p>{job.jobDescription}</p>
                </div>
                <div className="job-requirements">
                  <h3>Requirements:</h3>
                  <ul>
                    {job.requirements && job.requirements.split('\n').map((req, index) => (
                      req.trim() && <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <Link to={`/apply/${job._id}`} className="apply-button">
                  Apply Now
                </Link>
              </div>
            ))
          ) : (
            <div className="no-jobs">
              <p>No job postings available at the moment. Please check back later!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Careers;
