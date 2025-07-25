// Main Application Logic
class HarryPotterQuiz {
    constructor() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.playerName = '';
        this.timeLeft = 10;
        this.timer = null;
        this.questions = quizQuestions;
        this.totalQuestions = this.questions.length;
        this.certificateGenerator = new CertificateGenerator();
        
        this.initializeApp();
        this.setupEventListeners();
        this.createStars();
        this.createParticles();
    }
    
    initializeApp() {
        // Initialize audio
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.correctSound = document.getElementById('correctSound');
        this.wrongSound = document.getElementById('wrongSound');
        
        // Set initial volume
        this.backgroundMusic.volume = 1;
        this.correctSound.volume = 1;
        this.wrongSound.volume = 0.5;
        
        // Update title
        document.title = 'Harry Potter Quiz Adventure';
    }
    
    setupEventListeners() {
        // Login screen
        document.getElementById('startQuiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('playerName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startQuiz();
        });
        
        // Music controls
        document.getElementById('musicToggle').addEventListener('click', () => this.toggleMusic());
        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            this.backgroundMusic.volume = e.target.value / 100;
        });
        
        // Results screen
        document.getElementById('downloadCertificate').addEventListener('click', () => this.downloadCertificate());
        document.getElementById('playAgain').addEventListener('click', () => this.resetQuiz());
    }
    
    createStars() {
        const starsContainer = document.querySelector('.stars-container');
        const numStars = 50;
        
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.width = (Math.random() * 3 + 1) + 'px';
            star.style.height = star.style.width;
            star.style.animationDelay = Math.random() * 3 + 's';
            starsContainer.appendChild(star);
        }
    }
    
    createParticles() {
        const particlesContainer = document.querySelector('.particles-container');
        const numParticles = 20;
        
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    startQuiz() {
        const nameInput = document.getElementById('playerName');
        this.playerName = nameInput.value.trim();
        
        if (!this.playerName) {
            this.showNotification('Please enter your name to begin the magical journey!');
            nameInput.focus();
            return;
        }
        
        if (this.playerName.length < 2) {
            this.showNotification('Please enter a valid name (at least 2 characters)');
            nameInput.focus();
            return;
        }
        
        // Reset quiz state
        this.currentQuestionIndex = 0;
        this.score = 0;
        
        // Switch to quiz screen
        this.switchScreen('loginScreen', 'quizScreen');
        
        // Initialize quiz
        this.loadQuestion();
        this.updateProgress();
        
        // Start background music
        this.playBackgroundMusic();
    }
    
    switchScreen(fromScreen, toScreen) {
        document.getElementById(fromScreen).classList.remove('active');
        document.getElementById(toScreen).classList.add('active');
    }
    
    loadQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        // Update question text
        document.getElementById('questionText').textContent = question.question;
        
        // Update question counter
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = this.totalQuestions;
        
        // Clear and populate options
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.addEventListener('click', () => this.selectAnswer(index));
            optionsContainer.appendChild(button);
        });
        
        // Start timer
        this.startTimer();
        
        // Update character quote
        this.updateCharacterQuote('encouraging');
    }
    
    selectAnswer(selectedIndex) {
        const question = this.questions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.option-btn');
        const isCorrect = selectedIndex === question.correct;
        
        // Stop timer
        this.stopTimer();
        
        // Disable all options
        options.forEach(btn => btn.style.pointerEvents = 'none');
        
        // Show correct answer
        options[question.correct].classList.add('correct');
        
        if (isCorrect) {
            this.score++;
            this.playSound('correct');
            this.updateCharacterQuote('correct');
        } else {
            options[selectedIndex].classList.add('wrong');
            this.playSound('wrong');
            this.updateCharacterQuote('wrong');
        }
        
        // Move to next question after delay
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }
    
    startTimer() {
        this.timeLeft = 10;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    updateTimerDisplay() {
        document.getElementById('timerText').textContent = this.timeLeft;
        
        // Update circular progress
        const progress = document.getElementById('timerProgress');
        const circumference = 2 * Math.PI * 35; // radius = 35
        const offset = circumference - (this.timeLeft / 10) * circumference;
        progress.style.strokeDashoffset = offset;
        
        // Change color based on time left
        if (this.timeLeft <= 3) {
            progress.style.stroke = '#ff4444';
        } else if (this.timeLeft <= 5) {
            progress.style.stroke = '#ffaa00';
        } else {
            progress.style.stroke = '#ffd700';
        }
    }
    
    timeUp() {
        this.stopTimer();
        
        // Show correct answer
        const question = this.questions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.option-btn');
        options[question.correct].classList.add('correct');
        
        // Disable all options
        options.forEach(btn => btn.style.pointerEvents = 'none');
        
        this.playSound('wrong');
        this.updateCharacterQuote('wrong');
        
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.totalQuestions) {
            this.loadQuestion();
            this.updateProgress();
        } else {
            this.showResults();
        }
    }
    
    updateProgress() {
        const progress = (this.currentQuestionIndex / this.totalQuestions) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
    }
    
    showResults() {
        this.switchScreen('quizScreen', 'resultsScreen');
        
        const isWinner = this.score === this.totalQuestions;
        const resultsTitle = document.getElementById('resultsTitle');
        const scoreDisplay = document.getElementById('scoreDisplay');
        
        if (isWinner) {
            resultsTitle.textContent = 'Congratulations! 🏆';
            resultsTitle.style.color = '#ffd700';
            scoreDisplay.innerHTML = `
                <div style="font-size: 2rem; color: #28a745; margin-bottom: 10px;">Perfect Score!</div>
                <div>You scored ${this.score} out of ${this.totalQuestions} questions correctly!</div>
                <div style="margin-top: 10px; font-style: italic;">You are a true Harry Potter expert!</div>
            `;
        } else {
            resultsTitle.textContent = 'Well Done! ⭐';
            resultsTitle.style.color = '#4a90e2';
            scoreDisplay.innerHTML = `
                <div style="font-size: 2rem; color: #4a90e2; margin-bottom: 10px;">Great Effort!</div>
                <div>You scored ${this.score} out of ${this.totalQuestions} questions correctly!</div>
                <div style="margin-top: 10px; font-style: italic;">Keep learning about the wizarding world!</div>
            `;
        }
        
        // Generate certificate preview
        this.generateCertificatePreview();
        
        this.updateCharacterQuote('final');
    }
    
    async generateCertificatePreview() {
        const isWinner = this.score === this.totalQuestions;
        const preview = document.getElementById('certificatePreview');
        
        preview.innerHTML = `
            <h3 style="margin-bottom: 15px; color: #ffd700;">Your Certificate Preview</h3>
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; border: 1px solid rgba(255,215,0,0.3);">
                <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 10px;">
                    ${isWinner ? 'CERTIFICATE OF EXCELLENCE' : 'CERTIFICATE OF PARTICIPATION'}
                </div>
                <div style="margin: 10px 0;">Harry Potter Quiz Adventure</div>
                <div style="margin: 15px 0; font-size: 1.1rem; color: #ffd700;">
                    ${this.playerName}
                </div>
                <div style="font-size: 0.9rem; opacity: 0.8;">
                    Score: ${this.score}/${this.totalQuestions}
                </div>
            </div>
        `;
    }
    
    async downloadCertificate() {
        try {
            const isWinner = this.score === this.totalQuestions;
            const dataUrl = await this.certificateGenerator.generateCertificate(
                this.playerName, 
                this.score, 
                this.totalQuestions
            );
            
            this.certificateGenerator.downloadCertificate(dataUrl, this.playerName, isWinner);
            this.showNotification('Certificate downloaded successfully! 🎉');
        } catch (error) {
            console.error('Error generating certificate:', error);
            this.showNotification('Error generating certificate. Please try again.');
        }
    }
    
    resetQuiz() {
        // Reset all state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = 10;
        this.stopTimer();
        
        // Clear player name
        document.getElementById('playerName').value = '';
        
        // Switch back to login screen
        this.switchScreen('resultsScreen', 'loginScreen');
        
        // Reset progress
        document.getElementById('progressFill').style.width = '0%';
        
        // Stop background music
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
        document.getElementById('musicToggle').innerHTML = '<span class="music-icon">🎵</span><span class="music-text">Play Music</span>';
    }
    
    toggleMusic() {
        const musicBtn = document.getElementById('musicToggle');
        
        if (this.backgroundMusic.paused) {
            this.playBackgroundMusic();
            musicBtn.innerHTML = '<span class="music-icon">🔇</span><span class="music-text">Stop Music</span>';
        } else {
            this.backgroundMusic.pause();
            musicBtn.innerHTML = '<span class="music-icon">🎵</span><span class="music-text">Play Music</span>';
        }
    }
    
    playBackgroundMusic() {
    this.backgroundMusic.play().then(() => {
        console.log("Background music is playing.");
    }).catch(err => {
        console.warn("Autoplay failed due to browser policies:", err);
    });
}

    
    playSound(type) {
    if (type === 'correct') {
        this.correctSound.currentTime = 0;
        this.correctSound.play().catch(err => console.warn("Correct sound error:", err));
        this.showNotification('Correct! ✅', 1000);
    } else if (type === 'wrong') {
        this.wrongSound.currentTime = 0;
        this.wrongSound.play().catch(err => console.warn("Wrong sound error:", err));
        this.showNotification('Wrong! ❌', 1000);
    }
}

    
    updateCharacterQuote(situation) {
        const quote = document.getElementById('characterQuote');
        let message = '';
        
        switch (situation) {
            case 'correct':
                message = characterQuotes.correct[Math.floor(Math.random() * characterQuotes.correct.length)];
                break;
            case 'wrong':
                message = characterQuotes.wrong[Math.floor(Math.random() * characterQuotes.wrong.length)];
                break;
            case 'encouraging':
                message = characterQuotes.encouraging[Math.floor(Math.random() * characterQuotes.encouraging.length)];
                break;
            case 'final':
                message = characterQuotes.final[Math.floor(Math.random() * characterQuotes.final.length)];
                break;
            default:
                message = characterQuotes.welcome;
        }
        
        quote.textContent = `${message}`;
        quote.style.animation = 'none';
        setTimeout(() => {
            quote.style.animation = 'fadeIn 0.5s ease-in-out';
        }, 10);
    }
    
    showNotification(message, duration = 3000) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, duration);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HarryPotterQuiz();
});

// Add some global utility functions
window.addEventListener('beforeunload', (e) => {
    // Warn user before leaving during quiz
    const quizScreen = document.getElementById('quizScreen');
    if (quizScreen && quizScreen.classList.contains('active')) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press Enter to start quiz from login screen
    if (e.key === 'Enter' && document.getElementById('loginScreen').classList.contains('active')) {
        document.getElementById('startQuiz').click();
    }
    
    // Press 1-4 to select answers during quiz
    if (document.getElementById('quizScreen').classList.contains('active')) {
        const key = parseInt(e.key);
        if (key >= 1 && key <= 4) {
            const options = document.querySelectorAll('.option-btn');
            if (options[key - 1] && options[key - 1].style.pointerEvents !== 'none') {
                options[key - 1].click();
            }
        }
    }
    
});
// Harry Potter Quiz Questions
const quizQuestions = [
    {
        id: 1,
        question: "What is the name of Harry Potter's owl?",
        options: [
            "Hedwig",
            "Errol",
            "Pig",
            "Crookshanks"
        ],
        correct: 0,
        explanation: "Hedwig was Harry's loyal snowy owl, gifted to him by Hagrid on his 11th birthday."
    },
    {
        id: 2,
        question: "Which house at Hogwarts does Harry Potter belong to?",
        options: [
            "Slytherin",
            "Hufflepuff",
            "Ravenclaw",
            "Gryffindor"
        ],
        correct: 3,
        explanation: "Harry was sorted into Gryffindor, known for courage and bravery."
    },
    {
        id: 3,
        question: "What is the name of the three-headed dog guarding the Philosopher's Stone?",
        options: [
            "Fluffy",
            "Fang",
            "Aragog",
            "Buckbeak"
        ],
        correct: 0,
        explanation: "Fluffy was Hagrid's three-headed dog that guarded the trapdoor to the Philosopher's Stone."
    },
    {
        id: 4,
        question: "What spell is used to disarm an opponent?",
        options: [
            "Expelliarmus",
            "Stupefy",
            "Petrificus Totalus",
            "Avada Kedavra"
        ],
        correct: 0,
        explanation: "Expelliarmus is the disarming charm, one of Harry's signature spells."
    },
    {
        id: 5,
        question: "Who is the Half-Blood Prince?",
        options: [
            "Harry Potter",
            "Severus Snape",
            "Tom Riddle",
            "Draco Malfoy"
        ],
        correct: 1,
        explanation: "Severus Snape was the Half-Blood Prince, whose potions textbook helped Harry in his sixth year."
    },
    {
        id: 6,
        question: "What is the core of Harry Potter's wand?",
        options: [
            "Dragon heartstring",
            "Unicorn hair",
            "Phoenix feather",
            "Veela hair"
        ],
        correct: 2,
        explanation: "Harry's wand contains a phoenix feather core, from the same phoenix that gave a feather to Voldemort's wand."
    },
    {
        id: 7,
        question: "What is the name of the Weasley family's house?",
        options: [
            "The Burrow",
            "Shell Cottage",
            "Grimmauld Place",
            "Godric's Hollow"
        ],
        correct: 0,
        explanation: "The Burrow is the Weasley family's magical home, known for its chaotic but warm atmosphere."
    },
    {
        id: 8,
        question: "Which Hogwarts professor can turn into a cat?",
        options: [
            "Professor Sprout",
            "Professor McGonagall",
            "Professor Trelawney",
            "Professor Umbridge"
        ],
        correct: 1,
        explanation: "Professor McGonagall is an Animagus who can transform into a tabby cat."
    },
    {
        id: 9,
        question: "What is the name of Hermione's cat?",
        options: [
            "Scabbers",
            "Mrs. Norris",
            "Crookshanks",
            "Nagini"
        ],
        correct: 2,
        explanation: "Crookshanks is Hermione's half-cat, half-kneazle pet who could detect untrustworthy people."
    },
    {
        id: 10,
        question: "What does the spell 'Lumos' do?",
        options: [
            "Makes you invisible",
            "Creates light",
            "Heals wounds",
            "Unlocks doors"
        ],
        correct: 1,
        explanation: "Lumos is the wand-lighting charm that creates light at the tip of a wizard's wand."
    }
];

// Character quotes for different situations
const characterQuotes = {
    welcome: "Good luck with your quiz!",
    correct: ["Well done!", "Excellent!", "Brilliant work!", "Outstanding!"],
    wrong: ["Don't worry, keep trying!", "You'll get the next one!", "Stay focused!", "Learning is the key!"],
    encouraging: ["You're doing great!", "Keep it up!", "Almost there!", "Believe in yourself!"],
    final: ["Time to see your results!", "Let's check how you did!", "The moment of truth!"]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) 
    module.exports = { quizQuestions, characterQuotes };
// Certificate Generation System
class CertificateGenerator {
    constructor() {
        this.canvas = document.getElementById('certificateCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
    }

    async generateCertificate(playerName, score, totalQuestions) {
        const isWinner = score === totalQuestions;
        const certificateType = isWinner ? 'winner' : 'appreciation';
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        if (isWinner) {
            gradient.addColorStop(0, '#eee8aa');
            gradient.addColorStop(0.5, '#eee8aa');
            gradient.addColorStop(1, '#eee8aa');
        } else {
            gradient.addColorStop(0, '#b9efffff');
            gradient.addColorStop(0.5, '#b9efffff');
            gradient.addColorStop(1, '#b9efffff');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add border
        this.ctx.strokeStyle = '#8b4513';
        this.ctx.lineWidth = 8;
        this.ctx.strokeRect(20, 20, this.canvas.width - 40, this.canvas.height - 40);
        
        // Inner border
        this.ctx.strokeStyle = '#d4af37';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(30, 30, this.canvas.width - 60, this.canvas.height - 60);
        
        // Title
        this.ctx.fillStyle = '#8b4513';
        this.ctx.font = 'bold 36px Cinzel, serif';
        this.ctx.textAlign = 'center';
        
        const title = isWinner ? 'CERTIFICATE OF EXCELLENCE' : 'CERTIFICATE OF PARTICIPATION';
        this.ctx.fillText(title, this.canvas.width / 2, 100);
        
        // Subtitle
        this.ctx.font = '24px Cinzel, serif';
        this.ctx.fillText('Harry Potter Quiz Adventure', this.canvas.width / 2, 140);
        
        // Main text
        this.ctx.font = '20px serif';
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillText('This certifies that', this.canvas.width / 2, 200);
        
        // Player name
        this.ctx.font = 'bold 36px Cinzel, serif';
        this.ctx.fillStyle = isWinner ? '#8b0000' : '#1e3a8a';
        this.ctx.fillText(playerName, this.canvas.width / 2, 250);
        
        // Achievement text
        this.ctx.font = '20px serif';
        this.ctx.fillStyle = '#2c3e50';
        
        if (isWinner) {
            this.ctx.fillText('has successfully completed the Harry Potter Quiz', this.canvas.width / 2, 300);
            this.ctx.fillText('with a perfect score, demonstrating exceptional', this.canvas.width / 2, 330);
            this.ctx.fillText('knowledge of the wizarding world!', this.canvas.width / 2, 360);
        } else {
            this.ctx.fillText('has participated in the Harry Potter Quiz Adventure', this.canvas.width / 2, 300);
            this.ctx.fillText('and shown great enthusiasm for learning about', this.canvas.width / 2, 330);
            this.ctx.fillText('the magical world of Harry Potter!', this.canvas.width / 2, 360);
        }
        
        // Score
        this.ctx.font = 'bold 28px serif';
        this.ctx.fillStyle = isWinner ? '#8b0000' : '#1e3a8a';
        this.ctx.fillText(`Score: ${score}/${totalQuestions}`, this.canvas.width / 2, 410);
        
        // Date
        this.ctx.font = '18px serif';
        this.ctx.fillStyle = '#2c3e50';
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        this.ctx.fillText(`Awarded on ${currentDate}`, this.canvas.width / 2, 460);
        
        // Signature line
        // this.ctx.font = '16px serif';
        // this.ctx.fillText('Professor McGonagall', this.canvas.width / 2, 520);
        // this.ctx.fillText('Deputy Headmistress, Hogwarts School', this.canvas.width / 2, 540);
        
        // Add decorative elements
        this.addDecorations(isWinner);
        
        return this.canvas.toDataURL('image/png');
    }
    
    addDecorations(isWinner) {
        // Add some magical symbols
        this.ctx.font = '30px serif';
        this.ctx.fillStyle = isWinner ? '#8b0000' : '#1e3a8a';
        
        // Top decorations
        this.ctx.fillText('⚡', 150, 80);
        this.ctx.fillText('🦉', this.canvas.width - 150, 80);
        
        // Side decorations
        this.ctx.fillText('🏰', 80, 300);
        this.ctx.fillText('📚', this.canvas.width - 80, 300);
        
        // Bottom decorations
        this.ctx.fillText('🪄', 150, 550);
        this.ctx.fillText('✨', this.canvas.width - 150, 550);
    }
    
    downloadCertificate(dataUrl, playerName, isWinner) {
        const link = document.createElement('a');
        const certificateType = isWinner ? 'Winner' : 'Participation';
        link.download = `${playerName}_${certificateType}_Certificate.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CertificateGenerator;
}