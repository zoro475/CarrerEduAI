// FPT Polytechnic majors data
const fptMajors = {
    "technology": [
        "Phát triển phần mềm",
        "Thiết kế đồ họa",
        "Ứng dụng phần mềm",
        "Quản trị mạng máy tính",
        "Thiết kế trang web"
    ],
    "business": [
        "Quản trị kinh doanh",
        "Kế toán",
        "Marketing",
        "Logistics",
        "Quản lý khách sạn"
    ],
    "creative": [
        "Thiết kế đồ họa",
        "Thiết kế nội thất",
        "Thiết kế thời trang",
        "Quay phim và biên tập"
    ],
    "engineering": [
        "Công nghệ ô tô",
        "Điện tử viễn thông",
        "Cơ khí máy tính",
        "Điện công nghiệp"
    ]
};

// Enhanced API Configuration with GitHub Copilot integration
const API_CONFIG = {
    provider: 'demo', // 'openai', 'github', 'gemini', hoặc 'demo'
    openaiKey: 'demo-mode', // OpenAI API key (bắt đầu bằng sk-)
    githubToken: 'demo-mode', // GitHub Personal Access Token
    githubUsername: 'your-username', // GitHub username
    githubRepo: 'your-repo', // GitHub repository name
    githubBranch: 'main' // GitHub branch
};

// GitHub Copilot Chat Integration
class GitHubCopilotChat {
    constructor(config) {
        this.config = config;
        this.baseUrl = 'https://api.github.com';
        this.isAvailable = false;
        this.checkAvailability();
    }

    async checkAvailability() {
        if (this.config.githubToken === 'demo-mode') {
            this.isAvailable = false;
            return;
        }

        try {
            const response = await fetch(`${this.baseUrl}/user`, {
                headers: {
                    'Authorization': `token ${this.config.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            this.isAvailable = response.ok;
        } catch (error) {
            console.warn('GitHub API not available:', error);
            this.isAvailable = false;
        }
    }

    async sendMessage(message, context = '') {
        if (!this.isAvailable) {
            throw new Error('GitHub Copilot không khả dụng. Vui lòng kiểm tra cấu hình.');
        }

        try {
            // Create a new issue with the question
            const issueData = {
                title: `Copilot Chat: ${message.substring(0, 50)}...`,
                body: `## Câu hỏi từ AI Copilot
${message}

## Ngữ cảnh
${context}

## Yêu cầu
Vui lòng trả lời bằng tiếng Việt, thân thiện và hữu ích.`,
                labels: ['copilot-chat', 'question']
            };

            const response = await fetch(`${this.baseUrl}/repos/${this.config.githubUsername}/${this.config.githubRepo}/issues`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.config.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(issueData)
            });

            if (!response.ok) {
                throw new Error('Không thể tạo issue trên GitHub');
            }

            const issue = await response.json();
            
            // For demo purposes, return a simulated response
            // In production, you would wait for a human response or use GitHub Actions
            return this.generateSimulatedResponse(message);
            
        } catch (error) {
            console.error('GitHub Copilot Error:', error);
            throw new Error(`Lỗi GitHub Copilot: ${error.message}`);
        }
    }

    generateSimulatedResponse(message) {
        // Enhanced simulated responses for GitHub Copilot
        const responses = {
            'code': '💻 **GitHub Copilot có thể giúp bạn với code!**\n\nTôi có thể:\n• Gợi ý code hoàn chỉnh\n• Giải thích logic\n• Tối ưu hóa code\n• Debug vấn đề\n\nBạn muốn tôi giúp gì cụ thể? 😊',
            'github': '🚀 **GitHub Copilot - Trợ lý AI mạnh mẽ!**\n\n**Tính năng chính:**\n• Code completion thông minh\n• Code explanation chi tiết\n• Bug detection và fix\n• Documentation generation\n\n**Lợi ích:**\n• Tăng tốc độ coding\n• Giảm lỗi syntax\n• Học hỏi best practices\n• Hỗ trợ nhiều ngôn ngữ\n\nBạn muốn tìm hiểu thêm về tính năng nào? 🤔',
            'help': '🤖 **GitHub Copilot - Hướng dẫn sử dụng:**\n\n**Cách hoạt động:**\n1. Cài đặt extension trong VS Code\n2. Đăng nhập với GitHub account\n3. Bắt đầu code và nhận gợi ý\n4. Sử dụng `/` để tạo comment\n\n**Lệnh hữu ích:**\n• `/explain` - Giải thích code\n• `/fix` - Sửa lỗi\n• `/test` - Tạo test cases\n• `/doc` - Tạo documentation\n\nBạn cần hỗ trợ gì cụ thể? 😊'
        };

        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('code') || lowerMessage.includes('lập trình')) {
            return responses.code;
        } else if (lowerMessage.includes('github') || lowerMessage.includes('copilot')) {
            return responses.github;
        } else if (lowerMessage.includes('help') || lowerMessage.includes('hướng dẫn')) {
            return responses.help;
        } else {
            return `🤖 **GitHub Copilot đang xử lý câu hỏi của bạn...**\n\n"${message}"\n\n**Tính năng GitHub Copilot:**\n• 💻 Code completion thông minh\n• 🧠 AI-powered suggestions\n• 📚 Documentation generation\n• 🐛 Bug detection\n• 🚀 Productivity boost\n\nBạn có muốn tìm hiểu thêm về GitHub Copilot không? 😊`;
        }
    }
}

// Initialize GitHub Copilot Chat
const githubCopilot = new GitHubCopilotChat(API_CONFIG);

// Provider management functions
function switchProvider() {
    const providerSelection = document.getElementById('providerSelection');
    providerSelection.style.display = providerSelection.style.display === 'none' ? 'block' : 'none';
}

function setProvider(provider) {
    API_CONFIG.provider = provider;
    
    // Update UI
    updateProviderUI(provider);
    
    // Update status
    const statusElement = document.getElementById('copilotStatus');
    statusElement.textContent = getProviderDisplayName(provider);
    statusElement.className = `copilot-status ${provider}`;
    
    // Hide provider selection
    document.getElementById('providerSelection').style.display = 'none';
    
    // Show appropriate info
    updateProviderInfo(provider);
    
    // Save preference
    localStorage.setItem('copilotProvider', provider);
}

function updateProviderUI(provider) {
    // Remove active class from all buttons
    document.querySelectorAll('.provider-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected provider
    document.querySelector(`[onclick="setProvider('${provider}')"]`).classList.add('active');
}

function getProviderDisplayName(provider) {
    const names = {
        'demo': 'Demo Mode',
        'github': 'GitHub Copilot',
        'openai': 'OpenAI GPT'
    };
    return names[provider] || 'Demo Mode';
}

function updateProviderInfo(provider) {
    const infoElement = document.getElementById('providerInfo');
    const info = {
        'demo': '<strong>Demo Mode:</strong> Sử dụng câu trả lời được thiết kế sẵn, không cần API key',
        'github': '<strong>GitHub Copilot:</strong> Sử dụng GitHub API để tương tác với Copilot. Cần cấu hình GitHub token và repository',
        'openai': '<strong>OpenAI GPT:</strong> Sử dụng OpenAI API. Cần cấu hình OpenAI API key'
    };
    
    infoElement.innerHTML = `<p>${info[provider] || info['demo']}</p>`;
}

// Load saved provider preference
function loadProviderPreference() {
    const savedProvider = localStorage.getItem('copilotProvider');
    if (savedProvider && ['demo', 'github', 'openai'].includes(savedProvider)) {
        setProvider(savedProvider);
    }
}

// Initialize sliders
document.addEventListener('DOMContentLoaded', function() {
    const sliders = ['technology', 'creativity', 'communication', 'logic', 'business', 'manual'];
    sliders.forEach(slider => {
        const element = document.getElementById(slider);
        const valueElement = document.getElementById(slider + 'Value');
        
        element.addEventListener('input', function() {
            valueElement.textContent = this.value;
        });
    });

    loadHistory();
    loadCopilotHistory(); // Load copilot conversation history
    updateCopilotStatus(); // Update status indicator
    loadProviderPreference(); // Load saved provider preference
});

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Update navigation
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Auto-generate infographic if switching to infographic tab
    if (sectionName === 'infographic') {
        generateInfographic();
    }
}

document.getElementById('surveyForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (API_CONFIG.provider === 'demo') {
        // Demo mode - proceed without API key
        console.log('Running in demo mode');
    } else if (API_CONFIG.provider === 'openai' && (!API_CONFIG.openaiKey || API_CONFIG.openaiKey === 'YOUR_API_KEY_HERE' || API_CONFIG.openaiKey === 'demo-mode')) {
        alert('Vui lòng cấu hình OpenAI API Key thực trong code trước khi sử dụng! Hoặc chuyển sang chế độ demo.');
        return;
    } else if (API_CONFIG.provider === 'github' && (!API_CONFIG.githubToken || API_CONFIG.githubToken === 'YOUR_GITHUB_TOKEN' || API_CONFIG.githubToken === 'demo-mode')) {
        alert('Vui lòng cấu hình GitHub Token thực trong code trước khi sử dụng! Hoặc chuyển sang chế độ demo.');
        return;
    }

    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('surveyForm').style.display = 'none';
    
    // Simulate progress
    simulateProgress();
    
    // Collect form data
    const formData = collectFormData();
    
    try {
        // Call AI API
        const result = await analyzeWithAI(formData);
        
        // Display results
        displayResults(result, formData);
        
        // Save to history
        saveToHistory(result, formData);
        
        // Switch to results tab
        showSection('results');
        document.querySelector('[onclick="showSection(\'results\')"]').classList.add('active');
        document.querySelector('[onclick="showSection(\'survey\')"]').classList.remove('active');
        
    } catch (error) {
        alert('Có lỗi xảy ra khi phân tích: ' + error.message);
    } finally {
        // Hide loading
        document.getElementById('loading').style.display = 'none';
        document.getElementById('surveyForm').style.display = 'block';
    }
});

function collectFormData() {
    return {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        interests: document.getElementById('interests').value,
        skills: document.getElementById('skills').value,
        scores: {
            math: document.getElementById('mathScore').value,
            english: document.getElementById('englishScore').value,
            literature: document.getElementById('literatureScore').value,
            physics: document.getElementById('physicsScore').value
        },
        favoriteSubjects: document.getElementById('favoriteSubjects').value,
        careerGoals: document.getElementById('careerGoals').value,
        studyHabits: document.getElementById('studyHabits').value,
        preferences: {
            technology: document.getElementById('technology').value,
            creativity: document.getElementById('creativity').value,
            communication: document.getElementById('communication').value,
            logic: document.getElementById('logic').value,
            business: document.getElementById('business').value,
            manual: document.getElementById('manual').value
        }
    };
}

async function analyzeWithAI(formData) {
    const provider = API_CONFIG.provider;
    const apiKey = API_CONFIG.openaiKey;
    
    // Demo mode - return predefined analysis
    if (provider === 'demo') {
        return getDemoAnalysisResult(formData);
    }
    
    const prompt = `
Bạn là chuyên gia tư vấn giáo dục. Dựa trên thông tin sau của học sinh, hãy phân tích và đưa ra 3 gợi ý ngành học phù hợp nhất tại FPT Polytechnic:

Thông tin học sinh:
- Tên: ${formData.name}
- Tuổi: ${formData.age}
- Sở thích: ${formData.interests}
- Kỹ năng nổi bật: ${formData.skills}
- Điểm số: Toán ${formData.scores.math}, Anh ${formData.scores.english}, Văn ${formData.scores.literature}, Lý ${formData.scores.physics}
- Môn yêu thích: ${formData.favoriteSubjects}
- Định hướng nghề nghiệp: ${formData.careerGoals}
- Thói quen học tập: ${formData.studyHabits}
- Mức độ yêu thích (1-10): Công nghệ ${formData.preferences.technology}, Sáng tạo ${formData.preferences.creativity}, Giao tiếp ${formData.preferences.communication}, Logic ${formData.preferences.logic}, Kinh doanh ${formData.preferences.business}, Thực hành ${formData.preferences.manual}

Các ngành học có tại FPT Polytechnic:
Công nghệ: Phát triển phần mềm, Thiết kế đồ họa, Ứng dụng phần mềm, Quản trị mạng máy tính, Thiết kế trang web
Kinh doanh: Quản trị kinh doanh, Kế toán, Marketing, Logistics, Quản lý khách sạn
Sáng tạo: Thiết kế đồ họa, Thiết kế nội thất, Thiết kế thời trang, Quay phim và biên tập
Kỹ thuật: Công nghệ ô tô, Điện tử viễn thông, Cơ khí máy tính, Điện công nghiệp

Hãy trả về JSON với format:
{
  "analysis": "Phân tích tổng quan về học sinh",
  "recommendations": [
    {
      "major": "Tên ngành học",
      "compatibility": "95%",
      "reasons": ["Lý do 1", "Lý do 2", "Lý do 3"],
      "career_prospects": "Triển vọng nghề nghiệp",
      "skills_needed": "Kỹ năng cần phát triển"
    }
  ]
}
`;

    if (provider === 'openai') {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'Bạn là chuyên gia tư vấn giáo dục chuyên nghiệp.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error?.message || response.statusText || 'Unknown error';
                throw new Error(`API OpenAI Error: ${errorMessage}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            
            try {
                return JSON.parse(content);
            } catch (parseError) {
                console.error('Failed to parse AI response:', content);
                throw new Error('AI response format không hợp lệ. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw new Error(`Lỗi kết nối OpenAI: ${error.message}`);
        }
    } else if (provider === 'gemini') {
        // Gemini API integration (placeholder)
        throw new Error('Gemini API chưa được tích hợp. Vui lòng sử dụng OpenAI hoặc chế độ demo.');
    } else {
        throw new Error('Provider không được hỗ trợ. Vui lòng chọn OpenAI hoặc demo.');
    }
}

function getDemoAnalysisResult(formData) {
    const prefs = formData.preferences;
    const scores = formData.scores;
    
    // Calculate academic level
    const academicScores = [
        parseFloat(scores.math) || 0,
        parseFloat(scores.english) || 0, 
        parseFloat(scores.literature) || 0,
        parseFloat(scores.physics) || 0
    ].filter(score => score > 0);
    
    const avgScore = academicScores.length > 0 ? 
        academicScores.reduce((a, b) => a + b) / academicScores.length : 5;
    
    // Calculate interest level
    const interestScores = [
        parseInt(prefs.technology),
        parseInt(prefs.creativity),
        parseInt(prefs.communication),
        parseInt(prefs.logic),
        parseInt(prefs.business),
        parseInt(prefs.manual)
    ];
    const avgInterest = interestScores.reduce((a, b) => a + b) / interestScores.length;
    
    // Determine academic category
    let academicLevel = "";
    if (avgScore >= 8) {
        academicLevel = "xuất sắc";
    } else if (avgScore >= 6.5) {
        academicLevel = "giỏi";
    } else if (avgScore >= 5) {
        academicLevel = "khá";
    } else {
        academicLevel = "trung bình";
    }
    
    // Calculate compatibility for each major
    const majors = [
        {
            name: "Phát triển phần mềm",
            category: "technology",
            requiredScores: { math: 6, english: 5, logic: 6 },
            requiredInterests: { technology: 6, logic: 6 },
            academicWeight: 0.4,
            interestWeight: 0.6,
            career_prospects: "Lập trình viên, Software Engineer, Full-stack Developer, Technical Lead",
            skills_needed: "Ngôn ngữ lập trình (Java, Python, JavaScript), Cơ sở dữ liệu, Framework"
        },
        {
            name: "Thiết kế đồ họa",
            category: "creative", 
            requiredScores: { english: 5, literature: 5 },
            requiredInterests: { creativity: 7, manual: 5 },
            academicWeight: 0.3,
            interestWeight: 0.7,
            career_prospects: "Graphic Designer, UI/UX Designer, Brand Designer, Art Director",
            skills_needed: "Adobe Creative Suite (Photoshop, Illustrator), Figma, Typography, Color Theory"
        },
        {
            name: "Quản trị kinh doanh",
            category: "business",
            requiredScores: { math: 5, english: 6, literature: 5 },
            requiredInterests: { business: 6, communication: 6 },
            academicWeight: 0.4,
            interestWeight: 0.6,
            career_prospects: "Quản lý dự án, Business Analyst, Operations Manager, Entrepreneur",
            skills_needed: "Quản lý dự án, Phân tích kinh doanh, Kỹ năng lãnh đạo, Excel nâng cao"
        },
        {
            name: "Kế toán",
            category: "business",
            requiredScores: { math: 7, english: 5 },
            requiredInterests: { logic: 6, business: 5 },
            academicWeight: 0.5,
            interestWeight: 0.5,
            career_prospects: "Kế toán viên, Kiểm toán viên, Chuyên viên tài chính, CFO",
            skills_needed: "Phần mềm kế toán (MISA, FAST), Excel nâng cao, Luật thuế, Chuẩn mực kế toán"
        },
        {
            name: "Marketing",
            category: "business",
            requiredScores: { english: 6, literature: 5 },
            requiredInterests: { creativity: 6, communication: 7, business: 6 },
            academicWeight: 0.3,
            interestWeight: 0.7,
            career_prospects: "Digital Marketing, Content Creator, Brand Manager, Social Media Manager",
            skills_needed: "Google Ads, Facebook Ads, SEO/SEM, Content Marketing, Analytics"
        },
        {
            name: "Quản trị mạng máy tính",
            category: "technology",
            requiredScores: { math: 6, physics: 6, english: 5 },
            requiredInterests: { technology: 7, logic: 6 },
            academicWeight: 0.4,
            interestWeight: 0.6,
            career_prospects: "Network Administrator, System Engineer, IT Support, Cloud Engineer",
            skills_needed: "Cisco CCNA, Windows Server, Linux, Cloud Computing (AWS, Azure)"
        },
        {
            name: "Thiết kế nội thất",
            category: "creative",
            requiredScores: { math: 5, physics: 4 },
            requiredInterests: { creativity: 8, manual: 6 },
            academicWeight: 0.3,
            interestWeight: 0.7,
            career_prospects: "Interior Designer, Space Planner, Furniture Designer, Architectural Visualizer",
            skills_needed: "AutoCAD, 3ds Max, SketchUp, V-Ray, Kiến thức về vật liệu và màu sắc"
        },
        {
            name: "Công nghệ ô tô",
            category: "engineering",
            requiredScores: { math: 6, physics: 7 },
            requiredInterests: { manual: 7, technology: 6 },
            academicWeight: 0.5,
            interestWeight: 0.5,
            career_prospects: "Kỹ thuật viên ô tô, Chẩn đoán xe, Service Advisor, Workshop Manager",
            skills_needed: "Chẩn đoán lỗi, Sửa chữa động cơ, Hệ thống điện ô tô, Công nghệ hybrid/electric"
        }
    ];
    
    // Calculate compatibility for each major
    const results = majors.map(major => {
        let academicScore = 0;
        let interestScore = 0;
        let meetRequirements = true;
        let reasons = [];
        
        // Calculate academic compatibility
        Object.keys(major.requiredScores).forEach(subject => {
            const studentScore = parseFloat(scores[subject]) || 0;
            const requiredScore = major.requiredScores[subject];
            
            if (studentScore >= requiredScore) {
                academicScore += (studentScore / 10) * 100;
                if (studentScore >= requiredScore + 1) {
                    reasons.push(`Điểm ${getSubjectName(subject)} xuất sắc (${studentScore}/10)`);
                }
            } else {
                meetRequirements = false;
                academicScore += (studentScore / requiredScore) * 50;
            }
        });
        academicScore = academicScore / Object.keys(major.requiredScores).length;
        
        // Calculate interest compatibility  
        Object.keys(major.requiredInterests).forEach(interest => {
            const studentInterest = parseInt(prefs[interest]);
            const requiredInterest = major.requiredInterests[interest];
            
            if (studentInterest >= requiredInterest) {
                interestScore += (studentInterest / 10) * 100;
                if (studentInterest >= requiredInterest + 2) {
                    reasons.push(`Rất yêu thích ${getInterestName(interest)} (${studentInterest}/10)`);
                }
            } else {
                interestScore += (studentInterest / requiredInterest) * 60;
            }
        });
        interestScore = interestScore / Object.keys(major.requiredInterests).length;
        
        // Calculate final compatibility
        const finalScore = (academicScore * major.academicWeight) + (interestScore * major.interestWeight);
        
        // Add bonus for excellent students
        let bonus = 0;
        if (avgScore >= 8) {
            bonus += 5;
            if (!reasons.some(r => r.includes("xuất sắc"))) {
                reasons.push("Học sinh xuất sắc, có nền tảng học tập vững chắc");
            }
        }
        
        // Add bonus for high interest
        if (avgInterest >= 6) {
            bonus += 3;
            reasons.push("Có đam mê và động lực học tập cao");
        }
        
        return {
            major: major.name,
            compatibility: Math.min(100, Math.round(finalScore + bonus)) + "%",
            reasons: reasons.slice(0, 4),
            career_prospects: major.career_prospects,
            skills_needed: major.skills_needed,
            score: finalScore + bonus
        };
    });
    
    // Sort by compatibility score and take top 3
    results.sort((a, b) => b.score - a.score);
    const topRecommendations = results.slice(0, 3);
    
    // Generate analysis
    let analysis = `Phân tích cho ${formData.name}: `;
    analysis += `Với điểm trung bình ${avgScore.toFixed(1)}/10 (mức ${academicLevel}) và mức độ yêu thích trung bình ${avgInterest.toFixed(1)}/10, `;
    
    if (avgScore >= 8 && avgInterest >= 6) {
        analysis += "bạn là học sinh xuất sắc với đam mê cao. Bạn có thể thành công trong nhiều ngành khác nhau, đặc biệt là các ngành đòi hỏi cả kiến thức học thuật và sự sáng tạo.";
    } else if (avgScore >= 8) {
        analysis += "bạn có nền tảng học tập rất tốt. Hãy tìm hiểu thêm về các ngành để phát triển đam mê.";
    } else if (avgInterest >= 6) {
        analysis += "bạn có đam mê và động lực cao. Với sự nỗ lực, bạn sẽ thành công trong lĩnh vực mình yêu thích.";
    } else {
        analysis += "bạn cần tìm hiểu thêm về bản thân và các ngành học để đưa ra quyết định phù hợp.";
    }
    
    return {
        analysis: analysis,
        recommendations: topRecommendations
    };
}

function getSubjectName(subject) {
    const names = {
        math: "Toán",
        english: "Tiếng Anh", 
        literature: "Ngữ Văn",
        physics: "Vật Lý"
    };
    return names[subject] || subject;
}

function getInterestName(interest) {
    const names = {
        technology: "công nghệ",
        creativity: "sáng tạo",
        communication: "giao tiếp", 
        logic: "tư duy logic",
        business: "kinh doanh",
        manual: "thực hành"
    };
    return names[interest] || interest;
}

function displayResults(result, formData) {
    const resultsContent = document.getElementById('resultsContent');
    
    let html = `
        <div class="results-card">
            <h3>🎯 Kết quả phân tích cho ${formData.name}</h3>
            <p>${result.analysis}</p>
        </div>
    `;

    result.recommendations.forEach((rec, index) => {
        html += `
            <div class="major-recommendation">
                <h4>${index + 1}. ${rec.major} - Độ phù hợp: ${rec.compatibility}</h4>
                <div style="margin-bottom: 15px;">
                    <strong>🎯 Lý do phù hợp:</strong>
                    <ul style="margin-left: 20px; margin-top: 5px;">
                        ${rec.reasons.map(reason => `<li>${reason}</li>`).join('')}
                    </ul>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>💼 Triển vọng nghề nghiệp:</strong>
                    <p style="margin-top: 5px;">${rec.career_prospects}</p>
                </div>
                <div>
                    <strong>📚 Kỹ năng cần phát triển:</strong>
                    <p style="margin-top: 5px;">${rec.skills_needed}</p>
                </div>
            </div>
        `;
    });

    // Add action buttons
    html += `
        <div class="results-actions">
            <h4>🎉 Hoàn thành phân tích!</h4>
            <p>Bạn có muốn thực hiện thêm một lần khảo sát khác không?</p>
            <div class="results-actions-buttons">
                <button onclick="goBackToSurvey()" class="btn btn-primary">
                    📝 Làm khảo sát mới
                </button>
                <button onclick="viewHistory()" class="btn btn-secondary">
                    📚 Xem lịch sử
                </button>
            </div>
        </div>
    `;

    resultsContent.innerHTML = html;
}

function saveToHistory(result, formData) {
    const history = JSON.parse(localStorage.getItem('counselingHistory') || '[]');
    
    const record = {
        id: Date.now(),
        date: new Date().toLocaleDateString('vi-VN'),
        time: new Date().toLocaleTimeString('vi-VN'),
        studentName: formData.name,
        result: result,
        formData: formData
    };

    history.unshift(record);
    
    // Keep only last 10 records
    if (history.length > 10) {
        history.splice(10);
    }

    localStorage.setItem('counselingHistory', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('counselingHistory') || '[]');
    const historyContent = document.getElementById('historyContent');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

    if (history.length === 0) {
        historyContent.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 4rem; margin-bottom: 20px;">📚</div>
                <h3>Chưa có lịch sử tư vấn</h3>
                <p>Các kết quả tư vấn của bạn sẽ được lưu lại ở đây</p>
            </div>
        `;
        selectAllBtn.style.display = 'none';
        deleteSelectedBtn.style.display = 'none';
        return;
    }

    // Show selection buttons when there's history
    selectAllBtn.style.display = 'inline-block';
    deleteSelectedBtn.style.display = 'inline-block';

    let html = '';
    history.forEach(record => {
        html += `
            <div class="history-item" data-id="${record.id}">
                <input type="checkbox" class="history-checkbox" onchange="updateDeleteButton()" data-id="${record.id}">
                <div class="history-item-content">
                    <div class="date">📅 ${record.date} - ⏰ ${record.time}</div>
                    <h4>👤 ${record.studentName}</h4>
                    <div style="margin-top: 15px;">
                        <strong>🎯 Ngành học được đề xuất:</strong>
                        <ul style="margin-left: 20px; margin-top: 5px;">
                            ${record.result.recommendations.map(rec => 
                                `<li>${rec.major} (${rec.compatibility})</li>`
                            ).join('')}
                        </ul>
                    </div>
                    <button onclick="viewDetailHistory(${record.id})" class="btn btn-primary" style="margin-top: 15px; padding: 8px 16px; font-size: 0.9rem;">
                        👁️ Xem chi tiết
                    </button>
                </div>
            </div>
        `;
    });

    historyContent.innerHTML = html;
    
    // Add click handlers for checkboxes
    document.querySelectorAll('.history-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const historyItem = this.closest('.history-item');
            if (this.checked) {
                historyItem.classList.add('selected');
            } else {
                historyItem.classList.remove('selected');
            }
        });
    });
}

function viewDetailHistory(recordId) {
    const history = JSON.parse(localStorage.getItem('counselingHistory') || '[]');
    const record = history.find(r => r.id === recordId);
    
    if (record) {
        displayResults(record.result, record.formData);
        showSection('results');
        document.querySelector('[onclick="showSection(\'results\')"]').classList.add('active');
        document.querySelector('[onclick="showSection(\'history\')"]').classList.remove('active');
    }
}

function clearHistory() {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử tư vấn?')) {
        localStorage.removeItem('counselingHistory');
        loadHistory();
    }
}

function toggleSelectAll() {
    const checkboxes = document.querySelectorAll('.history-checkbox');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = !allChecked;
        const historyItem = checkbox.closest('.history-item');
        if (checkbox.checked) {
            historyItem.classList.add('selected');
        } else {
            historyItem.classList.remove('selected');
        }
    });
    
    // Update button text
    selectAllBtn.innerHTML = allChecked ? '☑️ Chọn tất cả' : '☐ Bỏ chọn tất cả';
    updateDeleteButton();
}

function updateDeleteButton() {
    const checkedBoxes = document.querySelectorAll('.history-checkbox:checked');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const totalBoxes = document.querySelectorAll('.history-checkbox');
    
    if (checkedBoxes.length > 0) {
        deleteSelectedBtn.innerHTML = `🗑️ Xóa đã chọn (${checkedBoxes.length})`;
        deleteSelectedBtn.style.backgroundColor = '#dc3545';
    } else {
        deleteSelectedBtn.innerHTML = '🗑️ Xóa đã chọn';
        deleteSelectedBtn.style.backgroundColor = '#6c757d';
    }
    
    // Update select all button
    if (checkedBoxes.length === totalBoxes.length && totalBoxes.length > 0) {
        selectAllBtn.innerHTML = '☐ Bỏ chọn tất cả';
    } else {
        selectAllBtn.innerHTML = '☑️ Chọn tất cả';
    }
}

function deleteSelectedHistory() {
    const checkedBoxes = document.querySelectorAll('.history-checkbox:checked');
    
    if (checkedBoxes.length === 0) {
        alert('Vui lòng chọn ít nhất một lịch sử để xóa!');
        return;
    }
    
    const selectedIds = Array.from(checkedBoxes).map(cb => parseInt(cb.dataset.id));
    const confirmMessage = `Bạn có chắc chắn muốn xóa ${selectedIds.length} lịch sử đã chọn?`;
    
    if (confirm(confirmMessage)) {
        const history = JSON.parse(localStorage.getItem('counselingHistory') || '[]');
        const filteredHistory = history.filter(record => !selectedIds.includes(record.id));
        
        localStorage.setItem('counselingHistory', JSON.stringify(filteredHistory));
        loadHistory();
        
        // Show success message
        const message = `Đã xóa thành công ${selectedIds.length} lịch sử tư vấn!`;
        alert(message);
    }
}

function simulateProgress() {
    const progressFill = document.getElementById('progressFill');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 200);
}

function goBackToSurvey() {
    // Reset form
    document.getElementById('surveyForm').reset();
    
    // Reset sliders to default value (5)
    const sliders = ['technology', 'creativity', 'communication', 'logic', 'business', 'manual'];
    sliders.forEach(slider => {
        document.getElementById(slider).value = 5;
        document.getElementById(slider + 'Value').textContent = 5;
    });
    
    // Switch to survey tab
    showSection('survey');
    document.querySelector('[onclick="showSection(\'survey\')"]').classList.add('active');
    document.querySelector('[onclick="showSection(\'results\')"]').classList.remove('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Focus on first input
    document.getElementById('name').focus();
}

function viewHistory() {
    // Switch to history tab
    showSection('history');
    document.querySelector('[onclick="showSection(\'history\')"]').classList.add('active');
    document.querySelector('[onclick="showSection(\'results\')"]').classList.remove('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Initialize copilot history for context
let copilotHistory = [];

// Enhanced context management for AI chat
function addToCopilotContext(userMessage, botResponse) {
    copilotHistory.push(
        { role: 'user', content: userMessage },
        { role: 'assistant', content: botResponse }
    );
    
    // Keep only last 20 messages to prevent context from getting too long
    if (copilotHistory.length > 20) {
        copilotHistory = copilotHistory.slice(-20);
    }
    
    // Save to localStorage for persistence
    try {
        localStorage.setItem('copilotHistory', JSON.stringify(copilotHistory));
    } catch (error) {
        console.warn('Could not save copilot history:', error);
    }
}

// Load copilot history from localStorage
function loadCopilotHistory() {
    try {
        const saved = localStorage.getItem('copilotHistory');
        if (saved) {
            copilotHistory = JSON.parse(saved);
        }
    } catch (error) {
        console.warn('Could not load copilot history:', error);
        copilotHistory = [];
    }
}

// Clear copilot history
function clearCopilotHistory() {
    copilotHistory = [];
    try {
        localStorage.removeItem('copilotHistory');
    } catch (error) {
        console.warn('Could not clear copilot history:', error);
    }
    
    // Clear messages from UI
    const messagesContainer = document.getElementById('copilotMessages');
    messagesContainer.innerHTML = `
        <div class="message bot">
            Xin chào! Tôi là AI Copilot của FPT Polytechnic. Tôi có thể giúp bạn:
            <br>• Tư vấn về các ngành học
            <br>• Giải thích kết quả phân tích
            <br>• Hướng dẫn sử dụng ứng dụng
            <br><br>Bạn cần hỗ trợ gì không? 😊
        </div>
    `;
}

// Copilot Functions
let isCopilotOpen = false;

function toggleCopilot() {
    const copilotChat = document.getElementById('copilotChat');
    isCopilotOpen = !isCopilotOpen;
    
    if (isCopilotOpen) {
        copilotChat.style.display = 'flex';
        copilotChat.style.animation = 'fadeIn 0.3s ease';
    } else {
        copilotChat.style.display = 'none';
    }
}

function sendQuickReply(message) {
    document.getElementById('copilotInput').value = message;
    sendCopilotMessage();
}

function handleCopilotKeyPress(event) {
    if (event.key === 'Enter') {
        sendCopilotMessage();
    }
}

async function sendCopilotMessage() {
    const input = document.getElementById('copilotInput');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message
    addCopilotMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    const typingDiv = addCopilotMessage('', 'typing');
    typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    
    // Disable input and send button while processing
    const sendButton = document.getElementById('copilotSend');
    const originalText = sendButton.innerHTML;
    sendButton.disabled = true;
    sendButton.innerHTML = '⏳';
    
    try {
        // Get AI response
        const response = await getCopilotResponse(message);
        
        // Remove typing indicator
        typingDiv.remove();
        
        // Add bot response
        addCopilotMessage(response, 'bot');
        
        // Auto-scroll to bottom
        const messagesContainer = document.getElementById('copilotMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Update copilot history
        addToCopilotContext(message, response);
    } catch (error) {
        console.error('Error getting AI response:', error);
        
        // Remove typing indicator
        typingDiv.remove();
        
        // Add error message
        addCopilotMessage('Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau hoặc sử dụng các câu hỏi nhanh bên dưới. 😔', 'bot');
    } finally {
        // Re-enable input and send button
        sendButton.disabled = false;
        sendButton.innerHTML = originalText;
    }
}

function addCopilotMessage(message, sender) {
    const messagesContainer = document.getElementById('copilotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = message;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageDiv;
}

async function getCopilotResponse(userMessage) {
    if (API_CONFIG.provider === 'demo') {
        // Demo mode - use enhanced fallback responses with GitHub Copilot simulation
        return getEnhancedFallbackResponse(userMessage, getCurrentFormData(), getLastAnalysisResult());
    }
    
    if (API_CONFIG.provider === 'github') {
        try {
            return await githubCopilot.sendMessage(userMessage);
        } catch (error) {
            console.error('GitHub Copilot Error:', error);
            return `❌ **Lỗi GitHub Copilot:** ${error.message}\n\nVui lòng kiểm tra cấu hình GitHub token và repository.`;
        }
    }
    
    if (!API_CONFIG.openaiKey || API_CONFIG.openaiKey === 'YOUR_API_KEY_HERE' || API_CONFIG.openaiKey === 'demo-mode') {
        return 'Để sử dụng tính năng chat AI thực, vui lòng cấu hình API Key OpenAI hoặc GitHub Copilot trong code. Hiện tại đang chạy ở chế độ demo với các câu trả lời được thiết kế sẵn. 🔑';
    }

    // Check for predefined responses first
    const predefinedResponse = getPredefinedResponse(userMessage);
    if (predefinedResponse) {
        return predefinedResponse;
    }

    const provider = API_CONFIG.provider;
    const apiKey = API_CONFIG.openaiKey;
    
    // Build context from user's current session
    const currentFormData = getCurrentFormData();
    const lastResult = getLastAnalysisResult();
    
    // Enhanced system prompt with more comprehensive capabilities
    const systemPrompt = `
Bạn là AI Copilot của FPT Polytechnic, chuyên gia tư vấn giáo dục toàn diện và hữu ích. 

**Thông tin về FPT Polytechnic:**
- **Các ngành Công nghệ**: Phát triển phần mềm, Thiết kế đồ họa, Ứng dụng phần mềm, Quản trị mạng máy tính, Thiết kế trang web
- **Các ngành Kinh doanh**: Quản trị kinh doanh, Kế toán, Marketing, Logistics, Quản lý khách sạn  
- **Các ngành Sáng tạo**: Thiết kế nội thất, Thiết kế thời trang, Quay phim và biên tập
- **Các ngành Kỹ thuật**: Công nghệ ô tô, Điện tử viễn thông, Cơ khí máy tính, Điện công nghiệp

**Khả năng chuyên môn:**
- Tư vấn ngành học dựa trên sở thích, năng lực và mục tiêu
- Giải thích chi tiết về từng ngành học, môn học, kỹ năng cần thiết
- Hướng dẫn chuẩn bị học tập và kỹ năng cần thiết
- Tư vấn về triển vọng nghề nghiệp và cơ hội việc làm
- Hướng dẫn phương pháp học tập hiệu quả cho từng lĩnh vực

**Khả năng tư vấn chung:**
- Trả lời các câu hỏi về giáo dục, học tập, phát triển bản thân
- Tư vấn về kỹ năng mềm: giao tiếp, làm việc nhóm, quản lý thời gian
- Hỗ trợ tâm lý: giảm stress, tăng tự tin, vượt qua khó khăn
- Định hướng nghề nghiệp và phát triển sự nghiệp
- Tư vấn về cuộc sống sinh viên, cân bằng học tập và giải trí
- Hướng dẫn về các chứng chỉ, kỹ năng bổ sung có ích

**Hướng dẫn trả lời:**
- Luôn thân thiện, khuyến khích và tích cực
- Sử dụng emoji phù hợp để tạo cảm giác gần gũi
- Trả lời chi tiết nhưng không quá dài (tối đa 300-400 từ)
- Nếu câu hỏi không liên quan đến giáo dục/ngành học, hãy nhẹ nhàng chuyển hướng về chủ đề giáo dục
- Sử dụng thông tin từ người dùng nếu có để đưa ra tư vấn cá nhân hóa
- Đưa ra ví dụ cụ thể và lời khuyên thực tế
- Khuyến khích người dùng đặt câu hỏi tiếp theo để tương tác sâu hơn

${currentFormData ? `\n**Thông tin người dùng hiện tại:** ${JSON.stringify(currentFormData)}` : ''}
${lastResult ? `\n**Kết quả phân tích gần nhất:** ${JSON.stringify(lastResult)}` : ''}
`;

    if (provider === 'openai') {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...copilotHistory.slice(-10), // Keep last 10 messages for context
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.8,
                    max_tokens: 400
                })
            });

            if (!response.ok) {
                throw new Error('Lỗi API OpenAI');
            }

            const data = await response.json();
            const botResponse = data.choices[0].message.content;
            
            // Update history
            copilotHistory.push(
                { role: 'user', content: userMessage },
                { role: 'assistant', content: botResponse }
            );
            
            return botResponse;
        } catch (error) {
            console.error('OpenAI API Error:', error);
            return getEnhancedFallbackResponse(userMessage, currentFormData, lastResult);
        }
    } else if (provider === 'gemini') {
        // Gemini API integration (placeholder)
        return getEnhancedFallbackResponse(userMessage, currentFormData, lastResult);
    } else {
        // Enhanced fallback response for demo mode
        return getEnhancedFallbackResponse(userMessage, currentFormData, lastResult);
    }
}

function getPredefinedResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Ngành học
    if (lowerMessage.includes('ngành') && (lowerMessage.includes('phù hợp') || lowerMessage.includes('suitable'))) {
        return `
🎯 Để tìm ngành học phù hợp, tôi cần hiểu về bạn hơn! Hãy hoàn thành bài khảo sát để tôi có thể đưa ra tư vấn chính xác nhất.

Một số ngành phổ biến tại FPT Polytechnic:
• 💻 **Công nghệ**: Phát triển phần mềm, Thiết kế đồ họa
• 💼 **Kinh doanh**: Quản trị kinh doanh, Marketing  
• 🎨 **Sáng tạo**: Thiết kế nội thất, Thời trang
• 🔧 **Kỹ thuật**: Công nghệ ô tô, Điện tử viễn thông
        `;
    }
    
    // Kết quả phân tích
    if (lowerMessage.includes('giải thích') && lowerMessage.includes('kết quả')) {
        const lastResult = getLastAnalysisResult();
        if (lastResult) {
            return `
📊 **Giải thích kết quả phân tích của bạn:**

${lastResult.analysis}

**Top 3 ngành được đề xuất:**
${lastResult.recommendations.map((rec, index) => 
    `${index + 1}. **${rec.major}** (${rec.compatibility})\n   💡 Lý do: ${rec.reasons.join(', ')}`
).join('\n\n')}

Bạn có câu hỏi gì về các ngành này không? 😊
            `;
        } else {
            return 'Bạn chưa có kết quả phân tích nào. Hãy hoàn thành bài khảo sát trước nhé! 📝';
        }
    }
    
    // Chuẩn bị
    if (lowerMessage.includes('chuẩn bị') || lowerMessage.includes('học gì')) {
        return `
📚 **Để chuẩn bị cho việc học tại FPT Polytechnic:**

**Kỹ năng chung:**
• 🇬🇧 Tiếng Anh cơ bản (nhiều tài liệu tiếng Anh)
• 💻 Tin học văn phòng cơ bản
• 🧠 Tư duy logic và giải quyết vấn đề

**Theo từng lĩnh vực:**
• **Công nghệ**: Toán học, logic, khám phá lập trình cơ bản
• **Kinh doanh**: Toán, khả năng giao tiếp, hiểu biết xã hội
• **Sáng tạo**: Mỹ thuật, thẩm mỹ, phần mềm thiết kế
• **Kỹ thuật**: Toán, Vật lý, tư duy không gian

Bạn quan tâm lĩnh vực nào nhất? 🤔
        `;
    }
    
    // Triển vọng nghề nghiệp
    if (lowerMessage.includes('triển vọng') || lowerMessage.includes('nghề nghiệp')) {
        return `
🚀 **Triển vọng nghề nghiệp tại FPT Polytechnic rất tốt!**

**Tỷ lệ có việc làm:** > 95% sau tốt nghiệp

**Mức lương khởi điểm:**
• 💻 IT: 8-15 triệu/tháng
• 💼 Kinh doanh: 7-12 triệu/tháng  
• 🎨 Thiết kế: 6-10 triệu/tháng
• 🔧 Kỹ thuật: 7-13 triệu/tháng

**Cơ hội phát triển:**
• Thực tập tại các doanh nghiệp lớn
• Kết nối mạng lưới FPT Corporation
• Chương trình đào tạo quốc tế
• Khởi nghiệp với sự hỗ trợ từ trường

Bạn muốn biết thêm về ngành nào cụ thể? 🎯
        `;
    }
    
    // Hướng dẫn sử dụng
    if (lowerMessage.includes('hướng dẫn') || lowerMessage.includes('sử dụng')) {
        return `
📖 **Hướng dẫn sử dụng ứng dụng:**

**Bước 1:** Điền đầy đủ thông tin trong form khảo sát 📝
**Bước 2:** Nhấn "Phân tích và Tư vấn" 🚀
**Bước 3:** Xem kết quả tư vấn chi tiết 🎯
**Bước 4:** Kiểm tra lịch sử các lần tư vấn 📚

**Mẹo:** 
• Trả lời thành thật để có kết quả chính xác nhất
• Điểm số các môn giúp đánh giá năng lực học tập
• Sở thích cá nhân rất quan trọng cho sự phù hợp

Bạn cần hỗ trợ thêm gì không? 😊
        `;
    }
    
    // Thông tin về FPT Polytechnic
    if (lowerMessage.includes('thông tin') && (lowerMessage.includes('trường') || lowerMessage.includes('fpt'))) {
        return `
🏫 **Thông tin về FPT Polytechnic:**

**Giới thiệu chung:**
• 🎓 Trường cao đẳng thuộc Tập đoàn FPT
• 🌍 Đào tạo theo tiêu chuẩn quốc tế
• 💼 Tỷ lệ có việc làm > 95% sau tốt nghiệp
• 🌟 Top 10 trường cao đẳng uy tín tại Việt Nam

**Chương trình đào tạo:**
• 📚 Hệ cao đẳng chính quy (2-3 năm)
• 🌐 Chương trình liên kết quốc tế
• 💻 Đào tạo theo chuẩn công nghệ mới nhất
• 🎯 Thực hành chiếm 70% thời gian học

**Cơ sở vật chất:**
• 🏢 Cơ sở hiện đại tại Hà Nội, TP.HCM, Đà Nẵng
• 💻 Phòng lab công nghệ cao
• 📚 Thư viện số với tài liệu phong phú
• 🏃‍♀️ Khu thể thao và giải trí đầy đủ

**Liên kết doanh nghiệp:**
• 🤝 Hợp tác với 500+ doanh nghiệp
• 💼 Chương trình thực tập và việc làm
• 🌟 Mạng lưới cựu sinh viên rộng khắp
• 🚀 Hỗ trợ khởi nghiệp và phát triển sự nghiệp

Bạn muốn biết thêm thông tin gì về trường? 😊
        `;
    }
    
    // Học bổng và hỗ trợ tài chính
    if (lowerMessage.includes('học bổng') || lowerMessage.includes('tài chính') || lowerMessage.includes('hỗ trợ')) {
        return `
💰 **Học bổng và hỗ trợ tài chính tại FPT Polytechnic:**

**Loại học bổng:**
• 🏆 **Học bổng tài năng**: Dành cho sinh viên có thành tích xuất sắc
• 🌟 **Học bổng khuyến khích**: Hỗ trợ sinh viên có hoàn cảnh khó khăn
• 🎯 **Học bổng ngành**: Ưu đãi cho các ngành đang thiếu nhân lực
• 🌍 **Học bổng quốc tế**: Cơ hội du học và trao đổi sinh viên

**Điều kiện nhận học bổng:**
• 📊 Điểm GPA từ 3.0 trở lên
• 🎯 Tham gia hoạt động ngoại khóa tích cực
• 💪 Có hoàn cảnh khó khăn (với học bổng khuyến khích)
• 🌟 Thành tích nổi bật trong học tập hoặc nghiên cứu

**Hỗ trợ tài chính khác:**
• 💳 Vay vốn học tập với lãi suất ưu đãi
• 💰 Hỗ trợ chi phí sinh hoạt cho sinh viên xuất sắc
• 🏠 Hỗ trợ chi phí ký túc xá
• 📚 Hỗ trợ mua sách vở và dụng cụ học tập

**Cách đăng ký:**
• 📝 Nộp hồ sơ trực tuyến qua website trường
• 📋 Chuẩn bị giấy tờ chứng minh hoàn cảnh
• 📅 Thời hạn: Tháng 6-8 hàng năm
• 👥 Phỏng vấn với hội đồng xét duyệt

Bạn có muốn tìm hiểu thêm về học bổng nào cụ thể không? 😊
        `;
    }
    
    // Chào hỏi
    if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return `
👋 Xin chào! Tôi là AI Copilot của FPT Polytechnic!

Tôi có thể giúp bạn:
• 🎯 Tư vấn ngành học phù hợp
• 📊 Giải thích kết quả phân tích  
• 📚 Hướng dẫn chuẩn bị học tập
• 🚀 Thông tin triển vọng nghề nghiệp

Bạn muốn bắt đầu từ đâu? 😊
        `;
    }
    
    // Handle emotional and psychological questions
    if (lowerMessage.includes('lo lắng') || lowerMessage.includes('sợ') || lowerMessage.includes('không tự tin') || lowerMessage.includes('stress')) {
        return `
😌 **Đừng lo lắng, mọi người đều trải qua những cảm xúc này:**

**Cách vượt qua:**
• 🌟 **Chia sẻ**: Nói chuyện với bạn bè, gia đình, giảng viên
• 🧘‍♀️ **Thư giãn**: Hít thở sâu, thiền, yoga
• 🎯 **Chia nhỏ mục tiêu**: Đặt mục tiêu nhỏ, dễ đạt được
• 💪 **Tự khuyến khích**: Ghi nhận mọi tiến bộ dù nhỏ

**Lời khuyên:**
• 🌈 Mọi khó khăn đều tạm thời
• 🚀 Bạn mạnh mẽ hơn bạn nghĩ
• 💡 Mỗi thất bại là bài học quý giá
• 🎓 Học tập là hành trình, không phải cuộc đua

**Hỗ trợ:**
• 👥 Tham gia nhóm học tập
• 🏫 Tìm kiếm sự giúp đỡ từ trường
• 💬 Chia sẻ với AI Copilot (tôi luôn ở đây!)

Bạn có muốn chia sẻ cụ thể điều gì đang làm bạn lo lắng không? Tôi sẽ lắng nghe và tư vấn! 😊
        `;
    }
    
    // Handle questions about making decisions
    if (lowerMessage.includes('quyết định') || lowerMessage.includes('lựa chọn') || lowerMessage.includes('không biết') || lowerMessage.includes('băn khoăn')) {
        return `
🤔 **Đưa ra quyết định đúng đắn:**

**Quy trình ra quyết định:**
• 📝 **Liệt kê**: Viết ra tất cả lựa chọn có thể
• ✅ **Đánh giá**: Xem xét ưu/nhược điểm của từng lựa chọn
• 🎯 **Mục tiêu**: Xác định mục tiêu dài hạn của bạn
• 💭 **Tưởng tượng**: Hình dung tương lai với mỗi lựa chọn
• 👥 **Tham khảo**: Hỏi ý kiến người có kinh nghiệm

**Lời khuyên:**
• 🌟 Không có quyết định hoàn hảo 100%
• 🚀 Quan trọng là hành động, không phải hoàn hảo
• 💡 Mỗi quyết định đều dạy bạn điều gì đó
• 🎓 Đôi khi sai lầm lại dẫn đến cơ hội tốt hơn

**Với ngành học:**
• 🎯 Chọn ngành phù hợp với sở thích và năng lực
• 💼 Xem xét triển vọng nghề nghiệp
• 🌟 Đừng quá lo về việc "chọn sai ngành"
• 🔄 Bạn có thể thay đổi hướng đi trong tương lai

Bạn đang băn khoăn về quyết định gì? Tôi sẽ giúp bạn phân tích! 😊
        `;
    }
    
    // Handle questions about study methods and learning
    if (lowerMessage.includes('học') && (lowerMessage.includes('hiệu quả') || lowerMessage.includes('phương pháp') || lowerMessage.includes('cách'))) {
        return `
📚 **Phương pháp học tập hiệu quả:**

**Nguyên tắc cơ bản:**
• 🎯 **Pomodoro**: Học 25 phút, nghỉ 5 phút
• 📝 **Ghi chép**: Tóm tắt bằng từ khóa và sơ đồ tư duy
• 🔄 **Ôn tập**: Ôn lại sau 1 ngày, 1 tuần, 1 tháng
• 💡 **Áp dụng**: Thực hành ngay sau khi học lý thuyết

**Theo từng lĩnh vực:**
• **Công nghệ**: Làm project thực tế, tham gia hackathon
• **Kinh doanh**: Đọc tin tức, phân tích case study
• **Sáng tạo**: Thực hành thiết kế, tham khảo portfolio
• **Kỹ thuật**: Làm thí nghiệm, vẽ sơ đồ, tính toán

**Kỹ năng bổ sung:**
• 🇬🇧 Tiếng Anh chuyên ngành
• 💻 Công cụ và phần mềm liên quan
• 📊 Kỹ năng thuyết trình và báo cáo

Bạn muốn tìm hiểu sâu hơn về phương pháp nào? 🤔
        `;
    }
    
    // Handle questions about soft skills
    if (lowerMessage.includes('kỹ năng') && (lowerMessage.includes('mềm') || lowerMessage.includes('giao tiếp') || lowerMessage.includes('làm việc nhóm'))) {
        return `
🌟 **Kỹ năng mềm quan trọng cho sinh viên:**

**Giao tiếp hiệu quả:**
• 🗣️ **Lắng nghe tích cực**: Tập trung, đặt câu hỏi
• 💬 **Thuyết trình**: Sử dụng ngôn ngữ cơ thể, giọng nói
• ✍️ **Viết**: Email, báo cáo rõ ràng, chuyên nghiệp

**Làm việc nhóm:**
• 👥 **Hợp tác**: Chia sẻ ý tưởng, hỗ trợ lẫn nhau
• 🎯 **Lãnh đạo**: Điều phối, phân công nhiệm vụ
• 🤝 **Giải quyết xung đột**: Thảo luận, tìm giải pháp chung

**Quản lý thời gian:**
• ⏰ **Lập kế hoạch**: Sử dụng calendar, to-do list
• 🎯 **Ưu tiên**: Phân loại công việc theo mức độ quan trọng
• 🚫 **Tránh trì hoãn**: Chia nhỏ nhiệm vụ, đặt deadline

**Phát triển bản thân:**
• 📚 **Học liên tục**: Khóa học online, sách, workshop
• 🌱 **Thích nghi**: Sẵn sàng thay đổi, học hỏi cái mới
• 💪 **Kiên trì**: Vượt qua khó khăn, không bỏ cuộc

Bạn muốn cải thiện kỹ năng nào trước? 😊
        `;
    }
    
    // Handle questions about student life
    if (lowerMessage.includes('sinh viên') || lowerMessage.includes('cuộc sống') || lowerMessage.includes('cân bằng')) {
        return `
🎓 **Cuộc sống sinh viên cân bằng và hiệu quả:**

**Cân bằng học tập và giải trí:**
• 📚 **Học tập**: 60% thời gian cho việc học chính
• 🎨 **Giải trí**: 20% thời gian cho sở thích cá nhân
• 💪 **Sức khỏe**: 20% thời gian cho thể thao, nghỉ ngơi

**Hoạt động ngoại khóa:**
• 🏃‍♀️ **Thể thao**: Tham gia câu lạc bộ, giải đấu
• 🎭 **Văn nghệ**: Hát, múa, kịch, nhiếp ảnh
• 🌍 **Tình nguyện**: Giúp đỡ cộng đồng, bảo vệ môi trường
• 💼 **Thực tập**: Tích lũy kinh nghiệm thực tế

**Quản lý tài chính:**
• 💰 **Thu nhập**: Làm thêm, học bổng, hỗ trợ gia đình
• 📊 **Chi tiêu**: Lập kế hoạch, tiết kiệm, đầu tư
• 🎯 **Mục tiêu**: Tiết kiệm cho tương lai, học tập bổ sung

**Mối quan hệ:**
• 👥 **Bạn bè**: Xây dựng mạng lưới quan hệ tích cực
• 👨‍👩‍👧‍👦 **Gia đình**: Duy trì liên lạc, chia sẻ tiến bộ
• 👨‍🏫 **Giảng viên**: Tìm kiếm sự hướng dẫn, tư vấn

Bạn đang gặp khó khăn gì trong cuộc sống sinh viên? Tôi sẽ tư vấn cụ thể! 😊
        `;
    }
    
    // Handle questions about certificates and additional skills
    if (lowerMessage.includes('chứng chỉ') || lowerMessage.includes('bổ sung') || lowerMessage.includes('nâng cao')) {
        return `
🏆 **Chứng chỉ và kỹ năng bổ sung có ích:**

**Chứng chỉ công nghệ:**
• 💻 **Microsoft**: Office Specialist, Azure Fundamentals
• 🌐 **Google**: IT Support, Digital Marketing
• 🍎 **Apple**: Apple Certified Support Professional
• 🔒 **Cisco**: CCNA, CCNP cho mạng máy tính

**Chứng chỉ ngoại ngữ:**
• 🇬🇧 **IELTS/TOEIC**: Tiếng Anh học thuật và giao tiếp
• 🇯🇵 **JLPT**: Tiếng Nhật (nhiều cơ hội việc làm)
• 🇰🇷 **TOPIK**: Tiếng Hàn (ngành công nghệ, giải trí)
• 🇨🇳 **HSK**: Tiếng Trung (thị trường lớn)

**Kỹ năng bổ sung:**
• 📊 **Phân tích dữ liệu**: Excel nâng cao, SQL, Python
• 🎨 **Thiết kế**: Photoshop, Illustrator, Figma
• 📱 **Marketing**: Facebook Ads, Google Ads, SEO
• 💼 **Quản lý**: Project Management, Agile, Scrum

**Lợi ích:**
• 🎯 Tăng cơ hội việc làm và mức lương
• 🌟 Nổi bật trong hồ sơ xin việc
• 💡 Mở rộng kiến thức và kỹ năng
• 🚀 Chuẩn bị cho tương lai nghề nghiệp

Bạn quan tâm chứng chỉ nào? Tôi sẽ hướng dẫn chi tiết! 😊
        `;
    }
    
    // Handle questions about future career development
    if (lowerMessage.includes('tương lai') || lowerMessage.includes('nghề nghiệp') || lowerMessage.includes('phát triển')) {
        return `
🚀 **Định hướng tương lai và phát triển nghề nghiệp:**

**Lộ trình phát triển:**
• 🎓 **Giai đoạn 1 (0-2 năm)**: Học tập, thực tập, tích lũy kinh nghiệm
• 💼 **Giai đoạn 2 (2-5 năm)**: Làm việc chuyên môn, phát triển kỹ năng
• 🌟 **Giai đoạn 3 (5-10 năm)**: Chuyên gia, quản lý, khởi nghiệp
• 🏆 **Giai đoạn 4 (10+ năm)**: Lãnh đạo, tư vấn, đào tạo

**Xu hướng nghề nghiệp tương lai:**
• 🤖 **AI & Machine Learning**: Phát triển ứng dụng AI, phân tích dữ liệu
• 🌐 **Digital Marketing**: Marketing online, quảng cáo số
• 💻 **Cybersecurity**: Bảo mật thông tin, an ninh mạng
• 🌱 **Sustainability**: Phát triển bền vững, năng lượng xanh
• 🏥 **Healthcare Tech**: Công nghệ y tế, telemedicine

**Kỹ năng cần thiết:**
• 🔄 **Thích nghi**: Học hỏi công nghệ mới liên tục
• 🌍 **Toàn cầu**: Tiếng Anh, văn hóa quốc tế
• 💡 **Sáng tạo**: Giải quyết vấn đề theo cách mới
• 🤝 **Hợp tác**: Làm việc nhóm, giao tiếp hiệu quả

**Lời khuyên:**
• 🎯 Luôn cập nhật xu hướng mới
• 📚 Học tập liên tục và không ngừng
• 🌟 Xây dựng thương hiệu cá nhân
• 💪 Dũng cảm thử nghiệm và mắc sai lầm

Bạn muốn tìm hiểu sâu hơn về hướng đi nào? Tôi sẽ tư vấn chi tiết! 😊
        `;
    }
    
    // Môn học cụ thể
    if (lowerMessage.includes('toán') || lowerMessage.includes('math')) {
        return `
📊 **Toán học - Nền tảng của tư duy logic:**

**🎯 Ứng dụng nghề nghiệp:**
• Lập trình viên & Kỹ sư phần mềm
• Nhà phân tích dữ liệu & Thống kê
• Kỹ sư tài chính & Ngân hàng
• Nhà nghiên cứu khoa học

**💪 Kỹ năng cần thiết:**
• Tư duy logic và phân tích
• Khả năng giải quyết vấn đề
• Tính chính xác và cẩn thận

**📚 Phương pháp học tập:**
• Làm nhiều bài tập thực hành
• Học theo nhóm để trao đổi ý tưởng
• Áp dụng vào thực tế cuộc sống

**🚀 Triển vọng:** Toán học đang trở thành kỹ năng cốt lõi trong thời đại AI và dữ liệu lớn.
        `;
    }

    if (lowerMessage.includes('vật lý') || lowerMessage.includes('physics')) {
        return `
⚛️ **Vật lý - Khoa học của tự nhiên:**

**🎯 Ứng dụng nghề nghiệp:**
• Kỹ sư điện tử & Viễn thông
• Kỹ sư cơ khí & Tự động hóa
• Nhà nghiên cứu vật liệu mới
• Kỹ sư năng lượng & Môi trường

**💪 Kỹ năng cần thiết:**
• Hiểu biết về các nguyên lý cơ bản
• Khả năng thực nghiệm và quan sát
• Tư duy phân tích và suy luận

**📚 Phương pháp học tập:**
• Kết hợp lý thuyết với thực hành
• Thực hiện các thí nghiệm đơn giản
• Quan sát hiện tượng trong cuộc sống

**🚀 Triển vọng:** Vật lý đang mở ra những cơ hội mới trong lĩnh vực công nghệ lượng tử và năng lượng tái tạo.
        `;
    }

    if (lowerMessage.includes('văn') || lowerMessage.includes('literature')) {
        return `
📚 **Văn học - Nghệ thuật ngôn từ:**

**🎯 Ứng dụng nghề nghiệp:**
• Nhà báo & Biên tập viên
• Copywriter & Content Creator
• Giáo viên & Giảng viên
• Nhà văn & Dịch giả

**💪 Kỹ năng cần thiết:**
• Khả năng viết và diễn đạt
• Tư duy phản biện và phân tích
• Hiểu biết văn hóa và xã hội

**📚 Phương pháp học tập:**
• Đọc nhiều tác phẩm đa dạng
• Viết nhật ký và sáng tác
• Thảo luận và tranh luận

**🚀 Triển vọng:** Trong thời đại số, kỹ năng viết và giao tiếp vẫn là những kỹ năng quan trọng nhất.
        `;
    }

    if (lowerMessage.includes('tiếng anh') || lowerMessage.includes('english')) {
        return `
🌍 **Tiếng Anh - Ngôn ngữ toàn cầu:**

**🎯 Ứng dụng nghề nghiệp:**
• Thông dịch viên & Biên dịch
• Hướng dẫn viên du lịch
• Nhân viên kinh doanh quốc tế
• Giáo viên tiếng Anh

**💪 Kỹ năng cần thiết:**
• Phát âm chuẩn và ngữ điệu
• Vốn từ vựng phong phú
• Ngữ pháp chính xác

**📚 Phương pháp học tập:**
• Xem phim và nghe nhạc tiếng Anh
• Đọc sách và báo tiếng Anh
• Thực hành giao tiếp với người bản xứ

**🚀 Triển vọng:** Tiếng Anh là yêu cầu bắt buộc trong hầu hết các công việc có thu nhập cao.
        `;
    }

    if (lowerMessage.includes('công nghệ') || lowerMessage.includes('it') || lowerMessage.includes('tin học')) {
        return `
💻 **Công nghệ thông tin - Lĩnh vực của tương lai:**

**🎯 Ứng dụng nghề nghiệp:**
• Lập trình viên & Kỹ sư phần mềm
• Chuyên gia bảo mật mạng
• Nhà phân tích dữ liệu
• Quản trị viên hệ thống

**💪 Kỹ năng cần thiết:**
• Tư duy logic và giải thuật
• Khả năng học hỏi công nghệ mới
• Kỹ năng làm việc nhóm

**📚 Phương pháp học tập:**
• Thực hành lập trình thường xuyên
• Tham gia các dự án thực tế
• Học từ các nguồn trực tuyến

**🚀 Triển vọng:** CNTT là ngành có tốc độ phát triển nhanh nhất với nhu cầu nhân lực cao và mức lương cạnh tranh.
        `;
    }

    if (lowerMessage.includes('kinh doanh') || lowerMessage.includes('business')) {
        return `
💼 **Kinh doanh - Nghệ thuật quản lý:**

**🎯 Ứng dụng nghề nghiệp:**
• Quản lý kinh doanh & Marketing
• Chuyên gia tài chính & Kế toán
• Nhà khởi nghiệp & Doanh nhân
• Chuyên viên tư vấn chiến lược

**💪 Kỹ năng cần thiết:**
• Tư duy chiến lược và phân tích
• Kỹ năng lãnh đạo và quản lý
• Khả năng giao tiếp và thuyết phục

**📚 Phương pháp học tập:**
• Đọc sách kinh doanh và case study
• Tham gia các cuộc thi khởi nghiệp
• Thực tập tại các công ty

**🚀 Triển vọng:** Kinh doanh luôn là lĩnh vực có nhu cầu nhân lực cao với cơ hội thăng tiến không giới hạn.
        `;
    }

    if (lowerMessage.includes('thiết kế') || lowerMessage.includes('design')) {
        return `
🎨 **Thiết kế - Nghệ thuật sáng tạo:**

**🎯 Ứng dụng nghề nghiệp:**
• Thiết kế đồ họa & UI/UX
• Thiết kế nội thất & Kiến trúc
• Thiết kế thời trang & Sản phẩm
• Thiết kế web & Mobile app

**💪 Kỹ năng cần thiết:**
• Khả năng sáng tạo và thẩm mỹ
• Sử dụng thành thạo công cụ thiết kế
• Hiểu biết về màu sắc và bố cục

**📚 Phương pháp học tập:**
• Thực hành thiết kế thường xuyên
• Học từ các designer nổi tiếng
• Tham gia các cuộc thi thiết kế

**🚀 Triển vọng:** Thiết kế đang trở thành yếu tố quan trọng trong mọi lĩnh vực, từ công nghệ đến thương mại.
        `;
    }

    if (lowerMessage.includes('marketing')) {
        return `
📢 **Marketing - Nghệ thuật kết nối:**

**🎯 Ứng dụng nghề nghiệp:**
• Chuyên viên Marketing số
• Quản lý thương hiệu
• Chuyên gia quảng cáo
• Nhà phân tích thị trường

**💪 Kỹ năng cần thiết:**
• Hiểu biết về tâm lý khách hàng
• Kỹ năng sáng tạo nội dung
• Phân tích dữ liệu và xu hướng

**📚 Phương pháp học tập:**
• Thực hành các chiến dịch marketing
• Học từ các case study thành công
• Tham gia các khóa học online

**🚀 Triển vọng:** Marketing số đang phát triển mạnh mẽ với sự xuất hiện của AI, Big Data và các nền tảng mạng xã hội mới.
        `;
    }

    // Default response for other questions
    return `
🤔 Tôi hiểu bạn muốn biết về "${userMessage}". 

Tôi là AI Copilot chuyên về tư vấn giáo dục toàn diện tại FPT Polytechnic. Tôi có thể giúp bạn:

**🎯 Tư vấn chuyên môn:**
• Ngành học phù hợp và triển vọng nghề nghiệp
• Phương pháp học tập hiệu quả cho từng lĩnh vực
• Chuẩn bị kiến thức và kỹ năng cần thiết
• Thông tin chi tiết về từng ngành học

**🌟 Phát triển cá nhân:**
• Kỹ năng mềm: giao tiếp, làm việc nhóm, quản lý thời gian
• Hỗ trợ tâm lý: giảm stress, tăng tự tin, vượt qua khó khăn
• Định hướng nghề nghiệp và phát triển sự nghiệp
• Xây dựng thương hiệu cá nhân

**🎓 Cuộc sống sinh viên:**
• Cân bằng học tập và giải trí
• Hoạt động ngoại khóa và mối quan hệ
• Quản lý tài chính và kế hoạch tương lai
• Hướng dẫn thực tập và việc làm

**🏆 Nâng cao năng lực:**
• Chứng chỉ và kỹ năng bổ sung có ích
• Cập nhật xu hướng nghề nghiệp mới
• Chuẩn bị cho thị trường lao động tương lai
• Học bổng và hỗ trợ tài chính

**💡 Tư vấn chung:**
• Thông tin về FPT Polytechnic
• Hướng dẫn sử dụng ứng dụng
• Giải đáp thắc mắc về giáo dục
• Lời khuyên về tương lai

Bạn có thể hỏi cụ thể hơn về các chủ đề trên, hoặc hoàn thành bài khảo sát để tôi có thể tư vấn cá nhân hóa cho bạn! 😊

Hoặc bạn có thể sử dụng các câu hỏi nhanh bên dưới để bắt đầu! 🚀

**💬 Gợi ý câu hỏi:**
• "Tôi nên học ngành gì với sở thích [sở thích cụ thể]?"
• "Làm thế nào để cải thiện [kỹ năng cụ thể]?"
• "Triển vọng của ngành [tên ngành] như thế nào?"
• "Tôi cần chuẩn bị gì cho [mục tiêu cụ thể]?"
    `;
}

function getEnhancedFallbackResponse(userMessage, currentFormData, lastResult) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for specific keywords and provide comprehensive responses
    if (lowerMessage.includes('ngành') || lowerMessage.includes('major')) {
        if (currentFormData) {
            return `
🎯 **Dựa trên thông tin của bạn, tôi có thể tư vấn về ngành học:**

**Thông tin hiện tại:**
• Tuổi: ${currentFormData.age || 'Chưa cung cấp'}
• Sở thích: ${currentFormData.interests ? currentFormData.interests : 'Chưa cung cấp'}
• Mục tiêu: ${currentFormData.careerGoals || 'Chưa cung cấp'}

**Để tư vấn chính xác hơn, hãy:**
1. Hoàn thành bài khảo sát đầy đủ
2. Nhấn "Phân tích và Tư vấn"
3. Tôi sẽ đưa ra gợi ý ngành học phù hợp nhất

Bạn có muốn hoàn thành khảo sát ngay bây giờ không? 😊
            `;
        } else {
            return `
🎯 **Tư vấn ngành học phù hợp:**

**Các ngành nổi bật tại FPT Polytechnic:**

**💻 Công nghệ thông tin:**
• Phát triển phần mềm - Lập trình, phát triển ứng dụng
• Thiết kế đồ họa - Sáng tạo, thiết kế digital
• Quản trị mạng - Bảo mật, hạ tầng công nghệ

**💼 Kinh doanh:**
• Quản trị kinh doanh - Quản lý, marketing, sales
• Kế toán - Tài chính, kiểm toán, thuế
• Logistics - Chuỗi cung ứng, vận tải

**🎨 Sáng tạo:**
• Thiết kế nội thất - Kiến trúc, trang trí
• Thiết kế thời trang - Thời trang, may mặc
• Quay phim - Truyền thông, giải trí

**🔧 Kỹ thuật:**
• Công nghệ ô tô - Cơ khí, điện tử ô tô
• Điện tử viễn thông - Viễn thông, IoT

**Để biết ngành nào phù hợp nhất với bạn, hãy hoàn thành bài khảo sát! 😊**
            `;
        }
    }
    
    if (lowerMessage.includes('học') && (lowerMessage.includes('gì') || lowerMessage.includes('chuẩn bị'))) {
        return `
📚 **Chuẩn bị cho việc học tại FPT Polytechnic:**

**Kỹ năng cơ bản:**
• 🇬🇧 **Tiếng Anh**: Đọc hiểu tài liệu, giao tiếp cơ bản
• 💻 **Tin học**: Word, Excel, PowerPoint, Internet
• 🧠 **Tư duy**: Logic, giải quyết vấn đề, sáng tạo

**Theo từng lĩnh vực:**
• **Công nghệ**: Toán học, tư duy logic, khám phá lập trình
• **Kinh doanh**: Toán, văn hóa xã hội, khả năng giao tiếp
• **Sáng tạo**: Mỹ thuật, thẩm mỹ, phần mềm thiết kế
• **Kỹ thuật**: Toán, Vật lý, tư duy không gian

**Chuẩn bị tinh thần:**
• 🎯 Xác định mục tiêu học tập rõ ràng
• 💪 Sẵn sàng học hỏi và thay đổi
• 🌟 Tích cực tham gia hoạt động ngoại khóa

Bạn quan tâm lĩnh vực nào nhất? Tôi sẽ hướng dẫn chi tiết hơn! 🤔
        `;
    }
    
    if (lowerMessage.includes('tương lai') || lowerMessage.includes('nghề nghiệp')) {
        return `
🚀 **Triển vọng nghề nghiệp tương lai:**

**Thị trường lao động:**
• 💼 **Tỷ lệ có việc làm**: > 95% sau tốt nghiệp
• 💰 **Mức lương khởi điểm**: 7-15 triệu/tháng tùy ngành
• 🌟 **Cơ hội thăng tiến**: Rõ ràng, dựa trên năng lực

**Xu hướng nghề nghiệp:**
• 🤖 **AI & Machine Learning**: Phát triển ứng dụng thông minh
• 🌐 **Digital Marketing**: Marketing online, quảng cáo số
• 💻 **Cybersecurity**: Bảo mật thông tin, an ninh mạng
• 🌱 **Sustainability**: Phát triển bền vững, năng lượng xanh

**Lộ trình phát triển:**
• 🎓 **0-2 năm**: Học tập, thực tập, tích lũy kinh nghiệm
• 💼 **2-5 năm**: Làm việc chuyên môn, phát triển kỹ năng
• 🌟 **5-10 năm**: Chuyên gia, quản lý, khởi nghiệp

Bạn muốn tìm hiểu sâu hơn về ngành nào? Tôi sẽ tư vấn chi tiết! 😊
        `;
    }
    
    if (lowerMessage.includes('kỹ năng') || lowerMessage.includes('phát triển')) {
        return `
🌟 **Phát triển kỹ năng cá nhân:**

**Kỹ năng mềm quan trọng:**
• 🗣️ **Giao tiếp**: Lắng nghe, thuyết trình, viết lách
• 👥 **Làm việc nhóm**: Hợp tác, lãnh đạo, giải quyết xung đột
• ⏰ **Quản lý thời gian**: Lập kế hoạch, ưu tiên, tránh trì hoãn
• 💡 **Tư duy phản biện**: Phân tích, đánh giá, sáng tạo

**Kỹ năng chuyên môn:**
• 💻 **Công nghệ**: Cập nhật xu hướng mới, học công cụ mới
• 📊 **Phân tích dữ liệu**: Excel, SQL, Python, Power BI
• 🎨 **Thiết kế**: Photoshop, Illustrator, Figma, Canva
• 📱 **Marketing**: Social media, Google Ads, SEO

**Cách phát triển:**
• 📚 **Học liên tục**: Khóa học online, sách, workshop
• 🌱 **Thực hành**: Làm project, tham gia hackathon
• 🤝 **Kết nối**: Tham gia cộng đồng, networking
• 💪 **Kiên trì**: Đặt mục tiêu nhỏ, theo dõi tiến độ

Bạn muốn cải thiện kỹ năng nào trước? Tôi sẽ hướng dẫn cụ thể! 😊
        `;
    }
    
    // Default comprehensive response
    return `
🤔 **Tôi hiểu bạn muốn biết về "${userMessage}"**

Là AI Copilot của FPT Polytechnic, tôi có thể tư vấn toàn diện về:

**🎯 Tư vấn chuyên môn:**
• Ngành học phù hợp với sở thích và năng lực
• Phương pháp học tập hiệu quả cho từng lĩnh vực
• Chuẩn bị kiến thức và kỹ năng cần thiết
• Thông tin chi tiết về từng ngành học

**🌟 Phát triển cá nhân:**
• Kỹ năng mềm: giao tiếp, làm việc nhóm, quản lý thời gian
• Hỗ trợ tâm lý: giảm stress, tăng tự tin, vượt qua khó khăn
• Định hướng nghề nghiệp và phát triển sự nghiệp
• Xây dựng thương hiệu cá nhân

**🎓 Cuộc sống sinh viên:**
• Cân bằng học tập và giải trí
• Hoạt động ngoại khóa và mối quan hệ
• Quản lý tài chính và kế hoạch tương lai
• Hướng dẫn thực tập và việc làm

**🏆 Nâng cao năng lực:**
• Chứng chỉ và kỹ năng bổ sung có ích
• Cập nhật xu hướng nghề nghiệp mới
• Chuẩn bị cho thị trường lao động tương lai
• Học bổng và hỗ trợ tài chính

**💡 Để tư vấn cá nhân hóa:**
1. Hoàn thành bài khảo sát đầy đủ
2. Tôi sẽ phân tích dữ liệu của bạn
3. Đưa ra gợi ý phù hợp nhất

Bạn có muốn bắt đầu khảo sát hoặc hỏi cụ thể về chủ đề nào không? 😊
    `;
}

function getCurrentFormData() {
    try {
        const name = document.getElementById('name')?.value || '';
        if (!name) return null;
        
        return {
            name: name,
            interests: document.getElementById('interests')?.value || '',
            skills: document.getElementById('skills')?.value || '',
            favoriteSubjects: document.getElementById('favoriteSubjects')?.value || '',
            careerGoals: document.getElementById('careerGoals')?.value || ''
        };
    } catch (error) {
        return null;
    }
}

function getLastAnalysisResult() {
    try {
        const history = JSON.parse(localStorage.getItem('counselingHistory') || '[]');
        return history.length > 0 ? history[0].result : null;
    } catch (error) {
        return null;
    }
}

// Infographic Functions
function generateInfographic() {
    const lastResult = getLastAnalysisResult();
    if (!lastResult) {
        alert('Vui lòng hoàn thành khảo sát trước để tạo Infographic!');
        return;
    }
    
    const formData = getCurrentFormData();
    if (!formData) {
        alert('Không thể lấy thông tin khảo sát!');
        return;
    }
    
    const infographicContent = document.getElementById('infographicContent');
    infographicContent.innerHTML = createInfographicHTML(lastResult, formData);
    
    // Add export functionality
    addExportEventListeners();
}

function createInfographicHTML(result, userData) {
    const scores = {
        technology: parseInt(document.getElementById('technology')?.value || 5),
        creativity: parseInt(document.getElementById('creativity')?.value || 5),
        communication: parseInt(document.getElementById('communication')?.value || 5),
        logic: parseInt(document.getElementById('logic')?.value || 5),
        business: parseInt(document.getElementById('business')?.value || 5),
        manual: parseInt(document.getElementById('manual')?.value || 5)
    };
    
    const academicScores = {
        math: parseFloat(document.getElementById('mathScore')?.value || 7),
        english: parseFloat(document.getElementById('englishScore')?.value || 7),
        literature: parseFloat(document.getElementById('literatureScore')?.value || 7),
        physics: parseFloat(document.getElementById('physicsScore')?.value || 7)
    };
    
    return `
        <div class="infographic-container">
            <div class="infographic-header">
                <h2>🎨 Infographic Tư vấn Ngành học</h2>
                <p>Dành riêng cho: ${userData.name} - ${getAgeFromForm()} tuổi</p>
            </div>

            <div class="infographic-grid">
                <!-- Skills Analysis -->
                <div class="infographic-card">
                    <h3>💪 Phân tích Kỹ năng</h3>
                    <div class="skill-chart">
                        <div class="skill-item">
                            <span class="skill-label">💻 Công nghệ</span>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: ${scores.technology * 10}%"></div>
                            </div>
                            <span class="skill-value">${scores.technology}/10</span>
                        </div>
                        <div class="skill-item">
                            <span class="skill-label">🎨 Sáng tạo</span>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: ${scores.creativity * 10}%"></div>
                            </div>
                            <span class="skill-value">${scores.creativity}/10</span>
                        </div>
                        <div class="skill-item">
                            <span class="skill-label">🗣️ Giao tiếp</span>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: ${scores.communication * 10}%"></div>
                            </div>
                            <span class="skill-value">${scores.communication}/10</span>
                        </div>
                        <div class="skill-item">
                            <span class="skill-label">🧠 Logic</span>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: ${scores.logic * 10}%"></div>
                            </div>
                            <span class="skill-value">${scores.logic}/10</span>
                        </div>
                        <div class="skill-item">
                            <span class="skill-label">💼 Kinh doanh</span>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: ${scores.business * 10}%"></div>
                            </div>
                            <span class="skill-value">${scores.business}/10</span>
                        </div>
                        <div class="skill-item">
                            <span class="skill-label">🔧 Thực hành</span>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: ${scores.manual * 10}%"></div>
                            </div>
                            <span class="skill-value">${scores.manual}/10</span>
                        </div>
                    </div>
                </div>

                <!-- Academic Performance -->
                <div class="infographic-card">
                    <h3>📊 Kết quả Học tập</h3>
                    <div class="skill-chart">
                        <div class="skill-item">
                            <span class="skill-label">📊 Toán học</span>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: ${academicScores.math * 10}%"></div>
                            </div>
                            <span class="skill-value">${academicScores.math}/10</span>
                        </div>
                        <div class="skill-item">
                            <span class="skill-label">🌍 Tiếng Anh</span>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: ${academicScores.english * 10}%"></div>
                            </div>
                            <span class="skill-value">${academicScores.english}/10</span>
                        </div>
                        <div class="skill-item">
                            <span class="skill-label">📚 Văn học</span>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: ${academicScores.literature * 10}%"></div>
                            </div>
                            <span class="skill-value">${academicScores.literature}/10</span>
                        </div>
                        <div class="skill-item">
                            <span class="skill-label">⚛️ Vật lý</span>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: ${academicScores.physics * 10}%"></div>
                            </div>
                            <span class="skill-value">${academicScores.physics}/10</span>
                        </div>
                    </div>
                </div>

                <!-- Personality Traits -->
                <div class="infographic-card">
                    <h3>🌟 Đặc điểm Tính cách</h3>
                    <div class="personality-traits">
                        <div class="trait-item">
                            <div class="trait-icon">💻</div>
                            <div class="trait-label">Công nghệ</div>
                            <div class="trait-score">${scores.technology}/10</div>
                        </div>
                        <div class="trait-item">
                            <div class="trait-icon">🎨</div>
                            <div class="trait-label">Sáng tạo</div>
                            <div class="trait-score">${scores.creativity}/10</div>
                        </div>
                        <div class="trait-item">
                            <div class="trait-icon">🗣️</div>
                            <div class="trait-label">Giao tiếp</div>
                            <div class="trait-score">${scores.communication}/10</div>
                        </div>
                        <div class="trait-item">
                            <div class="trait-icon">🧠</div>
                            <div class="trait-label">Logic</div>
                            <div class="trait-score">${scores.logic}/10</div>
                        </div>
                        <div class="trait-item">
                            <div class="trait-icon">💼</div>
                            <div class="trait-label">Kinh doanh</div>
                            <div class="trait-score">${scores.business}/10</div>
                        </div>
                        <div class="trait-item">
                            <div class="trait-icon">🔧</div>
                            <div class="trait-label">Thực hành</div>
                            <div class="trait-score">${scores.manual}/10</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recommendation Summary -->
            <div class="recommendation-summary">
                <h3>🎯 Khuyến nghị Ngành học</h3>
                <p>${getRecommendationSummary(result, scores)}</p>
            </div>

            <!-- Action Steps -->
            <div class="action-steps">
                <h3>🚀 Các bước Tiếp theo</h3>
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4>Xem kết quả chi tiết</h4>
                        <p>Chuyển sang tab "Kết quả" để xem phân tích chi tiết về ngành học phù hợp</p>
                    </div>
                </div>
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4>Tìm hiểu về ngành học</h4>
                        <p>Nghiên cứu sâu hơn về các ngành học được khuyến nghị</p>
                    </div>
                </div>
                <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4>Lập kế hoạch học tập</h4>
                        <p>Xây dựng lộ trình học tập và chuẩn bị cho tương lai</p>
                    </div>
                </div>
            </div>

            <!-- Export Buttons -->
            <div class="export-buttons">
                <button class="export-btn pdf" onclick="exportToPDF()">
                    📄 Xuất PDF
                </button>
                <button class="export-btn image" onclick="exportToImage()">
                    🖼️ Xuất Ảnh
                </button>
                <button class="export-btn share" onclick="shareInfographic()">
                    📤 Chia sẻ
                </button>
            </div>
        </div>
    `;
}

function getAgeFromForm() {
    const ageInput = document.getElementById('age');
    return ageInput ? ageInput.value : '18';
}

function getRecommendationSummary(result, scores) {
    const topScore = Math.max(...Object.values(scores));
    const topSkills = Object.keys(scores).filter(skill => scores[skill] === topScore);
    
    let summary = `Dựa trên phân tích kỹ năng và sở thích của bạn, `;
    
    if (topSkills.includes('technology')) {
        summary += `chúng tôi khuyến nghị tập trung vào các ngành học công nghệ thông tin, phát triển phần mềm, hoặc thiết kế đồ họa. `;
    } else if (topSkills.includes('creativity')) {
        summary += `chúng tôi khuyến nghị các ngành học thiết kế, nghệ thuật, hoặc truyền thông. `;
    } else if (topSkills.includes('business')) {
        summary += `chúng tôi khuyến nghị các ngành học quản trị kinh doanh, marketing, hoặc kế toán. `;
    } else if (topSkills.includes('communication')) {
        summary += `chúng tôi khuyến nghị các ngành học truyền thông, marketing, hoặc quản lý. `;
    } else if (topSkills.includes('logic')) {
        summary += `chúng tôi khuyến nghị các ngành học kỹ thuật, công nghệ, hoặc khoa học. `;
    } else {
        summary += `chúng tôi khuyến nghị các ngành học thực hành, kỹ thuật, hoặc công nghệ. `;
    }
    
    summary += `Hãy xem kết quả chi tiết trong tab "Kết quả" để biết thêm thông tin.`;
    
    return summary;
}

function addExportEventListeners() {
    // Add any additional event listeners for export functionality
    console.log('Export event listeners added');
}

// Export Functions
function exportToPDF() {
    alert('Tính năng xuất PDF sẽ được phát triển trong phiên bản tiếp theo!');
}

function exportToImage() {
    alert('Tính năng xuất ảnh sẽ được phát triển trong phiên bản tiếp theo!');
}

function shareInfographic() {
    if (navigator.share) {
        navigator.share({
            title: 'Infographic Tư vấn Ngành học FPT Polytechnic',
            text: 'Xem kết quả tư vấn ngành học cá nhân hóa của tôi!',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Đã sao chép link vào clipboard! Bạn có thể chia sẻ link này.');
        }).catch(() => {
            alert('Link: ' + url);
        });
    }
}

// Remove duplicate function


