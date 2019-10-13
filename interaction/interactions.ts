module BABYLON {
    export interface IInteractions {
        run(): void;
    }

    export class ToBeExtended {
        constructor(param: string) {
            console.log('wahou de lheritage');
        }
    }

    export class Interactions extends ToBeExtended implements IInteractions {
        public engine: Engine;
        public scene: Scene;
        public camera: FreeCamera;
        public cube: Mesh;
        public cubes: AbstractMesh[]=[];
        public cylinder: Mesh;
        public cylinders: AbstractMesh[]=[];
        public sphere: Mesh;
        public spheres: AbstractMesh[]=[];
        public ground: Mesh;
        public skybox: Mesh;

        /**
         * Constructor.
         * @param _canvas the canvas where to draw the scene
         */
        public constructor(private _canvas: HTMLCanvasElement) {
            super('yo');
            this._init();
            this._initLights();
            this._initGeometries();
            this._initPhysics();
            this._initInteractions();

            this.assign(this.cube, {
                maki: 1
            });
        }

        public assign<T extends any, U extends any>(target: T, source: U): T & U {
            for (const key in source) {
                target[key] = source[key];
            }

            return target as T & U;
        }

        /**
         * Runs the interactions game.
         */
        public run(): void {
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        }

        /**
         * Inits the interactions.
         */
        private _init(): void {
            this.engine = new Engine(this._canvas);
            this.scene = new Scene(this.engine);

            this.camera = new FreeCamera('freeCamera', new Vector3(100, 10, 200), this.scene);
            this.camera.attachControl(this._canvas);
        }

        private _initLights(): void {
            //const light = new PointLight('pointLight', new Vector3(30, 30, 30), this.scene);
            //const light = new DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), this.scene);
            const light = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 1, 0), this.scene);
        }

        private _initGeometries(): void {

            this.ground = Mesh.CreateGround('ground', 512, 512, 1, this.scene);
            this.ground.isPickable = true;
            var std = new StandardMaterial('std', this.scene);
               std.diffuseTexture = new Texture('../assets/gazon.jpg', this.scene);
               this.ground.material = std;

            var countCylindre = 12;
            var countSphere = 4;
           this.cube = Mesh.CreateBox("cube", 5,this.scene);
           var std = new StandardMaterial('std', this.scene);
               std.diffuseTexture = new Texture('../assets/maki.jpg', this.scene);
               this.cube.material = std;
            
            this.cylinder = Mesh.CreateCylinder("cylinder",10,10,10,10,this.scene);
            this.sphere = Mesh.CreateSphere("sphere",32,5,this.scene);
            

            for (var index = 0; index < countCylindre; index++) {
                const instance = this.cylinder.createInstance("i" + index);
                var x = 12*index;
                var y = 10;
                var z = 0; 
                    
                instance.position = new BABYLON.Vector3(x, y, z);
                instance.scaling = new BABYLON.Vector3(1, 1, 1);
                this.cylinders.push(instance);
           
             }	      
             for (var index = 0; index < countCylindre; index++) {
                const instance = this.cylinder.createInstance("i" + index);
                var x = 12*index;
                var y = 20;
                var z = 0; 
                    
                instance.position = new BABYLON.Vector3(x, y, z);
                instance.scaling = new BABYLON.Vector3(1, 1, 1);
                this.cylinders.push(instance);
           
             }

             for (var index = 0; index < countSphere; index++) {
                const instance = this.sphere.createInstance("i" + index);
                var x = 48*index;
                var y = 5;
                var z = 80; 
                    
                instance.position = new BABYLON.Vector3(x, y, z);
                instance.scaling = new BABYLON.Vector3(1, 1, 1);
                this.spheres.push(instance);
             }
             	     
            this.camera.setTarget(BABYLON.Vector3.Zero());

            const skybox = Mesh.CreateBox('skybox', 500, this.scene);
            // const skybox = Mesh.CreateSphere('skybox', 32, 1000, this.scene);
            const skyboxMaterial = new StandardMaterial('skybox', this.scene);
            skyboxMaterial.disableLighting = true;
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new CubeTexture('../assets/TropicalSunnyDay', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
            skybox.material = skyboxMaterial;
            skybox.infiniteDistance = true;
            
        }

        private _initPhysics(): void {
            this.scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin());

            this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, {
                mass: 0
            });
            for(var index = 0; index<this.cylinders.length;index++){
                this.cylinders[index].physicsImpostor = new PhysicsImpostor(this.cylinders[index], PhysicsImpostor.BoxImpostor, {
                    mass: 1
                });
            }
            for(var index = 0; index<this.spheres.length;index++){
                this.spheres[index].physicsImpostor = new PhysicsImpostor(this.spheres[index], PhysicsImpostor.BoxImpostor, {
                    mass: 1
                });
            }
        }

        private _initInteractions(): void {
            this.scene.onPointerObservable.add((data) => {
                if (data.type !== PointerEventTypes.POINTERUP)
                    //return;
                    for(var index = 0; index<this.cylinders.length;index++){
                        if (data.pickInfo.pickedMesh === this.cylinders[index]) {
                            this.cylinders[index].applyImpulse(data.pickInfo.ray.direction.multiplyByFloats(100, 100, 100), data.pickInfo.pickedPoint);
                        }
                    }
                    for(var index = 0; index<this.spheres.length;index++){
                        if (data.pickInfo.pickedMesh === this.spheres[index]) {
                            this.spheres[index].applyImpulse(data.pickInfo.ray.direction.multiplyByFloats(100, 100, 100), data.pickInfo.pickedPoint);
                        }
                    }
            });
        }
    }
}
