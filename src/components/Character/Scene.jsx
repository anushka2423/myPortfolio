import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

/** Feminine fallback when WebGL isn't available (sandboxed / in-app browser). */
const WebGLFallback = () => (
  <div className="character-fallback">
    <div className="character-fallback__blossom" aria-hidden />
    <div className="character-fallback__content">
      <span className="character-fallback__icon">✨</span>
      <p className="character-fallback__title">Hello there</p>
      <p className="character-fallback__text">
        3D isn’t available in this window (WebGL is disabled here). Scroll to explore the rest of the portfolio.
      </p>
      <p className="character-fallback__hint">
        To see the 3D character: <strong>open this page in standalone Chrome</strong> — launch Chrome from your dock/Start menu, copy this site’s URL from the address bar, and paste it there. In-editor or “Open in Browser” windows often have WebGL disabled.
      </p>
    </div>
  </div>
);

const Scene = () => {
  const canvasDiv = useRef(null);
  const hoverDivRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const [character, setChar] = useState(null);
  useEffect(() => {
    if (!canvasDiv.current) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false,
      });
    } catch (err) {
      console.error("[Character] WebGL failed:", err);
      setWebglUnavailable(true);
      setLoading(100);
      return;
    }

    if (!canvasDiv.current) {
      renderer.dispose();
      return;
    }
    {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = {
        width: rect.width || window.innerWidth,
        height: rect.height || window.innerHeight,
      };
      if (container.width <= 0) container.width = window.innerWidth;
      if (container.height <= 0) container.height = window.innerHeight;
      const aspect = container.width / container.height;
      const scene = sceneRef.current;
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone = null;
      let screenLight = null;
      let mixer;
      let characterObj = null;
      const _hairWorldPos = new THREE.Vector3();
      const _hairWorldQuat = new THREE.Quaternion();

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter()
        .then((gltf) => {
          if (gltf) {
            const animations = setAnimations(gltf);
            hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
            mixer = animations.mixer;
            characterObj = gltf.scene;
            setChar(characterObj);
            scene.add(characterObj);
            headBone =
              characterObj.getObjectByName("spine006") ||
              characterObj.getObjectByName("Head") ||
              characterObj.getObjectByName("head") ||
              null;
            screenLight = characterObj.getObjectByName("screenlight") || null;
            progress.loaded().then(() => {
              setTimeout(() => {
                light.turnOnLights();
                animations.startIntro();
              }, 2500);
            });
            window.addEventListener("resize", () =>
              handleResize(renderer, camera, canvasDiv, characterObj)
            );
          }
        })
        .catch((err) => {
          console.error("Character failed to load:", err);
          progress.loaded().then(() => {
            setTimeout(() => light.turnOnLights(), 500);
          });
        });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce;
      const onTouchStart = (event) => {
        const element = event.target;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", (event) => {
        onMouseMove(event);
      });
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      const animate = () => {
        requestAnimationFrame(animate);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
          const hairObj = characterObj?.getObjectByName("Hair");
          if (hairObj) {
            characterObj.updateMatrixWorld(true);
            headBone.getWorldPosition(_hairWorldPos);
            headBone.getWorldQuaternion(_hairWorldQuat);
            characterObj.worldToLocal(_hairWorldPos);
            hairObj.position.copy(_hairWorldPos);
            hairObj.quaternion.copy(_hairWorldQuat);
          }
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        clearTimeout(debounce);
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", () =>
          handleResize(renderer, camera, canvasDiv, character)
        );
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  if (webglUnavailable) {
    return (
      <div className="character-container">
        <div className="character-model character-model--fallback">
          <WebGLFallback />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
