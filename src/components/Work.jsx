import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward, MdOpenInNew } from "react-icons/md";
import { FaGithub } from "react-icons/fa";

const projects = [
  {
    title: "Flowgenie",
    category: "Workflow Automation Platform",
    tools: "Node.js, Express.js, PostgreSQL, Supabase",
    image: "/images/flowgenie.png",
    github: "https://github.com/anushka2423?tab=repositories&q=flow&type=&language=&sort=", 
    live: "http://flowgenie.live/",
  },
  {
    title: "Leetco Extension",
    category: "Chrome Extension",
    tools: "React.js, OpenAI API",
    image: "/images/leetcode.png",
    github: "https://github.com/anushka2423/LeetcodeExtension",
    live: "",
  },
  {
    title: "VSCode Extension",
    category: "VSCode Extension",
    tools: "javascript",
    image: "/images/vscode.png",
    github: "https://github.com/anushka2423/vs-extension",
    live: "",
  },
  {
    title: "CA Cloud Desk", 
    category: "Human Resource Management Systems",
    tools: "React.js, Redux, Ant Design, Workflows",
    image: "/images/caCloudDesk.png",
    github: "",
    live: "",
  },
  {
    title: "CPC",
    category: "Project Management",
    tools: "React.js, Redux, Ant Design, Workflows",
    image: "/images/cpc.png",
    github: "",
    live: "",
  },
  {
    title: "Accompany Akki",
    category: "Job Portal",
    tools: "Next.js, Ant Design",
    image: "/images/akki.png",
    github: "",
    live: "",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <div className="carousel-title-row">
                          <h4>{project.title}</h4>
                          <div className="carousel-title-links">
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="carousel-link-icon"
                                aria-label={`${project.title} - GitHub`}
                                title="View on GitHub"
                              >
                                <FaGithub />
                              </a>
                            )}
                            {project.live && (
                              <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="carousel-link-icon"
                                aria-label={`${project.title} - Live site`}
                                title="View live"
                              >
                                <MdOpenInNew />
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage image={project.image} alt={project.title} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
