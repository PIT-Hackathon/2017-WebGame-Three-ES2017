import * as THREE from 'three';
import Proton from 'three.proton.js';
import MTLLoader from 'three-mtl-loader';

export default class extends THREE.Object3D {
    constructor(loader, controller, proton) {
        super();

        loader.load('ship').then((mesh) => this.add(mesh));
        
        this.controller = controller;
        
        this.leftEngineEmitter = new Proton.PointZone(0, 0, 0);
        this.rightEngineEmitter = new Proton.PointZone(0, 0, 0);
        this.leftEngineEmitterOffset = new THREE.Vector3(-0.1, 0, -0.2);
        this.rightEngineEmitterOffset = new THREE.Vector3(0.1, 0, -0.2);
        this.engineEmitterVelocity = new Proton.V(10, new Proton.Vector3D(0, 0, -1), 10);
        
        this.engineEmitter = new Proton.Emitter();         
        this.engineEmitter.rate = new Proton.Rate(new Proton.Span(4, 16), new Proton.Span(.01));         
        
        this.engineEmitter.addInitialize(new Proton.Position(this.leftEngineEmitter, this.rightEngineEmitter ));
        this.engineEmitter.addInitialize(new Proton.Mass(1));
        this.engineEmitter.addInitialize(new Proton.Radius(0.1, 2));
        this.engineEmitter.addInitialize(new Proton.Life(3));
        this.engineEmitter.addInitialize(this.engineEmitterVelocity);
         
        this.engineEmitter.addBehaviour(new Proton.Alpha(1, 0));
        this.engineEmitter.addBehaviour(new Proton.Scale(.001, .005));
        this.engineEmitter.addBehaviour(new Proton.Color(new THREE.Color("#ffff00"), new THREE.Color("#aa0000")));
         
        proton.addEmitter(this.engineEmitter);    
            
        this.weaponEmitterPosition = new Proton.PointZone(0, 0, 0);
        this.weaponEmitterPositionOffset = new THREE.Vector3(0,-0.05,0.8);
        this.WeapnoEmitterVelocity = new Proton.V(1, new Proton.Vector3D(0, 0, 2), 1);

        this.weaponEmitter = new Proton.Emitter();       
        this.weaponEmitter.rate = new Proton.Rate(new Proton.Span(1, 1), new Proton.Span(.1));         
        
        this.weaponEmitter.addInitialize(new Proton.Position(this.weaponEmitterPosition ));
        this.weaponEmitter.addInitialize(new Proton.Mass(1));
        this.weaponEmitter.addInitialize(new Proton.Radius(1, 0));
        this.weaponEmitter.addInitialize(new Proton.Life(5));
        this.weaponEmitter.addInitialize(this.WeapnoEmitterVelocity);
         
        this.weaponEmitter.addBehaviour(new Proton.Alpha(1, 0));
        this.weaponEmitter.addBehaviour(new Proton.Scale(.001, .005));
        this.weaponEmitter.addBehaviour(new Proton.Color(new THREE.Color("#00ff00"), new THREE.Color("#00aa000")));

        proton.addEmitter(this.weaponEmitter);    
        
    }

    update(deltaSeconds) {  

        let forward = this.getWorldDirection();
        forward.normalize();
        forward.multiplyScalar(4 * deltaSeconds);

        let backward = forward.clone();
        backward.negate();

        let currentPosition = this.getWorldPosition();
        
        if (this.controller.isUpPressed) {
            this.position.add(forward);
            
            let leftEnginePosition = this.leftEngineEmitterOffset.clone();
            leftEnginePosition.applyQuaternion(this.quaternion);
            leftEnginePosition.add(currentPosition);

            this.leftEngineEmitter.x = leftEnginePosition.x;
            this.leftEngineEmitter.y = leftEnginePosition.y;
            this.leftEngineEmitter.z = leftEnginePosition.z;
            
            let rightEnginePosition = this.rightEngineEmitterOffset.clone();
            rightEnginePosition.applyQuaternion(this.quaternion);
            rightEnginePosition.add(currentPosition);
            
            this.rightEngineEmitter.x = rightEnginePosition.x;
            this.rightEngineEmitter.y = rightEnginePosition.y;
            this.rightEngineEmitter.z = rightEnginePosition.z;

            this.engineEmitterVelocity.dir = new Proton.Vector3D(backward.x*2,backward.y*2,backward.z*2);

            if(this.engineEmitter.totalEmitTimes == -1) this.engineEmitter.emit();
        }
        else {
            this.engineEmitter.stopEmit();
        }

        if (this.controller.isDownPressed) {
            this.position.add(backward);
        }

        if (this.controller.isLeftPressed) {
            this.rotateY(2 * deltaSeconds);
        }

        if (this.controller.isRightPressed) {
            this.rotateY(-2 * deltaSeconds);
        }

        if(this.controller.isWeaponPressed) {
            
            let weaponPosition = this.weaponEmitterPositionOffset.clone();
            weaponPosition.applyQuaternion(this.quaternion);
            weaponPosition.add(currentPosition);

            this.weaponEmitterPosition.x = weaponPosition.x;
            this.weaponEmitterPosition.y = weaponPosition.y;
            this.weaponEmitterPosition.z = weaponPosition.z;

            this.WeapnoEmitterVelocity.dir = new Proton.Vector3D(forward.x*100,forward.y*100,forward.z*100);

            if(this.weaponEmitter.totalEmitTimes == -1) this.weaponEmitter.emit(1);
        }
        else {
            this.weaponEmitter.stopEmit();
        }
    }
    
    getBullets() {
        return this.weaponEmitter.particles.filter(x => x && !x.dead);
    }

    destroyBullet(bullet) {
        bullet.dead = true;
    }
}