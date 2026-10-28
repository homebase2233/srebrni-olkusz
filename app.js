(() => {
  const data = window.ACADEMY_CONTENT || { news: [], events: [], teams: [] };
  const views = [...document.querySelectorAll(".view")];
  const navItems = [...document.querySelectorAll("[data-nav]")];
  const polishMonths = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"];
  const today = new Date();
  let month = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedDay = dateKey(today);

  function dateKey(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
  function safe(text) { return String(text ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])); }
  function showView(name) {
    const target = document.getElementById(`view-${name}`) ? name : "start";
    views.forEach(view => { const active = view.id === `view-${target}`; view.hidden = !active; view.classList.toggle("active", active); });
    navItems.forEach(item => item.classList.toggle("active", item.dataset.nav === target));
    history.replaceState(null, "", `#${target}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (target === "kalendarz") renderCalendar();
  }
  navItems.forEach(item => item.addEventListener("click", event => { event.preventDefault(); showView(item.dataset.nav); }));
  window.addEventListener("hashchange", () => showView(location.hash.slice(1)));

  function newsMarkup(items) {
    if (!items.length) return '<div class="empty-state"><span class="empty-icon">✳</span><div><h3>Wkrótce coś się wydarzy</h3><p>Aktualności pojawią się tutaj po opublikowaniu przez akademię.</p></div></div>';
    return items.map(item => {
      const date = item.day || item.month
        ? `<div class="news-date"><span>${safe(item.day || "")}</span><small>${safe(item.month || "")}</small></div>`
        : '<div class="news-date news-no-date"><small>AKTUALNOŚĆ</small></div>';
      const story = Array.isArray(item.body) && item.body.length
        ? `<details class="news-details"><summary>Czytaj relację</summary><div>${item.body.map(paragraph => `<p>${safe(paragraph)}</p>`).join("")}</div></details>`
        : "";
      return `<article class="news-item">${date}<div class="news-copy"><span class="tag">${safe(item.category || "AKADEMIA")}</span><h3>${safe(item.title)}</h3><p>${safe(item.description)}</p>${story}</div><span class="news-arrow" aria-hidden="true">↗</span></article>`;
    }).join("");
  }
  document.getElementById("newsList").innerHTML = newsMarkup(data.news.slice(0, 3));
  document.getElementById("allNewsList").innerHTML = newsMarkup(data.news);

  document.getElementById("teamList").innerHTML = data.teams.map((team, index) => `<article class="team-card ${safe(team.accent)}"><div class="team-card-top"><span class="team-index">0${index + 1} / DRUŻYNA</span><span class="team-arrow">↗</span></div><div class="team-years">${safe(team.label)}</div><div class="team-card-bottom"><h2>${safe(team.title)}</h2><p>${safe(team.description)}</p></div></article>`).join("");
  const teamFilter = document.getElementById("teamFilter");
  data.teams.forEach(team => teamFilter.insertAdjacentHTML("beforeend", `<option value="${safe(team.id)}">${safe(team.title)}</option>`));

  function renderCalendar() {
    document.getElementById("monthLabel").textContent = `${polishMonths[month.getMonth()]} ${month.getFullYear()}`;
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const eventsByDate = data.events.reduce((map, event) => { (map[event.date] ||= []).push(event); return map; }, {});
    let html = "";
    for (let i = 0; i < offset; i++) html += '<span class="day-empty" aria-hidden="true"></span>';
    for (let number = 1; number <= daysInMonth; number++) {
      const date = new Date(month.getFullYear(), month.getMonth(), number);
      const key = dateKey(date);
      const events = eventsByDate[key] || [];
      const classes = ["calendar-day", key === dateKey(today) ? "today" : "", key === selectedDay ? "selected" : ""].filter(Boolean).join(" ");
      const dots = events.slice(0, 2).map(event => `<i class="${event.type === "match" ? "match-dot" : "training-dot"}"></i>`).join("");
      html += `<button class="${classes}" data-day="${key}" aria-label="${number} ${polishMonths[month.getMonth()]}${events.length ? `, ${events.length} wydarzeń` : ""}"><span>${number}</span><span class="day-dots">${dots}</span></button>`;
    }
    document.getElementById("calendarDays").innerHTML = html;
    document.querySelectorAll("[data-day]").forEach(button => button.addEventListener("click", () => { selectedDay = button.dataset.day; renderCalendar(); renderEvents(); }));
    renderEvents();
  }
  function renderEvents() {
    const date = new Date(`${selectedDay}T12:00:00`);
    document.getElementById("selectedDateLabel").textContent = `${date.getDate()} ${polishMonths[date.getMonth()].toUpperCase()} ${date.getFullYear()}`;
    const chosen = data.events.filter(event => event.date === selectedDay && (teamFilter.value === "all" || event.teamId === teamFilter.value));
    const target = document.getElementById("eventList");
    if (!chosen.length) {
      target.innerHTML = '<div class="empty-state compact"><span class="empty-icon">◷</span><div><h3>Brak zaplanowanych wydarzeń</h3><p>Sprawdź harmonogram u trenera lub wróć później.</p></div></div>';
      return;
    }
    target.innerHTML = chosen.map(event => {
      const team = data.teams.find(item => item.id === event.teamId);
      const type = event.type === "match" ? "Mecz / turniej" : "Trening";
      return `<article class="event-item"><span class="event-type ${event.type === "match" ? "match" : "training"}"></span><div><span class="tag">${type} · ${safe(team?.title || "Akademia")}</span><h3>${safe(event.title)}</h3><p>${safe(event.time || "")}${event.location ? ` · ${safe(event.location)}` : ""}</p></div></article>`;
    }).join("");
  }
  teamFilter.addEventListener("change", renderEvents);
  document.getElementById("prevMonth").addEventListener("click", () => { month.setMonth(month.getMonth() - 1); renderCalendar(); });
  document.getElementById("nextMonth").addEventListener("click", () => { month.setMonth(month.getMonth() + 1); renderCalendar(); });
  document.getElementById("year").textContent = today.getFullYear();
  showView(location.hash.slice(1) || "start");

  let installPrompt;
  const installButton = document.getElementById("installButton");
  window.addEventListener("beforeinstallprompt", event => { event.preventDefault(); installPrompt = event; installButton.hidden = false; });
  installButton.addEventListener("click", async () => { if (!installPrompt) return; installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; installButton.hidden = true; });
  window.addEventListener("appinstalled", () => { installButton.hidden = true; });

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }
})();

