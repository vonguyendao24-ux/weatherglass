const cityName = document.getElementById('cityName');
const todayDate = document.getElementById('todayDate');
const timeLabel = document.getElementById('timeLabel');
const temperature = document.getElementById('temperature');
const conditionText = document.getElementById('conditionText');
const weatherIcon = document.getElementById('weatherIcon');
const humidityValue = document.getElementById('humidityValue');
const feelsValue = document.getElementById('feelsValue');
const windValue = document.getElementById('windValue');
const cloudValue = document.getElementById('cloudValue');
const uvValue = document.getElementById('uvValue');
const pressureValue = document.getElementById('pressureValue');
const hourlyScroll = document.getElementById('hourlyScroll');
const weeklyList = document.getElementById('weeklyList');
const searchInput = document.getElementById('searchInput');
const locateBtn = document.getElementById('locateBtn');
const searchHint = document.getElementById('searchHint');
const themeButtons = document.querySelectorAll('.theme-btn');
const nearbyCities = document.getElementById('nearbyCities');
const loginScreen = document.getElementById('loginScreen');
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const loginBtn = document.getElementById('loginBtn');
const loginHintText = document.getElementById('loginHint');
const logoutBtn = document.getElementById('logoutBtn');
const dashboard = document.getElementById('dashboard');

let currentLocation = null;
let refreshTimer = null;

const weatherCodeMap = {
  0: { icon: '☀️', label: 'Trời quang đãng', mood: 'sun' },
  1: { icon: '🌤️', label: 'Ít mây', mood: 'sun' },
  2: { icon: '⛅', label: 'Nhiều mây', mood: 'sun' },
  3: { icon: '☁️', label: 'Trời âm u', mood: 'rain' },
  45: { icon: '🌫️', label: 'Sương mù', mood: 'rain' },
  48: { icon: '🌫️', label: 'Sương mù nhẹ', mood: 'rain' },
  51: { icon: '🌦️', label: 'Mưa phùn nhẹ', mood: 'rain' },
  53: { icon: '🌦️', label: 'Mưa phùn', mood: 'rain' },
  55: { icon: '🌧️', label: 'Mưa phùn dày', mood: 'rain' },
  56: { icon: '🌧️', label: 'Mưa phùn lạnh', mood: 'rain' },
  57: { icon: '🌧️', label: 'Mưa phùn lạnh', mood: 'rain' },
  61: { icon: '🌧️', label: 'Mưa nhẹ', mood: 'rain' },
  63: { icon: '🌧️', label: 'Mưa vừa', mood: 'rain' },
  65: { icon: '⛈️', label: 'Mưa to', mood: 'rain' },
  66: { icon: '⛈️', label: 'Mưa đá nhỏ', mood: 'rain' },
  67: { icon: '⛈️', label: 'Mưa đá', mood: 'rain' },
  71: { icon: '🌨️', label: 'Tuyết nhẹ', mood: 'snow' },
  73: { icon: '❄️', label: 'Tuyết vừa', mood: 'snow' },
  75: { icon: '❄️', label: 'Tuyết to', mood: 'snow' },
  77: { icon: '❄️', label: 'Mưa tuyết', mood: 'snow' },
  80: { icon: '🌧️', label: 'Mưa rào', mood: 'rain' },
  81: { icon: '🌧️', label: 'Mưa rào vừa', mood: 'rain' },
  82: { icon: '⛈️', label: 'Mưa rào to', mood: 'rain' },
  85: { icon: '🌨️', label: 'Mưa tuyết nhẹ', mood: 'snow' },
  86: { icon: '🌨️', label: 'Mưa tuyết vừa', mood: 'snow' },
  95: { icon: '⛈️', label: 'Giông bão', mood: 'storm' },
  96: { icon: '⛈️', label: 'Giông mưa đá nhỏ', mood: 'storm' },
  99: { icon: '⛅', label: 'Giông mưa đá', mood: 'storm' },
};

const favoriteCities = [
  { name: 'Hà Nội', latitude: 21.0285, longitude: 105.8542 },
  { name: 'Đà Nẵng', latitude: 16.0544, longitude: 108.2022 },
  { name: 'TP.HCM', latitude: 10.8231, longitude: 106.6297 },
  { name: 'Huế', latitude: 16.4670, longitude: 107.5909 },
];

const formatDate = (date) => {
  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return `${days[date.getDay()]}, ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

const formatTime = (date) => `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

const setActiveThemeButton = (moodKey) => {
  themeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.mood === moodKey);
  });
};

const updateClock = () => {
  const now = new Date();
  todayDate.textContent = formatDate(now);
  timeLabel.textContent = formatTime(now);
};

const mapWeatherCode = (code) => weatherCodeMap[code] || { icon: '🌤️', label: 'Thời tiết đẹp', mood: 'sun' };

const showLogin = () => {
  loginScreen.classList.remove('hidden');
  dashboard.classList.add('hidden');
  logoutBtn.classList.add('hidden');
};

const showDashboard = () => {
  loginScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');
};

const handleLogin = () => {
  const user = loginUser.value.trim();
  const pass = loginPass.value.trim();
  if (!user) {
    loginHintText.textContent = 'Nhập tên người dùng để đăng nhập.';
    return;
  }
  if (!pass) {
    loginHintText.textContent = 'Nhập mật khẩu để tiếp tục.';
    return;
  }

  localStorage.setItem('weather-glass-user', user);
  showDashboard();
  fetchNearbyCities();
  searchCityWeather('Hà Nội');
};

const handleLogout = () => {
  localStorage.removeItem('weather-glass-user');
  showLogin();
  loginHintText.textContent = 'Nhập tên người dùng và mật khẩu bất kỳ để tiếp tục.';
};

const getCoordinates = async (query) => {
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&country_codes=VN&language=vi&count=5`);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return null;
    }
    return data.results[0];
  } catch {
    return null;
  }
};

const fetchWeather = async (latitude, longitude) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,cloudcover,uv_index,windspeed_10m,surface_pressure&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia%2FHo_Chi_Minh&forecast_days=7`;
  const response = await fetch(url);
  return response.json();
};

const getCurrentIndex = (weather) => weather.hourly.time.findIndex((time) => time === weather.current_weather.time);

const renderHourly = (hours) => {
  hourlyScroll.innerHTML = '';
  hours.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = `hourly-card ${index === 0 ? 'active' : ''}`;
    card.innerHTML = `
      <span>${item.time}</span>
      <div class="hour-icon">${item.icon}</div>
      <div class="hour-temp">${item.temp}</div>
    `;
    hourlyScroll.appendChild(card);
  });
};

const renderWeekly = (days) => {
  weeklyList.innerHTML = '';
  days.forEach((item) => {
    const row = document.createElement('article');
    row.className = 'weekly-row';
    const progressWidth = Math.max(15, Math.min(100, (item.max / 40) * 100));
    row.innerHTML = `
      <div class="weekday">${item.day}</div>
      <div class="weekly-icon">${item.icon}</div>
      <div class="temp-bar">
        <div class="temp-progress"><span style="width: ${progressWidth}%"></span></div>
        <div class="temp-range">${item.min}° / ${item.max}°</div>
      </div>
    `;
    weeklyList.appendChild(row);
  });
};

const renderNearbyCities = (cities) => {
  nearbyCities.innerHTML = '';
  cities.forEach((city) => {
    const card = document.createElement('article');
    card.className = 'regional-card glass-panel';
    card.innerHTML = `
      <h3>${city.name}</h3>
      <div class="regional-temp">${Math.round(city.temperature)}°C</div>
      <div class="regional-detail">${city.condition}</div>
    `;
    nearbyCities.appendChild(card);
  });
};

const fetchNearbyCities = async () => {
  const cityData = await Promise.all(
    favoriteCities.map(async (city) => {
      const weather = await fetchWeather(city.latitude, city.longitude);
      const info = mapWeatherCode(weather.current_weather.weathercode);
      return {
        name: city.name,
        temperature: weather.current_weather.temperature,
        condition: info.label,
      };
    }),
  );
  renderNearbyCities(cityData);
};

const showMessage = (text) => {
  searchHint.textContent = text;
};

const updateWeatherUI = (weather, location) => {
  const current = weather.current_weather;
  const index = Math.max(0, getCurrentIndex(weather));
  const weatherInfo = mapWeatherCode(current.weathercode);

  cityName.textContent = location.name || 'Không xác định';
  conditionText.textContent = weatherInfo.label;
  temperature.textContent = `${Math.round(current.temperature)}°C`;
  weatherIcon.textContent = weatherInfo.icon;
  humidityValue.textContent = weather.hourly.relativehumidity_2m ? `${Math.round(weather.hourly.relativehumidity_2m[index])}%` : '—';
  feelsValue.textContent = weather.hourly.apparent_temperature ? `${Math.round(weather.hourly.apparent_temperature[index])}°C` : '—';
  windValue.textContent = weather.hourly.windspeed_10m ? `${Math.round(weather.hourly.windspeed_10m[index])} km/h` : `${Math.round(current.windspeed)} km/h`;
  cloudValue.textContent = weather.hourly.cloudcover ? `${Math.round(weather.hourly.cloudcover[index])}%` : '—';
  uvValue.textContent = weather.hourly.uv_index ? `${Math.round(weather.hourly.uv_index[index])}` : '—';
  pressureValue.textContent = weather.hourly.surface_pressure ? `${Math.round(weather.hourly.surface_pressure[index])} hPa` : '—';
  setActiveThemeButton(weatherInfo.mood);
  document.body.className = weatherInfo.mood;

  const currentTime = new Date();
  todayDate.textContent = formatDate(currentTime);
  timeLabel.textContent = formatTime(currentTime);

  const hourlyItems = [];
  const labels = weather.hourly.time.map((time) => new Date(time));
  for (let i = index; i < labels.length && hourlyItems.length < 6; i += 1) {
    const date = labels[i];
    const info = mapWeatherCode(weather.hourly.weathercode[i]);
    hourlyItems.push({
      time: `${String(date.getHours()).padStart(2, '0')}:00`,
      icon: info.icon,
      temp: `${Math.round(weather.hourly.temperature_2m[i])}°`,
    });
  }
  renderHourly(hourlyItems);

  const weeklyItems = weather.daily.time.map((day, dayIndex) => {
    const date = new Date(day);
    const info = mapWeatherCode(weather.daily.weathercode[dayIndex]);
    return {
      day: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][date.getDay()],
      icon: info.icon,
      min: Math.round(weather.daily.temperature_2m_min[dayIndex]),
      max: Math.round(weather.daily.temperature_2m_max[dayIndex]),
    };
  });
  renderWeekly(weeklyItems);
};

const refreshWeather = async () => {
  if (!currentLocation) return;
  const weather = await fetchWeather(currentLocation.latitude, currentLocation.longitude);
  if (weather && weather.current_weather) {
    updateWeatherUI(weather, currentLocation);
    showMessage(`Cập nhật dữ liệu cho ${currentLocation.name} vào ${formatTime(new Date())}`);
  } else {
    showMessage('Không thể lấy dữ liệu thời tiết. Vui lòng thử lại.');
  }
};

const searchCityWeather = async (query) => {
  if (!query.trim()) {
    showMessage('Nhập tên thành phố để tìm kiếm.');
    return;
  }
  showMessage('Đang tìm kiếm thành phố...');
  const location = await getCoordinates(query);
  if (!location) {
    showMessage('Không tìm thấy thành phố. Nhập lại tên khác.');
    return;
  }
  currentLocation = location;
  await refreshWeather();
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
  refreshTimer = setInterval(refreshWeather, 10 * 60 * 1000);
};

const locateUserWeather = () => {
  if (!navigator.geolocation) {
    showMessage('Trình duyệt không hỗ trợ định vị.');
    return;
  }
  showMessage('Đang xác định vị trí...');
  navigator.geolocation.getCurrentPosition(async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const weather = await fetchWeather(latitude, longitude);
    if (weather && weather.current_weather) {
      currentLocation = { name: 'Vị trí của bạn', latitude, longitude };
      updateWeatherUI(weather, currentLocation);
      showMessage('Đã cập nhật thời tiết theo vị trí hiện tại.');
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
      refreshTimer = setInterval(refreshWeather, 10 * 60 * 1000);
    } else {
      showMessage('Không thể lấy vị trí thời tiết.');
    }
  }, () => {
    showMessage('Không thể xác định vị trí. Hãy bật GPS hoặc cho phép quyền truy cập.');
  });
};

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchCityWeather(searchInput.value);
  }
});

locateBtn.addEventListener('click', () => {
  locateUserWeather();
});

loginBtn.addEventListener('click', () => {
  handleLogin();
});

logoutBtn.addEventListener('click', () => {
  handleLogout();
});

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const mood = button.dataset.mood;
    setActiveThemeButton(mood);
    document.body.className = mood;
  });
});

window.addEventListener('load', () => {
  updateClock();
  setInterval(updateClock, 1000);
  const savedUser = localStorage.getItem('weather-glass-user');
  if (savedUser) {
    showDashboard();
    fetchNearbyCities();
    searchCityWeather('Hà Nội');
  } else {
    showLogin();
  }
});
