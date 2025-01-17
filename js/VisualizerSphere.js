class VisualizerSphere {
    constructor(container) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: container, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.baseScale = 1;

        // Create sphere
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            wireframe: true
        });
        this.sphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphere);
        
        // Add lights
        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(10, 10, 10);
        this.scene.add(light);
        
        this.camera.position.z = 5;
        
        // Initial render
        this.render();
        
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    update(audioData) {
        const bassScale = (audioData.bass / 256) * 0.8; // Stronger bass influence
        const overallScale = (audioData.average / 256) * 0.2; // Lighter overall influence
        const targetScale = this.baseScale + bassScale + overallScale;
        
        this.sphere.scale.set(targetScale, targetScale, targetScale);
        
        // Rotation speed also influenced by bass
        const rotationSpeed = (audioData.bass / 256) * 0.02;
        this.sphere.rotation.x += rotationSpeed;
        this.sphere.rotation.y += rotationSpeed;
        
        this.render();
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    }
}