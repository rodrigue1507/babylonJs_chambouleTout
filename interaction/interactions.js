var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BABYLON;
(function (BABYLON) {
    var ToBeExtended = /** @class */ (function () {
        function ToBeExtended(param) {
            console.log('wahou de lheritage');
        }
        return ToBeExtended;
    }());
    BABYLON.ToBeExtended = ToBeExtended;
    var Interactions = /** @class */ (function (_super) {
        __extends(Interactions, _super);
        /**
         * Constructor.
         * @param _canvas the canvas where to draw the scene
         */
        function Interactions(_canvas) {
            var _this = _super.call(this, 'yo') || this;
            _this._canvas = _canvas;
            _this.cubes = [];
            _this.cylinders = [];
            _this.spheres = [];
            _this._init();
            _this._initLights();
            _this._initGeometries();
            _this._initPhysics();
            _this._initInteractions();
            _this.assign(_this.cube, {
                maki: 1
            });
            return _this;
        }
        Interactions.prototype.assign = function (target, source) {
            for (var key in source) {
                target[key] = source[key];
            }
            return target;
        };
        /**
         * Runs the interactions game.
         */
        Interactions.prototype.run = function () {
            var _this = this;
            this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
        };
        /**
         * Inits the interactions.
         */
        Interactions.prototype._init = function () {
            this.engine = new BABYLON.Engine(this._canvas);
            this.scene = new BABYLON.Scene(this.engine);
            this.camera = new BABYLON.FreeCamera('freeCamera', new BABYLON.Vector3(100, 10, 200), this.scene);
            this.camera.attachControl(this._canvas);
        };
        Interactions.prototype._initLights = function () {
            //const light = new PointLight('pointLight', new Vector3(30, 30, 30), this.scene);
            //const light = new DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), this.scene);
            var light = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 1, 0), this.scene);
        };
        Interactions.prototype._initGeometries = function () {
            this.ground = BABYLON.Mesh.CreateGround('ground', 512, 512, 1, this.scene);
            this.ground.isPickable = true;
            var std = new BABYLON.StandardMaterial('std', this.scene);
            std.diffuseTexture = new BABYLON.Texture('../assets/gazon.jpg', this.scene);
            this.ground.material = std;
            var countCylindre = 12;
            var countSphere = 4;
            this.cube = BABYLON.Mesh.CreateBox("cube", 5, this.scene);
            var std = new BABYLON.StandardMaterial('std', this.scene);
            std.diffuseTexture = new BABYLON.Texture('../assets/maki.jpg', this.scene);
            this.cube.material = std;
            this.cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 10, 10, 10, 10, this.scene);
            this.sphere = BABYLON.Mesh.CreateSphere("sphere", 32, 5, this.scene);
            for (var index = 0; index < countCylindre; index++) {
                var instance = this.cylinder.createInstance("i" + index);
                var x = 12 * index;
                var y = 10;
                var z = 0;
                instance.position = new BABYLON.Vector3(x, y, z);
                instance.scaling = new BABYLON.Vector3(1, 1, 1);
                this.cylinders.push(instance);
            }
            for (var index = 0; index < countCylindre; index++) {
                var instance = this.cylinder.createInstance("i" + index);
                var x = 12 * index;
                var y = 20;
                var z = 0;
                instance.position = new BABYLON.Vector3(x, y, z);
                instance.scaling = new BABYLON.Vector3(1, 1, 1);
                this.cylinders.push(instance);
            }
            for (var index = 0; index < countSphere; index++) {
                var instance = this.sphere.createInstance("i" + index);
                var x = 48 * index;
                var y = 5;
                var z = 80;
                instance.position = new BABYLON.Vector3(x, y, z);
                instance.scaling = new BABYLON.Vector3(1, 1, 1);
                this.spheres.push(instance);
            }
            this.camera.setTarget(BABYLON.Vector3.Zero());
            var skybox = BABYLON.Mesh.CreateBox('skybox', 500, this.scene);
            // const skybox = Mesh.CreateSphere('skybox', 32, 1000, this.scene);
            var skyboxMaterial = new BABYLON.StandardMaterial('skybox', this.scene);
            skyboxMaterial.disableLighting = true;
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../assets/TropicalSunnyDay', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            skybox.material = skyboxMaterial;
            skybox.infiniteDistance = true;
        };
        Interactions.prototype._initPhysics = function () {
            this.scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
            this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0
            });
            for (var index = 0; index < this.cylinders.length; index++) {
                this.cylinders[index].physicsImpostor = new BABYLON.PhysicsImpostor(this.cylinders[index], BABYLON.PhysicsImpostor.BoxImpostor, {
                    mass: 1
                });
            }
            for (var index = 0; index < this.spheres.length; index++) {
                this.spheres[index].physicsImpostor = new BABYLON.PhysicsImpostor(this.spheres[index], BABYLON.PhysicsImpostor.BoxImpostor, {
                    mass: 1
                });
            }
        };
        Interactions.prototype._initInteractions = function () {
            var _this = this;
            this.scene.onPointerObservable.add(function (data) {
                if (data.type !== BABYLON.PointerEventTypes.POINTERUP)
                    //return;
                    for (var index = 0; index < _this.cylinders.length; index++) {
                        if (data.pickInfo.pickedMesh === _this.cylinders[index]) {
                            _this.cylinders[index].applyImpulse(data.pickInfo.ray.direction.multiplyByFloats(100, 100, 100), data.pickInfo.pickedPoint);
                        }
                    }
                for (var index = 0; index < _this.spheres.length; index++) {
                    if (data.pickInfo.pickedMesh === _this.spheres[index]) {
                        _this.spheres[index].applyImpulse(data.pickInfo.ray.direction.multiplyByFloats(100, 100, 100), data.pickInfo.pickedPoint);
                    }
                }
            });
        };
        return Interactions;
    }(ToBeExtended));
    BABYLON.Interactions = Interactions;
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=interactions.js.map