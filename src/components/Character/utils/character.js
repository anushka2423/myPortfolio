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

                  if (mesh.material) {
                    if (mesh.name === "BODY.SHIRT") {
                      const newMat = mesh.material.clone();
                      newMat.color = new THREE.Color("#D4A5A5"); // soft dusty rose
                      if (newMat.roughness !== undefined) newMat.roughness = 0.72;
                      if (newMat.metalness !== undefined) newMat.metalness = 0.04;
                      mesh.material = newMat;
                    } else if (mesh.name === "Pant") {
                      const newMat = mesh.material.clone();
                      newMat.color = new THREE.Color("#2C2426"); // soft charcoal
                      if (newMat.roughness !== undefined) newMat.roughness = 0.78;
                      mesh.material = newMat;
                    }
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
