export default class {
    constructor() {
        window.addEventListener("keydown",(keyEvent) => this.keyDown(keyEvent));
        window.addEventListener("keyup", (keyEvent) => this.keyUp(keyEvent));

        this.isUpPressed = false;
        this.isDownPressed = false;
        this.isLeftPressed = false;
        this.isRightPressed = false;
        this.isWeaponPressed = false;
    }

    keyDown(keyEvent) {
        if(keyEvent.key == "ArrowUp") {
            this.isUpPressed = true;
        }
        else if(keyEvent.key == "ArrowDown") {
            this.isDownPressed = true;
        }
        else if(keyEvent.key == "ArrowLeft") {
            this.isLeftPressed = true;
        }
        else if(keyEvent.key == "ArrowRight") {
            this.isRightPressed = true;
        }
        else if(keyEvent.key == " ") {
            this.isWeaponPressed = true;
        }
    }

    keyUp(keyEvent) {
        if(keyEvent.key == "ArrowUp") {
            this.isUpPressed = false;
        }
        else if(keyEvent.key == "ArrowDown") {
            this.isDownPressed = false;
        }
        else if(keyEvent.key == "ArrowLeft") {
            this.isLeftPressed = false;
        }
        else if(keyEvent.key == "ArrowRight") {
            this.isRightPressed = false;
        }
        else if(keyEvent.key == " ") {
            this.isWeaponPressed = false;
        }
    }
}