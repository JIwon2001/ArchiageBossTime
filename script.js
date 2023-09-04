let results = []; // 결과를 저장할 배열

// 페이지 로드 시 로컬 스토리지에서 결과 가져오기
window.onload = function () {
  getResultsFromLocalStorage();
};

function calculateTime() {
  const bossName = document.getElementById("bossNameInput").value;
  let hourInput = parseInt(document.getElementById("hourInput").value);
  const timeInput = document.getElementById("timeInput").value;

  if (bossName.trim() === "") {
    alert("보스의 이름을 입력하세요.");
    return;
  }

  // 보스 이름에 따라 자동으로 추가 시간 설정
  const automaticHours = {
    디켄: 6,
    네르구스: 6,
    킹스톤: 6,
    타이란: 6,
    나투스: 6,
    저거너트: 6,
    바루타: 6,
    "29호": 18,
    마스투스: 18,
    벨루치: 15,
    가나비슈: 15,
    발룸: 15,
  };

  // 자동으로 추가 시간 설정이 있는 경우 해당 값을 사용
  if (bossName in automaticHours) {
    hourInput = automaticHours[bossName];
  }

  // 시간을 24시간 형식으로 파싱 (예: "1400" -> "14:00")
  const parsedTime = parseTimeInput(timeInput);

  if (!parsedTime) {
    alert("올바른 시간 형식을 입력하세요 (예: '1400' 또는 '1523').");
    return;
  }

  // 시간을 더함
  parsedTime.setHours(parsedTime.getHours() + hourInput);

  // 시간을 24시간 형식으로 변환
  const hours = parsedTime.getHours();
  const minutes = parsedTime.getMinutes();

  // 결과를 문자열로 변환 (24시간 형식)
  const resultTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  // 결과를 배열에 추가
  const resultObject = {
    bossName: bossName,
    resultTime: resultTime,
    timestamp: parsedTime.getTime(),
  };

  results.push(resultObject);

  // 결과 배열을 타임스탬프를 기준으로 정렬
  results.sort((a, b) => a.timestamp - b.timestamp);

  // 화면에 정렬된 결과를 표시
  displayResults();
  saveResultsToLocalStorage();
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    calculateTime();
  }
}

// 24시간 형식의 시간 입력을 파싱하는 함수
function parseTimeInput(timeInput) {
  const match = timeInput.match(/^(\d{2})(\d{2})$/);
  if (match) {
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      const parsedTime = new Date();
      parsedTime.setHours(hours);
      parsedTime.setMinutes(minutes);
      return parsedTime;
    }
  }
  return null;
}

// 보스 이름에 따라 다른 색상을 반환하는 함수
function getBossColor(bossName) {
  const bossColors = {
    디켄: "blue",
    네르구스: "blue",
    킹스톤: "blue",
    타이란: "blue",
    나투스: "blue",
    저거너트: "blue",
    바루타: "blue",
    "29호": "yellow",
    마스투스: "yellow",
    벨루치: "red",
    가나비슈: "red",
    발룸: "red",
  };

  return bossColors[bossName] || "black"; // 기본은 검은색
}

// 결과를 화면에 출력하는 함수
function displayResults() {
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "";

  results.forEach((result) => {
    const p = document.createElement("p");
    const bossNameWithColor = `<span style="color: ${getBossColor(result.bossName)}">${result.bossName}</span>`;
    p.innerHTML = `${bossNameWithColor}의 다음 젠 시간은 ${result.resultTime} 입니다.`;
    resultContainer.appendChild(p);
  });
}

// 로컬 스토리지에 결과를 저장하는 함수
function saveResultsToLocalStorage() {
  localStorage.setItem("savedResults", JSON.stringify(results));
}

// 로컬 스토리지에서 결과를 불러오는 함수
function getResultsFromLocalStorage() {
  const savedResults = localStorage.getItem("savedResults");
  if (savedResults) {
    results = JSON.parse(savedResults);
    displayResults();
  }
}

// 초기화 버튼에 대한 이벤트 리스너 추가
document.getElementById("clearButton").addEventListener("click", function () {
  // 로컬 스토리지에서 저장된 결과를 제거하고 배열을 초기화합니다.
  localStorage.removeItem("savedResults");
  results = [];
  // 화면에서 모든 결과를 제거합니다.
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "";
});
