import * as THREE from 'three';
import Controller from 'Controller';
import Ship from 'Ship';
import Rock from 'Rock';
import ExplosionEffect from 'ExplosionEffect';
import Proton from 'three.proton.js';
import ModelLoader from 'ModelLoader';

class Game {

    constructor() {     
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight, true);
        document.body.appendChild(this.renderer.domElement);

        this.modelLoader = new ModelLoader();

        this.clock = new THREE.Clock(true);
        this.score = 0;
        this.scoreElement = document.querySelector(".score");

        this.createScene();
    }

    createScene() {
        this.scene = new THREE.Scene();  
        this.renderer.setClearColor(new THREE.Color(0,0,0),1); 

        this.proton = new Proton();
        this.proton.addRender(new Proton.MeshRender(this.scene));

        this.controller = new Controller();
        this.ship = new Ship(this.modelLoader, this.controller, this.proton);
        this.scene.add(this.ship);   

        this.scene.background = new THREE.CubeTextureLoader()
        .setPath( 'assets/skybox/' )
        .load( [
            'space_px.jpg', 'space_nx.jpg',
            'space_py.jpg', 'space_ny.jpg',
            'space_pz.jpg', 'space_nz.jpg'
        ] );

        let light = new THREE.DirectionalLight(0xffffff,1);
        light.position.set(0.25,1,0.75);
        this.scene.add(light);

        let ambientLight = new THREE.AmbientLight(0xffffff,0.5);
        this.scene.add(ambientLight);
        
        let light2 = new THREE.DirectionalLight(0xffffff,0.25);
        light2.position.set(-0.25,-1,-0.75);
        this.scene.add(light2);

        this.rocks = new THREE.Group();      
        this.scene.add(this.rocks);  

        this.totalRocks = 0;
        for (var index = 0; index < 20; index++) {
            this.createRock(this.ship.position);
        }   

        this.explosionEffect = new ExplosionEffect(this.proton);
    }

    createRock(origin) {
        this.totalRocks++;
        let rock = new Rock(this.modelLoader);

        var rockPosition = new THREE.Vector3(Math.random() - .5, 0, Math.random() - .5).normalize(); // Direction
        rockPosition.multiplyScalar(Math.random() * 30 + 5); // Distance 100 - 400
        rockPosition.add(origin);

        rock.position.copy(rockPosition);
        this.scene.add(rock);
        this.rocks.add(rock);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const deltaSeconds = this.clock.getDelta();
        this.ship.update(deltaSeconds);

        for(let rock of this.rocks.children) {
            rock.update(deltaSeconds);
        }
        
        this.proton.update();

        let bulletPosition = new THREE.Vector3(0,0,0);
        for(let bullet of this.ship.getBullets()) {
            if(bullet.dead) continue;


            for(let rock of this.rocks.children) {
                if(rock.isDestroyed) continue;

                bulletPosition.set(bullet.p.x,bullet.p.y,bullet.p.z);
                let distance = bulletPosition.sub(rock.position).length();

                if(distance <= 1) {
                    this.score++;
                    this.rocks.remove(rock);

                    this.scene.remove(rock);
                    this.explosionEffect.emit(rock.position);

                    this.ship.destroyBullet(bullet);
                    this.createRock(this.ship.position);
                }
            }
        }

        var relativeCameraOffset = new THREE.Vector3(0,1.5,-3);
        var relativeCameraLookAt = new THREE.Vector3(0,1,0);
        
        var cameraOffset = relativeCameraOffset.applyMatrix4( this.ship.matrixWorld );
        cameraOffset.sub(this.camera.position);
        cameraOffset.multiplyScalar(THREE.Math.clamp(10 * deltaSeconds,0,1));

        this.camera.position.add(cameraOffset);
        this.camera.lookAt( relativeCameraLookAt.add( this.ship.position) );

        this.renderer.render(this.scene, this.camera);

        this.scoreElement.innerHTML = `Score: ${this.score}`;
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight, true);
    }
}

const game = new Game();

window.game = game;
window.addEventListener("resize", () => game.resize());

game.animate();
