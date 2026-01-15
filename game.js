import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- CONFIGURATION ---
const CONFIG = {
    ROTATION_SPEED: 3.0,
    MOUSE_SENSITIVITY: 0.002, // Lowered slightly for precision
    SPRINT_MULTIPLIER: 1.5,
    MAX_PITCH: 0.8,
    INVINCIBILITY_TIME: 1000,
    GRAVITY: 9.8,
    QUICKTURN_DURATION: 0.3, // Seconds
    USE_ZOMBIE1_MODELS: true // Set to true if zombie1.glb exists and loads properly
};

// --- WEAPON DATA ---
const WEAPONS = {
    pistol: {
        name: 'Matilda',
        type: 'gun',
        damageClose: 20,
        damageFar: 10,
        falloffStart: 15,
        falloffEnd: 30,
        fireRate: 400,
        magSize: 15,
        reloadTime: 1200,
        spread: 0,
        color: 0x888888,
        scale: { x: 0.05, y: 0.1, z: 0.2 }
    },
    shotgun: {
        name: 'W-870',
        type: 'gun',
        damageClose: 50,
        damageFar: 10,
        falloffStart: 5,
        falloffEnd: 12,
        pellets: 6,
        spread: 0.15,
        fireRate: 1100,
        magSize: 8,
        reloadTime: 2500,
        color: 0x444444,
        scale: { x: 0.08, y: 0.1, z: 0.6 }
    },
    rifle: {
        name: 'AR-15',
        type: 'gun',
        damageClose: 28,
        damageFar: 18,
        falloffStart: 20,
        falloffEnd: 50,
        fireRate: 100,
        magSize: 30,
        reloadTime: 2000,
        spread: 0.04,
        color: 0x555555,
        scale: { x: 0.06, y: 0.12, z: 0.7 },
        isAutomatic: true
    },
    smg: {
        name: 'MP5',
        type: 'gun',
        damageClose: 16,
        damageFar: 10,
        falloffStart: 10,
        falloffEnd: 25,
        fireRate: 60,
        magSize: 30,
        reloadTime: 1800,
        spread: 0.03,
        color: 0x666666,
        scale: { x: 0.05, y: 0.1, z: 0.4 },
        isAutomatic: true
    },
    magnum: {
        name: 'Magnum',
        type: 'gun',
        damageClose: 80,
        damageFar: 60,
        falloffStart: 25,
        falloffEnd: 60,
        fireRate: 800,
        magSize: 6,
        reloadTime: 2200,
        spread: 0,
        color: 0xccaa00,
        scale: { x: 0.06, y: 0.12, z: 0.25 }
    },
    knife: {
        name: 'Combat Knife',
        type: 'melee',
        damage: 35,
        fireRate: 600,
        color: 0xcccccc,
        scale: { x: 0.02, y: 0.05, z: 0.25 }
    }
};

const CHARACTERS = {
    leon:  { color: 0x4466ff, speed: 4.5, hp: 60 },
    claire:{ color: 0xff4444, speed: 6.0, hp: 50 },
    hunk:  { color: 0x888888, speed: 3.5, hp: 80 }
};

// --- ZOMBIE ANIMATIONS MAPPING ---
const ZOMBIE_ANIMATIONS = {
    attack1: 'attack1',
    attack2: 'attack2',
    death1: 'death1',
    death2: 'death2',
    hit1: 'hit1',
    hit2: 'hit2',
    idle: 'idle',
    walk1: 'walk1',
    walk2: 'walk2'
};

// --- ZOMBIE3 ANIMATIONS MAPPING (Fast runner, 3 attacks) ---
const ZOMBIE3_ANIMATIONS = {
    attack1: 'attack1',
    attack2: 'attack2',
    attack3: 'attack3',
    death1: 'death1',
    death2: 'death2',
    hit1: 'hit1',
    hit2: 'hit2',
    idle: 'idle',
    run: 'run',
    tpose: 'tpose'
};

// --- ZOMBIE4 ANIMATIONS MAPPING (Same as Zombie3) ---
const ZOMBIE4_ANIMATIONS = {
    attack1: 'attack1',
    attack2: 'attack2',
    attack3: 'attack3',
    death1: 'death1',
    death2: 'death2',
    hit1: 'hit1',
    hit2: 'hit2',
    idle: 'idle',
    run: 'run',
    tpose: 'tpose'
};

// --- ZOMBIE5 ANIMATIONS MAPPING (Same as Zombie3) ---
const ZOMBIE5_ANIMATIONS = {
    attack1: 'attack1',
    attack2: 'attack2',
    attack3: 'attack3',
    death1: 'death1',
    death2: 'death2',
    hit1: 'hit1',
    hit2: 'hit2',
    idle: 'idle',
    run: 'run',
    tpose: 'tpose'
};

// --- ZOMBIE6 ANIMATIONS MAPPING (Walker, single attack/death) ---
const ZOMBIE6_ANIMATIONS = {
    attack: 'attack',
    death: 'death',
    idle: 'idle',
    walk: 'walk'
};

// --- LEON ANIMATIONS MAPPING ---
const LEON_ANIMATIONS = {
    dance: 'dance',
    knife_death: 'knife_death',
    knife_idle: 'knife_idle',
    knife_stab1: 'knife_stab1',
    knife_stab2: 'knife_stab2',
    knife_stab3: 'knife_stab3',
    knife_stab4: 'knife_stab4', // Extra animation available
    pistol_aim: 'pistol_aim',
    pistol_back: 'pistol_back',
    pistol_death: 'pistol_death', // Use this for pistol death instead of knife_death
    pistol_fire: 'pistol_fire', // Pistol fire animation
    pistol_hit: 'pistol_hit',
    pistol_hit2: 'pistol_hit2',
    pistol_idle: 'pistol_idle',
    pistol_run: 'pistol_run',
    pistol_walk: 'pistol_walk',
    reload: 'reload',
    shotgun_ads: 'shotgun_ads',
    shotgun_aim: 'shotgun_aim',
    shotgun_back: 'shotgun_walk', // Use first shotgun_walk for backward (1.300s - shorter)
    shotgun_death: 'shotgun_death',
    shotgun_fire: 'shotgun_fire',
    shotgun_idle: 'shotgun_idle',
    shotgun_walk: 'shotgun_walk_1', // Use second shotgun_walk for forward (1.333s)
    shotgun_run: 'shotgun_run'
};

// --- CLAIRE ANIMATIONS MAPPING ---
const CLAIRE_ANIMATIONS = {
    dance1: 'dance1',
    dance2: 'dance2',
    death: 'death',
    hit_pistol1: 'hit_pistol1',
    hit_pistol2: 'hit_pistol2',
    knife_back: 'knife_back',
    knife_death: 'knife_death',
    knife_idle: 'knife_idle',
    knife_run: 'knife_run',
    knife_stab: 'knife_stab',
    knife_walk: 'knife_walk',
    pistol_aim: 'pistol_aim',
    pistol_back: 'pistol_back',
    pistol_death: 'pistol_death',
    pistol_idle: 'pistol_idle',
    pistol_walk: 'pistol_walk',
    pistol_run: 'pistol_run',
    reload: 'reload',
    smg_aim: 'smg_aim',
    smg_back: 'smg_back',
    smg_death: 'smg_death',
    smg_idle: 'smg_idle',
    smg_run: 'smg_run',
    smg_walk: 'smg_walk'
};

// --- ZOMBIE ANIMATOR CLASS ---
class ZombieAnimator {
    constructor(model) {
        this.model = model;
        this.mixer = new THREE.AnimationMixer(model);
        this.actions = {};
        this.currentAction = null;
        
        if (model.animations && model.animations.length > 0) {
            const nameCount = {};
            model.animations.forEach(clip => {
                let key = clip.name;
                
                if (nameCount[clip.name] === undefined) {
                    nameCount[clip.name] = 0;
                } else {
                    nameCount[clip.name]++;
                    key = `${clip.name}_${nameCount[clip.name]}`;
                }
                
                this.actions[key] = this.mixer.clipAction(clip);
            });
            console.log('ZombieAnimator initialized with animations:', Object.keys(this.actions));
        }
    }
    
    findAnimation(targetName) {
        if (this.actions[targetName]) {
            return targetName;
        }
        
        const keys = Object.keys(this.actions);
        const lowerTarget = targetName.toLowerCase();
        for (let key of keys) {
            if (key.toLowerCase() === lowerTarget) {
                return key;
            }
        }
        
        for (let key of keys) {
            if (key.toLowerCase().includes(lowerTarget)) {
                return key;
            }
        }
        
        return null;
    }
    
    playAnimation(animName, shouldLoop = true) {
        const actualAnimName = this.findAnimation(animName);
        
        if (!actualAnimName) {
            console.warn(`❌ Animation '${animName}' NOT FOUND`);
            return;
        }
        
        const action = this.actions[actualAnimName];
        
        if (this.currentAction === action && action.isRunning()) {
            return;
        }
        
        if (this.currentAction && this.currentAction !== action) {
            this.currentAction.stop();
            this.currentAction.fadeOut(0.1);
        }
        
        action.reset();
        action.clampWhenFinished = !shouldLoop;
        action.loop = shouldLoop ? THREE.LoopRepeat : THREE.LoopOnce;
        action.fadeIn(0.2);
        action.play();
        
        this.currentAction = action;
        return action;
    }
    
    update(dt) {
        if (this.mixer) this.mixer.update(dt);
    }
}

// --- GLOBALS ---
let camera, scene, renderer, clock;
let player, currentWeaponMesh;
let bullets = [], enemies = [], pickups = [];
let input = { w: false, s: false, a: false, d: false, shift: false, aim: false, fire: false, mouseX: 0, mouseY: 0, m: false, l: false, space: false };
let inventory = [];
let inventoryOpen = false;
let freecamVelocity = new THREE.Vector3(); // For freecam movement
const FREECAM_SPEED = 10; // Units per second
let currentCharacter = 'leon'; // Track current character
let cameraYaw = 0; // Camera yaw rotation (horizontal) for aiming
let cameraPitch = 0; // Camera pitch rotation (vertical) for aiming

// Weapon models
let pistolModel = null; // Loaded pistol.glb model template

// Aim mode settings
let gameSettings = {
    aimMode: 'hold' // 'hold' for hold to aim, 'toggle' for press to toggle
};
let mouseAimToggled = false; // Track mouse aim toggle state
let keyboardAimToggled = false; // Track keyboard aim toggle state

// Leon model and animations
let leonModel = null;
let leonAnimator = null;

// Claire model and animations
let claireModel = null;
let claireAnimator = null;

let gameState = {
    isPlaying: false, isPaused: false, isDead: false,
    hp: 60, maxHp: 60,
    currentWeapon: 'pistol',
    weaponStates: { 
        pistol: { ammo: 15, reserve: 60 },
        shotgun: { ammo: 8, reserve: 16 },
        rifle: { ammo: 30, reserve: 90 },
        smg: { ammo: 30, reserve: 90 },
        magnum: { ammo: 6, reserve: 12 },
        knife: { ammo: 1, reserve: 0 }
    },
    lastFireTime: 0,
    isReloading: false,
    aimPitch: 0,
    round: 1,
    enemiesToSpawn: 0, enemiesSpawned: 0, enemiesAlive: 0, enemiesDefeated: 0,
    lastSpawnTime: 0,
    lastHitTime: 0,
    isDancing: false,
    lastStabIndex: -1, // Track which stab animation was last used
    lastDanceAnimation: null, // Track which dance animation was last used for Claire
    lastHitAnimation: null, // Track which hit animation was last used for Claire
    shotgunAdsPlayed: false, // Track if ads animation has been played
    
    // Quickturn State
    isQuickTurning: false,
    quickTurnTimer: 0,
    quickTurnStartRot: 0,
    quickTurnTargetRot: 0,
    
    // Animation tracking
    lastAnimationName: null,
    
    // Death animation state
    isPlayingDeathAnimation: false,
    deathAnimationComplete: false,
    
    // Freecam state
    isFreecam: false
};

// Audio elements for music
const menuMusic = document.getElementById('menu-music');
const leonMusic = document.getElementById('leon-music');
const claireMusic = document.getElementById('claire-music');
const hunkMusic = document.getElementById('hunk-music');

// Sound effects
const deadSound = document.getElementById('dead-sound');

// Set music volume levels (0.0 to 1.0)
menuMusic.volume = 0.6;
leonMusic.volume = 0.5;
claireMusic.volume = 0.5;
hunkMusic.volume = 0.5;
deadSound.volume = 0.8;

// Function to stop all music
function stopAllMusic() {
    menuMusic.pause();
    leonMusic.pause();
    claireMusic.pause();
    hunkMusic.pause();
    menuMusic.currentTime = 0;
    leonMusic.currentTime = 0;
    claireMusic.currentTime = 0;
    hunkMusic.currentTime = 0;
}

// Function to play character-specific music
function playCharacterMusic(character) {
    stopAllMusic();
    
    if (character === 'leon') {
        leonMusic.play().catch(err => console.log('Leon music autoplay blocked:', err));
    } else if (character === 'claire') {
        claireMusic.play().catch(err => console.log('Claire music autoplay blocked:', err));
    } else if (character === 'hunk') {
        hunkMusic.play().catch(err => console.log('Hunk music autoplay blocked:', err));
    }
}

// Load pistol model
function loadPistolModel() {
    const loader = new GLTFLoader();
    loader.load('assets/weapons/pistol/pistol.glb', 
        (gltf) => {
            pistolModel = gltf.scene;
            console.log('✓ Pistol model loaded successfully');
        },
        undefined,
        (error) => {
            console.error('Failed to load pistol model:', error);
        }
    );
}

clock = new THREE.Clock();

init();

function init() {
    // Play menu music on initialization
    menuMusic.play().catch(err => console.log('Menu music autoplay blocked:', err));
    
    // Load weapon models
    loadPistolModel();
    
    // 1. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    scene.fog = new THREE.Fog(0x111111, 10, 50);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // 4. Lights
    const ambi = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambi);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // 5. Environment
    const grid = new THREE.GridHelper(100, 50, 0x00ff00, 0x111111);
    scene.add(grid);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    setupUI();
    
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', e => onKey(e, true));
    window.addEventListener('keyup', e => onKey(e, false));
    window.addEventListener('mousedown', e => onMouse(e, true));
    window.addEventListener('mouseup', e => onMouse(e, false));
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('contextmenu', e => e.preventDefault());

    // Fake Load
    setTimeout(() => {
        document.getElementById('loading-layer').style.display = 'none';
        document.getElementById('menu-layer').style.display = 'flex';
    }, 1000);

    animate();
}

function setupUI() {
    document.getElementById('btn-leon').onclick = () => selectCharacter('leon');
    document.getElementById('btn-claire').onclick = () => selectCharacter('claire');
    document.getElementById('btn-hunk').onclick = () => selectCharacter('hunk');
    document.getElementById('btn-resume').onclick = togglePause;
    document.getElementById('btn-freecam').onclick = toggleFreecam;
    document.getElementById('btn-settings').onclick = openSettings;
    document.getElementById('btn-settings-back').onclick = closeSettings;
    
    // Aim mode buttons
    document.querySelectorAll('.aim-mode-btn').forEach(btn => {
        btn.onclick = () => setAimMode(btn.dataset.mode);
    });
    
    // Set initial button state
    updateAimModeDisplay();
}

function openSettings() {
    document.getElementById('settings-menu').style.display = 'flex';
}

function closeSettings() {
    document.getElementById('settings-menu').style.display = 'none';
    // Reset aim toggle states and L key when closing settings
    mouseAimToggled = false;
    keyboardAimToggled = false;
    input.aim = false;
    input.l = false;
    document.getElementById('crosshair').style.display = 'none';
}

function setAimMode(mode) {
    gameSettings.aimMode = mode;
    updateAimModeDisplay();
}

function updateAimModeDisplay() {
    const holdBtn = document.querySelector('[data-mode="hold"]');
    const toggleBtn = document.querySelector('[data-mode="toggle"]');
    const desc = document.getElementById('aim-mode-desc');
    
    if (gameSettings.aimMode === 'hold') {
        holdBtn.style.background = '#0ff';
        holdBtn.style.color = '#000';
        toggleBtn.style.background = '';
        toggleBtn.style.color = '';
        desc.textContent = 'Hold down to aim, release to stop';
    } else {
        holdBtn.style.background = '';
        holdBtn.style.color = '';
        toggleBtn.style.background = '#0ff';
        toggleBtn.style.color = '#000';
        desc.textContent = 'Press to aim, press again to stop';
    }
}

// --- LEON ANIMATOR CLASS ---
class LeonAnimator {
    constructor(model) {
        this.model = model;
        this.mixer = new THREE.AnimationMixer(model);
        this.actions = {};
        this.currentAction = null;
        this.nextAction = null;
        
        // Build action map from loaded animations, handling duplicates
        if (model.animations && model.animations.length > 0) {
            const nameCount = {}; // Track how many times we've seen each name
            model.animations.forEach(clip => {
                let key = clip.name;
                
                // If we've seen this name before, add a suffix
                if (nameCount[clip.name] === undefined) {
                    nameCount[clip.name] = 0;
                } else {
                    nameCount[clip.name]++;
                    key = `${clip.name}_${nameCount[clip.name]}`;
                }
                
                this.actions[key] = this.mixer.clipAction(clip);
            });
            console.log('LeonAnimator initialized with animations:', Object.keys(this.actions));
        } else {
            console.warn('No animations found in Leon model');
        }
    }
    
    // Find animation by name with fallback support (case-insensitive partial match)
    findAnimation(targetName) {
        // First try exact match
        if (this.actions[targetName]) {
            return targetName;
        }
        
        // Try case-insensitive match
        const keys = Object.keys(this.actions);
        const lowerTarget = targetName.toLowerCase();
        for (let key of keys) {
            if (key.toLowerCase() === lowerTarget) {
                return key;
            }
        }
        
        // Try partial match (search for animation containing the target name)
        for (let key of keys) {
            if (key.toLowerCase().includes(lowerTarget)) {
                // Skip if it's just a numbered variant we haven't tried yet
                // e.g., looking for "pistol_walk" might match "pistol_walk_1" or "pistol_walk.001"
                const keyWithoutNumbers = key.replace(/[_.\d]+$/g, '');
                if (keyWithoutNumbers.toLowerCase() === lowerTarget) {
                    return key;
                }
            }
        }
        
        // Ultimate fallback: try to match the core concept
        // e.g., for "pistol_idle", try to find any animation with "pistol" and "idle"
        const parts = lowerTarget.split('_').filter(p => p && !p.match(/^\d+$/));
        if (parts.length > 0) {
            for (let key of keys) {
                const keyLower = key.toLowerCase();
                if (parts.every(part => keyLower.includes(part))) {
                    console.log(`Using fuzzy match: ${targetName} -> ${key}`);
                    return key;
                }
            }
        }
        
        return null;
    }
    
    playAnimation(animName, shouldLoop = true) {
        const actualAnimName = this.findAnimation(animName);
        
        if (!actualAnimName) {
            console.warn(`❌ Animation '${animName}' NOT FOUND. Available animations:`, Object.keys(this.actions));
            // Fallback: play first available animation so model doesn't freeze
            const fallbackName = Object.keys(this.actions)[0];
            if (fallbackName) {
                console.log(`  → Using fallback animation: ${fallbackName}`);
                const fallbackAction = this.actions[fallbackName];
                fallbackAction.reset();
                fallbackAction.clampWhenFinished = !shouldLoop;
                fallbackAction.loop = shouldLoop ? THREE.LoopRepeat : THREE.LoopOnce;
                fallbackAction.fadeIn(0.2);
                fallbackAction.play();
                this.currentAction = fallbackAction;
                return fallbackAction;
            }
            return;
        }
        
        const action = this.actions[actualAnimName];
        
        // If this animation is already playing, don't restart it
        if (this.currentAction === action && action.isRunning()) {
            return;
        }
        
        // Stop current action with fade
        if (this.currentAction && this.currentAction !== action) {
            this.currentAction.fadeOut(0.2);
        }
        
        action.reset();
        action.clampWhenFinished = !shouldLoop;
        action.loop = shouldLoop ? THREE.LoopRepeat : THREE.LoopOnce;
        action.fadeIn(0.2);
        action.play();
        
        console.log(`✓ Playing: '${animName}' (actual: '${actualAnimName}', loop: ${shouldLoop})`);
        
        this.currentAction = action;
        return action;
    }
    
    update(dt) {
        if (this.mixer) this.mixer.update(dt);
    }
}

// --- LOAD LEON MODEL ---
async function loadLeonModel() {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            'assets/Leon/leon.glb',
            (gltf) => {
                const model = gltf.scene;
                model.scale.set(0.875, 0.875, 0.875); // 1.75x the previous 0.5 scale
                model.rotation.y = 0; // Face forward (don't rotate)
                model.castShadow = true;
                model.traverse(node => {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    // Fix transparency issues more selectively
                    if (node.material) {
                        const materials = Array.isArray(node.material) ? node.material : [node.material];
                        materials.forEach(material => {
                            // Only fix materials that have transparency but full opacity
                            if (material.transparent && material.opacity >= 1.0) {
                                material.transparent = false;
                                material.needsUpdate = true;
                            }
                            // Ensure proper depth testing
                            material.depthTest = true;
                            material.depthWrite = true;
                        });
                    }
                });
                
                // CRITICAL: Store animations on the model so animator can access them
                model.animations = gltf.animations;
                
                // Debug: Log all animations in the model
                console.log('Available animations:', gltf.animations.map(clip => clip.name));
                
                resolve(model);
            },
            (progress) => {
                // Optional: track loading progress
            },
            (error) => {
                console.error('Failed to load Leon model:', error);
                reject(error);
            }
        );
    });
}

// --- LOAD CLAIRE MODEL ---
async function loadClaireModel() {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            'assets/claire/claire.glb',
            (gltf) => {
                const model = gltf.scene;
                model.scale.set(0.875, 0.875, 0.875); // Same scale as Leon
                model.rotation.y = 0; // Face forward (don't rotate)
                model.castShadow = true;
                model.traverse(node => {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    // Fix transparency issues more selectively
                    if (node.material) {
                        const materials = Array.isArray(node.material) ? node.material : [node.material];
                        materials.forEach(material => {
                            // Only fix materials that have transparency but full opacity
                            if (material.transparent && material.opacity >= 1.0) {
                                material.transparent = false;
                                material.needsUpdate = true;
                            }
                            // Ensure proper depth testing
                            material.depthTest = true;
                            material.depthWrite = true;
                        });
                    }
                });
                
                // Store animations on the model so animator can access them
                model.animations = gltf.animations;
                
                // Debug: Log all animations in the model with detailed info
                console.log('=== CLAIRE MODEL LOADED ===');
                console.log('Total Animations:', gltf.animations.length);
                const animList = gltf.animations.map((clip, i) => `[${i}] ${clip.name} (${clip.duration.toFixed(2)}s)`).join('\n');
                console.log('Animation Names:\n' + animList);
                
                if (gltf.animations.length === 0) {
                    console.error('❌ ERROR: Claire model has NO ANIMATIONS!');
                    console.error('Please check that your claire.glb file has animation clips.');
                }
                
                resolve(model);
            },
            (progress) => {
                // Optional: track loading progress
            },
            (error) => {
                console.error('Failed to load Claire model:', error);
                reject(error);
            }
        );
    });
}

// --- LOAD ZOMBIE1 MODEL ---
async function loadZombie1Model() {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        let timeoutId = setTimeout(() => {
            reject(new Error('Zombie1 model loading timeout - check if assets/zombie/zombie1/zombie1.glb exists'));
        }, 3000); // Reduced to 3 seconds
        
        loader.load(
            'assets/zombie/zombie1/zombie1.glb',
            (gltf) => {
                clearTimeout(timeoutId);
                const model = gltf.scene;
                model.scale.set(3.0, 3.0, 3.0); // 3x scale (quarter smaller than 4x)
                model.rotation.y = 0;
                model.castShadow = true;
                model.traverse(node => {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    if (node.material) {
                        const materials = Array.isArray(node.material) ? node.material : [node.material];
                        materials.forEach(material => {
                            if (material.transparent && material.opacity >= 1.0) {
                                material.transparent = false;
                                material.needsUpdate = true;
                            }
                            material.depthTest = true;
                            material.depthWrite = true;
                        });
                    }
                });
                
                model.animations = gltf.animations;
                console.log('✓ Zombie1 model loaded successfully with', gltf.animations.length, 'animations:', gltf.animations.map(c => c.name));
                
                resolve(model);
            },
            (progress) => {
                if (progress.total > 0) {
                    console.log('Loading zombie1.glb:', Math.round((progress.loaded / progress.total) * 100) + '%');
                }
            },
            (error) => {
                clearTimeout(timeoutId);
                console.error('❌ Failed to load Zombie1 model:', error.message || error);
                console.error('   Tried to load from: assets/zombie/zombie1/zombie1.glb');
                console.error('   Make sure the file exists and the path is correct');
                reject(error);
            }
        );
    });
}

// --- LOAD ZOMBIE2 MODEL ---
async function loadZombie2Model() {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        let timeoutId = setTimeout(() => {
            reject(new Error('Zombie2 model loading timeout - check if assets/zombie/zombie2/zombie2.glb exists'));
        }, 3000);
        
        loader.load(
            'assets/zombie/zombie2/zombie2.glb',
            (gltf) => {
                clearTimeout(timeoutId);
                const model = gltf.scene;
                model.scale.set(3.0, 3.0, 3.0); // Same scale as zombie1
                model.rotation.y = 0;
                model.castShadow = true;
                model.traverse(node => {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    if (node.material) {
                        const materials = Array.isArray(node.material) ? node.material : [node.material];
                        materials.forEach(material => {
                            if (material.transparent && material.opacity >= 1.0) {
                                material.transparent = false;
                                material.needsUpdate = true;
                            }
                            material.depthTest = true;
                            material.depthWrite = true;
                        });
                    }
                });
                
                model.animations = gltf.animations;
                console.log('✓ Zombie2 model loaded successfully with', gltf.animations.length, 'animations:', gltf.animations.map(c => c.name));
                
                resolve(model);
            },
            (progress) => {
                if (progress.total > 0) {
                    console.log('Loading zombie2.glb:', Math.round((progress.loaded / progress.total) * 100) + '%');
                }
            },
            (error) => {
                clearTimeout(timeoutId);
                console.error('❌ Failed to load Zombie2 model:', error.message || error);
                console.error('   Tried to load from: assets/zombie/zombie2/zombie2.glb');
                console.error('   Make sure the file exists and the path is correct');
                reject(error);
            }
        );
    });
}

// --- LOAD ZOMBIE3 MODEL (Fast runner) ---
async function loadZombie3Model() {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        let timeoutId = setTimeout(() => {
            reject(new Error('Zombie3 model loading timeout - check if assets/zombie/zombie3/zombie3.glb exists'));
        }, 3000);
        
        loader.load(
            'assets/zombie/zombie3/zombie3.glb',
            (gltf) => {
                clearTimeout(timeoutId);
                const model = gltf.scene;
                model.scale.set(0.765, 0.765, 0.765);
                model.rotation.y = 0;
                model.castShadow = true;
                model.traverse(node => {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    if (node.material) {
                        const materials = Array.isArray(node.material) ? node.material : [node.material];
                        materials.forEach(material => {
                            if (material.transparent && material.opacity >= 1.0) {
                                material.transparent = false;
                                material.needsUpdate = true;
                            }
                            material.depthTest = true;
                            material.depthWrite = true;
                        });
                    }
                });
                
                model.animations = gltf.animations;
                console.log('✓ Zombie3 model loaded successfully with', gltf.animations.length, 'animations:', gltf.animations.map(c => c.name));
                
                resolve(model);
            },
            (progress) => {
                if (progress.total > 0) {
                    console.log('Loading zombie3.glb:', Math.round((progress.loaded / progress.total) * 100) + '%');
                }
            },
            (error) => {
                clearTimeout(timeoutId);
                console.error('❌ Failed to load Zombie3 model:', error.message || error);
                console.error('   Tried to load from: assets/zombie/zombie3/zombie3.glb');
                reject(error);
            }
        );
    });
}

// --- LOAD ZOMBIE4 MODEL (Fast runner) ---
async function loadZombie4Model() {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        let timeoutId = setTimeout(() => {
            reject(new Error('Zombie4 model loading timeout - check if assets/zombie/zombie4/zombie4.glb exists'));
        }, 3000);
        
        loader.load(
            'assets/zombie/zombie4/zombie4.glb',
            (gltf) => {
                clearTimeout(timeoutId);
                const model = gltf.scene;
                model.scale.set(0.765, 0.765, 0.765);
                model.rotation.y = 0;
                model.castShadow = true;
                model.traverse(node => {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    if (node.material) {
                        const materials = Array.isArray(node.material) ? node.material : [node.material];
                        materials.forEach(material => {
                            if (material.transparent && material.opacity >= 1.0) {
                                material.transparent = false;
                                material.needsUpdate = true;
                            }
                            material.depthTest = true;
                            material.depthWrite = true;
                        });
                    }
                });
                
                model.animations = gltf.animations;
                console.log('✓ Zombie4 model loaded successfully with', gltf.animations.length, 'animations:', gltf.animations.map(c => c.name));
                
                resolve(model);
            },
            (progress) => {
                if (progress.total > 0) {
                    console.log('Loading zombie4.glb:', Math.round((progress.loaded / progress.total) * 100) + '%');
                }
            },
            (error) => {
                clearTimeout(timeoutId);
                console.error('❌ Failed to load Zombie4 model:', error.message || error);
                console.error('   Tried to load from: assets/zombie/zombie4/zombie4.glb');
                reject(error);
            }
        );
    });
}

// --- LOAD ZOMBIE5 MODEL (Fast runner) ---
async function loadZombie5Model() {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        let timeoutId = setTimeout(() => {
            reject(new Error('Zombie5 model loading timeout - check if assets/zombie/zombie5/zombie5.glb exists'));
        }, 3000);
        
        loader.load(
            'assets/zombie/zombie5/zombie5.glb',
            (gltf) => {
                clearTimeout(timeoutId);
                const model = gltf.scene;
                model.scale.set(0.765, 0.765, 0.765);
                model.rotation.y = 0;
                model.castShadow = true;
                model.traverse(node => {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    if (node.material) {
                        const materials = Array.isArray(node.material) ? node.material : [node.material];
                        materials.forEach(material => {
                            if (material.transparent && material.opacity >= 1.0) {
                                material.transparent = false;
                                material.needsUpdate = true;
                            }
                            material.depthTest = true;
                            material.depthWrite = true;
                        });
                    }
                });
                
                model.animations = gltf.animations;
                console.log('✓ Zombie5 model loaded successfully with', gltf.animations.length, 'animations:', gltf.animations.map(c => c.name));
                
                resolve(model);
            },
            (progress) => {
                if (progress.total > 0) {
                    console.log('Loading zombie5.glb:', Math.round((progress.loaded / progress.total) * 100) + '%');
                }
            },
            (error) => {
                clearTimeout(timeoutId);
                console.error('❌ Failed to load Zombie5 model:', error.message || error);
                console.error('   Tried to load from: assets/zombie/zombie5/zombie5.glb');
                reject(error);
            }
        );
    });
}

// --- LOAD ZOMBIE6 MODEL (Slow walker, bigger) ---
async function loadZombie6Model() {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        let timeoutId = setTimeout(() => {
            reject(new Error('Zombie6 model loading timeout - check if assets/zombie/zombie6/zombie6.glb exists'));
        }, 3000);
        
        loader.load(
            'assets/zombie/zombie6/zombie6.glb',
            (gltf) => {
                clearTimeout(timeoutId);
                const model = gltf.scene;
                model.scale.set(0.875, 0.875, 0.875); // Same scale as Z1/Z2
                model.rotation.y = 0;
                model.castShadow = true;
                model.traverse(node => {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    if (node.material) {
                        const materials = Array.isArray(node.material) ? node.material : [node.material];
                        materials.forEach(material => {
                            if (material.transparent && material.opacity >= 1.0) {
                                material.transparent = false;
                                material.needsUpdate = true;
                            }
                            material.depthTest = true;
                            material.depthWrite = true;
                        });
                    }
                });
                
                model.animations = gltf.animations;
                console.log('✓ Zombie6 model loaded successfully with', gltf.animations.length, 'animations:', gltf.animations.map(c => c.name));
                
                resolve(model);
            },
            (progress) => {
                if (progress.total > 0) {
                    console.log('Loading zombie6.glb:', Math.round((progress.loaded / progress.total) * 100) + '%');
                }
            },
            (error) => {
                clearTimeout(timeoutId);
                console.error('❌ Failed to load Zombie6 model:', error.message || error);
                console.error('   Tried to load from: assets/zombie/zombie6/zombie6.glb');
                reject(error);
            }
        );
    });
}

function createBlockPlayer(color) {
    const group = new THREE.Group();
    
    // Body (1.8m tall)
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 1.8, 0.3),
        new THREE.MeshStandardMaterial({ color: color })
    );
    body.position.y = 0.9; 
    body.castShadow = true;
    group.add(body);
    
    // Head
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.3),
        new THREE.MeshStandardMaterial({ color: 0xffccaa })
    );
    head.position.set(0, 1.95, 0);
    group.add(head);
    
    // Right Arm Container (for Pitch rotation)
    const armGroup = new THREE.Group();
    armGroup.name = 'RightArm';
    armGroup.position.set(0.35, 1.45, 0); 
    group.add(armGroup);

    // Arm Mesh
    const arm = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.6, 0.15),
        new THREE.MeshStandardMaterial({ color: color })
    );
    arm.position.y = -0.3; // Hang down
    armGroup.add(arm);

    return group;
}

function selectCharacter(type) {
    if (player) scene.remove(player);
    
    currentCharacter = type;
    leonModel = null;
    leonAnimator = null;
    claireModel = null;
    claireAnimator = null;
    
    // Reset aim toggle states when changing characters
    mouseAimToggled = false;
    keyboardAimToggled = false;
    input.aim = false;
    document.getElementById('crosshair').style.display = 'none';
    
    // Load Leon model asynchronously, or create block models for others
    if (type === 'leon') {
        loadLeonModel().then(model => {
            player = model;
            player.position.set(0, 0, 0);
            player.rotation.order = 'YXZ'; // Ensure consistent rotation order
            scene.add(player);
            
            // Initialize animator with small delay to ensure model is fully loaded
            setTimeout(() => {
                leonAnimator = new LeonAnimator(player);
                if (leonAnimator && Object.keys(leonAnimator.actions).length > 0) {
                    leonAnimator.playAnimation(getLeonIdleAnimation(), true);
                } else {
                    console.error('Failed to initialize animations for Leon');
                }
                
                initializeCharacter(type);
            }, 50);
        }).catch(err => {
            console.error('Failed to load Leon model, using block model:', err);
            player = createBlockPlayer(CHARACTERS[type].color);
            scene.add(player);
            initializeCharacter(type);
        });
    } else if (type === 'claire') {
        loadClaireModel().then(model => {
            player = model;
            player.position.set(0, 0, 0);
            player.rotation.order = 'YXZ'; // Ensure consistent rotation order
            scene.add(player);
            
            // Initialize animator with small delay to ensure model is fully loaded
            setTimeout(() => {
                claireAnimator = new LeonAnimator(player); // Reuse LeonAnimator - it's generic
                
                // Debug: detailed diagnostics
                const availableAnims = Object.keys(claireAnimator.actions);
                const expectedAnims = Object.values(CLAIRE_ANIMATIONS);
                
                console.log('=== CLAIRE ANIMATOR INITIALIZATION ===');
                console.log('Available animations in claire.glb:', availableAnims);
                console.log('Expected animations in CLAIRE_ANIMATIONS:', expectedAnims);
                
                // Check for missing animations
                const missing = expectedAnims.filter(anim => !availableAnims.includes(anim) && !availableAnims.some(a => a.toLowerCase() === anim.toLowerCase()));
                if (missing.length > 0) {
                    console.warn('⚠️  Missing animations:', missing);
                    console.warn('Please update CLAIRE_ANIMATIONS to match the actual animation names in claire.glb');
                }
                
                if (claireAnimator && availableAnims.length > 0) {
                    // Play first available animation as safe default
                    const firstAnim = availableAnims[0];
                    console.log(`Playing first animation as fallback: ${firstAnim}`);
                    claireAnimator.playAnimation(firstAnim, true);
                } else {
                    console.error('Failed to initialize animations for Claire - no animations found');
                }
                
                initializeCharacter(type);
            }, 50);
        }).catch(err => {
            console.error('Failed to load Claire model, using block model:', err);
            player = createBlockPlayer(CHARACTERS[type].color);
            scene.add(player);
            initializeCharacter(type);
        });
    } else {
        player = createBlockPlayer(CHARACTERS[type].color);
        scene.add(player);
        initializeCharacter(type);
    }
}

function initializeCharacter(type) {
    // Stats
    gameState.hp = CHARACTERS[type].hp;
    gameState.maxHp = gameState.hp;
    gameState.round = 1;
    gameState.isDead = false;
    gameState.isReloading = false;
    gameState.isDancing = false;
    gameState.lastStabIndex = -1;
    gameState.shotgunAdsPlayed = false;
    
    // Reset Inventory
    Object.keys(gameState.weaponStates).forEach(k => {
        gameState.weaponStates[k].ammo = WEAPONS[k].magSize || 1;
        gameState.weaponStates[k].reserve = (WEAPONS[k].magSize || 0) * 3;
    });

    // Character-specific weapons
    if (type === 'leon') {
        inventory = [
            { type: 'weapon', id: 'pistol' },
            { type: 'weapon', id: 'shotgun' },
            { type: 'weapon', id: 'knife' },
            { type: 'herb', amount: 3 }
        ];
        equipWeapon('pistol');
    } else if (type === 'claire') {
        inventory = [
            { type: 'weapon', id: 'pistol' },
            { type: 'weapon', id: 'smg' },
            { type: 'weapon', id: 'knife' },
            { type: 'herb', amount: 3 }
        ];
        equipWeapon('pistol');
    } else if (type === 'hunk') {
        inventory = [
            { type: 'weapon', id: 'magnum' },
            { type: 'weapon', id: 'rifle' },
            { type: 'weapon', id: 'knife' },
            { type: 'herb', amount: 2 }
        ];
        equipWeapon('magnum');
    }
    
    startRound(1);
    
    document.getElementById('menu-layer').style.display = 'none';
    document.getElementById('ui-layer').style.display = 'block';
    gameState.isPlaying = true;
    
    // Play character-specific music
    playCharacterMusic(type);
    
    updateInventoryDisplay();
    updateUI();
}

function equipWeapon(key) {
    gameState.currentWeapon = key;
    gameState.isReloading = false;
    gameState.shotgunAdsPlayed = false; // Reset ads state when switching weapons
    
    // For Leon model, play appropriate idle animation
    if (currentCharacter === 'leon' && leonAnimator) {
        leonAnimator.playAnimation(getLeonIdleAnimation(), true);
    }
    
    // For Claire model, play appropriate idle animation
    if (currentCharacter === 'claire' && claireAnimator) {
        claireAnimator.playAnimation(getClaireIdleAnimation(), true);
    }
    
    // For block models
    const arm = player.getObjectByName('RightArm');
    if (!arm) return;

    if (currentWeaponMesh) {
        currentWeaponMesh.parent.remove(currentWeaponMesh);
        currentWeaponMesh = null;
    }

    const wCfg = WEAPONS[key];
    let mesh;
    
    // Use loaded pistol model for pistol weapon
    if (key === 'pistol' && pistolModel) {
        mesh = pistolModel.clone();
        // Position and scale the model to fit in the player's hand
        mesh.position.set(0, -0.6, 0.2);
        mesh.scale.set(1, 1, 1); // Adjust scale if needed based on model size
        // Traverse and ensure shadows
        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
    } else {
        // Use box geometry for other weapons
        mesh = new THREE.Mesh(
            new THREE.BoxGeometry(wCfg.scale.x, wCfg.scale.y, wCfg.scale.z),
            new THREE.MeshStandardMaterial({ color: wCfg.color })
        );
        
        // Attach to hand
        mesh.position.set(0, -0.6, 0.2);
        mesh.castShadow = true;
    }
    
    arm.add(mesh);
    currentWeaponMesh = mesh;
    
    updateUI();
}

// --- LEON ANIMATION HELPERS ---
function getLeonIdleAnimation() {
    switch(gameState.currentWeapon) {
        case 'knife':
            return LEON_ANIMATIONS.knife_idle;
        case 'pistol':
            return LEON_ANIMATIONS.pistol_idle;
        case 'shotgun':
            return LEON_ANIMATIONS.shotgun_idle;
        default:
            return LEON_ANIMATIONS.pistol_idle;
    }
}

function getLeonWalkAnimation() {
    switch(gameState.currentWeapon) {
        case 'knife':
            return LEON_ANIMATIONS.pistol_walk; // Use pistol walk as fallback
        case 'pistol':
            return LEON_ANIMATIONS.pistol_walk;
        case 'shotgun':
            return LEON_ANIMATIONS.shotgun_walk;
        default:
            return LEON_ANIMATIONS.pistol_walk;
    }
}

function getLeonRunAnimation() {
    switch(gameState.currentWeapon) {
        case 'knife':
            return LEON_ANIMATIONS.pistol_run; // Use pistol run as fallback
        case 'pistol':
            return LEON_ANIMATIONS.pistol_run;
        case 'shotgun':
            return LEON_ANIMATIONS.shotgun_run;
        default:
            return LEON_ANIMATIONS.pistol_run;
    }
}

function getLeonBackwardAnimation() {
    switch(gameState.currentWeapon) {
        case 'knife':
            return LEON_ANIMATIONS.pistol_back; // Use pistol back as fallback
        case 'pistol':
            return LEON_ANIMATIONS.pistol_back;
        case 'shotgun':
            return LEON_ANIMATIONS.shotgun_back;
        default:
            return LEON_ANIMATIONS.pistol_back;
    }
}

function getNextStabAnimation() {
    const stabs = [
        LEON_ANIMATIONS.knife_stab1,
        LEON_ANIMATIONS.knife_stab2,
        LEON_ANIMATIONS.knife_stab3
    ];
    
    // Cycle through stabs, avoiding the same twice in a row
    let nextIndex = (gameState.lastStabIndex + 1) % stabs.length;
    gameState.lastStabIndex = nextIndex;
    return stabs[nextIndex];
}

// --- CLAIRE ANIMATION HELPERS ---
function getClaireIdleAnimation() {
    switch(gameState.currentWeapon) {
        case 'knife':
            return CLAIRE_ANIMATIONS.knife_idle;
        case 'pistol':
            return CLAIRE_ANIMATIONS.pistol_idle;
        case 'smg':
            return CLAIRE_ANIMATIONS.smg_idle;
        default:
            return CLAIRE_ANIMATIONS.pistol_idle;
    }
}

function getClaireWalkAnimation() {
    switch(gameState.currentWeapon) {
        case 'knife':
            return CLAIRE_ANIMATIONS.knife_walk;
        case 'pistol':
            return CLAIRE_ANIMATIONS.pistol_walk;
        case 'smg':
            return CLAIRE_ANIMATIONS.smg_walk;
        default:
            return CLAIRE_ANIMATIONS.pistol_walk;
    }
}

function getClaireRunAnimation() {
    switch(gameState.currentWeapon) {
        case 'knife':
            return CLAIRE_ANIMATIONS.knife_run;
        case 'pistol':
            return CLAIRE_ANIMATIONS.pistol_run;
        case 'smg':
            return CLAIRE_ANIMATIONS.smg_run;
        default:
            return CLAIRE_ANIMATIONS.pistol_run;
    }
}

function getClaireBackwardAnimation() {
    switch(gameState.currentWeapon) {
        case 'knife':
            return CLAIRE_ANIMATIONS.knife_back;
        case 'pistol':
            return CLAIRE_ANIMATIONS.pistol_back;
        case 'smg':
            return CLAIRE_ANIMATIONS.smg_back;
        default:
            return CLAIRE_ANIMATIONS.pistol_back;
    }
}

// --- ENEMY ---
function createBlockZombie() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 1.8, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x228822 })
    );
    body.position.y = 0.9;
    body.castShadow = true;
    group.add(body);
    
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x44aa44 })
    );
    head.position.set(0, 1.95, 0.1);
    group.add(head);

    const armGeo = new THREE.BoxGeometry(0.1, 0.7, 0.1);
    const leftArm = new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: 0x228822 }));
    leftArm.position.set(-0.35, 1.4, 0.4);
    leftArm.rotation.x = -Math.PI / 2;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: 0x228822 }));
    rightArm.position.set(0.35, 1.4, 0.4);
    rightArm.rotation.x = -Math.PI / 2;
    group.add(rightArm);

    return group;
}

function createZombie2BlockModel() {
    const group = new THREE.Group();
    // Slightly different color scheme for zombie2 (more blue/grey tint)
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 1.8, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x1a4d5c })
    );
    body.position.y = 0.9;
    body.castShadow = true;
    group.add(body);
    
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x2d7a8a })
    );
    head.position.set(0, 1.95, 0.1);
    group.add(head);

    const armGeo = new THREE.BoxGeometry(0.1, 0.7, 0.1);
    const leftArm = new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: 0x1a4d5c }));
    leftArm.position.set(-0.35, 1.4, 0.4);
    leftArm.rotation.x = -Math.PI / 2;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: 0x1a4d5c }));
    rightArm.position.set(0.35, 1.4, 0.4);
    rightArm.rotation.x = -Math.PI / 2;
    group.add(rightArm);

    return group;
}

function createFatZombie() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 2.0, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x1a6b1a })
    );
    body.position.y = 1.0;
    body.castShadow = true;
    group.add(body);
    
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.45, 0.45),
        new THREE.MeshStandardMaterial({ color: 0x2d8f2d })
    );
    head.position.set(0, 2.25, 0.15);
    group.add(head);

    const armGeo = new THREE.BoxGeometry(0.15, 0.85, 0.15);
    const leftArm = new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: 0x1a6b1a }));
    leftArm.position.set(-0.5, 1.5, 0.5);
    leftArm.rotation.x = -Math.PI / 2;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: 0x1a6b1a }));
    rightArm.position.set(0.5, 1.5, 0.5);
    rightArm.rotation.x = -Math.PI / 2;
    group.add(rightArm);

    return group;
}

// --- GAME LOOP ---
function update(dt) {
    // Update Leon animator if active (even during death animation)
    if (currentCharacter === 'leon' && leonAnimator) {
        leonAnimator.update(dt);
    }
    
    // Update Claire animator if active (even during death animation)
    if (currentCharacter === 'claire' && claireAnimator) {
        claireAnimator.update(dt);
    }
    
    // If death animation is playing, only update animator and camera - skip all other game logic
    if (gameState.isPlayingDeathAnimation) {
        updateCamera();
        return;
    }
    
    // Stop other game logic if dead (but before death animation state is set)
    if (!gameState.isPlaying || gameState.isPaused || gameState.isDead) return;
    
    // FREECAM MODE
    if (gameState.isFreecam) {
        // Handle freecam movement with WASD
        const moveSpeed = FREECAM_SPEED;
        const moveDirection = new THREE.Vector3();
        
        if (input.w) moveDirection.z += 1;
        if (input.s) moveDirection.z -= 1;
        if (input.a) moveDirection.x -= 1;
        if (input.d) moveDirection.x += 1;
        
        // Normalize movement direction
        if (moveDirection.length() > 0) {
            moveDirection.normalize();
            
            // Apply movement relative to camera rotation (pitch and yaw)
            const camera_matrix = new THREE.Matrix4();
            camera_matrix.lookAt(camera.position, new THREE.Vector3().addVectors(camera.position, new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)), camera.up);
            camera_matrix.invert();
            
            moveDirection.applyMatrix4(camera_matrix);
            moveDirection.normalize();
            
            freecamVelocity.copy(moveDirection).multiplyScalar(moveSpeed);
        } else {
            freecamVelocity.multiplyScalar(0.8); // Decelerate
        }
        
        // Apply velocity to camera
        camera.position.addScaledVector(freecamVelocity, dt);
        
        updateCamera();
        return; // Skip normal game logic during freecam
    }

    // 1. Quickturn Logic
    if (gameState.isQuickTurning) {
        gameState.quickTurnTimer += dt;
        const progress = Math.min(gameState.quickTurnTimer / CONFIG.QUICKTURN_DURATION, 1.0);
        // Smooth ease-out
        const t = 1 - Math.pow(1 - progress, 3); 
        
        // Interpolate rotation
        const newRot = THREE.MathUtils.lerp(gameState.quickTurnStartRot, gameState.quickTurnTargetRot, t);
        player.rotation.y = newRot;

        if (progress >= 1.0) gameState.isQuickTurning = false;
        
        // Camera logic handles the rest
        updateCamera();
        return; // Skip other movement while turning
    }

    // 2. Keyboard Aim Control (L key) and Mouse Look & Aim Control
    // L key aiming: WASD controls pitch/yaw, player is locked in place
    // Mouse aiming: mouse controls player rotation and pitch
    
    if (keyboardAimToggled) {
        // Keyboard aim mode (L key toggle)
        input.aim = true;
        
        // W/S controls aim pitch (up/down)
        if (input.w) {
            cameraPitch += CONFIG.MOUSE_SENSITIVITY * 100 * dt;
        }
        if (input.s) {
            cameraPitch -= CONFIG.MOUSE_SENSITIVITY * 100 * dt;
        }
        cameraPitch = Math.max(-Math.PI/3, Math.min(Math.PI/3, cameraPitch));
        
        // A/D controls yaw (left/right)
        if (input.a) {
            player.rotation.y += CONFIG.ROTATION_SPEED * dt;
        }
        if (input.d) {
            player.rotation.y -= CONFIG.ROTATION_SPEED * dt;
        }
        
        gameState.aimPitch = cameraPitch;
        if(!inventoryOpen) document.getElementById('crosshair').style.display = 'block';
    } else {
        // Exit keyboard aim - reset aim state
        input.aim = false;
        cameraPitch = 0;
        gameState.aimPitch = 0;
        gameState.shotgunAdsPlayed = false;
        if(!inventoryOpen) document.getElementById('crosshair').style.display = 'none';
    }
    input.mouseX = 0;
    input.mouseY = 0;
    
    // Handle Space key firing
    if (input.space) {
        input.fire = true;
    }
    
    // Apply Pitch to Arm (for block models)
    const arm = player.getObjectByName('RightArm');
    if (arm) {
        const targetPitch = input.aim ? (-Math.PI/2 + gameState.aimPitch) : 0;
        arm.rotation.x = THREE.MathUtils.lerp(arm.rotation.x, targetPitch, dt * 15);
    }

    // 3. TANK CONTROLS MOVEMENT (RE4 Style)
    // Player cannot move while aiming or reloading (except Hunk can move while mouse aiming)
    let isMoving = false;
    let moveDirection = 'idle'; // idle, forward, backward, run
    
    // Allow movement while mouse aiming for Hunk, but NOT while keyboard aiming (L key toggle)
    const canMoveWhileAiming = currentCharacter === 'hunk' && !keyboardAimToggled;
    const canMoveWhileReloading = currentCharacter === 'hunk';
    const isAimingRestricted = input.aim && !canMoveWhileAiming;
    const isReloadingRestricted = gameState.isReloading && !canMoveWhileReloading;
    
    if (!isAimingRestricted && !isReloadingRestricted && !gameState.isDancing) {
        const charSpeed = CHARACTERS[currentCharacter].speed;
        
        // A = Rotate LEFT (Tank Controls) / Strafe LEFT (Hunk while mouse aiming)
        if (input.a) {
            if (input.aim && canMoveWhileAiming) {
                // Hunk strafes left while mouse aiming
                let strafeSpeed = charSpeed * 0.4 * dt; // Strafe is slower than forward movement
                player.translateX(strafeSpeed);
                isMoving = true;
                moveDirection = 'forward';
            } else {
                // Normal rotation for Leon/Claire or Hunk not aiming
                player.rotation.y += CONFIG.ROTATION_SPEED * dt;
            }
        }
        
        // D = Rotate RIGHT (Tank Controls) / Strafe RIGHT (Hunk while mouse aiming)
        if (input.d) {
            if (input.aim && canMoveWhileAiming) {
                // Hunk strafes right while mouse aiming
                let strafeSpeed = charSpeed * 0.4 * dt; // Strafe is slower than forward movement
                player.translateX(-strafeSpeed);
                isMoving = true;
                moveDirection = 'forward';
            } else {
                // Normal rotation for Leon/Claire or Hunk not aiming
                player.rotation.y -= CONFIG.ROTATION_SPEED * dt;
            }
        }
        
        // W = Forward (can run with SHIFT)
        if (input.w) {
            let moveSpeed = charSpeed * dt;
            
            // Apply speed modifiers
            if (input.aim && canMoveWhileAiming) {
                moveSpeed *= 0.7; // 70% speed while aiming for Hunk
            }
            if (gameState.isReloading && canMoveWhileReloading) {
                moveSpeed *= 0.7; // 70% speed while reloading for Hunk
            }
            
            moveSpeed = input.shift ? (moveSpeed * CONFIG.SPRINT_MULTIPLIER) : moveSpeed;
            player.translateZ(moveSpeed);
            isMoving = true;
            moveDirection = input.shift ? 'run' : 'forward';
        }
        
        // S = Backward (walk only, no running)
        if (input.s) {
            let backSpeed = charSpeed * 0.6 * dt;
            
            // Apply speed modifiers
            if (input.aim && canMoveWhileAiming) {
                backSpeed *= 0.7; // 70% speed while aiming for Hunk
            }
            if (gameState.isReloading && canMoveWhileReloading) {
                backSpeed *= 0.7; // 70% speed while reloading for Hunk
            }
            
            player.translateZ(-backSpeed);
            isMoving = true;
            moveDirection = 'backward';
        }
    }
    
    // Update Leon animations based on state (PRIORITY ORDER)
    if (currentCharacter === 'leon' && leonAnimator) {
        let targetAnim = null;
        
        // Priority 1: Dancing (overrides everything)
        if (gameState.isDancing) {
            // Dance animation is already playing, don't interrupt
            targetAnim = null; // Skip animation update
        }
        // Priority 2: Reloading
        else if (gameState.isReloading) {
            // Reload animation is already playing from startReload()
            targetAnim = null; // Skip animation update
        }
        // Priority 3: Aiming
        else if (input.aim) {
            if (gameState.currentWeapon === 'pistol') {
                targetAnim = LEON_ANIMATIONS.pistol_aim;
            } else if (gameState.currentWeapon === 'shotgun') {
                targetAnim = LEON_ANIMATIONS.shotgun_aim;
            } else {
                targetAnim = getLeonIdleAnimation();
            }
        }
        // Priority 4: Movement
        else if (moveDirection === 'run') {
            targetAnim = getLeonRunAnimation();
        } else if (moveDirection === 'forward') {
            targetAnim = getLeonWalkAnimation();
        } else if (moveDirection === 'backward') {
            targetAnim = getLeonBackwardAnimation();
        }
        // Priority 5: Idle (default)
        else {
            targetAnim = getLeonIdleAnimation();
        }
        
        // Only play animation if target changed from last frame
        if (targetAnim && targetAnim !== gameState.lastAnimationName) {
            console.log(`[ANIM] ${gameState.lastAnimationName} → ${targetAnim}`);
            leonAnimator.playAnimation(targetAnim, true);
            gameState.lastAnimationName = targetAnim;
        }
    }

    // Update Claire animations based on state (PRIORITY ORDER)
    if (currentCharacter === 'claire' && claireAnimator) {
        let targetAnim = null;
        
        // Priority 1: Dancing (overrides everything)
        if (gameState.isDancing) {
            // Dance animation is already playing, don't interrupt
            targetAnim = null; // Skip animation update
        }
        // Priority 2: Reloading
        else if (gameState.isReloading) {
            // Reload animation is already playing from startReload()
            targetAnim = null; // Skip animation update
        }
        // Priority 3: Aiming
        else if (input.aim) {
            if (gameState.currentWeapon === 'pistol') {
                targetAnim = CLAIRE_ANIMATIONS.pistol_aim;
            } else if (gameState.currentWeapon === 'smg') {
                targetAnim = CLAIRE_ANIMATIONS.smg_aim;
            } else {
                targetAnim = getClaireIdleAnimation();
            }
        }
        // Priority 4: Movement
        else if (moveDirection === 'run') {
            targetAnim = getClaireRunAnimation();
        } else if (moveDirection === 'forward') {
            targetAnim = getClaireWalkAnimation();
        } else if (moveDirection === 'backward') {
            targetAnim = getClaireBackwardAnimation();
        }
        // Priority 5: Idle (default)
        else {
            targetAnim = getClaireIdleAnimation();
        }
        
        // Only play animation if target changed from last frame
        if (targetAnim && targetAnim !== gameState.lastAnimationName) {
            console.log(`[ANIM] ${gameState.lastAnimationName} → ${targetAnim} (moveDir: ${moveDirection}, aim: ${input.aim})`);
            const result = claireAnimator.playAnimation(targetAnim, true);
            if (result) {
                gameState.lastAnimationName = targetAnim;
            }
        }
    }

    // 4. Fire
    if (input.fire && !gameState.isReloading && !gameState.isDancing) {
        // Only allow firing when aiming (RMB held down)
        if (!input.aim) {
            input.fire = false;
            return;
        }
        
        // Cancel dance if active
        if (gameState.isDancing) {
            gameState.isDancing = false;
            if (leonAnimator) {
                leonAnimator.playAnimation(getLeonIdleAnimation(), true);
            }
        }
        
        if (gameState.currentWeapon === 'knife') performMelee();
        else shootGun();
        
        // For non-automatic weapons, consume the fire input
        const cfg = WEAPONS[gameState.currentWeapon];
        if (!cfg.isAutomatic) {
            input.fire = false;
        }
    }
    
    // 5. Dance (M key)
    if (input.m && !gameState.isDancing) {
        gameState.isDancing = true;
        if (currentCharacter === 'leon' && leonAnimator) {
            leonAnimator.playAnimation(LEON_ANIMATIONS.dance, true); // Loop continuously
        } else if (currentCharacter === 'claire' && claireAnimator) {
            // Alternate between dance1 and dance2 for Claire
            const danceAnim = gameState.lastDanceAnimation === CLAIRE_ANIMATIONS.dance1 
                ? CLAIRE_ANIMATIONS.dance2 
                : CLAIRE_ANIMATIONS.dance1;
            claireAnimator.playAnimation(danceAnim, true);
            gameState.lastDanceAnimation = danceAnim;
        }
        input.m = false;
    }
    
    // Cancel dance if any action is pressed
    if (gameState.isDancing && (input.w || input.s || input.a || input.d || input.aim || input.fire || gameState.isReloading)) {
        gameState.isDancing = false;
        if (currentCharacter === 'leon' && leonAnimator) {
            leonAnimator.playAnimation(getLeonIdleAnimation(), true);
        } else if (currentCharacter === 'claire' && claireAnimator) {
            claireAnimator.playAnimation(getClaireIdleAnimation(), true);
        }
    }

    updateCamera();
    updateBullets(dt);
    updateEnemies(dt);
    updatePickups(dt);
}

function shootGun() {
    const w = gameState.weaponStates[gameState.currentWeapon];
    const cfg = WEAPONS[gameState.currentWeapon];
    
    if (Date.now() - gameState.lastFireTime < cfg.fireRate) return;
    if (w.ammo <= 0) { showMessage("EMPTY", 'red'); return; }

    w.ammo--;
    gameState.lastFireTime = Date.now();
    updateUI();
    
    // Leon firing animation for shotgun - play complete animation
    if (currentCharacter === 'leon' && leonAnimator && gameState.currentWeapon === 'shotgun' && input.aim) {
        leonAnimator.playAnimation(LEON_ANIMATIONS.shotgun_fire, false);
        // Return to aim after fire animation completes
        setTimeout(() => {
            if (input.aim && leonAnimator) {
                leonAnimator.playAnimation(LEON_ANIMATIONS.shotgun_aim, true);
            }
        }, 800); // Adjust timing based on animation length
    }

    const count = cfg.pellets || 1;
    for(let i=0; i<count; i++) {
        spawnBullet(); // Visual effect
        performHitscan(); // Instant damage
    }
}

function performHitscan() {
    // INSTANT hit detection from crosshair
    const raycaster = new THREE.Raycaster();
    const screenCenter = new THREE.Vector2(0, 0);
    raycaster.setFromCamera(screenCenter, camera);
    
    // Apply spread
    const spread = WEAPONS[gameState.currentWeapon].spread || 0;
    if (spread > 0) {
        const spreadX = (Math.random() - 0.5) * spread;
        const spreadY = (Math.random() - 0.5) * spread;
        const originalDir = raycaster.ray.direction.clone();
        const up = new THREE.Vector3(0, 1, 0);
        const right = new THREE.Vector3().crossVectors(originalDir, up).normalize();
        const actualUp = new THREE.Vector3().crossVectors(right, originalDir).normalize();
        
        raycaster.ray.direction.add(right.multiplyScalar(spreadX));
        raycaster.ray.direction.add(actualUp.multiplyScalar(spreadY));
        raycaster.ray.direction.normalize();
    }
    
    const weapon = WEAPONS[gameState.currentWeapon];
    let closestHit = null;
    let closestDistance = Infinity;
    
    // Check what the crosshair is pointing at
    enemies.forEach(e => {
        let isHeadshot = false;
        let hitDistance = 0;
        let didHit = false;
        
        // For model-based zombies, use extra-generous hitbox for fast-firing weapons
        let headHitboxRadius = e.isModelBased ? 0.85 : 0.35;
        let bodyHitboxRadius = e.isModelBased ? 1.4 : 0.6;
        
        // SMG gets even larger hitbox due to rapid fire
        if (gameState.currentWeapon === 'smg') {
            headHitboxRadius = e.isModelBased ? 1.2 : 0.5;
            bodyHitboxRadius = e.isModelBased ? 1.8 : 0.9;
        }
        
        // Check headshot first (smaller hitbox, higher priority)
        if (e.head) {
            const headWorldPos = new THREE.Vector3();
            e.head.getWorldPosition(headWorldPos);
            const rayToHead = headWorldPos.clone().sub(raycaster.ray.origin);
            hitDistance = rayToHead.dot(raycaster.ray.direction);
            
            if (hitDistance > 0) { // In front of camera
                const closestPoint = raycaster.ray.origin.clone().add(
                    raycaster.ray.direction.clone().multiplyScalar(hitDistance)
                );
                const distToHead = closestPoint.distanceTo(headWorldPos);
                
                if (distToHead < headHitboxRadius) { // Head hitbox radius (larger for models)
                    isHeadshot = true;
                    didHit = true;
                }
            }
        }
        
        // Check body hit if no headshot
        if (!didHit) {
            const bodyPos = e.group.position.clone().add(new THREE.Vector3(0, 1.0, 0));
            const rayToBody = bodyPos.clone().sub(raycaster.ray.origin);
            hitDistance = rayToBody.dot(raycaster.ray.direction);
            
            if (hitDistance > 0) { // In front of camera
                const closestPoint = raycaster.ray.origin.clone().add(
                    raycaster.ray.direction.clone().multiplyScalar(hitDistance)
                );
                const distToBody = closestPoint.distanceTo(bodyPos);
                
                if (distToBody < bodyHitboxRadius) { // Body hitbox radius (larger for models)
                    didHit = true;
                }
            }
        }
        
        if (!didHit) return;
        
        // Track closest hit (in case multiple enemies overlap)
        if (hitDistance < closestDistance) {
            closestDistance = hitDistance;
            
            // Calculate damage with falloff
            let damage = weapon.damageClose || weapon.damage || 0;
            
            if (weapon.falloffStart && weapon.falloffEnd) {
                if (hitDistance < weapon.falloffStart) {
                    damage = weapon.damageClose;
                } else if (hitDistance > weapon.falloffEnd) {
                    damage = weapon.damageFar;
                } else {
                    // Interpolate between close and far damage
                    const falloffRatio = (hitDistance - weapon.falloffStart) / (weapon.falloffEnd - weapon.falloffStart);
                    damage = weapon.damageClose + (weapon.damageFar - weapon.damageClose) * falloffRatio;
                }
            }
            
            // Apply headshot multiplier
            if (isHeadshot) {
                damage *= 2;
            }
            
            closestHit = { enemy: e, damage: Math.round(damage), isHeadshot };
        }
    });
    
    // Apply damage to closest hit only
    if (closestHit) {
        damageEnemy(closestHit.enemy, closestHit.damage, closestHit.isHeadshot);
    }
}

function spawnBullet() {
    // 1. RAYCAST from screen center (where crosshair is) to find target point
    const raycaster = new THREE.Raycaster();
    const screenCenter = new THREE.Vector2(0, 0);
    raycaster.setFromCamera(screenCenter, camera);
    
    // Find a point far away where the crosshair is aiming
    const targetPoint = raycaster.ray.at(100, new THREE.Vector3());
    
    // 2. Find Origin (Gun Muzzle) - offset from player position
    const origin = player.position.clone().add(new THREE.Vector3(0, 1.4, 0)); 
    // Add forward/right offset based on rotation to match visual arm
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(player.quaternion);
    const right = new THREE.Vector3(-1, 0, 0).applyQuaternion(player.quaternion);
    origin.add(forward.multiplyScalar(0.5)).add(right.multiplyScalar(0.2));

    // 3. Calculate direction from MUZZLE to TARGET POINT (where crosshair points)
    const bulletDir = new THREE.Vector3().subVectors(targetPoint, origin).normalize();

    // 4. Apply Spread
    const spread = WEAPONS[gameState.currentWeapon].spread || 0;
    if (spread > 0) {
        const spreadX = (Math.random() - 0.5) * spread;
        const spreadY = (Math.random() - 0.5) * spread;
        const spreadZ = (Math.random() - 0.5) * spread;
        bulletDir.x += spreadX;
        bulletDir.y += spreadY;
        bulletDir.z += spreadZ;
        bulletDir.normalize();
    }

    // 5. Spawn Bullet
    const b = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.05, 0.2),
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    b.position.copy(origin);
    b.userData.velocity = bulletDir.clone().multiplyScalar(300); // Much faster - nearly instant
    b.lookAt(origin.clone().add(bulletDir));
    
    scene.add(b);
    bullets.push(b);
}

function updateBullets(dt) {
    for (let i = bullets.length-1; i>=0; i--) {
        const b = bullets[i];
        b.position.add(b.userData.velocity.clone().multiplyScalar(dt));
        
        // Bullets are now just visual - remove after traveling far or timeout
        if (b.position.distanceTo(player.position) > 100) {
            scene.remove(b);
            bullets.splice(i, 1);
        }
    }
}

function performMelee() {
    // Leon animation for knife - play complete stab animation
    if (currentCharacter === 'leon' && leonAnimator) {
        const stabAnim = getNextStabAnimation();
        leonAnimator.playAnimation(stabAnim, false);
        
        // Return to knife idle after stab completes
        setTimeout(() => {
            if (leonAnimator && gameState.currentWeapon === 'knife') {
                leonAnimator.playAnimation(LEON_ANIMATIONS.knife_idle, true);
            }
        }, 600); // Adjust timing based on animation length
    }
    
    // Claire animation for knife - single stab animation
    if (currentCharacter === 'claire' && claireAnimator) {
        claireAnimator.playAnimation(CLAIRE_ANIMATIONS.knife_stab, false);
        
        // Return to knife idle after stab completes
        setTimeout(() => {
            if (claireAnimator && gameState.currentWeapon === 'knife') {
                claireAnimator.playAnimation(CLAIRE_ANIMATIONS.knife_idle, true);
            }
        }, 600); // Adjust timing based on animation length
    }
    
    // Block model animation
    const arm = player.getObjectByName('RightArm');
    if (arm) {
        arm.rotation.x = -Math.PI / 2;
        setTimeout(() => { arm.rotation.x = 0; }, 200);
    }
    
    setTimeout(() => {
        enemies.forEach(e => {
            const dist = e.group.position.distanceTo(player.position);
            const angle = player.getWorldDirection(new THREE.Vector3()).dot(
                new THREE.Vector3().subVectors(e.group.position, player.position).normalize()
            );
            if (dist < 2.5 && angle > 0.5) damageEnemy(e, WEAPONS.knife.damage);
        });
    }, 100);
}

function damageEnemy(e, amt, isHeadshot = false) {
    // Prevent damage to already-dead enemies
    if (e.isDying) return;
    
    e.hp -= amt;
    
    // Visual feedback
    const flashColor = isHeadshot ? 0xffff00 : 0xff0000;
    if (e.isModelBased && e.animator) {
        e.group.traverse(node => {
            if (node.material) {
                const materials = Array.isArray(node.material) ? node.material : [node.material];
                materials.forEach(mat => mat.emissive.setHex(flashColor));
            }
        });
    } else {
        e.group.children.forEach(c => { if(c.material) c.material.emissive.setHex(flashColor); });
    }
    
    setTimeout(() => {
        if (e.isModelBased) {
            e.group.traverse(node => {
                if (node.material) {
                    const materials = Array.isArray(node.material) ? node.material : [node.material];
                    materials.forEach(mat => mat.emissive.setHex(0));
                }
            });
        } else {
            e.group.children.forEach(c => { if(c.material) c.material.emissive.setHex(0); });
        }
    }, 100);
    
    // Play hit animation for model-based zombies
    if (e.hp > 0 && e.animator) {
        let hitAnim;
        
        if (e.hitAnimations) {
            // Use zombie-specific hit animations
            const randomHit = Math.floor(Math.random() * e.hitAnimations.length);
            hitAnim = e.hitAnimations[randomHit];
        } else {
            // Fallback for old zombies
            hitAnim = Math.random() < 0.5 ? ZOMBIE_ANIMATIONS.hit1 : ZOMBIE_ANIMATIONS.hit2;
        }
        
        e.animator.playAnimation(hitAnim, false);
        
        setTimeout(() => {
            if (e.animator && !e.isLunging && e.hp > 0) {
                e.animator.playAnimation(e.idleAnimation || ZOMBIE_ANIMATIONS.idle, true);
                e.lastAnimationName = e.idleAnimation || ZOMBIE_ANIMATIONS.idle;
            }
        }, 300);
    }
    
    if (e.hp <= 0) {
        e.isDying = true;
        
        // Increment defeat counter immediately (not waiting for removal)
        gameState.enemiesDefeated++;
        gameState.enemiesAlive--; // Remove from active count
        updateUI();
        
        // Check if round complete
        if (gameState.enemiesDefeated >= gameState.enemiesToSpawn) {
            startRound(gameState.round + 1);
        }
        
        // Play death animation for model-based zombies
        if (e.animator) {
            let deathAnim;
            
            if (e.deathAnimations) {
                // Use zombie-specific death animations (Z1/Z2/Z3/Z4/Z5)
                const randomDeath = Math.floor(Math.random() * e.deathAnimations.length);
                deathAnim = e.deathAnimations[randomDeath];
            } else if (e.deathAnimation) {
                // Use single death animation (Z6)
                deathAnim = e.deathAnimation;
            } else {
                // Fallback
                deathAnim = ZOMBIE_ANIMATIONS.death1;
            }
            
            const action = e.animator.playAnimation(deathAnim, false);
            if (action) {
                action.clampWhenFinished = true;
            }
        }
        
        const deathPos = e.group.position.clone();
        
        // 20% chance to drop something
        if (Math.random() < 0.20) {
            let dropType;
            const dropRoll = Math.random();
            
            // Character-specific drops
            if (currentCharacter === 'claire') {
                // Claire: pistol ammo, SMG ammo, herb
                if (dropRoll < 0.4) dropType = 'handgun_ammo';
                else if (dropRoll < 0.8) dropType = 'smg_ammo';
                else dropType = 'herb';
            } else if (currentCharacter === 'hunk') {
                // Hunk: magnum ammo, rifle ammo, herb
                if (dropRoll < 0.4) dropType = 'magnum_ammo';
                else if (dropRoll < 0.8) dropType = 'rifle_ammo';
                else dropType = 'herb';
            } else {
                // Leon: pistol ammo, shotgun ammo, herb
                if (dropRoll < 0.4) dropType = 'handgun_ammo';
                else if (dropRoll < 0.8) dropType = 'shotgun_ammo';
                else dropType = 'herb';
            }
            
            createPickup(dropType, deathPos);
        }
        
        // Remove enemy from scene after 5 seconds (animation duration)
        setTimeout(() => {
            scene.remove(e.group);
            enemies = enemies.filter(z => z !== e);
        }, 5000);
    }
}

function startReload() {
    const w = gameState.weaponStates[gameState.currentWeapon];
    const cfg = WEAPONS[gameState.currentWeapon];
    if (gameState.currentWeapon === 'knife' || w.ammo >= cfg.magSize || w.reserve <= 0) return;
    
    gameState.isReloading = true;
    updateUI(); // Update UI to show reloading status
    
    // Leon reload animation
    if (currentCharacter === 'leon' && leonAnimator) {
        leonAnimator.playAnimation(LEON_ANIMATIONS.reload, false);
    }
    
    // Claire reload animation
    if (currentCharacter === 'claire' && claireAnimator) {
        claireAnimator.playAnimation(CLAIRE_ANIMATIONS.reload, false);
    }
    
    setTimeout(() => {
        const needed = cfg.magSize - w.ammo;
        const take = Math.min(needed, w.reserve);
        w.ammo += take;
        w.reserve -= take;
        gameState.isReloading = false;
        updateUI();
        
        // Return to idle animation
        if (currentCharacter === 'leon' && leonAnimator) {
            leonAnimator.playAnimation(getLeonIdleAnimation(), true);
        }
        
        // Return to idle animation for Claire
        if (currentCharacter === 'claire' && claireAnimator) {
            claireAnimator.playAnimation(getClaireIdleAnimation(), true);
        }
    }, cfg.reloadTime);
}

function performQuickTurn() {
    if (gameState.isQuickTurning) return;
    gameState.isQuickTurning = true;
    gameState.quickTurnTimer = 0;
    gameState.quickTurnStartRot = player.rotation.y;
    gameState.quickTurnTargetRot = player.rotation.y + Math.PI; // 180 degrees
}

function startRound(r) {
    gameState.round = r;
    gameState.enemiesToSpawn = 5 + (r - 1) * 2;
    gameState.enemiesSpawned = 0;
    gameState.enemiesAlive = 0;
    gameState.enemiesDefeated = 0;
    showMessage(`ROUND ${r}`);
    setTimeout(() => showMessage(""), 2000);
}

function spawnEnemy() {
    if (gameState.enemiesSpawned >= gameState.enemiesToSpawn) return;
    
    // Increment counter immediately to prevent race condition
    gameState.enemiesSpawned++;
    
    // Equal 20% chance for Z1-Z5
    const spawnRoll = Math.random();
    let zombieType;
    
    if (spawnRoll < 0.20) zombieType = 1;
    else if (spawnRoll < 0.40) zombieType = 2;
    else if (spawnRoll < 0.60) zombieType = 3;
    else if (spawnRoll < 0.80) zombieType = 4;
    else zombieType = 5;
    
    // Z6 spawning: 1 per round (1-4), 2 per round (5-9), 3 per round (10-14), 4 per round (15-19), etc.
    // Formula: Math.floor((gameState.round - 1) / 5) + 1
    const z6SpawnCount = Math.floor((gameState.round - 1) / 5) + 1;
    if (Math.random() < (z6SpawnCount / gameState.enemiesToSpawn)) {
        zombieType = 6;
    }
    
    // Determine spawn location
    const angle = Math.random() * Math.PI * 2;
    const spawnPos = {
        x: Math.sin(angle) * 20,
        y: 0,
        z: Math.cos(angle) * 20
    };
    
    // Spawn the appropriate zombie type
    if (zombieType === 1 && CONFIG.USE_ZOMBIE1_MODELS) {
        spawnZombie1(spawnPos);
    } else if (zombieType === 2 && CONFIG.USE_ZOMBIE1_MODELS) {
        spawnZombie2(spawnPos);
    } else if (zombieType === 3 && CONFIG.USE_ZOMBIE1_MODELS) {
        spawnZombie3(spawnPos);
    } else if (zombieType === 4 && CONFIG.USE_ZOMBIE1_MODELS) {
        spawnZombie4(spawnPos);
    } else if (zombieType === 5 && CONFIG.USE_ZOMBIE1_MODELS) {
        spawnZombie5(spawnPos);
    } else if (zombieType === 6 && CONFIG.USE_ZOMBIE1_MODELS) {
        spawnZombie6(spawnPos);
    } else {
        // Fallback to block model
        const blockEnemy = createBlockZombie();
        spawnBlockEnemy(blockEnemy, false);
    }
}

// --- SPAWN ZOMBIE1 (Standard) ---
function spawnZombie1(spawnPos) {
    loadZombie1Model().then(model => {
        model.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
        scene.add(model);
        
        const animator = new ZombieAnimator(model);
        const zombieData = {
            group: model,
            head: model.children[0],
            hp: 100 + (gameState.round * 20),
            speed: 2.0,
            walkAnimations: [ZOMBIE_ANIMATIONS.walk1, ZOMBIE_ANIMATIONS.walk2],
            attackAnimations: [ZOMBIE_ANIMATIONS.attack1, ZOMBIE_ANIMATIONS.attack2],
            deathAnimations: [ZOMBIE_ANIMATIONS.death1, ZOMBIE_ANIMATIONS.death2],
            hitAnimations: [ZOMBIE_ANIMATIONS.hit1, ZOMBIE_ANIMATIONS.hit2],
            idleAnimation: ZOMBIE_ANIMATIONS.idle,
            isLunging: false,
            lungeTarget: null,
            lungeSpeed: 8,
            lastLungeTime: 0,
            animator: animator,
            isModelBased: true,
            lastAnimationName: ZOMBIE_ANIMATIONS.walk1,
            lastWalkVariation: 0,
            lastWalkSwitchTime: 0,
            isDying: false
        };
        
        enemies.push(zombieData);
        gameState.enemiesAlive++;
        animator.playAnimation(ZOMBIE_ANIMATIONS.idle, true);
    }).catch(err => {
        console.error('Failed to load zombie1 model:', err.message);
        const blockEnemy = createBlockZombie();
        spawnBlockEnemy(blockEnemy, false);
    });
}

// --- SPAWN ZOMBIE2 (Standard) ---
function spawnZombie2(spawnPos) {
    loadZombie2Model().then(model => {
        model.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
        scene.add(model);
        
        const animator = new ZombieAnimator(model);
        const zombieData = {
            group: model,
            head: model.children[0],
            hp: 100 + (gameState.round * 20),
            speed: 2.0,
            walkAnimations: [ZOMBIE_ANIMATIONS.walk1, ZOMBIE_ANIMATIONS.walk2],
            attackAnimations: [ZOMBIE_ANIMATIONS.attack1, ZOMBIE_ANIMATIONS.attack2],
            deathAnimations: [ZOMBIE_ANIMATIONS.death1, ZOMBIE_ANIMATIONS.death2],
            hitAnimations: [ZOMBIE_ANIMATIONS.hit1, ZOMBIE_ANIMATIONS.hit2],
            idleAnimation: ZOMBIE_ANIMATIONS.idle,
            isLunging: false,
            lungeTarget: null,
            lungeSpeed: 8,
            lastLungeTime: 0,
            animator: animator,
            isModelBased: true,
            lastAnimationName: ZOMBIE_ANIMATIONS.walk1,
            lastWalkVariation: 0,
            lastWalkSwitchTime: 0,
            isDying: false
        };
        
        enemies.push(zombieData);
        gameState.enemiesAlive++;
        animator.playAnimation(ZOMBIE_ANIMATIONS.idle, true);
    }).catch(err => {
        console.error('Failed to load zombie2 model:', err.message);
        const blockEnemy = createZombie2BlockModel();
        spawnBlockEnemy(blockEnemy, false);
    });
}

// --- SPAWN ZOMBIE3 (Fast runner, less health) ---
function spawnZombie3(spawnPos) {
    loadZombie3Model().then(model => {
        model.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
        scene.add(model);
        
        const animator = new ZombieAnimator(model);
        const zombieData = {
            group: model,
            head: model.children[0],
            hp: 60 + (gameState.round * 15), // Less health than Z1/Z2
            speed: 2.5,
            runAnimation: ZOMBIE3_ANIMATIONS.run,
            attackAnimations: [ZOMBIE3_ANIMATIONS.attack1, ZOMBIE3_ANIMATIONS.attack2, ZOMBIE3_ANIMATIONS.attack3],
            deathAnimations: [ZOMBIE3_ANIMATIONS.death1, ZOMBIE3_ANIMATIONS.death2],
            hitAnimations: [ZOMBIE3_ANIMATIONS.hit1, ZOMBIE3_ANIMATIONS.hit2],
            idleAnimation: ZOMBIE3_ANIMATIONS.idle,
            isLunging: false,
            lungeTarget: null,
            lungeSpeed: 12, // Faster lunge
            lastLungeTime: 0,
            animator: animator,
            isModelBased: true,
            lastAnimationName: ZOMBIE3_ANIMATIONS.idle,
            isDying: false,
            zombieType: 3
        };
        
        enemies.push(zombieData);
        gameState.enemiesAlive++;
        animator.playAnimation(ZOMBIE3_ANIMATIONS.idle, true);
    }).catch(err => {
        console.error('Failed to load zombie3 model:', err.message);
        const blockEnemy = createBlockZombie();
        spawnBlockEnemy(blockEnemy, false);
    });
}

// --- SPAWN ZOMBIE4 (Fast runner, less health) ---
function spawnZombie4(spawnPos) {
    loadZombie4Model().then(model => {
        model.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
        scene.add(model);
        
        const animator = new ZombieAnimator(model);
        const zombieData = {
            group: model,
            head: model.children[0],
            hp: 60 + (gameState.round * 15),
            speed: 2.5,
            runAnimation: ZOMBIE4_ANIMATIONS.run,
            attackAnimations: [ZOMBIE4_ANIMATIONS.attack1, ZOMBIE4_ANIMATIONS.attack2, ZOMBIE4_ANIMATIONS.attack3],
            deathAnimations: [ZOMBIE4_ANIMATIONS.death1, ZOMBIE4_ANIMATIONS.death2],
            hitAnimations: [ZOMBIE4_ANIMATIONS.hit1, ZOMBIE4_ANIMATIONS.hit2],
            idleAnimation: ZOMBIE4_ANIMATIONS.idle,
            isLunging: false,
            lungeTarget: null,
            lungeSpeed: 12,
            lastLungeTime: 0,
            animator: animator,
            isModelBased: true,
            lastAnimationName: ZOMBIE4_ANIMATIONS.idle,
            isDying: false,
            zombieType: 4
        };
        
        enemies.push(zombieData);
        gameState.enemiesAlive++;
        animator.playAnimation(ZOMBIE4_ANIMATIONS.idle, true);
    }).catch(err => {
        console.error('Failed to load zombie4 model:', err.message);
        const blockEnemy = createBlockZombie();
        spawnBlockEnemy(blockEnemy, false);
    });
}

// --- SPAWN ZOMBIE5 (Fast runner, less health) ---
function spawnZombie5(spawnPos) {
    loadZombie5Model().then(model => {
        model.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
        scene.add(model);
        
        const animator = new ZombieAnimator(model);
        const zombieData = {
            group: model,
            head: model.children[0],
            hp: 60 + (gameState.round * 15),
            speed: 2.5,
            runAnimation: ZOMBIE5_ANIMATIONS.run,
            attackAnimations: [ZOMBIE5_ANIMATIONS.attack1, ZOMBIE5_ANIMATIONS.attack2, ZOMBIE5_ANIMATIONS.attack3],
            deathAnimations: [ZOMBIE5_ANIMATIONS.death1, ZOMBIE5_ANIMATIONS.death2],
            hitAnimations: [ZOMBIE5_ANIMATIONS.hit1, ZOMBIE5_ANIMATIONS.hit2],
            idleAnimation: ZOMBIE5_ANIMATIONS.idle,
            isLunging: false,
            lungeTarget: null,
            lungeSpeed: 12,
            lastLungeTime: 0,
            animator: animator,
            isModelBased: true,
            lastAnimationName: ZOMBIE5_ANIMATIONS.idle,
            isDying: false,
            zombieType: 5
        };
        
        enemies.push(zombieData);
        gameState.enemiesAlive++;
        animator.playAnimation(ZOMBIE5_ANIMATIONS.idle, true);
    }).catch(err => {
        console.error('Failed to load zombie5 model:', err.message);
        const blockEnemy = createBlockZombie();
        spawnBlockEnemy(blockEnemy, false);
    });
}

// --- SPAWN ZOMBIE6 (Slow walker, more health, bigger) ---
function spawnZombie6(spawnPos) {
    loadZombie6Model().then(model => {
        model.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
        scene.add(model);
        
        const animator = new ZombieAnimator(model);
        const zombieData = {
            group: model,
            head: model.children[0],
            hp: 150 + (gameState.round * 25), // More health than Z1/Z2
            speed: 2.5,
            walkAnimation: ZOMBIE6_ANIMATIONS.walk,
            attackAnimation: ZOMBIE6_ANIMATIONS.attack,
            deathAnimation: ZOMBIE6_ANIMATIONS.death,
            idleAnimation: ZOMBIE6_ANIMATIONS.idle,
            isLunging: false,
            lungeTarget: null,
            lungeSpeed: 6, // Slower lunge
            lastLungeTime: 0,
            animator: animator,
            isModelBased: true,
            lastAnimationName: ZOMBIE6_ANIMATIONS.idle,
            isDying: false,
            zombieType: 6
        };
        
        enemies.push(zombieData);
        gameState.enemiesAlive++;
        animator.playAnimation(ZOMBIE6_ANIMATIONS.idle, true);
    }).catch(err => {
        console.error('Failed to load zombie6 model:', err.message);
        const blockEnemy = createFatZombie();
        spawnBlockEnemy(blockEnemy, true);
    });
}

function spawnBlockEnemy(enemy, isFat) {
    const angle = Math.random() * Math.PI * 2;
    enemy.position.set(Math.sin(angle) * 20, 0, Math.cos(angle) * 20);
    scene.add(enemy);
    
    const head = enemy.children.find(c => c.geometry && c.position.y > 1.5);
    const baseHp = isFat ? 200 : 100;
    enemies.push({
        group: enemy,
        head: head,
        isFat: isFat,
        hp: baseHp + (gameState.round * 20),
        isLunging: false,
        lungeTarget: null,
        lungeSpeed: isFat ? 12 : 8,
        lastLungeTime: 0,
        animator: null,
        isModelBased: false,
        lastAnimationName: null,
        lastWalkVariation: Math.random() < 0.5 ? ZOMBIE_ANIMATIONS.walk1 : ZOMBIE_ANIMATIONS.walk2,
        isDying: false
    });
    gameState.enemiesAlive++;
}

function updateEnemies(dt) {
    // Update all zombie animators
    enemies.forEach(e => {
        if (e.animator) {
            e.animator.update(dt);
        }
    });
    
    if (Date.now() - gameState.lastSpawnTime > 2000) { spawnEnemy(); gameState.lastSpawnTime = Date.now(); }
    enemies.forEach(e => {
        const distToPlayer = e.group.position.distanceTo(player.position);
        const sixFeetInMeters = 6 * 0.3048; // Convert 6 feet to meters (approximately 1.83m)
        
        // Lunge attack logic - triggers at 6 feet radius
        if (distToPlayer < sixFeetInMeters && !e.isLunging && Date.now() - e.lastLungeTime > 2000 && !e.isDying) {
            e.isLunging = true;
            e.lungeTarget = player.position.clone();
            e.lastLungeTime = Date.now();
            
            // Play attack animation for model-based zombies
            if (e.animator) {
                let attackAnim;
                
                if (e.zombieType === 3 || e.zombieType === 4 || e.zombieType === 5) {
                    // Zombie3/4/5: 3 attack animations
                    const randomAttack = Math.floor(Math.random() * 3);
                    attackAnim = e.attackAnimations[randomAttack];
                } else if (e.zombieType === 6) {
                    // Zombie6: 1 attack animation
                    attackAnim = e.attackAnimation;
                } else {
                    // Zombie1/2: 2 attack animations
                    attackAnim = Math.random() < 0.5 ? e.attackAnimations[0] : e.attackAnimations[1];
                }
                
                e.animator.playAnimation(attackAnim, false);
            }
            
            setTimeout(() => {
                e.isLunging = false;
                // Return to idle after lunge
                if (e.animator) {
                    e.animator.playAnimation(e.idleAnimation, true);
                }
            }, 500);
        }
        
        // Handle lunging movement
        if (e.isLunging && e.lungeTarget && !e.isDying) {
            const lungeDir = new THREE.Vector3().subVectors(e.lungeTarget, e.group.position).normalize();
            e.group.position.add(lungeDir.multiplyScalar(e.lungeSpeed * dt));
        } else if (!e.isDying) {
            // Normal walking behavior
            const dir = new THREE.Vector3().subVectors(player.position, e.group.position).normalize();
            e.group.position.add(dir.multiplyScalar(e.speed * dt));
            
            // Update walk/run animation for model-based zombies
            if (e.animator) {
                let targetAnim;
                
                if (e.zombieType === 3 || e.zombieType === 4 || e.zombieType === 5) {
                    // Zombie3/4/5: Use run animation (they run instead of walk)
                    targetAnim = e.runAnimation;
                } else if (e.zombieType === 6) {
                    // Zombie6: Use walk animation
                    targetAnim = e.walkAnimation;
                } else {
                    // Zombie1/2: Alternate between walk1 and walk2 (switch every 2-3 seconds)
                    if (Date.now() - e.lastWalkSwitchTime > 2000 + Math.random() * 1000) {
                        e.lastWalkVariation = e.lastWalkVariation === 0 ? 1 : 0;
                        e.lastWalkSwitchTime = Date.now();
                    }
                    targetAnim = e.walkAnimations[e.lastWalkVariation];
                }
                
                if (targetAnim !== e.lastAnimationName && !e.isLunging) {
                    e.animator.playAnimation(targetAnim, true);
                    e.lastAnimationName = targetAnim;
                }
            }
        }
        
        e.group.lookAt(player.position);
        
        // Check collision with player for damage
        if (distToPlayer < 1.0 && !e.isDying) {
            if (Date.now() - gameState.lastHitTime > CONFIG.INVINCIBILITY_TIME) {
                const damageTaken = e.isFat ? 25 : 15;
                gameState.hp -= damageTaken;
                gameState.lastHitTime = Date.now();
                updateUI();
                
                // Player hit animations and knockback

                if (gameState.hp > 0 && currentCharacter === 'leon' && leonAnimator) {
                    let hitAnim;
                    if (gameState.currentWeapon === 'knife') {
                        hitAnim = LEON_ANIMATIONS.pistol_hit;
                    } else if (gameState.currentWeapon === 'shotgun') {
                        hitAnim = LEON_ANIMATIONS.pistol_hit2;
                    } else {
                        // Pistol or other weapons - randomly choose hit1 or hit2
                        hitAnim = Math.random() < 0.5 ? LEON_ANIMATIONS.pistol_hit : LEON_ANIMATIONS.pistol_hit2;
                    }
                    
                    // Play hit animation completely
                    leonAnimator.playAnimation(hitAnim, false);
                    
                    // Move player back or to the side to avoid another lunge
                    const knockbackDir = new THREE.Vector3().subVectors(player.position, e.group.position).normalize();
                    const sideDir = new THREE.Vector3(-knockbackDir.z, 0, knockbackDir.x).normalize(); // Perpendicular direction
                    const useBack = Math.random() < 0.5;
                    const moveDir = useBack ? knockbackDir : sideDir;
                    player.position.add(moveDir.multiplyScalar(0.5)); // Move further away than before
                    
                    // Return to appropriate idle after hit animation
                    setTimeout(() => {
                        if (leonAnimator && gameState.hp > 0) {
                            leonAnimator.playAnimation(getLeonIdleAnimation(), true);
                        }
                    }, 500);
                }
                
                if (gameState.hp > 0 && currentCharacter === 'claire' && claireAnimator) {
                    let hitAnim;
                    // Alternate between hit_pistol1 and hit_pistol2 for Claire
                    if (gameState.lastHitAnimation !== CLAIRE_ANIMATIONS.hit_pistol1) {
                        hitAnim = CLAIRE_ANIMATIONS.hit_pistol1;
                        gameState.lastHitAnimation = CLAIRE_ANIMATIONS.hit_pistol1;
                    } else {
                        hitAnim = CLAIRE_ANIMATIONS.hit_pistol2;
                        gameState.lastHitAnimation = CLAIRE_ANIMATIONS.hit_pistol2;
                    }
                    
                    // Play hit animation completely
                    claireAnimator.playAnimation(hitAnim, false);
                    
                    // Move player back or to the side to avoid another lunge
                    const knockbackDir = new THREE.Vector3().subVectors(player.position, e.group.position).normalize();
                    const sideDir = new THREE.Vector3(-knockbackDir.z, 0, knockbackDir.x).normalize(); // Perpendicular direction
                    const useBack = Math.random() < 0.5;
                    const moveDir = useBack ? knockbackDir : sideDir;
                    player.position.add(moveDir.multiplyScalar(0.5)); // Move further away than before
                    
                    // Return to appropriate idle after hit animation
                    setTimeout(() => {
                        if (claireAnimator && gameState.hp > 0) {
                            claireAnimator.playAnimation(getClaireIdleAnimation(), true);
                        }
                    }, 500);
                }
                
                if (gameState.hp <= 0) {
                    gameState.isDead = true;
                    
                    // Leon death animation based on equipped weapon - keep frozen on ground
                    if (currentCharacter === 'leon' && leonAnimator) {
                        let deathAnim;
                        if (gameState.currentWeapon === 'knife') {
                            deathAnim = LEON_ANIMATIONS.knife_death;
                        } else if (gameState.currentWeapon === 'shotgun') {
                            deathAnim = LEON_ANIMATIONS.shotgun_death;
                        } else {
                            // Pistol - use pistol_death
                            deathAnim = LEON_ANIMATIONS.pistol_death;
                        }
                        
                        const action = leonAnimator.playAnimation(deathAnim, false);
                        if (action) {
                            action.clampWhenFinished = true; // Freeze on last frame
                        }
                    }
                    
                    // Claire death animation based on equipped weapon - keep frozen on ground
                    if (currentCharacter === 'claire' && claireAnimator) {
                        let deathAnim;
                        if (gameState.currentWeapon === 'knife') {
                            deathAnim = CLAIRE_ANIMATIONS.knife_death;
                        } else if (gameState.currentWeapon === 'smg') {
                            deathAnim = CLAIRE_ANIMATIONS.smg_death;
                        } else if (gameState.currentWeapon === 'pistol') {
                            deathAnim = CLAIRE_ANIMATIONS.pistol_death;
                        } else {
                            // Rifle, magnum, or others - use generic death
                            deathAnim = CLAIRE_ANIMATIONS.death;
                        }
                        
                        const action = claireAnimator.playAnimation(deathAnim, false);
                        if (action) {
                            action.clampWhenFinished = true; // Freeze on last frame
                        }
                    }
                    
                    document.getElementById('game-over-screen').style.display = 'block';
                    
                    // Stop gameplay music
                    stopAllMusic();
                    
                    // Play death sound, then play menu music when it finishes
                    deadSound.currentTime = 0;
                    deadSound.play().catch(err => console.log('Death sound autoplay blocked:', err));
                    
                    // Set up listener to play menu music when death sound finishes
                    deadSound.onended = function() {
                        menuMusic.currentTime = 0;
                        menuMusic.play().catch(err => console.log('Menu music autoplay blocked:', err));
                    };
                }
            }
        }
    });
}

// --- PICKUP SYSTEM ---
function createPickup(type, position) {
    const group = new THREE.Group();
    
    let color, label;
    switch(type) {
        case 'handgun_ammo':
            color = 0xffaa00;
            label = 'PISTOL';
            break;
        case 'shotgun_ammo':
            color = 0xff4444;
            label = 'SHOTGUN';
            break;
        case 'smg_ammo':
            color = 0x66ccff;
            label = 'SMG';
            break;
        case 'rifle_ammo':
            color = 0x99ff99;
            label = 'RIFLE';
            break;
        case 'magnum_ammo':
            color = 0xffff00;
            label = 'MAGNUM';
            break;
        case 'herb':
            color = 0x44ff44;
            label = 'HERB';
            break;
    }
    
    // Visual representation
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.4, 0.4),
        new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.3 })
    );
    box.position.y = 0.2;
    group.add(box);
    
    group.position.copy(position);
    group.userData.type = type;
    group.userData.rotationSpeed = 2;
    
    scene.add(group);
    pickups.push(group);
}

function updatePickups(dt) {
    for (let i = pickups.length - 1; i >= 0; i--) {
        const pickup = pickups[i];
        
        // Rotate pickup for visual effect
        pickup.rotation.y += pickup.userData.rotationSpeed * dt;
        pickup.children[0].position.y = 0.2 + Math.sin(Date.now() * 0.003) * 0.1;
        
        // Check collision with player
        const dist = pickup.position.distanceTo(player.position);
        if (dist < 1.5) {
            collectPickup(pickup.userData.type);
            scene.remove(pickup);
            pickups.splice(i, 1);
        }
    }
}

function collectPickup(type) {
    switch(type) {
        case 'handgun_ammo':
            gameState.weaponStates.pistol.reserve += 15;
            showMessage("HANDGUN AMMO +15", '#ffaa00');
            setTimeout(() => showMessage(""), 1000);
            break;
        case 'shotgun_ammo':
            gameState.weaponStates.shotgun.reserve += 8;
            showMessage("SHOTGUN AMMO +8", '#ff4444');
            setTimeout(() => showMessage(""), 1000);
            break;
        case 'smg_ammo':
            gameState.weaponStates.smg.reserve += 20;
            showMessage("SMG AMMO +20", '#66ccff');
            setTimeout(() => showMessage(""), 1000);
            break;
        case 'rifle_ammo':
            gameState.weaponStates.rifle.reserve += 25;
            showMessage("RIFLE AMMO +25", '#99ff99');
            setTimeout(() => showMessage(""), 1000);
            break;
        case 'magnum_ammo':
            gameState.weaponStates.magnum.reserve += 6;
            showMessage("MAGNUM AMMO +6", '#ffff00');
            setTimeout(() => showMessage(""), 1000);
            break;
        case 'herb':
            const herbItem = inventory.find(item => item.type === 'herb');
            if (herbItem) {
                herbItem.amount++;
            } else {
                inventory.push({ type: 'herb', amount: 1 });
            }
            showMessage("HERB +1", '#44ff44');
            setTimeout(() => showMessage(""), 1000);
            break;
    }
    updateUI();
}

function spawnRandomPickup() {
    const types = ['handgun_ammo', 'shotgun_ammo', 'herb'];
    const type = types[Math.floor(Math.random() * types.length)];
    const angle = Math.random() * Math.PI * 2;
    const distance = 10 + Math.random() * 15;
    const position = new THREE.Vector3(
        Math.sin(angle) * distance,
        0,
        Math.cos(angle) * distance
    );
    createPickup(type, position);
}

function updateCamera() {
    if (!player) return;

    // Camera offsets adjusted for each character
    let xOff = 0.8;
    let yOff = 2.5; 
    let zOff = -3.5;
    let aimX = 1.0;
    let aimY = 1.8;
    let aimZ = -1.2;
    
    // Leon (model-based) needs adjusted offsets
    if (currentCharacter === 'leon') {
        xOff = 0.9;
        yOff = 2.3;
        zOff = -4.0;
        aimX = 1.1;
        aimY = 1.9;
        aimZ = -1.3;
    }

    const currentX = input.aim ? aimX : xOff;
    const currentY = input.aim ? aimY : yOff;
    const currentZ = input.aim ? aimZ : zOff;

    const offset = new THREE.Vector3(currentX, currentY, currentZ);
    offset.applyQuaternion(player.quaternion);
    
    // Smooth Camera Follow
    const targetPos = player.position.clone().add(offset);
    camera.position.lerp(targetPos, 0.15);

    // Camera Look Direction
    if (input.aim) {
        // When aiming: Camera looks in direction of player rotation + pitch offset
        // This ensures crosshair points where bullets will go
        const lookDistance = 20;
        
        // Create direction vector based on player's Y rotation and camera pitch
        const direction = new THREE.Vector3();
        direction.x = Math.sin(player.rotation.y) * Math.cos(cameraPitch);
        direction.y = Math.sin(cameraPitch);
        direction.z = Math.cos(player.rotation.y) * Math.cos(cameraPitch);
        direction.normalize();
        
        const lookAt = camera.position.clone().add(direction.multiplyScalar(lookDistance));
        camera.lookAt(lookAt);
    } else {
        // When not aiming: Camera follows player's forward direction
        const lookDist = 5;
        const lookHeight = 1.5;
        const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(player.quaternion);
        const lookAt = player.position.clone().add(new THREE.Vector3(0, lookHeight, 0)).add(forward.multiplyScalar(lookDist));
        camera.lookAt(lookAt);
    }
}

// --- UI HELPERS ---
function updateUI() {
    const w = gameState.weaponStates[gameState.currentWeapon];
    const ammoText = gameState.isReloading ? 'RELOADING...' : `${w.ammo}/${w.reserve}`;
    document.getElementById('ammo-count').innerText = ammoText;
    document.getElementById('ammo-count').style.color = gameState.isReloading ? '#ffff00' : '#ffffff';
    document.getElementById('weapon-name').innerText = gameState.currentWeapon.toUpperCase();
    document.getElementById('round-hud').innerText = `ROUND: ${gameState.round}`;
    
    // Update enemies remaining counter
    const enemiesRemaining = Math.max(0, gameState.enemiesToSpawn - gameState.enemiesDefeated);
    document.getElementById('enemies-remaining').innerText = enemiesRemaining;
    
    // Resident Evil style health system
    const hpEl = document.getElementById('hp-text');
    const healthPercentage = gameState.hp / gameState.maxHp;
    
    if (healthPercentage > 0.66) {
        hpEl.innerText = "FINE";
        hpEl.style.color = "#0f0"; // Green
    } else if (healthPercentage > 0.33) {
        hpEl.innerText = "CAUTION";
        hpEl.style.color = "#ff0"; // Yellow
    } else {
        hpEl.innerText = "DANGER";
        hpEl.style.color = "#f00"; // Red
    }
}

function showMessage(txt, col='#0f0') {
    const el = document.getElementById('center-msg');
    el.innerText = txt;
    el.style.color = col;
    el.style.display = txt ? 'block' : 'none';
}

function toggleInventory() {
    inventoryOpen = !inventoryOpen;
    document.getElementById('inventory-panel').style.display = inventoryOpen ? 'block' : 'none';
    gameState.isPaused = inventoryOpen;
    if (inventoryOpen) updateInventoryDisplay();
}

function updateInventoryDisplay() {
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = '';
    inventory.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'inventory-slot';
        if (item.type === 'weapon') {
            div.innerText = item.id.toUpperCase();
            if(item.id === gameState.currentWeapon) div.style.border = '2px solid white';
            div.onclick = () => { equipWeapon(item.id); toggleInventory(); };
        } else {
            div.innerText = `HERB x${item.amount}`;
            div.onclick = () => { 
                if(gameState.hp < gameState.maxHp) {
                    gameState.hp = Math.min(gameState.maxHp, gameState.hp+50);
                    item.amount--;
                    if(item.amount<=0) inventory.splice(i,1);
                    updateUI(); toggleInventory();
                }
            };
        }
        grid.appendChild(div);
    });
}

function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    document.getElementById('pause-menu').style.display = gameState.isPaused ? 'flex' : 'none';
    
    // Pause/resume music based on game state
    const currentMusic = 
        currentCharacter === 'leon' ? leonMusic :
        currentCharacter === 'claire' ? claireMusic :
        currentCharacter === 'hunk' ? hunkMusic : null;
    
    if (currentMusic) {
        if (gameState.isPaused) {
            currentMusic.pause();
        } else {
            currentMusic.play().catch(err => console.log('Music resume blocked:', err));
        }
    }
}

function toggleFreecam() {
    gameState.isFreecam = !gameState.isFreecam;
    freecamVelocity.set(0, 0, 0); // Reset velocity
    
    if (gameState.isFreecam) {
        console.log('✓ Freecam enabled - Use WASD to move, mouse to look around');
        document.getElementById('btn-freecam').textContent = 'EXIT FREECAM';
    } else {
        console.log('✓ Freecam disabled - Normal gameplay resumed');
        document.getElementById('btn-freecam').textContent = 'FREECAM';
    }
}

function onKey(e, down) {
    if (e.code === 'KeyW') input.w = down;
    if (e.code === 'KeyS') input.s = down;
    if (e.code === 'KeyA') input.a = down;
    if (e.code === 'KeyD') input.d = down;
    if (e.code === 'KeyM') input.m = down;
    if (e.code === 'Space') input.space = down;
    if (e.code.includes('Shift')) input.shift = down;
    if (down) {
        if (e.code === 'KeyL') {
            // Toggle keyboard aim
            keyboardAimToggled = !keyboardAimToggled;
            if (!inventoryOpen) {
                document.getElementById('crosshair').style.display = keyboardAimToggled ? 'block' : 'none';
            }
        }
        if (e.code === 'KeyQ') performQuickTurn();
        if (e.code === 'KeyR') startReload();
        if (e.code === 'KeyI') toggleInventory();
        if (e.code === 'KeyP') togglePause();
    }
}

function onMouse(e, down) {
    if (e.button === 2) { 
        if (gameSettings.aimMode === 'toggle') {
            // Toggle mode
            if (down) {
                mouseAimToggled = !mouseAimToggled;
                input.aim = mouseAimToggled;
                if(!inventoryOpen) document.getElementById('crosshair').style.display = mouseAimToggled ? 'block' : 'none';
            }
        } else {
            // Hold mode (default)
            input.aim = down;
            if(!inventoryOpen) document.getElementById('crosshair').style.display = down ? 'block' : 'none';
        }
    }
    if (e.button === 0) input.fire = down;
}

function onMouseMove(e) {
    // Capture mouse movement for aiming or freecam
    if (!gameState.isPaused && !inventoryOpen) {
        if (gameState.isFreecam) {
            // Freecam mouse look
            const sensitivity = CONFIG.MOUSE_SENSITIVITY;
            camera.rotation.order = 'YXZ';
            camera.rotation.y -= e.movementX * sensitivity;
            camera.rotation.x -= e.movementY * sensitivity;
            
            // Clamp pitch to prevent camera flipping
            camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));
        } else if (input.aim) {
            // Normal aiming
            input.mouseX = e.movementX;
            input.mouseY = e.movementY;
        }
    }
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    update(clock.getDelta());
    renderer.render(scene, camera);
}