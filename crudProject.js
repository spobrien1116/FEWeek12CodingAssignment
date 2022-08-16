class Dinosaur {
    constructor(name) {
        this.name = name;
        this.diet = diet;
        this.size = size;
        this.colors = [];
        this.environment = environment;
    }

    addColor(color) {
        this.colors.push(color);
    }
}

class DinosaurService {
    static createDinosaur(dinosaur) {
        return null;
    }
    
    static getAllDinosaurs() {
        return null;
    }

    static getDinosaur(id) {
        return null;
    }

    static updateDinosaur(dinosaur) {
        return null;
    }

    static deleteDinosaur(id) {
        return null;
    }
}

class DOMManipulator {
    static dinosaurs;

    static getAllDinosaurs() {
        DinosaurService.getAllDinosaurs().then(dinosaurs => this.render(dinosaurs));
    }
}