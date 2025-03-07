// router.ts
function patternMatcher(handlers) {
  const typedHandlers = handlers;
  const routes = Object.keys(typedHandlers).sort((a, b) => {
    if (!a.includes("*") && !a.includes(":"))
      return -1;
    if (!b.includes("*") && !b.includes(":"))
      return 1;
    if (a.includes(":") && !b.includes(":"))
      return -1;
    if (!a.includes(":") && b.includes(":"))
      return 1;
    if (a.includes("*") && !b.includes("*"))
      return 1;
    if (!a.includes("*") && b.includes("*"))
      return -1;
    return b.length - a.length;
  });
  return {
    match(path) {
      for (const route of routes) {
        const params = matchRoute(route, path);
        if (params !== null) {
          const result = typedHandlers[route](params);
          return { pattern: route, result };
        }
      }
      return null;
    }
  };
}
function matchRoute(pattern, path) {
  const patternParts = pattern.split("/");
  const pathParts = path.split("/");
  if (pattern === "/*")
    return {};
  if (patternParts.length !== pathParts.length) {
    const lastPattern = patternParts[patternParts.length - 1];
    if (lastPattern === "*" && pathParts.length >= patternParts.length - 1) {
      return {};
    }
    return null;
  }
  const params = {};
  for (let i = 0;i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];
    if (patternPart === "*")
      return params;
    if (patternPart.startsWith(":")) {
      const paramName = patternPart.slice(1);
      params[paramName] = pathPart;
      continue;
    }
    if (patternPart !== pathPart)
      return null;
  }
  return params;
}
var matcher;
var handleRoute = (path) => {
  if (!matcher)
    return;
  const m = matcher.match(path);
  if (!m)
    console.error("No route found for", path);
  console.log("match result", m);
};
window.addEventListener("popstate", () => {
  handleRoute(window.location.pathname);
});
var routes = (routes2) => {
  matcher = patternMatcher(routes2);
  handleRoute(window.location.pathname);
};
var navigate = (path) => {
  window.history.pushState({}, "", path);
  handleRoute(path);
};

// chat.ts
var chatView = (root) => {
  root.innerHTML = "";
  const container = document.createElement("div");
  container.className = "container";
  const header = document.createElement("div");
  header.className = "header";
  header.style.display = "flex";
  const headerText = document.createElement("h1");
  headerText.innerHTML = "\uD83D\uDC36 PuppyChat";
  const musicButton = document.createElement("button");
  musicButton.innerHTML = "\uD83C\uDFB6";
  musicButton.style.height = "40px";
  musicButton.style.width = "40px";
  musicButton.onclick = () => {
    navigate("/music");
  };
  header.append(headerText, musicButton);
  container.appendChild(header);
  const messagesBox = document.createElement("div");
  messagesBox.className = "chat-box";
  container.appendChild(messagesBox);
  const inputBox = document.createElement("div");
  inputBox.className = "input-box";
  const chatInput = document.createElement("input");
  chatInput.style.borderTopRightRadius = "0";
  chatInput.style.borderBottomRightRadius = "0";
  const button = document.createElement("button");
  button.innerHTML = "Send";
  button.style.borderTopLeftRadius = "0";
  button.style.borderBottomLeftRadius = "0";
  inputBox.append(chatInput, button);
  container.appendChild(inputBox);
  root.appendChild(container);
};

// icons.ts
var chatIcon = `<svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.998 511.998" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M418.643,21.318H221.353c-51.547,0-93.355,41.807-93.355,93.355v13.312H93.355C41.807,127.984,0,169.792,0,221.339 v88.683c0,55.289,26.377,95.296,76.864,95.296h8.469v64c0,22.932,31.239,29.714,40.747,8.845 c7.211-15.827,19.353-30.833,35.143-44.611c9.913-8.65,20.621-16.265,31.321-22.725c3.835-2.315,7.11-4.157,9.649-5.509h75.14 c52.857,0,106.667-44.46,106.667-95.296v-11.371h51.134c50.487,0,76.864-40.007,76.864-95.296v-88.683 C511.998,63.119,470.206,21.318,418.643,21.318z M277.333,362.651H197.12c-3.133,0-6.227,0.69-9.063,2.021 c-3.758,1.764-9.867,4.982-17.563,9.628c-12.7,7.667-25.394,16.695-37.322,27.103c-1.756,1.533-3.481,3.081-5.172,4.647v-22.065 c0-11.782-9.551-21.333-21.333-21.333H76.864c-22.276,0-34.197-18.081-34.197-52.629v-88.683 c0-27.983,22.705-50.688,50.688-50.688h55.977h141.312c1.198,0,2.383,0.057,3.56,0.138c21.165,1.471,38.766,15.936,44.849,35.478 c1.481,4.761,2.279,9.823,2.279,15.072v55.979c0,0.015,0.002,0.029,0.002,0.044v32.661 C341.333,335.302,308.233,362.651,277.333,362.651z M469.331,203.355c0,34.548-11.921,52.629-34.197,52.629H384v-34.645 c0-9.74-1.495-19.131-4.264-27.959c-11.505-36.697-45.057-63.637-85.143-65.306c-1.31-0.055-2.625-0.089-3.948-0.089h-0.002 H170.665v-13.312c0-27.983,22.705-50.688,50.688-50.688h197.291c27.996,0,50.688,22.696,50.688,50.688V203.355z"></path> <path d="M192,234.651c-11.776,0-21.333,9.557-21.333,21.333c0,11.776,9.557,21.333,21.333,21.333s21.333-9.557,21.333-21.333 C213.333,244.208,203.776,234.651,192,234.651z"></path> <path d="M277.333,234.651c-11.776,0-21.333,9.557-21.333,21.333c0,11.776,9.557,21.333,21.333,21.333s21.333-9.557,21.333-21.333 C298.667,244.208,289.109,234.651,277.333,234.651z"></path> <path d="M106.667,234.651c-11.776,0-21.333,9.557-21.333,21.333c0,11.776,9.557,21.333,21.333,21.333S128,267.76,128,255.984 C128,244.208,118.443,234.651,106.667,234.651z"></path> </g> </g> </g> </g></svg>`;
var playIcon = `
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
		stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<polygon points="5 3 19 12 5 21 5 3"></polygon>
	</svg>
`;
var pauseIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" 
	stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
	<rect x="6" y="4" width="4" height="16"></rect>
	<rect x="14" y="4" width="4" height="16"></rect>
</svg>
`;

// state.ts
class NotifyValue {
  value;
  listeners = [];
  constructor(value) {
    this.value = value;
  }
  get() {
    return this.value;
  }
  set(value) {
    this.value = value;
    this.listeners.forEach((listener) => listener(value));
  }
  onChange(listener) {
    this.listeners.push(listener);
  }
}
var state = {
  selectedSong: new NotifyValue(null),
  playing: new NotifyValue(false),
  currentAudio: new NotifyValue(null)
};

// music.ts
var musicListItem = (args) => {
  const musicItem = document.createElement("div");
  musicItem.style.backgroundColor = "white";
  musicItem.style.display = "flex";
  musicItem.style.justifyContent = "space-between";
  musicItem.style.padding = "10px";
  musicItem.style.borderBottom = "1px solid #ccc";
  musicItem.style.cursor = "pointer";
  state.selectedSong.onChange((selectedSong) => {
    if (selectedSong === args.title) {
      musicItem.style.backgroundColor = "lightgrey";
    } else {
      musicItem.style.backgroundColor = "white";
    }
  });
  musicItem.onclick = () => {
    let audio = state.currentAudio.get();
    if (audio) {
      audio.pause();
    }
    state.playing.set(false);
    state.selectedSong.set(args.title);
    const newAudio = new Audio(`./api/music/${args.id}`);
    newAudio.preload = "auto";
    newAudio.onloadedmetadata = () => {
      state.currentAudio.set(newAudio);
    };
  };
  const musicTitle = document.createElement("div");
  musicTitle.textContent = args.title;
  const musicDuration = document.createElement("div");
  musicDuration.textContent = args.duration + "s";
  musicItem.append(musicTitle, musicDuration);
  return musicItem;
};
var timelineControls = () => {
  const timelineContainer = document.createElement("div");
  timelineContainer.style.position = "fixed";
  timelineContainer.style.bottom = "40px";
  timelineContainer.style.left = "0";
  timelineContainer.style.right = "0";
  timelineContainer.style.padding = "10px";
  timelineContainer.style.backgroundColor = "#fff";
  timelineContainer.style.borderTop = "1px solid #ccc";
  timelineContainer.style.display = "flex";
  timelineContainer.style.alignItems = "center";
  const currentTime = document.createElement("span");
  currentTime.id = "currentTime";
  currentTime.textContent = "0:00";
  currentTime.style.marginRight = "10px";
  const progressSlider = document.createElement("input");
  progressSlider.id = "progressSlider";
  progressSlider.type = "range";
  progressSlider.min = "0";
  progressSlider.max = "100";
  progressSlider.value = "0";
  progressSlider.style.flexGrow = "1";
  const totalTime = document.createElement("span");
  totalTime.id = "totalTime";
  totalTime.textContent = "";
  totalTime.style.marginLeft = "10px";
  progressSlider.oninput = () => {
    const audio = state.currentAudio.get();
    if (!audio || !audio.duration)
      return;
    const newTime = audio.duration * (Number(progressSlider.value) / 100);
    console.log("newTime", newTime);
    audio.currentTime = newTime;
    audio.play();
  };
  state.currentAudio.onChange((audio) => {
    if (!audio)
      return;
    currentTime.textContent = "0:00";
    progressSlider.value = "0";
    if (!isNaN(audio.duration)) {
      totalTime.textContent = `${Math.floor(audio.duration / 60)}:${Math.floor(audio.duration % 60)}`;
    }
    audio.ontimeupdate = () => {
      currentTime.textContent = `${Math.floor(audio.currentTime / 60)}:${Math.floor(audio.currentTime % 60)}`;
      progressSlider.value = audio.currentTime / audio.duration * 100 + "";
    };
  });
  timelineContainer.append(currentTime, progressSlider, totalTime);
  return timelineContainer;
};
var playControls = () => {
  const controlsContainer = document.createElement("div");
  controlsContainer.style.position = "fixed";
  controlsContainer.style.bottom = "0";
  controlsContainer.style.left = "0";
  controlsContainer.style.right = "0";
  controlsContainer.style.backgroundColor = "#fff";
  controlsContainer.style.borderTop = "1px solid #ccc";
  controlsContainer.style.display = "flex";
  controlsContainer.style.justifyContent = "space-around";
  controlsContainer.style.alignItems = "center";
  controlsContainer.style.padding = "10px";
  const currentSong = document.createElement("span");
  currentSong.textContent = "";
  const playPauseButton = document.createElement("button");
  playPauseButton.innerHTML = playIcon;
  playPauseButton.onclick = () => {
    state.playing.set(!state.playing.get());
    const audio = state.currentAudio.get();
    if (!audio)
      return;
    console.log("audio.currentTime", audio.currentTime);
    if (audio.paused)
      audio.play();
    else
      audio.pause();
  };
  state.playing.onChange((playing) => {
    console.log("playing", playing);
    if (playing) {
      playPauseButton.innerHTML = pauseIcon;
    } else {
      playPauseButton.innerHTML = playIcon;
    }
  });
  controlsContainer.append(currentSong, playPauseButton);
  return controlsContainer;
};
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId)
      clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
var musicView = async (root) => {
  root.innerHTML = "";
  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.backgroundColor = "white";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.transition = "transform 0.3s ease";
  const chatButton = document.createElement("button");
  chatButton.innerHTML = chatIcon;
  chatButton.style.height = "40px";
  chatButton.style.width = "40px";
  chatButton.onclick = () => {
    navigate("/");
  };
  const musicList = document.createElement("div");
  const searchInput = document.createElement("input");
  searchInput.style.borderRadius = "10px";
  searchInput.style.padding = "10px";
  searchInput.style.border = "1px solid #ccc";
  searchInput.placeholder = "Search for music";
  searchInput.style.flexGrow = "1";
  searchInput.oninput = debounce(async () => {
    musicList.innerHTML = "";
    const results = await fetch("/api/search?query=" + searchInput.value).then((res) => res.json());
    for (const result of results) {
      musicList.appendChild(musicListItem({
        id: result.id,
        title: result.title,
        duration: 0
      }));
    }
  }, 300);
  const inputContainer = document.createElement("div");
  inputContainer.style.display = "flex";
  inputContainer.style.flexDirection = "row";
  inputContainer.style.gap = "10px";
  inputContainer.style.margin = "5px";
  inputContainer.append(chatButton, searchInput);
  const musicListContainer = document.createElement("div");
  musicListContainer.style.flexGrow = "1";
  musicListContainer.style.overflowY = "auto";
  musicListContainer.appendChild(musicList);
  container.append(inputContainer, musicListContainer);
  root.appendChild(container);
  root.appendChild(timelineControls());
  root.appendChild(playControls());
};

// app.ts
window.onload = () => {
  const body = document.body;
  if (!body)
    return;
  routes({
    "/music": () => musicView(body),
    "/": () => chatView(body)
  });
};
