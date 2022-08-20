/* This class is where Dinosaur objects are created. Each new dinosaur starts with an empty this.features array.
This array can later be filled in through the addFeature method, which calls on a class of Feature to add
in dinosaur body parts and their associated colors. */
class Dinosaur {
    constructor(name, size, diet, environment) {
        this.name = name;
        this.size = size;
        this.diet = diet;
        this.environment = environment;
        this.features = [];
    }

    // The method that will add dinosaur body parts and colors into the Dinosaur this.features array.
    /* This method has now been removed, as the API was never pulling the method function as part of its data. It could never be
    referenced from the DOMManipulator addFeature method. */
    // addFeature(part, color) {
    //     this.features.push(new Feature(part, color));
    // }
}

/* This class is created so updates can be called on dinosaur objects, specifically updating the Dinosaur this.features array.
It allows for the creation of dinosaur body parts and colors associated with them. Elsewhere, functionality is created to delete
these features if wanted. */
class Feature {
    constructor(part, color) {
        this.part = part;
        this.color = color;
    }
}

// This service is how the application can communicate with the API to perform CRUD (create, read, update, delete) operations.
class DinosaurService {
    static url = 'https://630006689350a1e548e97a11.mockapi.io/Dinosaur';
    
    // Create operation to create one new dinosaur object.
    static createDinosaur(dinosaur) {
        console.log(dinosaur);
        const responsePromise = $.ajax({
            url: this.url,
            data: JSON.stringify(dinosaur),
            dataType: "json",
            type: "POST",
            contentType: "application/json",
            crossDomain: true,
        });
        console.log("This is a create dinosaur method responsePromise:", responsePromise);
        return responsePromise;
        // Old return, new return created to hopefully fix the 405 error.
        // return $.post(this.url, dinosaur);
    }
    
    // Read operation to display a list of all dinosaur objects.
    static getAllDinosaurs() {
        return $.get(this.url);
    }

    // Read operation to display one dinosaur object.
    static getDinosaur(id) {
        return $.get(this.url + `/${id}`);
    }

    // Update operation to modify an existing dinosaur object.
    static updateDinosaur(dinosaur) {
        console.log("This should be everything that the Dinosaur object is made of, including new features: ", dinosaur);
        console.log("This specific dinosaur's API endpoint: ", this.url + `/${dinosaur._id}`);
        console.log("This should return an array of features from this dinosaur: ", dinosaur.features);
        const responsePromise = $.ajax({
            url: this.url + `/${dinosaur._id}`,
            dataType: 'json',
            data: JSON.stringify({name: dinosaur.name, size: dinosaur.size, diet: dinosaur.diet, environment: dinosaur.environment,
                 features: dinosaur.features}),
            contentType: 'application/json',
            type: 'PUT',
            crossDomain: true,
            error: ((XHR, status, error) => {
                console.log("XHR Errored: ", XHR, status, error);
            })
        });
        console.log("This is an update dinosaur method responsePromise:", responsePromise);
        return responsePromise;
    }

    // Delete operation to delete an existing dinosaur object.
    static deleteDinosaur(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

// This class is where the actual DOM is being altered.
class DOMManipulator {
    static dinosaurs;

    // Uses promises to create a dinosaur object in the DOM.
    static createDinosaur(name, size, diet, environment) {
        DinosaurService.createDinosaur(new Dinosaur(name, size, diet, environment))
            .then(() => {
                return DinosaurService.getAllDinosaurs();
            })
            .then((dinosaurs) => this.render(dinosaurs));
    }
    
    // Uses promises to display all dinosaur objects in the DOM.
    static getAllDinosaurs() {
        DinosaurService.getAllDinosaurs().then(dinosaurs => {
            console.log(dinosaurs);
            return dinosaurs;
        }).then(dinosaurs => this.render(dinosaurs));
    }

    // Uses promises to delete a dinosaur object in the DOM.
    static deleteDinosaur(id) {
        DinosaurService.deleteDinosaur(id)
            .then(() => {
                return DinosaurService.getAllDinosaurs();
            })
            .then((dinosaurs) => this.render(dinosaurs));
    }

    // Uses promises to add a feature to a dinosaur object in the DOM.
    static addFeature(id) {
        console.log("This is the id of the dinosaur feature: ", id);
        for (let dinosaur of this.dinosaurs) {
            if (dinosaur._id == id) {
                dinosaur.features.push(new Feature($(`#${dinosaur._id}-feature-part`).val(), $(`#${dinosaur._id}-feature-color`).val()));
                $(`#${dinosaur._id}-feature-part`).val('');
                $(`#${dinosaur._id}-feature-color`).val('');
                // DinosaurService.updateDinosaur(dinosaur)
                //     .then(() => {
                //         console.log("Entered updateDinosaur promise.");
                //         return DinosaurService.getAllDinosaurs().then(() => {
                //             console.log("Entered getAllDinosaurs promise.");
                //         });
                //     })
                //     .then((dinosaurs) => {
                //         console.log(dinosaurs);
                //         this.render(dinosaurs);
                //     })
                //     .catch(err => console.error(err));
                DinosaurService.updateDinosaur(dinosaur)
                    .then((_dinosaur) => {
                        console.log("Entered updateDinosaur promise.", _dinosaur);
                        return DinosaurService.getAllDinosaurs();
                    })
                    .then((dinosaurs) => {
                        console.log("Entered getAllDinosaurs promise", dinosaurs);
                        this.render(dinosaurs);
                    })
                    .catch((err) => {
                        console.log("Entered catch block");
                        console.error(err)
                    });
            }
        }
    }

    // Uses promises to delete a feature from a dinosaur object in the DOM.
    static deleteFeature(dinosaurId, featureId) {
        for (let dinosaur of this.dinosaurs) {
            if (dinosaur._id == dinosaurId) {
                for (let feature of dinosaur.features) {
                    if (feature._id == featureId) {
                        dinosaur.features.splice(dinosaur.features.indexOf(feature), 1);
                        DinosaurService.updateDinosaur(dinosaur)
                            .then(() => {
                                return DinosaurService.getAllDinosaurs();
                            })
                            .then((dinosaurs) => this.render(dinosaurs))
                    }
                }
            }
        }
    }

    // This is how the dinosaur objects are displayed each time something is altered in the DOM.
    static render(dinosaurs) {
        console.log("The render function has been called. Here is dinosaurs:", dinosaurs);
        this.dinosaurs = dinosaurs;
        $('#dinoApp').empty();
        for (let dinosaur of dinosaurs) {
            $('#dinoApp').append(
                `<div id=${dinosaur._id}" class="card p-4 m-2">
                    <div class="card-header">
                        <h4>${dinosaur.name}</h4>
                        <button class="btn btn-danger" onclick="DOMManipulator.deleteDinosaur('${dinosaur._id}')">Delete Dinosaur</button>
                    </div>
                    <ul class="list-group list-group-flush dinoInfo">
                        <li class="list-group-item"><b>Size: </b> ${dinosaur.size}</li>
                        <li class="list-group-item"><b>Diet: </b> ${dinosaur.diet}</li>
                        <li class="list-group-item"><b>Environment: </b> ${dinosaur.environment}</li>
                    </ul>
                    <div class="card-body">
                        <input type="text" id="${dinosaur._id}-feature-part" class="form-control" placeholder="Dinosaur's Body Part">
                        <input type="text" id="${dinosaur._id}-feature-color" class="form-control" placeholder="Dinosaur's Body Part Color">
                        <button id="${dinosaur._id}-new-feature" onclick="DOMManipulator.addFeature('${dinosaur._id}')" class="btn btn-primary form-control">Add Feature</button>
                    </div>
                </div><br>`
            );
            // for (let feature of dinosaur.features) {
            //     console.log("Testing the list of features: ", feature);
            //     $(`#${dinosaur._id}`).find('#dinoInfo').append(
            //         `<li class="list-group-item id="feature-${feature._id}"><b>Body Part: </b> ${feature.part} <b>   Color: </b> ${feature.color}</li>
            //         <button class="btn btn-danger" onclick="DOMManipulator.deleteFeature('${dinosaur._id}', '${feature._id}')">Delete Feature</button>`
            //     );
            // }
            console.log("This is the length of the array for this dinosaur's features:", dinosaur.features.length);
            for (let i = 0; i < dinosaur.features.length; i++) {
                console.log("Testing the list of features: ", dinosaur.features[i]);
                $(`#${dinosaur._id}`).find('.dinoInfo').append(
                    `<li class="list-group-item id="features${i}-${dinosaur._id}"><b>Body Part: </b> ${dinosaur.features[i].part} <b>   Color: </b> ${dinosaur.features[i].color}</li>
                    <button class="btn btn-danger" onclick="DOMManipulator.deleteFeature('${dinosaur._id}', 'feature-${dinosaur._id}')">Delete Feature</button>`
                );
            }
        }
    }
}

// This JQuery is how the input from the HTML form to create a new dinosaur is gathered upon the click of the #addDino button.
$('#addDino').on('click', () => {
    DOMManipulator.createDinosaur($('#dinoName').val(), $('#dinoSize').val(), $('#dinoDiet').val(), $('#dinoEnvironment').val());
    $('#dinoName').val('');
    $('#dinoSize').val('');
    $('#dinoDiet').val('');
    $('#dinoEnvironment').val('');
});

// How the initial list of all dinosaurs from the API are displayed in the DOM.
DOMManipulator.getAllDinosaurs();