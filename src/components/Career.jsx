import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Senior Software Developer</h4>
                <h5>Monocept (Max Life Insurance)</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Collaborated closely with designers and backend teams to deliver user-centric features within sprint timelines.
              Enhanced UI reliability through improved state handling and optimized rendering pattern
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Developer</h4>
                <h5>Plutonic Services</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Owned end-to-end delivery of production features across frontend and backend services used by real users.
              Mentored junior developers, enforced code reviews, and improved overall code quality and delivery velocity
              Refactored legacy code into reusable component abstractions, decreasing total bundle size and improving maintainability across
              the core application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
