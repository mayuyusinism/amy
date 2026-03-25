const GAME_DATA = {
    scenes: [
        { 
            id: 'intro', 
            bg: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600', 
            speaker: 'Investigation Log', 
            text: "March 25, 2026. Kyoto. The air is cold, but the mystery is burning. $NAME, a series of encrypted spirits have appeared at the old shrine. We need your deduction skills...", 
            choices: [{ text: "Examine the Shrine", next: 's1_puzzle' }] 
        },
        { 
            id: 's1_puzzle', 
            bg: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600', 
            speaker: 'J02', 
            text: "The spirits require a rhythmic pattern to reveal their number. Watch the sequence carefully and repeat it.", 
            type: 'puzzle_memory' 
        },
        { 
            id: 'after_s1', 
            bg: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600', 
            speaker: 'J02', 
            text: "The rhythm is restored. But look... the total number of spirits in this grid is the first key. How many are there?", 
            choices: [{ text: "Enter Total Spirits", next: 'input_wait' }] 
        },
        { 
            id: 's2_intro', 
            bg: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600', 
            speaker: 'J02', 
            text: "Correct. Now, we move to Gion. The lanterns here whisper a name... not in numbers, but the month khi mùa xuân thực sự bắt đầu. What is the 3rd month called?", 
            choices: [{ text: "Decipher the Month", next: 'input_wait' }] 
        },
        { 
            id: 's3_birthday', 
            bg: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600', 
            speaker: 'J02', 
            text: "We're so close. Every clue, every spirit, it all points to one special person. The numbers 25 and 03... what is the final combined code for today? (DDMM)", 
            choices: [{ text: "Enter Birthday Code", next: 'input_wait' }] 
        },
        { 
            id: 's4_minigame', 
            bg: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600', 
            speaker: 'J02', 
            text: "Final security layer: Sakura Collection. Catch 25 falling petals to reveal the hidden gift.", 
            type: 'mini_game',
            choices: [{ text: "Start Catching", next: 'start_game_action' }] 
        },
        { 
            id: 's5_final', 
            bg: '#000', 
            speaker: 'J02', 
            text: "The mystery is solved. The truth is waiting inside the envelope. Happy Birthday, Amy.", 
            choices: [{ text: "Open Your Gift", next: 'final_envelope' }] 
        }
    ],
    keys: ["25", "march", "2503"] 
};

let userName = "Amy";
let isAdmin = false;
let typeTimer = null;
let envelopeStep = 0;
let gameActive = false;

// 1. Khởi tạo hoa đào nền (luôn chạy)
function initSakura() {
    setInterval(() => {
        if (!gameActive) createLeaf(document.getElementById('sakura-container'), false);
    }, 400);
}

// 2. Màn hình Identify Yourself (Backdoor Login)
function beginAdventure() {
    const startScreen = document.getElementById('start-screen');
    startScreen.style.backgroundImage = "url('https://i.pinimg.com/1200x/8b/43/32/8b4332027a10fc1ab6ec3f596070cf28.jpg')";
    startScreen.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 20px; background: rgba(0,0,0,0.7); padding: 40px; border-radius: 15px; border: 1px solid var(--gold);">
            <div class="terminal-header" style="color: var(--gold); font-family: 'Cinzel'; font-size: 1.5rem;">IDENTIFY YOURSELF</div>
            <input type="text" id="user-login" placeholder="Enter name..." 
                   style="background:rgba(255,255,255,0.1); border:1px solid var(--gold); color:white; padding:12px; text-align:center; font-family:'Special Elite'; width: 250px; outline: none;">
            <button class="btn-start" onclick="confirmLogin()" style="padding: 10px 30px; cursor: pointer;">ACCESS SYSTEM</button>
        </div>
    `;
}

function confirmLogin() {
    const input = document.getElementById('user-login').value.trim();
    if (!input) return alert("Identify yourself, Detective.");
    
    userName = input;
    if (userName.toLowerCase() === "admin") {
        isAdmin = true;
        userName = "Developer";
    }

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('main-interface').classList.remove('hidden');
    renderScene(GAME_DATA.scenes[0]);
}

// 3. Render Scene & Admin Skip Logic
function renderScene(scene) {
    const viewport = document.getElementById('puzzle-viewport');
    const canvas = document.getElementById('text-canvas');
    const choiceList = document.getElementById('choice-list');
    const dialogue = document.getElementById('dialogue-container');
    
    viewport.innerHTML = ""; canvas.innerHTML = ""; choiceList.innerHTML = "";
    if (typeTimer) clearInterval(typeTimer);

    document.getElementById('dynamic-bg').style.backgroundImage = `url('${scene.bg}')`;
    dialogue.classList.remove('hidden');
    document.getElementById('speaker-tag').innerText = scene.speaker;

    // NẾU LÀ ADMIN: Hiện nút Skip Stage ngay lập tức
    if (isAdmin && scene.id !== 's5_final') {
        const skipBtn = document.createElement('button');
        skipBtn.innerText = "⏩ [ DEBUG: SKIP STAGE ]";
        skipBtn.style = "display:block; margin: 10px auto; font-size: 0.7rem; background: rgba(0,255,0,0.1); color: #00ff00; border: 1px solid #00ff00; cursor:pointer; padding: 5px; z-index: 10000;";
        skipBtn.onclick = () => adminSkip(scene.id);
        choiceList.appendChild(skipBtn);
    }

    const processedText = scene.text.replace("$NAME", userName);
    typeWriter(processedText, () => {
        if (scene.choices) {
            scene.choices.forEach(c => {
                const btn = document.createElement('button');
                btn.className = "choice-item";
                btn.innerText = `> ${c.text}`;
                btn.onclick = () => handleChoice(c.next);
                choiceList.appendChild(btn);
            });
        }
        if (scene.type === 'puzzle_memory') renderMemoryGrid();
    });
}

function adminSkip(currentId) {
    const order = ['intro', 's1_puzzle', 'after_s1', 's2_intro', 's3_birthday', 's4_minigame', 's5_final'];
    const currentIndex = order.indexOf(currentId);
    if (currentIndex < order.length - 1) {
        const nextScene = GAME_DATA.scenes.find(s => s.id === order[currentIndex + 1]);
        renderScene(nextScene);
    }
}

// 4. Mini Game Logic (Fixed Sakura Visibility)
function startBasketGame() {
    gameActive = true;
    document.getElementById('dialogue-container').classList.add('hidden'); 
    const viewport = document.getElementById('puzzle-viewport');
    let caught = 0; const goal = 25;

    viewport.innerHTML = `
        <div id="game-ui-wrapper" style="position:fixed; inset:0; z-index:8000; pointer-events:none;">
            <div id="progress-wrapper" style="position:absolute; top:60px; left:50%; transform:translateX(-50%); width:300px; height:10px; background:rgba(255,255,255,0.2); border-radius:10px; border:1px solid var(--gold); pointer-events:auto;">
                <div id="progress-bar" style="width:0%; height:100%; background:var(--gold); transition:0.3s;"></div>
            </div>
            <div id="score-text" style="position:absolute; top:30px; left:50%; transform:translateX(-50%); color:var(--gold); font-family:'Cinzel'; font-size:1.2rem;">SCORE: <span id="score">0</span> / ${goal}</div>
            <div id="basket" style="position:fixed; bottom:100px; left:50%; width:120px; height:18px; background:var(--gold); border-radius:20px; z-index:9000; transform:translateX(-50%); box-shadow: 0 0 20px var(--gold); pointer-events:auto;"></div>
        </div>
    `;

    const moveBasket = (x) => {
        const basket = document.getElementById('basket');
        if(basket) basket.style.left = x + 'px';
    };
    window.onmousemove = (e) => moveBasket(e.clientX);
    window.ontouchmove = (e) => moveBasket(e.touches[0].clientX);

    const spawnInterval = setInterval(() => {
        if (!gameActive) { clearInterval(spawnInterval); return; }
        createLeaf(document.getElementById("game-ui-wrapper"), true, () => {
            caught++;
            document.getElementById('score').innerText = caught;
            document.getElementById('progress-bar').style.width = (caught / goal * 100) + '%';
            if (caught >= goal) {
                gameActive = false;
                window.onmousemove = null;
                setTimeout(() => renderScene(GAME_DATA.scenes[6]), 500);
            }
        });
    }, 600);
}

function createLeaf(container, isGamePetal, onCatch) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.style.left = Math.random() * 95 + 'vw';
    const size = Math.random() * 10 + 12 + 'px';
    leaf.style.width = size; leaf.style.height = size;
    
    // CRITICAL FIX: Z-index cực cao cho hoa trong game
    leaf.style.position = "absolute";
    
    const duration = Math.random() * 2 + 2.5;
    leaf.style.animation = `fall ${duration}s linear forwards`;
    container.appendChild(leaf);

    if (isGamePetal) {
        const check = setInterval(() => {
            const basket = document.getElementById('basket');
            if (!basket || !gameActive) { clearInterval(check); leaf.remove(); return; }
            const b = basket.getBoundingClientRect(); const l = leaf.getBoundingClientRect();
            if (l.bottom >= b.top && l.right >= b.left && l.left <= b.right && l.top <= b.bottom) {
                leaf.remove(); clearInterval(check); onCatch();
            }
        }, 20);
    }
    setTimeout(() => { if(leaf.parentNode) leaf.remove(); }, duration * 1000);
}

// 5. Utility Functions
function handleChoice(next) {
    if (next === 'input_wait') {
        document.getElementById('terminal-top').classList.remove('hidden');
        document.getElementById('master-input').focus();
    } else if (next === 'final_envelope') {
        showFinalEnvelope();
    } else if (next === 'start_game_action') {
        startBasketGame();
    } else {
        const nextScene = GAME_DATA.scenes.find(s => s.id === next);
        if (nextScene) renderScene(nextScene);
    }
}

function typeWriter(text, callback) {
    const canvas = document.getElementById('text-canvas');
    let i = 0;
    typeTimer = setInterval(() => {
        canvas.innerHTML += text.charAt(i); i++;
        if (i >= text.length) { clearInterval(typeTimer); if (callback) callback(); }
    }, 50); 
}

document.getElementById('master-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const val = e.target.value.toLowerCase().trim();
        if (GAME_DATA.keys.includes(val)) {
            e.target.value = "";
            document.getElementById('terminal-top').classList.add('hidden');
            const map = { "25": 3, "march": 4, "2503": 5 };
            if(map[val]) renderScene(GAME_DATA.scenes[map[val]]);
        } else { alert("Access Denied."); }
    }
});

function renderMemoryGrid() {
    const viewport = document.getElementById('puzzle-viewport');
    const grid = document.createElement('div');
    grid.className = "spirit-grid";
    for(let i=0; i<25; i++) {
        const d = document.createElement('div');
        d.className = "dot"; d.id = `dot-${i}`;
        d.onclick = () => {
            userSeq.push(i); d.classList.add('active');
            setTimeout(() => d.classList.remove('active'), 300);
            if(userSeq.length === sequence.length) checkSeq();
        };
        grid.appendChild(d);
    }
    const watchBtn = document.createElement('button');
    watchBtn.className = "btn-start"; watchBtn.innerText = "OBSERVE RHYTHM"; watchBtn.style.marginTop = "20px";
    watchBtn.onclick = () => {
        sequence = Array.from({length: 5}, () => Math.floor(Math.random()*25));
        userSeq = [];
        sequence.forEach((idx, i) => {
            setTimeout(() => {
                const target = document.getElementById(`dot-${idx}`);
                if(target) target.classList.add('active');
                setTimeout(() => { if(target) target.classList.remove('active') }, 600);
            }, i * 900);
        });
    };
    viewport.appendChild(grid); viewport.appendChild(watchBtn);
}

function checkSeq() {
    if(userSeq.every((v, i) => v === sequence[i])) { renderScene(GAME_DATA.scenes[2]); }
    else { alert("Try again."); userSeq = []; }
}

function showFinalEnvelope() {
    document.getElementById('main-interface').classList.add('hidden');
    document.getElementById('final-stage').classList.remove('hidden');
}

function handleEnvelopeClick() {
    const env = document.getElementById('main-envelope');
    const letter = document.getElementById('inner-letter');
    if (envelopeStep === 0) { env.classList.add('open'); envelopeStep = 1; }
    else if (envelopeStep === 1) { envelopeStep = 2; }
    else if (envelopeStep === 2) { 
        letter.classList.add('extracted');
        setTimeout(() => {
            document.getElementById('final-stage').classList.add('hidden');
            document.getElementById('letter-read-mode').classList.remove('hidden');
        }, 1000);
    }
}

window.onload = initSakura;