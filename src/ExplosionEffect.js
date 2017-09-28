import * as THREE from 'three';
import Proton from 'three.proton.js';

export default class {
    constructor(proton) {
        this.position = new Proton.PointZone(0, 0, 0);
        
        this.emitter = new ExplosionEmitter();         
        this.emitter.rate = new Proton.Rate(new Proton.Span(10, 300), new Proton.Span(.001));         
        
        this.emitter.addInitialize(new Proton.Position(this.position ));
        this.emitter.addInitialize(new Proton.Mass(1));
        this.emitter.addInitialize(new Proton.Radius(0.1, 2));
        this.emitter.addInitialize(new Proton.Life(1));
        this.emitter.addInitialize(new Proton.V(10, new Proton.Vector3D(0, 0, 1), 180));
         
        this.emitter.addBehaviour(new Proton.Alpha(1, 0));
        this.emitter.addBehaviour(new Proton.Scale(.005, .025));
        this.emitter.addBehaviour(new Proton.Color(new THREE.Color("#dddddd"), new THREE.Color("#010101")));
         
        proton.addEmitter(this.emitter);  
    }

    emit(position) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;

        this.emitter.emit('once');
    }
}

class ExplosionEmitter extends Proton.Emitter {
    
    emit(totalEmitTimes, life) {
        super.emit(totalEmitTimes, life);
        this.life = Infinity;
    }
}