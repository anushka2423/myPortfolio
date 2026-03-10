import "./styles/Landing.css";

const Landing = ({ children }) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              ANUSHKA
              <br />
              <span>SRIVASTAVA</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>A Software</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Developer</div>
              <div className="landing-h2-2">Engineer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Engineer</div>
              <div className="landing-h2-info-1">Developer</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
