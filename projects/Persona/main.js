import {loadGLTF, loadTexture, loadVideo,} from "../../libs/loader.js";
import { Material, MeshBasicMaterial } from "../../libs/three.js-r132/build/three.module.js";
import {CSS3DObject} from "../../libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";


const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/target4.mind',
    });
    const {renderer,cssRenderer, scene, cssScene, camera} = mindarThree;
    
    const video = await loadVideo("../../assets/videos/Werbung.mp4");
    const texture = new THREE.VideoTexture(video);
    
   const loader = new THREE.TextureLoader();

    const playGeometry = new THREE.CircleGeometry(0.05, 50);
    const playMaterial = new THREE.MeshBasicMaterial({map: loader.load("../../assets/images/play_Icon.png")});
    const playPlane = new THREE.Mesh(playGeometry, playMaterial);
    playPlane.position.set(-0.075, -0.3, 0);
    playPlane.userData.clickable = true;
    console.log("playPlane: " +playPlane.position);

    const pauseGeometry = new THREE.CircleGeometry(0.05, 50);
    const pauseMaterial = new THREE.MeshBasicMaterial({map: loader.load("../../assets/images/Pause.png")});
    const pausePlane = new THREE.Mesh(pauseGeometry, pauseMaterial);
    pausePlane.position.set(0.075, -0.3, 0);
    pausePlane.userData.clickable = true;
    console.log("pausePlane: " +pausePlane.position);

    const geometry = new THREE.PlaneGeometry(1, 204/480);
    const material = new MeshBasicMaterial({map: texture});
    const plane = new THREE.Mesh(geometry, material);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);
    anchor.group.add(playPlane);
    anchor.group.add(pausePlane);

    const ueberschriftPicturObj = new CSS3DObject(document.querySelector("#ar-ueberschrift"));
    const larsPicturObj = new CSS3DObject(document.querySelector("#ar-lars-mischak"));
    const maraPicturObj = new CSS3DObject(document.querySelector("#ar-mara"));
    const kundenkartePicturObj = new CSS3DObject(document.querySelector("#ar-kundenkarte"));

    const dataportalCSSAnchor=mindarThree.addCSSAnchor(0);
    
    dataportalCSSAnchor.group.add(ueberschriftPicturObj);
    dataportalCSSAnchor.group.add(larsPicturObj);
    dataportalCSSAnchor.group.add(maraPicturObj);
    dataportalCSSAnchor.group.add(kundenkartePicturObj);
    ueberschriftPicturObj.position.set(-250, 350, 0);
    larsPicturObj.position.set(-750, 125, 0);
    maraPicturObj.position.set(-750, -75, 0);
    kundenkartePicturObj.position.set(1000,0,0);
    kundenkartePicturObj.rotateY(-10);
    anchor.onTargetFound = () =>{
        console.log("found target");
    }
    anchor.onTargetLost = () => {
        video.pause();
        console.log("pause on target lost");
      }

    document.body.addEventListener("click", (e) => {
        const mouseX = (e.clientX/window.innerWidth) * 2 - 1;
        const mouseY = -1 * ((e.clientY/window.innerHeight) * 2 - 1);
        const mouse = new THREE.Vector2(mouseX,mouseY);
       
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
  
        const intersects = raycaster.intersectObjects(scene.children, true);

        console.log(intersects);
        
          if(intersects.length > 0){
                let o =intersects[0].object;
                console.log(o.userData);
                if(o.userData.clickable){
                  console.log("clickable");
                 
                  if(o === playPlane){
                    video.play();
                  }else if (o === pausePlane) {
                    video.pause();
                    
                  
                    /*
                    console.log("play =" + startAndPauseVideo);
                    startAndPauseVideo = !startAndPauseVideo;
                    if(startAndPauseVideo){
                        video.play();
                        console.log("video sollte laufen");
                      }else{
                        video.pause();
                      }
                      */
                    }
                  
                }
          }
        

      });
    
   
    
   
    
    

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
      cssRenderer.render(cssScene, camera);
    });
  }
  start();
});
