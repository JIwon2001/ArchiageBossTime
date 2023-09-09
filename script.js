let results = []; // 결과를 저장할 배열

// 페이지 로드 시 로컬 스토리지에서 결과 가져오기
window.onload = function () {
  getCutTimeFromLocalStorage();
  getResultsFromLocalStorage();
};

function calculateTime() {
  const bossName = document.getElementById("bossNameInput").value;
  const hourInput = parseInt(document.getElementById("hourInput").value);
  const timeInput = document.getElementById("timeInput").value;
  const cutTime = document.getElementById("timeInput").value;

  if (bossName.trim() === "") {
    alert("보스의 이름을 입력하세요.");
    return;
  }

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
    굴라: 15,
  };

  let parsedTime = parseTimeInput(timeInput);

  if (!parsedTime) {
    alert("올바른 시간 형식을 입력하세요 (예: '1400' 또는 '1523').");
    return;
  }

  const bossAutomaticHour = automaticHours[bossName];
  if (bossAutomaticHour !== undefined) {
    parsedTime.setHours(parsedTime.getHours() + bossAutomaticHour);
  } else {
    parsedTime.setHours(parsedTime.getHours() + hourInput);
  }

  if (parsedTime.getHours() < parseInt(timeInput.substring(0, 1))) {
    parsedTime.setDate(parsedTime.getDate() + 1); // 날짜를 하루 더해줌
  }

  const hours = parsedTime.getHours();
  const minutes = parsedTime.getMinutes();
  const resultTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  const existingResultIndex = results.findIndex((result) => result.bossName === bossName);
  if (existingResultIndex !== -1) {
    results[existingResultIndex].resultTime = resultTime;
    results[existingResultIndex].timestamp = parsedTime.getTime();
    results[existingResultIndex].cutTime = cutTime;
  } else {
    const resultObject = {
      bossName: bossName,
      resultTime: resultTime,
      timestamp: parsedTime.getTime(),
      cutTime: cutTime,
    };
    results.push(resultObject);
  }

  results.sort((a, b) => a.timestamp - b.timestamp);
  displayResults();
  saveResultsToLocalStorage();
}



function handleKeyPress(event) {
  if (event.key === "Enter") {
    saveCutTimeToLocalStorage(document.getElementById("timeInput").value);
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
    굴라:"red",
  };

  return bossColors[bossName] || "black"; // 기본은 검은색
}

// 결과를 화면에 출력하는 함수
function displayResults() {
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "";

  results.forEach((result, index) => {
    const p = document.createElement("p");
    const bossNameWithColor = `<span style="color: ${getBossColor(
      result.bossName
    )}">${result.bossName}</span>`;
    const date = new Date(result.timestamp);
    const dateString = `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
      .getDate()
      .toString()
      .padStart(2, "0")}`;
    const formattedCutTime = result.cutTime.replace(/^(\d{2})(\d{2})$/, "$1:$2"); // 이 부분이 수정되었습니다
    const formattedResultTime = result.resultTime.replace("::", ":");
    p.innerHTML = `${bossNameWithColor} 컷: ${formattedCutTime}, 젠:${dateString} ${formattedResultTime}`;

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "X";
    deleteButton.addEventListener("click", () => {
      deleteResult(index);
    });
    deleteButton.style.fontSize = "16px";
    deleteButton.style.width = "20px";
    deleteButton.style.height = "20px";
    deleteButton.style.background = "transparent";
    deleteButton.style.border = "none";
    deleteButton.style.cursor = "pointer";
    deleteButton.style.padding = "0";

    p.appendChild(deleteButton);

    resultContainer.appendChild(p);
  });
}



function formatTime(time) {
  const hours = time.substring(0, 2);
  const minutes = time.substring(2);
  return `${hours}:${minutes}`;
}

// 컷 시간을 로컬 스토리지에 저장하는 함수
function saveCutTimeToLocalStorage(cutTime) {
  localStorage.setItem("cutTime", cutTime);
}

// 로컬 스토리지에서 컷 시간을 불러오는 함수
function getCutTimeFromLocalStorage() {
  const cutTime = localStorage.getItem("cutTime");
  if (cutTime) {
    document.getElementById("timeInput").value = cutTime;
  }
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
  localStorage.removeItem("cutTime");
  results = [];
  // 화면에서 모든 결과를 제거합니다.
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "";
});

// 결과 삭제 버튼에 대한 이벤트 리스너 추가
function deleteResult(index) {
  results.splice(index, 1);
  saveResultsToLocalStorage();
  displayResults();
}

getCutTimeFromLocalStorage();
