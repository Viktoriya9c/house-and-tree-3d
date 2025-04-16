import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Настройка сцены
const scene = new THREE.Scene();
// 
const skyGeo = new THREE.SphereGeometry(100, 32, 32);
const skyMat = new THREE.MeshBasicMaterial({
  color: 0xB3E5FC,
  side: THREE.BackSide // внутренняя поверхность
});
const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);
scene.fog = new THREE.Fog(0xA3D8FF, 5, 30); // Лёгкая дымка для глубины

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.type = THREE.SoftShadowMap; // Мягкие тени
document.body.appendChild(renderer.domElement);

// --- ОСНОВНЫЕ ОБЪЕКТЫ ---

// 1. Холм (сфера с зелёной "травой")
const hillGeometry = new THREE.SphereGeometry(8, 32, 32);
hillGeometry.scale(1, 0.3, 1); // Сжимаем по Y, чтобы получился холм
const hillMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x7CFC00, // Ярко-зелёный
  flatShading: true // Мультяшный стиль
});
const hill = new THREE.Mesh(hillGeometry, hillMaterial);
hill.position.y = -1.5;
hill.castShadow = true;
hill.receiveShadow = true;
scene.add(hill);

// 2. Домик (куб + конус + труба)
const house = new THREE.Group();

// Стены (бежевый куб)
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshStandardMaterial({ color: 0xF5DEB3, flatShading: true })
);
walls.position.y = 1;
house.add(walls);

// Крыша (красный конус)
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(1.8, 1.5, 4),
  new THREE.MeshStandardMaterial({ color: 0xFF4500, flatShading: true })
);
roof.position.y = 2.5;
roof.rotation.y = Math.PI / 4; // Поворот на 45°
house.add(roof);

// Труба (коричневый параллелепипед)
const chimney = new THREE.Mesh(
  new THREE.BoxGeometry(0.4, 0.8, 0.4),
  new THREE.MeshStandardMaterial({ color: 0x8B4513 })
);
chimney.position.set(0.5, 2.7, 0.5);
house.add(chimney);

house.position.set(0, 0.5, 0);
scene.add(house);

// 3. Дерево (ствол + сложная крона)
const tree = new THREE.Group();

// Ствол (коричневый цилиндр)
const trunk = new THREE.Mesh(
  new THREE.CylinderGeometry(0.3, 0.4, 1.5, 8),
  new THREE.MeshStandardMaterial({ color: 0x8B4513 })
);
trunk.position.y = 0.8;
tree.add(trunk);

// Крона (3 сферы для "пушистости")
const crown = new THREE.Group();
const crownPart1 = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0x32CD32 })
);
crownPart1.position.y = 2;

const crownPart2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
crownPart2.position.set(0.5, 2.3, 0.3);

const crownPart3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0x006400 })
);
crownPart3.position.set(-0.4, 2.5, -0.2);

crown.add(crownPart1, crownPart2, crownPart3);
tree.add(crown);
tree.position.set(4, 0, -2);
scene.add(tree);

// 4. Облака (группы из перекрывающихся сфер для пушистости)
const clouds = new THREE.Group();

function createCloud() {
  const cloud = new THREE.Group();
  const sphereGeo = new THREE.SphereGeometry(1, 16, 16);
  const material = new THREE.MeshStandardMaterial({  color: 0xffffff,
    transparent: true,
    opacity: 0.6,            // уровень прозрачности (от 0 до 1)
    roughness: 1.0,
    metalness: 0.0,
    flatShading: true,
    depthWrite: false,       // отключаем запись глубины — важно для прозрачных объектов
    side: THREE.DoubleSide   // чтобы не было артефактов при вращении
	 });

  const count = Math.floor(Math.random() * 2) + 3; // 3-4 шариков

  for (let i = 0; i < count; i++) {
    const puff = new THREE.Mesh(sphereGeo, material);
    puff.position.set(
      i * 0.8 - (count * 0.4),                  // Разнос по ширине
      Math.random() * 0.3,                      // Немного по Y
      Math.random() * 0.4 - 0.2                 // Немного по глубине
    );
    puff.scale.setScalar(0.6 + Math.random() * 0.4); // Разный размер
    cloud.add(puff);
  }

  return cloud;
}

// Генерация нескольких облаков
for (let i = 0; i < 4; i++) {
  const singleCloud = createCloud();
  singleCloud.position.set(
    Math.random() * 30 - 15,   // X: от -15 до 15
    Math.random() * 3 + 5,     // Y: от 5 до 8
    Math.random() * 10 - 5     // Z: от -5 до 5
  );
  singleCloud.rotation.y = Math.random() * Math.PI * 2;
  clouds.add(singleCloud);
}

scene.add(clouds);

// --- ОСВЕЩЕНИЕ ---
// Мягкое общее освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Направленный свет как солнце
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(5, 10, 7); // направление "солнечного света"
sunLight.castShadow = true;

// Подробности теней
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.camera.near = 1;
sunLight.shadow.camera.far = 30;
sunLight.shadow.camera.left = -10;
sunLight.shadow.camera.right = 10;
sunLight.shadow.camera.top = 10;
sunLight.shadow.camera.bottom = -10;

scene.add(sunLight);

// --- УПРАВЛЕНИЕ ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 25;

// --- АНИМАЦИЯ ---
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});