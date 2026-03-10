import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother;

const Navbar = () => {
  useEffect(() => {
    const wrapper = document.querySelector("#smooth-wrapper");
    const content = document.querySelector("#smooth-content");
    if (!wrapper || !content || !(wrapper instanceof HTMLElement) || !(content instanceof HTMLElement)) return;

    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      elem.addEventListener("click", (e) => {
        if (window.innerWidth > 1024 && smoother) {
          e.preventDefault();
          let elem = e.currentTarget;
          let section = elem.getAttribute("data-href");
          if (section) smoother.scrollTo(section, true, "top top");
        }
      });
    });
    window.addEventListener("resize", () => {
      if (smoother) ScrollSmoother.refresh(true);
    });
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          AS
        </a>
        <a
          href="mailto:anushkasrivastava1124@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          anushkasrivastava1124@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
