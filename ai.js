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

// API Configuration - Chỉnh sửa API key tại đây
const API_CONFIG = {
    provider: 'demo', // 'openai', 'gemini', hoặc 'demo' (không cần API key)
    apiKey: '0xR9Dv4BcLfQgDNLpTQgvfMAimMqqG4gB3gAWPVX' // Thay thế bằng API key thực của bạn (bắt đầu bằng sk-)
};

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
}

document.getElementById('surveyForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!API_CONFIG.apiKey || API_CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
        alert('Vui lòng cấu hình API Key trong code trước khi sử dụng!');
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
    const apiKey = API_CONFIG.apiKey;
    
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
            return JSON.parse(data.choices[0].message.content);
        } catch (error) {
            console.error('OpenAI API Error:', error);
            // Fallback to demo data if API fails
            return getDemoAnalysisResult(formData);
        }
    } else {
        // For other providers or demo mode
        return getDemoAnalysisResult(formData);
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

// Copilot Functions
let copilotHistory = [];
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
    
    try {
        // Get AI response
        const response = await getCopilotResponse(message);
        
        // Remove typing indicator
        typingDiv.remove();
        
        // Add bot response
        addCopilotMessage(response, 'bot');
        
    } catch (error) {
        // Remove typing indicator
        typingDiv.remove();
        
        // Add error message
        addCopilotMessage('Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.', 'bot');
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
    if (!API_CONFIG.apiKey || API_CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
        return 'Để sử dụng tính năng chat, vui lòng cấu hình API Key trong code. 🔑';
    }

    // Check for predefined responses first
    const predefinedResponse = getPredefinedResponse(userMessage);
    if (predefinedResponse) {
        return predefinedResponse;
    }

    const provider = API_CONFIG.provider;
    const apiKey = API_CONFIG.apiKey;
    
    // Build context from user's current session
    const currentFormData = getCurrentFormData();
    const lastResult = getLastAnalysisResult();
    
    const systemPrompt = `
Bạn là AI Copilot của FPT Polytechnic, chuyên gia tư vấn giáo dục thân thiện và hữu ích. 

Thông tin về FPT Polytechnic:
- Các ngành Công nghệ: Phát triển phần mềm, Thiết kế đồ họa, Ứng dụng phần mềm, Quản trị mạng máy tính, Thiết kế trang web
- Các ngành Kinh doanh: Quản trị kinh doanh, Kế toán, Marketing, Logistics, Quản lý khách sạn  
- Các ngành Sáng tạo: Thiết kế nội thất, Thiết kế thời trang, Quay phim và biên tập
- Các ngành Kỹ thuật: Công nghệ ô tô, Điện tử viễn thông, Cơ khí máy tính, Điện công nghiệp

Hãy trả lời ngắn gọn, thân thiện và hữu ích. Sử dụng emoji phù hợp.
${currentFormData ? `\nThông tin người dùng hiện tại: ${JSON.stringify(currentFormData)}` : ''}
${lastResult ? `\nKết quả phân tích gần nhất: ${JSON.stringify(lastResult)}` : ''}
`;

    if (provider === 'openai') {
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
                temperature: 0.7,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            throw new Error('Lỗi API');
        }

        const data = await response.json();
        const botResponse = data.choices[0].message.content;
        
        // Update history
        copilotHistory.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: botResponse }
        );
        
        return botResponse;
    } else {
        // Fallback response for other providers
        return getPredefinedResponse(userMessage) || 
               'Tôi hiểu bạn muốn biết về ' + userMessage + '. Để được tư vấn chi tiết hơn, bạn có thể hoàn thành bài khảo sát trước nhé! 😊';
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
    
    return null;
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
