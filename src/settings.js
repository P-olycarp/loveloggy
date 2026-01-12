// LoveLoggy Settings Module
// Shared settings functionality across all pages

// Theme CSS styles (inject into head)
const themeStyles = `
/* Settings Panel Slide Animation */
.settings-panel {
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.settings-panel.open {
    transform: translateX(0);
}

/* Overlay */
.settings-overlay {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}
.settings-overlay.open {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}

/* Theme Variables */
:root {
    --bg-primary: #EBE7E0;
    --bg-card: #FFFFFF;
    --text-primary: #000000;
    --text-secondary: #8E8E93;
    --accent-color: #007AFF;
    --accent-secondary: #9E8C78;
}

/* Dark Theme */
body.dark-theme {
    --bg-primary: #1C1C1E;
    --bg-card: #2C2C2E;
    --text-primary: #FFFFFF;
    --text-secondary: #8E8E93;
    --accent-color: #0A84FF;
    --accent-secondary: #BFA98E;
}

/* Rose Theme */
body.rose-theme {
    --bg-primary: #FFF0F3;
    --bg-card: #FFFFFF;
    --text-primary: #4A1A2C;
    --text-secondary: #9E6B7D;
    --accent-color: #E91E63;
    --accent-secondary: #F48FB1;
}

/* Ocean Theme */
body.ocean-theme {
    --bg-primary: #E8F4F8;
    --bg-card: #FFFFFF;
    --text-primary: #1A3A4A;
    --text-secondary: #5A8A9E;
    --accent-color: #0288D1;
    --accent-secondary: #4FC3F7;
}

/* Lavender Theme */
body.lavender-theme {
    --bg-primary: #F3E8FF;
    --bg-card: #FFFFFF;
    --text-primary: #3D1A5C;
    --text-secondary: #8B5A9E;
    --accent-color: #9C27B0;
    --accent-secondary: #CE93D8;
}

/* Mint Theme */
body.mint-theme {
    --bg-primary: #E8F5E9;
    --bg-card: #FFFFFF;
    --text-primary: #1B3A1F;
    --text-secondary: #5A8A5E;
    --accent-color: #4CAF50;
    --accent-secondary: #81C784;
}

/* Apply theme variables */
body.themed {
    background-color: var(--bg-primary) !important;
}
body.themed .themed-bg {
    background-color: var(--bg-primary) !important;
}
body.themed .themed-card {
    background-color: var(--bg-card) !important;
}
body.themed .themed-text {
    color: var(--text-primary) !important;
}
body.themed .themed-text-secondary {
    color: var(--text-secondary) !important;
}
body.themed .themed-accent {
    color: var(--accent-color) !important;
}
body.themed .themed-accent-bg {
    background-color: var(--accent-color) !important;
}

/* Toggle Switch */
.toggle-switch {
    position: relative;
    width: 51px;
    height: 31px;
}
.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}
.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #E5E5EA;
    transition: 0.4s;
    border-radius: 31px;
}
.toggle-slider:before {
    position: absolute;
    content: "";
    height: 27px;
    width: 27px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
input:checked + .toggle-slider {
    background-color: #34C759;
}
input:checked + .toggle-slider:before {
    transform: translateX(20px);
}

/* Theme Preview Circles */
.theme-option {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.theme-option:hover {
    transform: scale(1.1);
}
.theme-option.selected {
    box-shadow: 0 0 0 3px var(--accent-color, #007AFF);
}

/* Responsive Navigation */
@media (max-width: 380px) {
    .nav-item span {
        font-size: 9px !important;
    }
    .nav-item i {
        font-size: 18px !important;
    }
}

/* Toast styling */
#loveloggy-toast {
    position: fixed;
    bottom: 96px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #000;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 100;
    white-space: nowrap;
    max-width: 90vw;
    text-overflow: ellipsis;
    overflow: hidden;
}
`;

// Inject theme styles
function injectThemeStyles() {
    if (!document.getElementById('loveloggy-theme-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'loveloggy-theme-styles';
        styleEl.textContent = themeStyles;
        document.head.appendChild(styleEl);
    }
}

// Settings panel HTML
function getSettingsPanelHTML() {
    return `
        <!-- Settings Overlay -->
        <div id="settingsOverlay" class="settings-overlay fixed inset-0 bg-black/40 z-50" onclick="closeSettings()"></div>

        <!-- Settings Panel -->
        <div id="settingsPanel" class="settings-panel fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-ios-card z-50 shadow-2xl overflow-y-auto themed-card">
            <!-- Settings Header -->
            <div class="sticky top-0 bg-ios-card/95 ios-blur border-b border-ios-separator/30 px-4 py-4 themed-card">
                <div class="flex items-center justify-between">
                    <h2 class="text-lg font-bold text-ios-text themed-text">Settings</h2>
                    <button onclick="closeSettings()" class="w-8 h-8 rounded-full bg-ios-separator/30 flex items-center justify-center">
                        <i class="fas fa-times text-ios-secondary"></i>
                    </button>
                </div>
            </div>

            <!-- Settings Content -->
            <div class="p-4 space-y-6">
                <!-- Theme Section -->
                <div class="bg-ios-bg rounded-2xl p-4 themed-bg">
                    <h3 class="text-sm font-semibold text-ios-text mb-3 themed-text">
                        <i class="fas fa-palette mr-2 text-ios-blue themed-accent"></i>App Theme
                    </h3>
                    <div class="grid grid-cols-6 gap-3 mb-4">
                        <button onclick="setTheme('default')" class="theme-option w-10 h-10 rounded-full bg-gradient-to-br from-[#EBE7E0] to-[#D4CFC6] border-2 border-white shadow-md" title="Sand"></button>
                        <button onclick="setTheme('dark')" class="theme-option w-10 h-10 rounded-full bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border-2 border-white shadow-md" title="Dark"></button>
                        <button onclick="setTheme('rose')" class="theme-option w-10 h-10 rounded-full bg-gradient-to-br from-[#FFF0F3] to-[#FFCDD2] border-2 border-white shadow-md" title="Rose"></button>
                        <button onclick="setTheme('ocean')" class="theme-option w-10 h-10 rounded-full bg-gradient-to-br from-[#E8F4F8] to-[#B3E5FC] border-2 border-white shadow-md" title="Ocean"></button>
                        <button onclick="setTheme('lavender')" class="theme-option w-10 h-10 rounded-full bg-gradient-to-br from-[#F3E8FF] to-[#E1BEE7] border-2 border-white shadow-md" title="Lavender"></button>
                        <button onclick="setTheme('mint')" class="theme-option w-10 h-10 rounded-full bg-gradient-to-br from-[#E8F5E9] to-[#A5D6A7] border-2 border-white shadow-md" title="Mint"></button>
                    </div>
                    <p class="text-xs text-ios-secondary themed-text-secondary">Choose your couple theme 💕</p>
                </div>

                <!-- Quick Actions -->
                <div class="bg-ios-bg rounded-2xl overflow-hidden themed-bg">
                    <h3 class="text-sm font-semibold text-ios-text px-4 pt-4 pb-2 themed-text">
                        <i class="fas fa-bolt mr-2 text-yellow-500"></i>Quick Actions
                    </h3>
                    
                    <button onclick="window.location.href='gallery.html?folder=all'" class="w-full flex items-center justify-between px-4 py-3 border-b border-ios-separator/20 hover:bg-ios-separator/10 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center">
                                <i class="fas fa-images text-white text-sm"></i>
                            </div>
                            <span class="text-sm text-ios-text themed-text">Our Gallery</span>
                        </div>
                        <i class="fas fa-chevron-right text-ios-separator text-xs"></i>
                    </button>
                    
                    <button onclick="window.location.href='goals.html'" class="w-full flex items-center justify-between px-4 py-3 border-b border-ios-separator/20 hover:bg-ios-separator/10 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                                <i class="fas fa-bullseye text-white text-sm"></i>
                            </div>
                            <span class="text-sm text-ios-text themed-text">Couple Goals</span>
                        </div>
                        <i class="fas fa-chevron-right text-ios-separator text-xs"></i>
                    </button>
                    
                    <button onclick="window.location.href='resolutions.html'" class="w-full flex items-center justify-between px-4 py-3 border-b border-ios-separator/20 hover:bg-ios-separator/10 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                                <i class="fas fa-list-check text-white text-sm"></i>
                            </div>
                            <span class="text-sm text-ios-text themed-text">Resolutions</span>
                        </div>
                        <i class="fas fa-chevron-right text-ios-separator text-xs"></i>
                    </button>
                    
                    <button onclick="window.location.href='stats.html'" class="w-full flex items-center justify-between px-4 py-3 hover:bg-ios-separator/10 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                                <i class="fas fa-chart-line text-white text-sm"></i>
                            </div>
                            <span class="text-sm text-ios-text themed-text">Love Stats</span>
                        </div>
                        <i class="fas fa-chevron-right text-ios-separator text-xs"></i>
                    </button>
                </div>

                <!-- Preferences -->
                <div class="bg-ios-bg rounded-2xl overflow-hidden themed-bg">
                    <h3 class="text-sm font-semibold text-ios-text px-4 pt-4 pb-2 themed-text">
                        <i class="fas fa-sliders mr-2 text-ios-blue themed-accent"></i>Preferences
                    </h3>
                    
                    <div class="flex items-center justify-between px-4 py-3 border-b border-ios-separator/20">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-ios-secondary/20 flex items-center justify-center">
                                <i class="fas fa-bell text-ios-secondary text-sm"></i>
                            </div>
                            <span class="text-sm text-ios-text themed-text">Notifications</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="notificationsToggle" checked onchange="savePreferences()">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div class="flex items-center justify-between px-4 py-3 border-b border-ios-separator/20">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-ios-secondary/20 flex items-center justify-center">
                                <i class="fas fa-volume-high text-ios-secondary text-sm"></i>
                            </div>
                            <span class="text-sm text-ios-text themed-text">Sound Effects</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="soundToggle" checked onchange="savePreferences()">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div class="flex items-center justify-between px-4 py-3 border-b border-ios-separator/20">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-ios-secondary/20 flex items-center justify-center">
                                <i class="fas fa-heart-pulse text-ios-secondary text-sm"></i>
                            </div>
                            <span class="text-sm text-ios-text themed-text">Love Reminders</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="remindersToggle" onchange="savePreferences()">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div class="flex items-center justify-between px-4 py-3">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-ios-secondary/20 flex items-center justify-center">
                                <i class="fas fa-eye text-ios-secondary text-sm"></i>
                            </div>
                            <span class="text-sm text-ios-text themed-text">Read Receipts</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="readReceiptsToggle" checked onchange="savePreferences()">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- Fun Features -->
                <div class="bg-ios-bg rounded-2xl overflow-hidden themed-bg">
                    <h3 class="text-sm font-semibold text-ios-text px-4 pt-4 pb-2 themed-text">
                        <i class="fas fa-sparkles mr-2 text-yellow-400"></i>Fun Features
                    </h3>
                    
                    <button onclick="sendLoveNudge()" class="w-full flex items-center justify-between px-4 py-3 border-b border-ios-separator/20 hover:bg-ios-separator/10 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-red-400 flex items-center justify-center">
                                <i class="fas fa-heart text-white text-sm"></i>
                            </div>
                            <div class="text-left">
                                <span class="text-sm text-ios-text block themed-text">Send Love Nudge</span>
                                <span class="text-[10px] text-ios-secondary themed-text-secondary">Let them know you're thinking of them</span>
                            </div>
                        </div>
                        <i class="fas fa-paper-plane text-ios-blue themed-accent"></i>
                    </button>
                    
                    <button onclick="showRandomMemory()" class="w-full flex items-center justify-between px-4 py-3 border-b border-ios-separator/20 hover:bg-ios-separator/10 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
                                <i class="fas fa-shuffle text-white text-sm"></i>
                            </div>
                            <div class="text-left">
                                <span class="text-sm text-ios-text block themed-text">Random Memory</span>
                                <span class="text-[10px] text-ios-secondary themed-text-secondary">Relive a beautiful moment</span>
                            </div>
                        </div>
                        <i class="fas fa-dice text-ios-blue themed-accent"></i>
                    </button>
                    
                    <button onclick="showDailyQuestion()" class="w-full flex items-center justify-between px-4 py-3 hover:bg-ios-separator/10 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                                <i class="fas fa-question text-white text-sm"></i>
                            </div>
                            <div class="text-left">
                                <span class="text-sm text-ios-text block themed-text">Daily Question</span>
                                <span class="text-[10px] text-ios-secondary themed-text-secondary">Get to know each other better</span>
                            </div>
                        </div>
                        <i class="fas fa-lightbulb text-yellow-400"></i>
                    </button>
                </div>

                <!-- Account -->
                <div class="bg-ios-bg rounded-2xl overflow-hidden themed-bg">
                    <h3 class="text-sm font-semibold text-ios-text px-4 pt-4 pb-2 themed-text">
                        <i class="fas fa-user-gear mr-2 text-ios-blue themed-accent"></i>Account
                    </h3>
                    
                    <button onclick="window.location.href='profile.html'" class="w-full flex items-center justify-between px-4 py-3 border-b border-ios-separator/20 hover:bg-ios-separator/10 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-ios-blue flex items-center justify-center">
                                <i class="fas fa-user-edit text-white text-sm"></i>
                            </div>
                            <span class="text-sm text-ios-text themed-text">Edit Profile</span>
                        </div>
                        <i class="fas fa-chevron-right text-ios-separator text-xs"></i>
                    </button>
                    
                    <button onclick="exportData()" class="w-full flex items-center justify-between px-4 py-3 border-b border-ios-separator/20 hover:bg-ios-separator/10 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                                <i class="fas fa-download text-white text-sm"></i>
                            </div>
                            <span class="text-sm text-ios-text themed-text">Export Data</span>
                        </div>
                        <i class="fas fa-chevron-right text-ios-separator text-xs"></i>
                    </button>
                    
                    <button onclick="confirmLogout()" class="w-full flex items-center justify-between px-4 py-3 hover:bg-ios-separator/10 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-ios-red flex items-center justify-center">
                                <i class="fas fa-sign-out-alt text-white text-sm"></i>
                            </div>
                            <span class="text-sm text-ios-red">Logout</span>
                        </div>
                        <i class="fas fa-chevron-right text-ios-separator text-xs"></i>
                    </button>
                </div>

                <!-- App Info -->
                <div class="text-center py-4">
                    <p class="text-xs text-ios-secondary themed-text-secondary">LoveLoggy v1.0</p>
                    <p class="text-[10px] text-ios-secondary/60 themed-text-secondary">Made with ❤️ for couples</p>
                </div>
            </div>
        </div>

        <!-- Toast Notification -->
        <div id="loveloggy-toast">Message</div>
    `;
}

// Initialize settings
function initSettings() {
    injectThemeStyles();
    
    // Create toast if not exists
    if (!document.getElementById('loveloggy-toast')) {
        const toast = document.createElement('div');
        toast.id = 'loveloggy-toast';
        toast.textContent = 'Message';
        document.body.appendChild(toast);
    }
    
    // Inject settings panel if not exists
    if (!document.getElementById('settingsPanel')) {
        const container = document.createElement('div');
        container.innerHTML = getSettingsPanelHTML();
        document.body.appendChild(container);
    }
    
    loadTheme();
    loadPreferences();
}

// Settings Panel Functions
function openSettings() {
    document.getElementById('settingsOverlay').classList.add('open');
    document.getElementById('settingsPanel').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeSettings() {
    document.getElementById('settingsOverlay').classList.remove('open');
    document.getElementById('settingsPanel').classList.remove('open');
    document.body.style.overflow = '';
}

// Theme Functions
function setTheme(themeName) {
    const body = document.body;
    // Remove all theme classes
    body.classList.remove('themed', 'dark-theme', 'rose-theme', 'ocean-theme', 'lavender-theme', 'mint-theme');
    
    // Remove selected from all theme options
    document.querySelectorAll('.theme-option').forEach(el => el.classList.remove('selected'));
    
    if (themeName !== 'default') {
        body.classList.add('themed', `${themeName}-theme`);
    }
    
    // Add selected to current theme (if event exists)
    if (event && event.target) {
        event.target.classList.add('selected');
    }
    
    // Save preference
    localStorage.setItem('loveloggy_theme', themeName);
    showToast(`Theme changed to ${themeName === 'default' ? 'Sand' : themeName.charAt(0).toUpperCase() + themeName.slice(1)}! ✨`);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('loveloggy_theme') || 'default';
    const body = document.body;
    
    if (savedTheme !== 'default') {
        body.classList.add('themed', `${savedTheme}-theme`);
    }
    
    // Mark selected theme
    setTimeout(() => {
        const themeButtons = document.querySelectorAll('.theme-option');
        const themeNames = ['default', 'dark', 'rose', 'ocean', 'lavender', 'mint'];
        themeNames.forEach((name, index) => {
            if (name === savedTheme && themeButtons[index]) {
                themeButtons[index].classList.add('selected');
            }
        });
    }, 100);
}

// Preferences
function savePreferences() {
    const prefs = {
        notifications: document.getElementById('notificationsToggle')?.checked ?? true,
        sound: document.getElementById('soundToggle')?.checked ?? true,
        reminders: document.getElementById('remindersToggle')?.checked ?? false,
        readReceipts: document.getElementById('readReceiptsToggle')?.checked ?? true
    };
    localStorage.setItem('loveloggy_prefs', JSON.stringify(prefs));
    showToast('Preferences saved! ✓');
}

function loadPreferences() {
    const prefs = JSON.parse(localStorage.getItem('loveloggy_prefs') || '{}');
    setTimeout(() => {
        const notif = document.getElementById('notificationsToggle');
        const sound = document.getElementById('soundToggle');
        const remind = document.getElementById('remindersToggle');
        const read = document.getElementById('readReceiptsToggle');
        
        if (notif && prefs.notifications !== undefined) notif.checked = prefs.notifications;
        if (sound && prefs.sound !== undefined) sound.checked = prefs.sound;
        if (remind && prefs.reminders !== undefined) remind.checked = prefs.reminders;
        if (read && prefs.readReceipts !== undefined) read.checked = prefs.readReceipts;
    }, 100);
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('loveloggy-toast');
    if (toast) {
        toast.textContent = message;
        toast.style.opacity = '1';
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 2500);
    }
}

// Fun Features
const loveNudges = [
    "💕 Someone is thinking about you right now!",
    "❤️ You just got a virtual hug!",
    "💖 Your partner sends you a kiss!",
    "🥰 Someone loves you very much!",
    "✨ You're the best thing that happened to them!",
    "💗 Sending you all my love!",
    "😘 *virtual smooch*",
    "🌹 You're as beautiful as this rose!"
];

function sendLoveNudge() {
    const nudge = loveNudges[Math.floor(Math.random() * loveNudges.length)];
    showToast(nudge);
    closeSettings();
}

function showRandomMemory() {
    const messages = JSON.parse(localStorage.getItem('loveloggy_chat') || '[]');
    const events = JSON.parse(localStorage.getItem('loveloggy_events') || '[]');
    const allItems = [...messages, ...events];
    
    if (allItems.length === 0) {
        showToast("No memories yet! Start creating some 💬");
    } else {
        const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
        const text = randomItem.text || randomItem.title || 'A beautiful memory';
        showToast(`Memory: "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}" 📝`);
    }
    closeSettings();
}

const dailyQuestions = [
    "What's one thing you love most about your partner?",
    "Describe your perfect date night together.",
    "What's a dream you'd like to achieve together?",
    "What song reminds you of your relationship?",
    "What's your favorite memory together?",
    "What makes your partner laugh the most?",
    "If you could travel anywhere together, where would it be?",
    "What's something new you'd like to try together?",
    "What's the most thoughtful thing your partner has done?",
    "What do you admire most about your partner?"
];

function showDailyQuestion() {
    const question = dailyQuestions[Math.floor(Math.random() * dailyQuestions.length)];
    showToast(`💭 ${question}`);
    closeSettings();
}

function exportData() {
    const data = {
        user: localStorage.getItem('loveloggy_user'),
        chat: localStorage.getItem('loveloggy_chat'),
        events: localStorage.getItem('loveloggy_events'),
        goals: localStorage.getItem('loveloggy_goals'),
        preferences: localStorage.getItem('loveloggy_prefs'),
        theme: localStorage.getItem('loveloggy_theme')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loveloggy_backup.json';
    a.click();
    showToast('Data exported! 📥');
    closeSettings();
}

function confirmLogout() {
    if (confirm('Are you sure you want to logout?')) {
        if (window.LoveLoggyAuth && LoveLoggyAuth.logout) {
            LoveLoggyAuth.logout();
        } else {
            localStorage.removeItem('loveloggy_user');
        }
        window.location.href = 'index.html';
    }
}

// Make functions globally accessible
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.setTheme = setTheme;
window.savePreferences = savePreferences;
window.showDailyQuestion = showDailyQuestion;
window.exportData = exportData;
window.confirmLogout = confirmLogout;
window.sendLoveNudge = sendLoveNudge;
window.showRandomMemory = showRandomMemory;
window.showToast = showToast;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettings);
} else {
    initSettings();
}
