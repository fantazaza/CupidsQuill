/* ========================================
   Cupid's Quill — Premium Valentine's Card
   Script (v2)
   ======================================== */

// ===== State =====
const state = {
    theme: 'romantic',
    sender: '',
    recipient: '',
    message: '',
    currentStep: 1,
};

const templates = [
    'ไม่รู้จะเริ่มยังไงดี\nแต่อยากบอกว่า... รักนะ ที่สุดเลย\n\nทุกครั้งที่อยู่ใกล้เธอ หัวใจเต้นแรงเสมอ\nอยากจะบอกแบบนี้มานานแล้ว',
    'ทุกเช้าที่ตื่นมา สิ่งแรกที่นึกถึงคือเธอ\n\nคิดถึงทุกวัน ทุกนาที ทุกวินาที\nอยากให้รู้ว่าเธอสำคัญมากแค่ไหน\nเธอคือคนพิเศษที่สุดในโลกนี้ของฉัน',
    'เรารู้จักกันมาสักพักแล้ว\nและทุกวันที่ผ่านไป ความรู้สึกนี้ชัดเจนขึ้นเรื่อยๆ\n\nฉันชอบทุกอย่างของเธอ\nรอยยิ้ม เสียงหัวเราะ แม้แต่ตอนงอน\n\nเป็นแฟนกันนะ... ได้ไหม?',
    'ถ้าความรักเป็นดวงดาว\nเธอคือจักรวาลทั้งจักรวาลของฉัน\n\nไม่ว่าจะผ่านไปนานแค่ไหน\nความรู้สึกนี้จะไม่เปลี่ยนแปลง\nรักเธอตลอดไป',
    'สวัสดี... เธออาจไม่รู้ว่าฉันเป็นใคร\nแต่ฉันแอบชอบเธอมานานแล้ว\n\nทุกครั้งที่เห็นเธอยิ้ม ใจฉันก็พองโต\nSecret Admirer คนนี้\nอยากให้เธอมีความสุขนะ',
];

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    // Rich editor char count is handled in its own DOMContentLoaded listener

    initParticles();

    // Check URL for shared card
    if (!loadCardFromURL()) {
        applyThemeVisuals('romantic');
    }

    // ESC to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeShareModal();
    });
});

// ===== Navigation =====
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===== Step Navigation =====
function goToStep(step) {
    if (step > state.currentStep && state.currentStep === 2) {
        const msg = (document.getElementById('loveMessage').innerText || '').trim();
        if (!msg) {
            showToast('✎ กรุณาเขียนข้อความรักก่อนนะ');
            document.getElementById('loveMessage').focus();
            return;
        }
    }

    state.currentStep = step;

    // Update progress bar
    const fill = document.getElementById('progressFill');
    fill.style.width = `${(step / 2) * 100}%`;

    // Steps
    document.querySelectorAll('.p-step').forEach((s, i) => {
        s.classList.remove('active', 'done');
        if (i + 1 < step) s.classList.add('done');
        if (i + 1 === step) s.classList.add('active');
    });

    // Show step
    document.querySelectorAll('.form-step').forEach(fs => fs.classList.remove('active'));
    const target = document.getElementById(`step${step}`);
    if (target) target.classList.add('active');
}

// ===== Rich Text Editor =====
function execFormat(cmd) {
    document.execCommand(cmd, false, null);
    document.getElementById('loveMessage').focus();
}

function execFontSize(size) {
    if (size === 'small') {
        document.execCommand('fontSize', false, '2');
    } else {
        document.execCommand('fontSize', false, '5');
    }
    document.getElementById('loveMessage').focus();
}

// Character count for contenteditable
document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('loveMessage');
    if (editor) {
        editor.addEventListener('input', () => {
            const text = editor.innerText || '';
            const count = text.trim().length;
            document.getElementById('charCount').textContent = count;
            if (count > 500) {
                editor.innerText = text.substring(0, 500);
                // Move cursor to end
                const range = document.createRange();
                range.selectNodeContents(editor);
                range.collapse(false);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        });
    }
});

// ===== Theme Selection =====
const themeConfig = {
    romantic: {
        bg: '#1a0008', bgWarm: '#2a0010',
        text: '#fff0f3', accent: '#ff1a4b',
        blob1: 'rgba(255,26,75,0.3)', blob2: 'rgba(200,0,50,0.2)', blob3: 'rgba(255,100,130,0.12)',
        particles: ['rgba(255,26,75,', 'rgba(220,20,60,', 'rgba(255,105,135,', 'rgba(255,200,210,'],
        shape: 'heart',
    },
    cute: {
        bg: '#1a060f', bgWarm: '#250a18',
        text: '#fff5f8', accent: '#ff69b4',
        blob1: 'rgba(255,105,180,0.3)', blob2: 'rgba(255,182,213,0.2)', blob3: 'rgba(255,200,230,0.15)',
        particles: ['rgba(255,105,180,', 'rgba(255,182,213,', 'rgba(255,140,200,', 'rgba(255,220,240,'],
        shape: 'flower',
    },
    elegant: {
        bg: '#0a0015', bgWarm: '#12002a',
        text: '#e8e0f0', accent: '#c0c0c0',
        blob1: 'rgba(128,0,255,0.25)', blob2: 'rgba(192,192,192,0.15)', blob3: 'rgba(180,160,255,0.1)',
        particles: ['rgba(192,192,192,', 'rgba(180,160,255,', 'rgba(128,0,255,', 'rgba(220,215,240,'],
        shape: 'diamond',
    },
    playful: {
        bg: '#151000', bgWarm: '#201a00',
        text: '#fffde8', accent: '#ffd700',
        blob1: 'rgba(255,215,0,0.25)', blob2: 'rgba(255,180,0,0.15)', blob3: 'rgba(255,255,200,0.1)',
        particles: ['rgba(255,215,0,', 'rgba(255,180,50,', 'rgba(255,240,100,', 'rgba(255,255,200,'],
        shape: 'star',
    },
    night: {
        bg: '#05001a', bgWarm: '#0a0030',
        text: '#e8e0ff', accent: '#b8a0ff',
        blob1: 'rgba(100,60,200,0.3)', blob2: 'rgba(180,160,255,0.15)', blob3: 'rgba(140,100,255,0.1)',
        particles: ['rgba(180,160,255,', 'rgba(140,100,255,', 'rgba(220,210,255,', 'rgba(255,215,0,'],
        shape: 'twinkle',
    },
};

let activeParticleColors = themeConfig.romantic.particles;
let activeParticleShape = 'heart';

function selectTheme(el) {
    document.querySelectorAll('.theme-option').forEach(t => t.classList.remove('selected'));
    el.classList.add('selected');
    state.theme = el.dataset.theme;
    applyThemeVisuals(state.theme);
}

function applyThemeVisuals(themeName) {
    const cfg = themeConfig[themeName] || themeConfig.romantic;
    const root = document.documentElement;

    // Update CSS custom properties
    root.style.setProperty('--bg', cfg.bg);
    root.style.setProperty('--bg-warm', cfg.bgWarm);
    root.style.setProperty('--text-primary', cfg.text);
    root.style.setProperty('--primary', cfg.accent);

    // For minimal (light) theme, adjust surface colors
    if (themeName === 'minimal') {
        root.style.setProperty('--surface-card', 'rgba(240,240,240,0.85)');
        root.style.setProperty('--border-subtle', 'rgba(0,0,0,0.1)');
        root.style.setProperty('--charcoal-800', '#f5f5f5');
        root.style.setProperty('--charcoal-600', '#ddd');
        root.style.setProperty('--charcoal-700', '#eee');
        root.style.setProperty('--champagne', '#1a1a1a');
        root.style.setProperty('--text-secondary', '#555');
        root.style.setProperty('--text-muted', '#888');
    } else {
        root.style.setProperty('--surface-card', 'rgba(42,34,37,0.65)');
        root.style.setProperty('--border-subtle', `rgba(${hexToRgb(cfg.accent)},0.15)`);
        root.style.setProperty('--charcoal-800', '#1a1517');
        root.style.setProperty('--charcoal-600', '#3d3235');
        root.style.setProperty('--charcoal-700', '#2a2225');
        root.style.setProperty('--champagne', cfg.text);
        root.style.setProperty('--text-secondary', '#b8adb1');
        root.style.setProperty('--text-muted', '#8a7d81');
    }

    // Update blob colors
    const blobs = document.querySelectorAll('.ambient-blob');
    if (blobs[0]) blobs[0].style.background = `radial-gradient(circle, ${cfg.blob1}, transparent 70%)`;
    if (blobs[1]) blobs[1].style.background = `radial-gradient(circle, ${cfg.blob2}, transparent 70%)`;
    if (blobs[2]) blobs[2].style.background = `radial-gradient(circle, ${cfg.blob3}, transparent 70%)`;

    // Update particle colors + shape
    activeParticleColors = cfg.particles;
    activeParticleShape = cfg.shape;

    // Flash effect
    themeFlash(cfg.particles[0]);
}

function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return [parseInt(h.substring(0,2),16), parseInt(h.substring(2,4),16), parseInt(h.substring(4,6),16)].join(',');
}

function themeFlash(colorBase) {
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed; inset: 0; z-index: 9999; pointer-events: none;
        background: radial-gradient(circle at center, ${colorBase}0.12), transparent 65%);
        animation: themeFlashAnim 0.6s ease-out forwards;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 700);
}


// ===== Template Usage =====
function useTemplate(index) {
    const editor = document.getElementById('loveMessage');
    editor.innerText = templates[index];
    document.getElementById('charCount').textContent = templates[index].length;
    editor.focus();
    showToast('✓ ใส่ข้อความสำเร็จรูปแล้ว');
}

// ===== Char Count =====
// Handled by rich editor DOMContentLoaded listener



// ===== Generate Card =====
function generateCard() {
    state.sender = document.getElementById('senderName').value.trim() || 'ผู้แอบรัก';
    state.recipient = document.getElementById('recipientName').value.trim() || 'คนพิเศษ';

    const editorEl = document.getElementById('loveMessage');
    const rawHtml = editorEl.innerHTML.trim();
    const plainText = editorEl.innerText.trim();
    state.message = plainText || 'รักนะ...';
    state.messageHtml = rawHtml || 'รักนะ...';

    const card = document.getElementById('loveCard');
    const wrapper = document.getElementById('cardWrapper');

    // Apply theme
    wrapper.className = 'card-stage';
    wrapper.classList.add(`card-theme-${state.theme}`);

    // Apply font
    const themeFont = {
        romantic: "'Charm', cursive",
        cute: "'Charm', cursive",
        elegant: "'Cormorant Garamond', serif",
        playful: "'Noto Sans Thai', 'Sarabun', sans-serif",
        // minimal removed
        night: "'Charm', cursive",
    };
    card.style.fontFamily = themeFont[state.theme] || "'Charm', cursive";

    // Front
    document.getElementById('cardTo').textContent = `ถึง ${state.recipient} ♡`;

    // Back — use innerHTML for rich text
    document.getElementById('cardDear').textContent = `ถึง ${state.recipient} ที่รัก,`;
    document.getElementById('cardMessage').innerHTML = state.messageHtml;
    document.getElementById('cardFrom').textContent = `ด้วยรักและคิดถึง,\n${state.sender}`;

    // Reset flip
    card.classList.remove('flipped');

    navigateTo('preview');
    saveCardToURL();
    showToast('✓ สร้างการ์ดสำเร็จแล้ว!');
}

// ===== Card Flip =====
document.addEventListener('click', (e) => {
    const card = e.target.closest('.card-3d');
    if (card) {
        card.classList.toggle('flipped');
        
        // Show response buttons if recipient opens card
        if (document.body.classList.contains('viewer-mode') && card.classList.contains('flipped')) {
            const resp = document.querySelector('.response-section');
            if (resp && !resp.classList.contains('visible')) {
                setTimeout(() => {
                    resp.classList.add('visible');
                    resp.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 800);
            }
        }
    }
});

// ===== URL Sharing =====
// ===== URL Sharing =====
function saveCardToURL() {
    const data = {
        t: state.theme
    };
    // Optimize: Only save if changed from default
    if (state.sender && state.sender !== 'ผู้แอบรัก') data.s = state.sender;
    if (state.recipient && state.recipient !== 'คนพิเศษ') data.r = state.recipient;
    
    // Optimize: Prefer HTML, only save one version
    if (state.messageHtml && state.messageHtml !== 'รักนะ...') {
        data.h = state.messageHtml;
    } else if (state.message && state.message !== 'รักนะ...') {
        data.m = state.message;
    }
    
    // Include answer if exists
    if (state.answer) data.a = state.answer;

    // Use try-catch for encoding safety
    try {
        let encoded;
        // Try compression if library loaded
        if (typeof LZString !== 'undefined') {
            encoded = LZString.compressToEncodedURIComponent(JSON.stringify(data));
            // LZString is already URL safe, no need to encodeURIComponent
            window.shareURL = window.location.origin + window.location.pathname + '?card=' + encoded;
        } else {
            // Legacy Base64 fallback
            encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
            window.shareURL = window.location.origin + window.location.pathname + '?card=' + encodeURIComponent(encoded);
        }
    } catch (e) {
        console.error('URL generation failed:', e);
        showToast('⚠ ข้อความยาวเกินไป อาจแชร์ไม่ได้');
    }
}

function loadCardFromURL() {
    const params = new URLSearchParams(window.location.search);
    let cardData = params.get('card');
    if (!cardData) return false;

    let data = null;

    // Try Decompress (LZString)
    try {
        if (typeof LZString !== 'undefined') {
            const decompressed = LZString.decompressFromEncodedURIComponent(cardData);
            if (decompressed) {
                data = JSON.parse(decompressed);
            }
        }
    } catch (e) {
        // Not compressed or invalid
    }

    // Fallback to Legacy Base64 if detection failed
    if (!data) {
        try {
            // Fix spaces for legacy base64
            const fixed = cardData.replace(/ /g, '+');
            data = JSON.parse(decodeURIComponent(escape(atob(fixed))));
        } catch (e) {
            console.error('Failed to parse card data:', e);
            showToast('⚠ ไม่สามารถโหลดการ์ดได้ (ลิงก์อาจผิดพลาด)');
            return false;
        }
    }

    try {
        state.theme = data.t || 'romantic';
        state.sender = data.s || 'ผู้แอบรัก';
        state.recipient = data.r || 'คนพิเศษ';
        if (data.a) state.answer = data.a;
        
        // Handle optimized message data
        if (data.h) {
            state.messageHtml = data.h;
            // Create plain text approximation for compatibility
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data.h;
            state.message = tempDiv.innerText;
        } else {
            state.message = data.m || 'รักนะ...';
            state.messageHtml = state.message.replace(/\n/g, '<br>');
        }

        const card = document.getElementById('loveCard');
        const wrapper = document.getElementById('cardWrapper');

        wrapper.className = 'card-stage';
        wrapper.classList.add(`card-theme-${state.theme}`);

        const themeFont = {
            romantic: "'Charm', cursive",
            cute: "'Charm', cursive",
            elegant: "'Cormorant Garamond', serif",
            playful: "'Noto Sans Thai', 'Sarabun', sans-serif",
            night: "'Charm', cursive",
        };
        card.style.fontFamily = themeFont[state.theme] || "'Charm', cursive";

        document.getElementById('cardTo').textContent = `ถึง ${state.recipient} ♡`;
        document.getElementById('cardDear').textContent = `ถึง ${state.recipient} ที่รัก,`;
        document.getElementById('cardMessage').innerHTML = state.messageHtml;
        document.getElementById('cardFrom').textContent = `ด้วยรักและคิดถึง,\n${state.sender}`;

        card.classList.remove('flipped');
        window.shareURL = window.location.href;
        
        // Apply theme visuals (bg, particles)
        applyThemeVisuals(state.theme);

        // viewer mode UI
        document.body.classList.add('viewer-mode');
        const homeBtn = document.querySelector('.btn-home');
        if (homeBtn) {
            homeBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                   <path d="M12 5v14M5 12h14" />
                </svg>
                สร้างการ์ดของคุณเอง`;
            homeBtn.onclick = () => {
                window.location.href = window.location.pathname; // Reload clear
            }
        }

        navigateTo('preview');

        if (state.answer) {
             document.querySelector('.response-section').classList.add('visible');
        }

        // If answer exists, show result immediately (without Reply button)
        if (state.answer === 'yes') {
            setTimeout(() => sayYes(false), 500);
        } else if (state.answer === 'no') {
            setTimeout(() => sayNo(false), 500);
        }

        return true;
    } catch (e) {
        console.error('Failed to load card:', e);
        showToast('⚠ ไม่สามารถโหลดการ์ดได้ (ลิงก์อาจผิดพลาด)');
        return false;
    }
}

// ===== Share =====
// ===== Share =====
async function shareCard() {
    if (!window.shareURL) saveCardToURL();
    
    const modal = document.getElementById('shareModal');
    const input = document.getElementById('shareLink');
    const copyStatus = document.getElementById('copyStatus');
    
    modal.classList.add('active');
    copyStatus.textContent = '';
    
    // Check if we should try to shorten (HTTP/S only, long URL)
    const longURL = window.shareURL;
    if (longURL.startsWith('http') && longURL.length > 50 && !longURL.includes('tinyurl.com')) {
        input.value = 'กำลังสร้าง Short Link...';
        
        try {
            const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longURL)}`);
            if (response.ok) {
                const short = await response.text();
                if (short.startsWith('http')) {
                    window.shareURL = short; // Cache it
                    input.value = short;
                    return;
                }
            }
        } catch (e) {
            console.warn('Short link failed, utilizing long URL');
        }
    }
    
    // Fallback or already short
    input.value = window.shareURL;
}

function closeShareModal() {
    document.getElementById('shareModal').classList.remove('active');
}

document.getElementById('shareModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeShareModal();
});

function copyLink() {
    const input = document.getElementById('shareLink');
    input.select();
    navigator.clipboard.writeText(input.value).then(() => {
        document.getElementById('copyStatus').textContent = '✅ คัดลอกลิงก์แล้ว!';
        showToast('✓ คัดลอกลิงก์เรียบร้อย!');
    }).catch(() => {
        document.execCommand('copy');
        document.getElementById('copyStatus').textContent = '✅ คัดลอกแล้ว!';
    });
}

// Social share functions removed


// ===== Download =====
// ===== Download =====


// ===== Toast =====
function showToast(msg) {
    const toast = document.getElementById('toast');
    const textEl = toast.querySelector('.toast-text');
    textEl.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== Say Yes / Say No =====
// ===== Say Yes / Say No =====
function runAway(btn) {
    // Initialize run count
    if (typeof btn._runCount === 'undefined') btn._runCount = 0;
    btn._runCount++;

    // If tired, stop running
    if (btn._runCount > 7) {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.5s ease-out';
        btn.textContent = 'โอเค ยอมก็ได้...';
        // Background color removed to keep original style
        btn.style.cursor = 'pointer'; 
        btn.onclick = sayNo; 
        
        // Remove listeners so it stops running
        btn.onmouseover = null;
        btn.ontouchstart = null;
        return;
    }

    const container = btn.closest('.response-buttons');
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    // Dampen movement as it gets tired
    const fatigue = 1 - (btn._runCount / 8); 
    const maxX = (containerRect.width - btnRect.width) * fatigue;
    const maxY = 120 * fatigue;

    // Random new position
    let newX = (Math.random() * maxX - maxX / 2);
    let newY = ((Math.random() - 0.5) * maxY);

    btn.style.transform = `translate(${newX}px, ${newY}px)`;
    // Slower transition as it gets tired
    const duration = 0.15 + (btn._runCount * 0.05);
    btn.style.transition = `transform ${duration}s ease`;

    // Change text randomly for fun
    const noTexts = ['Say No', 'ไม่นะ!', 'กดไม่ได้~', 'ลองอีกสิ', 'จับไม่ได้!', 'หนีก่อน~', 'เริ่มเหนื่อย...', 'เดี๋ยวก่อน...'];
    if (btn._runCount < 6) {
        btn.textContent = noTexts[Math.floor(Math.random() * noTexts.length)];
    } else {
        btn.textContent = 'แฮ่ก... แฮ่ก...';
    }
}

function sayYes(showReplyBtn = true) {
    state.answer = 'yes';
    saveCardToURL();
    
    // Update share button to "Send Reply"
    if (showReplyBtn) {
        const shareBtn = document.querySelector('.btn-share');
        if (shareBtn) {
            shareBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            ส่งคำตอบกลับ`;
        }
    }

    const section = document.getElementById('responseSection');
    const btnsDiv = section.querySelector('.response-buttons');
    const result = document.getElementById('responseResult');
    const question = section.querySelector('.response-question');

    btnsDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    btnsDiv.style.opacity = '0';
    btnsDiv.style.transform = 'scale(0.9)';

    setTimeout(() => {
        btnsDiv.style.display = 'none';
        question.style.display = 'none';

        let btnHtml = '';
        if (showReplyBtn) {
            btnHtml = `<button class="btn-share-reply" onclick="shareCard()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                ส่งคำตอบกลับ
            </button>`;
        }

        result.innerHTML = `
            <div class="result-text">ยินดีด้วย! เราเป็นของกันและกันแล้ว</div>
            ${btnHtml}
        `;

        document.body.classList.add('celebration-mode');
        launchFireworks();
    }, 350);
}

function sayNo(showReplyBtn = true) {
    state.answer = 'no';
    saveCardToURL();

    // Update share button to "Send Reply"
    if (showReplyBtn) {
        const shareBtn = document.querySelector('.btn-share');
        if (shareBtn) {
            shareBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            ส่งคำตอบกลับ`;
        }
    }

    const section = document.getElementById('responseSection');
    const btnsDiv = section.querySelector('.response-buttons');
    const result = document.getElementById('responseResult');
    const question = section.querySelector('.response-question');

    btnsDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    btnsDiv.style.opacity = '0';
    btnsDiv.style.transform = 'scale(0.9)';

    setTimeout(() => {
        btnsDiv.style.display = 'none';
        question.style.display = 'none';

        let btnHtml = '';
        if (showReplyBtn) {
            btnHtml = `<button class="btn-share-reply" onclick="shareCard()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                ส่งคำตอบกลับ
            </button>`;
        }

        result.innerHTML = `
            <div class="result-text" style="color:#b8adb1;">ไม่เป็นไร... ขอบคุณที่รับฟังนะ</div>
            ${btnHtml}
        `;

        document.body.classList.add('gloom-mode');
        launchRain();
    }, 350);
}

let activeEffectFrameId = null; // To track animation frame

function clearEffects() {
    const canvas = document.getElementById('effectCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (activeEffectFrameId) cancelAnimationFrame(activeEffectFrameId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ===== FIREWORKS Effect (Infinite, Transparent) =====
function launchFireworks() {
    clearEffects(); // Stop any previous effect
    const canvas = document.getElementById('effectCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const rockets = [];
    const particles = [];
    const colors = ['#ffcc00', '#ff3366', '#00ccff', '#cc33ff', '#66ff33', '#ffffff', '#ff9900'];
    
    let frame = 0;

    function createRocket() {
        rockets.push({
            x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
            y: canvas.height,
            vx: (Math.random() - 0.5) * 4,
            vy: -(Math.random() * 5 + 9),
            color: colors[Math.floor(Math.random() * colors.length)],
            explodeY: canvas.height * 0.1 + Math.random() * canvas.height * 0.4,
            history: []
        });
    }

    function createExplosion(x, y, color) {
        const particleCount = 50 + Math.random() * 50;
        for (let i = 0; i < particleCount; i++) {
            const speed = Math.random() * 5 + 2;
            const angle = Math.random() * Math.PI * 2;
            particles.push({
                x: x, y: y,
                px: x, py: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                alpha: 1,
                decay: Math.random() * 0.015 + 0.005,
                gravity: 0.05
            });
        }
    }

    function animate() {
        // Fully clear canvas every frame to prevent darkening
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Continuous launch
        if (frame % 35 === 0 || Math.random() < 0.03) {
            createRocket();
        }

        // Update rockets
        for (let i = rockets.length - 1; i >= 0; i--) {
            const r = rockets[i];
            r.history.push({x: r.x, y: r.y});
            if (r.history.length > 20) r.history.shift();
            
            r.x += r.vx;
            r.y += r.vy;
            r.vy += 0.05;

            // Draw trail
            ctx.beginPath();
            for(let j=0; j<r.history.length; j++) {
                const pos = r.history[j];
                ctx.lineTo(pos.x, pos.y);
            }
            ctx.lineTo(r.x, r.y);
            ctx.strokeStyle = `rgba(255,255,255,0.5)`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Head
            ctx.beginPath();
            ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = r.color;
            ctx.fill();

            if (r.y <= r.explodeY || r.vy >= 0) {
                createExplosion(r.x, r.y, r.color);
                rockets.splice(i, 1);
            }
        }

        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.px = p.x; p.py = p.y;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }

            // Draw motion blur line
            ctx.beginPath();
            ctx.moveTo(p.px, p.py);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(${hexToRgb(p.color)},${p.alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        frame++;
        activeEffectFrameId = requestAnimationFrame(animate);
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r},${g},${b}`;
    }

    animate();
}

// ===== RAIN Effect (Infinite) =====
function launchRain() {
    clearEffects(); // Stop any previous effect
    const canvas = document.getElementById('effectCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const W = canvas.width, H = canvas.height;

    const drops = [];
    const clouds = [];
    
    // Create persistent clouds
    for(let i=0; i<6; i++) {
        clouds.push({
            x: Math.random() * W,
            y: Math.random() * 80,
            w: 120 + Math.random() * 100,
            speed: 0.3 + Math.random() * 0.4
        });
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        
        // Draw clouds
        ctx.fillStyle = 'rgba(120, 130, 150, 0.3)';
        for(let c of clouds) {
            c.x += c.speed;
            if(c.x > W + 100) c.x = -c.w - 100; // Loop clouds

            ctx.beginPath();
            ctx.arc(c.x, c.y, 40, 0, Math.PI*2);
            ctx.arc(c.x + 40, c.y - 10, 50, 0, Math.PI*2);
            ctx.arc(c.x + 80, c.y, 40, 0, Math.PI*2);
            ctx.fill();
        }

        // Add drops continuously
        for(let i=0; i<5; i++) {
            drops.push({
                x: Math.random() * W,
                y: -30,
                l: Math.random() * 15 + 10,
                vy: Math.random() * 8 + 12
            });
        }

        // Update drops
        ctx.strokeStyle = 'rgba(160, 140, 150, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for(let i=drops.length-1; i>=0; i--) {
            let d = drops[i];
            d.y += d.vy;
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x, d.y - d.l);

            if(d.y > H) {
                drops.splice(i, 1);
            }
        }
        ctx.stroke();

        activeEffectFrameId = requestAnimationFrame(animate);
    }
    animate();
}



// ===== Particle System with Theme Shapes =====
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Shape drawing helpers
    function drawHeart(x, y, sz) {
        ctx.save(); ctx.translate(x, y);
        const s = sz / 10;
        ctx.beginPath();
        ctx.moveTo(0, -2*s);
        ctx.bezierCurveTo(-4*s, -8*s, -12*s, -2*s, 0, 6*s);
        ctx.bezierCurveTo(12*s, -2*s, 4*s, -8*s, 0, -2*s);
        ctx.fill(); ctx.restore();
    }
    function drawFlower(x, y, sz, rot) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.ellipse(0, -sz*0.6, sz*0.25, sz*0.6, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.rotate(Math.PI*2/5);
        }
        ctx.restore();
    }
    function drawDiamond(x, y, sz) {
        ctx.save(); ctx.translate(x, y);
        ctx.beginPath();
        ctx.moveTo(0, -sz); ctx.lineTo(sz*0.6, 0);
        ctx.lineTo(0, sz); ctx.lineTo(-sz*0.6, 0);
        ctx.closePath(); ctx.fill(); ctx.restore();
    }
    function drawStar(x, y, sz, rot) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const a = (i*4*Math.PI)/5 - Math.PI/2;
            i === 0 ? ctx.moveTo(Math.cos(a)*sz, Math.sin(a)*sz) : ctx.lineTo(Math.cos(a)*sz, Math.sin(a)*sz);
        }
        ctx.closePath(); ctx.fill(); ctx.restore();
    }
    function drawTwinkle(x, y, sz) {
        ctx.save(); ctx.translate(x, y);
        ctx.beginPath();
        const inner = sz*0.2;
        for (let i = 0; i < 4; i++) {
            const ao = (i*Math.PI)/2;
            const ai = ao + Math.PI/4;
            ctx.lineTo(Math.cos(ao)*sz, Math.sin(ao)*sz);
            ctx.lineTo(Math.cos(ai)*inner, Math.sin(ai)*inner);
        }
        ctx.closePath(); ctx.fill(); ctx.restore();
    }
    function drawShape(shape, x, y, sz, rot) {
        switch(shape) {
            case 'heart': drawHeart(x, y, sz); break;
            case 'flower': drawFlower(x, y, sz, rot); break;
            case 'diamond': drawDiamond(x, y, sz); break;
            case 'star': drawStar(x, y, sz, rot); break;
            case 'twinkle': drawTwinkle(x, y, sz); break;
            default: ctx.beginPath(); ctx.arc(x, y, sz*0.5, 0, Math.PI*2); ctx.fill();
        }
    }

    const particles = [];
    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.color = activeParticleColors[Math.floor(Math.random() * activeParticleColors.length)];
            this.alpha = Math.random() * 0.5 + 0.1;
            this.pulse = Math.random() * Math.PI * 2;
            this.rot = Math.random() * Math.PI * 2;
            this.rotSpd = (Math.random() - 0.5) * 0.02;
            this.shape = activeParticleShape;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulse += 0.025;
            this.rot += this.rotSpd;
            if (this.shape === 'flower') { this.speedY = Math.abs(this.speedY)*0.5+0.08; this.speedX += Math.sin(this.pulse)*0.008; }
            else if (this.shape === 'star') { this.speedY += Math.sin(this.pulse*2)*0.004; }
            else if (this.shape === 'twinkle') { this.speedX *= 0.99; this.speedY *= 0.99; }
            if (Math.random() < 0.003) { this.color = activeParticleColors[Math.floor(Math.random() * activeParticleColors.length)]; this.shape = activeParticleShape; }
            if (this.x < -20 || this.x > canvas.width+20 || this.y < -20 || this.y > canvas.height+20) this.reset();
        }
        draw() {
            const a = this.alpha * (0.4 + 0.6 * Math.sin(this.pulse));
            ctx.fillStyle = this.color + a + ')';
            const sz = this.shape === 'twinkle' ? this.size*(0.5+0.5*Math.sin(this.pulse*3)) : this.size;
            drawShape(this.shape, this.x, this.y, sz, this.rot);
        }
    }

    const count = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 12000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    const mouseParticles = [];
    class MouseParticle {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.size = Math.random() * 4 + 1;
            this.speedX = (Math.random()-0.5)*3;
            this.speedY = (Math.random()-0.5)*3;
            this.life = 1;
            this.decay = Math.random()*0.025+0.015;
            this.color = activeParticleColors[Math.floor(Math.random() * activeParticleColors.length)];
            this.rot = Math.random()*Math.PI*2;
            this.shape = activeParticleShape;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            this.speedX *= 0.97; this.speedY *= 0.97;
            this.life -= this.decay; this.rot += 0.05;
        }
        draw() {
            if (this.life <= 0) return;
            ctx.fillStyle = this.color + (this.life*0.6) + ')';
            drawShape(this.shape, this.x, this.y, this.size*this.life, this.rot);
        }
    }

    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.55) mouseParticles.push(new MouseParticle(e.clientX, e.clientY));
    });
    document.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        if (Math.random() > 0.5) mouseParticles.push(new MouseParticle(t.clientX, t.clientY));
    }, { passive: true });

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) { p.update(); p.draw(); }
        for (let i = mouseParticles.length-1; i >= 0; i--) {
            mouseParticles[i].update(); mouseParticles[i].draw();
            if (mouseParticles[i].life <= 0) mouseParticles.splice(i, 1);
        }
        while (mouseParticles.length > 60) mouseParticles.shift();
        requestAnimationFrame(loop);
    }
    loop();
}

// ===== Donate Modal =====
function openDonateModal() {
    const modal = document.getElementById('donateModal');
    if (modal) modal.classList.add('active');
}

function closeDonateModal() {
    const modal = document.getElementById('donateModal');
    if (modal) modal.classList.remove('active');
}

// Close on overlay click
const donateModal = document.getElementById('donateModal');
if (donateModal) {
    donateModal.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeDonateModal();
    });
}

// ===== Back Button Logic =====
function handleBack() {
    if (state.currentStep === 2) {
        goToStep(1);
    } else {
        navigateTo('landing');
    }
}
