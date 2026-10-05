let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let currentJsonFile = '';
let currentTitle = '';

// Chuyển đổi Dark / Light Mode
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Tải câu hỏi từ JSON khi chọn Học phần
async function startQuiz(jsonFile, title) {
  try {
    currentJsonFile = jsonFile;
    currentTitle = title;

    const response = await fetch(`./${jsonFile}`);
    currentQuestions = await response.json();
    
    if (currentQuestions.length === 0) {
      alert("Học phần này chưa có câu hỏi!");
      return;
    }

    // Xáo trộn câu hỏi ngẫu nhiên
    shuffleArray(currentQuestions);

    currentIndex = 0;
    score = 0; // Đặt lại điểm số
    document.getElementById('quiz-title').innerText = title;
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('result-view').classList.add('hidden');
    document.getElementById('quiz-view').classList.remove('hidden');
    
    showQuestion();
  } catch (error) {
    alert("Không thể tải dữ liệu câu hỏi. Hãy kiểm tra lại file JSON!");
  }
}

// Hiển thị câu hỏi
function showQuestion() {
  const q = currentQuestions[currentIndex];
  document.getElementById('quiz-progress').innerText = `Câu hỏi ${currentIndex + 1}/${currentQuestions.length} • Đúng: ${score} câu`;
  document.getElementById('question-text').innerText = q.question;

  const container = document.getElementById('options-container');
  container.innerHTML = '';

  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = `${String.fromCharCode(65 + index)}. ${opt}`;
    btn.onclick = () => selectOption(btn, index, q.answer);
    container.appendChild(btn);
  });
}

// Kiểm tra đáp án khi người dùng bấm chọn
function selectOption(btn, selectedIndex, correctIndex) {
  const buttons = document.querySelectorAll('.option-btn');
  buttons.forEach(b => b.disabled = true); // Khóa không cho chọn lại

  if (selectedIndex === correctIndex) {
    btn.classList.add('correct');
    score++; // Cộng 1 điểm nếu trả lời đúng
  } else {
    btn.classList.add('wrong');
    buttons[correctIndex].classList.add('correct'); // Hiện đáp án đúng
  }
}

// Qua câu hỏi tiếp theo
function nextQuestion() {
  if (currentIndex < currentQuestions.length - 1) {
    currentIndex++;
    showQuestion();
  } else {
    showResult(); // Hiển thị kết quả khi xong
  }
}

// Hiển thị màn hình tổng kết & chấm điểm
function showResult() {
  document.getElementById('quiz-view').classList.add('hidden');
  document.getElementById('result-view').classList.remove('hidden');

  const total = currentQuestions.length;
  const percentage = Math.round((score / total) * 100);
  const mark10 = ((score / total) * 10).toFixed(1); // Thang điểm 10

  document.getElementById('final-score').innerText = `${mark10} / 10 điểm`;
  document.getElementById('score-details').innerText = `Bạn trả lời đúng ${score}/${total} câu hỏi`;
  document.getElementById('score-percentage').innerText = `Tỷ lệ chính xác: ${percentage}%`;
}

// Làm lại bài thi
function restartQuiz() {
  startQuiz(currentJsonFile, currentTitle);
}

// Quay về trang chủ
function goHome() {
  document.getElementById('home-view').classList.remove('hidden');
  document.getElementById('quiz-view').classList.add('hidden');
  document.getElementById('result-view').classList.add('hidden');
}

// Hàm xáo trộn mảng ngẫu nhiên
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
