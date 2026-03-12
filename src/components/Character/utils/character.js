import * as THREE from "three";
import { DRACOLoader, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (renderer, scene, camera) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise((resolve, reject) => {
      decryptFile("/models/character.enc?v=2", "MyCharacter12")
        .then((encryptedBlob) => {
          const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

          let character;
          loader.load(
            blobUrl,
            async (gltf) => {
              character = gltf.scene;
              await renderer.compileAsync(character, camera, scene);
              character.traverse((child) => {
                if (child.isMesh) {
                  const mesh = child;
                  const isCap = mesh.name && mesh.name.toLowerCase().includes("cap");

                  if (mesh.material) {
                    const newMat = Array.isArray(mesh.material)
                      ? mesh.material.map((m) => m.clone())
                      : mesh.material.clone();
                    const mats = Array.isArray(newMat) ? newMat : [newMat];
                    mats.forEach((mat) => {
                      if (isCap) {
                        // Cap: black base with subtle purple glow (silhouette + halo)
                        if (mat.color) mat.color.set("#000000");
                        if (mat.emissive) {
                          mat.emissive.set("#2d1b4e");
                          if (mat.emissiveIntensity !== undefined) mat.emissiveIntensity = 0.25;
                        }
                        if (mat.roughness !== undefined) mat.roughness = 0.8;
                        if (mat.metalness !== undefined) mat.metalness = 0.02;
                      } else {
                        // Rest: full black silhouette
                        if (mat.color) mat.color.set("#000000");
                        if (mat.emissive) mat.emissive.set("#000000");
                        if (mat.roughness !== undefined) mat.roughness = 0.85;
                        if (mat.metalness !== undefined) mat.metalness = 0.05;
                      }
                    });
                    mesh.material = Array.isArray(mesh.material) ? mats : mats[0];
                  }

                  child.castShadow = true;
                  child.receiveShadow = true;
                  mesh.frustumCulled = true;
                }
              });
              resolve(gltf);
              setCharTimeline(character, camera);
              setAllTimeline();
              character.getObjectByName("footR").position.y = 3.36;
              character.getObjectByName("footL").position.y = 3.36;

              // Longer, slightly curly hair: scale hair group + gentle vertex wave
              const hairGroup = character.getObjectByName("longHair");
              if (hairGroup) {
                hairGroup.scale.set(1.12, 1.38, 1.12); // longer (Y) and slightly fuller
                hairGroup.traverse((child) => {
                  if (child.isMesh && child.geometry) {
                    const geo = child.geometry.clone();
                    const pos = geo.attributes.position;
                    if (pos) {
                      const a = pos.array;
                      const curlAmp = 0.07;
                      const curlFreq = 1.4;
                      for (let i = 0; i < a.length; i += 3) {
                        const y = a[i + 1];
                        const t = y * curlFreq;
                        a[i] += curlAmp * Math.sin(t);
                        a[i + 2] += curlAmp * Math.cos(t);
                      }
                      pos.needsUpdate = true;
                      geo.computeVertexNormals();
                    }
                    child.geometry = geo;
                  }
                });
              }

              dracoLoader.dispose();
            },
            undefined,
            (error) => {
              console.error("Error loading GLTF model:", error);
              reject(error);
            }
          );
        })
        .catch((err) => {
          reject(err);
          console.error(err);
        });
    });
  };

  return { loadCharacter };
};

export default setCharacter;
