const PASSCODE = "2026";
const AUTH_KEY = "trip-portal:auth";
const PINNED_TRIP_KEY = "trip-portal:pinned-trip-id";
const DB_NAME = "family-trip-portal";
const DB_VERSION = 1;

const FALLBACK_TRIPS = [
  {
    id: "2026-ny",
    title: "2026 暑假 我們在紐約！",
    subtitle: "Taipei, Seoul, New York, Miami, Bahamas",
    destination: "New York City",
    startDate: "2026-07-07",
    endDate: "2026-07-29",
    people: 8,
    status: "planned",
    banner: "assets/images/ny_itinerary_banner_2026.png",
    logo: "assets/images/family_logo_2026.png",
    data: "data/trips/2026-ny.json"
  }
];

const FALLBACK_TRIP_DETAIL = null;

const state = {
  trips: [],
  tripDetails: new Map(),
  activeTripId: null,
  nearestTripId: null,
  activeDayId: null,
  db: null,
  dayScrollHandler: null,
  dayObserver: null,
  isCalendarJumping: false,
  calendarJumpTimer: null,
  calendarMode: "month",
  bannerCalendarScrollHandler: null
};

const iconMap = {
  flight: "assets/icons/flight.svg",
  ticket: "assets/icons/ticket.svg",
  hotel: "assets/icons/hotel.svg",
  "ny-skyline": "assets/icons/ny-skyline.svg",
  camera: "assets/icons/camera.svg",
  "statue-liberty": "assets/icons/statue-liberty.svg",
  cruise: "assets/icons/cruise.svg",
  baseball: "assets/icons/baseball.svg",
  subway: "assets/icons/subway.svg",
  gps: "assets/icons/gps.svg",
  "map-pin": "assets/icons/map-pin.svg"
};

const calendarIconMap = {
  airplane: "assets/icons/calendar/airplane.svg",
  boat: "assets/icons/calendar/boat.svg",
  bus: "assets/icons/calendar/bus.svg",
  train: "assets/icons/calendar/train.svg",
  bike: "assets/icons/calendar/bike.svg",
  baseball: "assets/icons/calendar/baseball.svg",
  walk: "assets/icons/calendar/walk.svg",
  beach: "assets/icons/calendar/beach.svg",
  food: "assets/icons/calendar/food.svg"
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  bindLogin();
  bindTopbar();
  bindAttachmentModal();
  state.db = await openPhotoDb();
  if (localStorage.getItem(AUTH_KEY) === "ok") {
    await enterApp();
  }
}

function bindLogin() {
  const form = document.querySelector("#login-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.querySelector("#passcode");
    const error = document.querySelector("#login-error");
    if (input.value.trim() === PASSCODE) {
      localStorage.setItem(AUTH_KEY, "ok");
      error.textContent = "";
      await enterApp();
    } else {
      error.textContent = "Passcode 不正確。提示：第一版預設為 2026。";
    }
  });
}

function bindTopbar() {
  document.querySelector("#menu-button").addEventListener("click", () => showPortal());
  document.querySelector("#calendar-mode-button").addEventListener("click", () => {
    if (currentCalendarMode() === "strip") {
      scrollToTripInitialView();
    }
  });
  document.querySelector("#logout-button").addEventListener("click", () => {
    localStorage.removeItem(AUTH_KEY);
    document.querySelector("#main-app").classList.add("hidden");
    document.querySelector("#login-screen").classList.remove("hidden");
  });
}

function bindAttachmentModal() {
  document.addEventListener("click", (event) => {
    const sourceButton = event.target.closest("[data-preview-source]");
    if (sourceButton) {
      openAttachmentPreview(sourceButton.dataset.previewSource, sourceButton.textContent.trim() || "附件預覽");
      return;
    }
    const image = event.target.closest("[data-preview-image]");
    if (image) {
      openAttachmentPreview(image.dataset.previewImage, image.dataset.previewTitle || image.alt || "照片預覽");
    }
  });

  document.querySelector("#attachment-close").addEventListener("click", closeAttachmentPreview);
  document.querySelector("#attachment-modal").addEventListener("click", (event) => {
    if (event.target.id === "attachment-modal") closeAttachmentPreview();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAttachmentPreview();
  });
}

function openAttachmentPreview(source, title = "附件預覽") {
  if (!source) return;
  const modal = document.querySelector("#attachment-modal");
  const titleEl = document.querySelector("#attachment-title");
  const body = document.querySelector("#attachment-body");
  const lower = source.split("?")[0].toLowerCase();

  titleEl.textContent = title;
  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(lower) || source.startsWith("data:image/")) {
    body.innerHTML = `<img src="${escapeAttr(source)}" alt="${escapeAttr(title)}">`;
  } else if (/\.pdf$/i.test(lower)) {
    body.innerHTML = `<iframe src="${escapeAttr(source)}" title="${escapeAttr(title)}"></iframe>`;
  } else {
    body.innerHTML = `
      <div class="attachment-fallback">
        <a class="source-link" href="${escapeAttr(source)}" target="_blank" rel="noopener noreferrer">開啟附件</a>
      </div>
    `;
  }

  modal.hidden = false;
  document.body.classList.add("modal-open");
  document.querySelector("#attachment-close").focus();
}

function closeAttachmentPreview() {
  const modal = document.querySelector("#attachment-modal");
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.querySelector("#attachment-body").innerHTML = "";
  document.body.classList.remove("modal-open");
}

async function enterApp() {
  document.querySelector("#login-screen").classList.add("hidden");
  document.querySelector("#main-app").classList.remove("hidden");
  state.trips = await loadTrips();
  state.nearestTripId = chooseNearestTrip(state.trips)?.id;
  const pinnedTrip = localStorage.getItem(PINNED_TRIP_KEY);
  await showTrip(pinnedTrip || state.nearestTripId);
}

async function loadTrips() {
  try {
    const response = await fetch("data/trips.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Cannot load trips.json");
    return await response.json();
  } catch {
    return FALLBACK_TRIPS;
  }
}

async function loadTripDetail(trip) {
  if (state.tripDetails.has(trip.id)) return state.tripDetails.get(trip.id);
  try {
    const response = await fetch(trip.data, { cache: "no-store" });
    if (!response.ok) throw new Error("Cannot load trip detail");
    const detail = await response.json();
    state.tripDetails.set(trip.id, detail);
    return detail;
  } catch {
    if (FALLBACK_TRIP_DETAIL) return FALLBACK_TRIP_DETAIL;
    throw new Error("請透過本機伺服器開啟，或確認 data/trips/2026-ny.json 存在。");
  }
}

function chooseNearestTrip(trips) {
  const today = stripTime(new Date());
  const enriched = trips.map((trip) => ({
    ...trip,
    start: parseDate(trip.startDate),
    end: parseDate(trip.endDate)
  }));
  const active = enriched.find((trip) => today >= trip.start && today <= trip.end);
  if (active) return active;
  const upcoming = enriched
    .filter((trip) => trip.start > today)
    .sort((a, b) => a.start - b.start)[0];
  if (upcoming) return upcoming;
  return enriched.sort((a, b) => b.end - a.end)[0];
}

function tripStatus(trip) {
  const today = stripTime(new Date());
  const start = parseDate(trip.startDate);
  const end = parseDate(trip.endDate);
  if (today >= start && today <= end) return "旅程中";
  if (today < start) return "規劃中";
  return "已完成";
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function showPortal() {
  unbindBannerCalendarMode();
  document.querySelector("#calendar-mode-button").classList.add("hidden");
  document.querySelector("#current-trip-button").classList.remove("hidden");
  updateTopbarTripTitle("旅遊日誌");
  document.querySelector("#trip-view").classList.add("hidden");
  document.querySelector("#portal-view").classList.remove("hidden");
  renderTripList();
}

async function showTrip(tripId) {
  const trip = state.trips.find((item) => item.id === tripId) || state.trips[0];
  if (!trip) return;
  state.activeTripId = trip.id;
  const detail = await loadTripDetail(trip);
  const todayDay = findTodayDay(detail);
  state.activeDayId = (todayDay || chooseInitialDay(detail)).id;
  state.calendarMode = "month";
  document.querySelector("#current-trip-button").classList.remove("hidden");
  updateTopbarTripTitle(detail.title);
  updateCalendarModeButton(currentCalendarMode());
  document.querySelector("#calendar-mode-button").classList.remove("hidden");
  document.querySelector("#portal-view").classList.add("hidden");
  document.querySelector("#trip-view").classList.remove("hidden");
  renderTripHero(detail);
  renderTripCalendar(detail);
  await renderTripSections(detail);
  bindDayScrollSpy(detail.days);
  bindBannerCalendarMode(detail);
  setActiveDay(state.activeDayId, { center: true });
  if (todayDay) {
    window.setTimeout(() => {
      jumpToDayFromCalendar(detail, todayDay.id, currentCalendarMode());
    }, 180);
  } else {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}

function updateTopbarTripTitle(title) {
  document.querySelector("#current-trip-button span:last-child").textContent = title;
}

function renderTripList() {
  const list = document.querySelector("#trip-list");
  const pinnedTripId = localStorage.getItem(PINNED_TRIP_KEY);
  list.innerHTML = state.trips.map((trip) => {
    const isPinned = trip.id === pinnedTripId;
    return `
      <article class="trip-card">
        <img src="${escapeAttr(trip.banner)}" alt="${escapeAttr(trip.title)}">
        <div class="trip-card-body">
          <p class="eyebrow">${trip.destination}</p>
          <h2>${escapeHtml(trip.title)}</h2>
          <p>${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}</p>
          <div class="hero-actions">
            <button class="primary-button" type="button" data-open-trip="${trip.id}">打開旅程</button>
            ${isPinned
              ? `<button class="ghost-button" type="button" data-unpin-trip="${trip.id}">取消固定</button>`
              : `<button class="ghost-button" type="button" data-pin-trip="${trip.id}">固定此旅程</button>`
            }
          </div>
        </div>
      </article>
    `;
  }).join("");
  list.querySelectorAll("[data-open-trip]").forEach((button) => {
    button.addEventListener("click", () => showTrip(button.dataset.openTrip));
  });
  list.querySelectorAll("[data-pin-trip]").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.setItem(PINNED_TRIP_KEY, button.dataset.pinTrip);
      showTrip(button.dataset.pinTrip);
    });
  });
  list.querySelectorAll("[data-unpin-trip]").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.removeItem(PINNED_TRIP_KEY);
      renderTripList();
      if (button.dataset.unpinTrip === state.activeTripId) {
        showTrip(state.nearestTripId || state.trips[0]?.id);
      }
    });
  });
}

function renderTripHero(trip) {
  document.querySelector("#trip-hero").innerHTML = `
    <button
      class="hero-image hero-info-toggle"
      type="button"
      style="background-image: url('${escapeAttr(trip.banner)}')"
      aria-label="展開旅程資訊"
      aria-expanded="false"
      aria-controls="overview"
    >
      <span class="hero-info-chip">資訊</span>
    </button>
  `;
  document.querySelector(".hero-info-toggle").addEventListener("click", toggleTripInfo);
}

function toggleTripInfo() {
  const overview = document.querySelector("#overview");
  const button = document.querySelector(".hero-info-toggle");
  const chip = button?.querySelector(".hero-info-chip");
  if (!overview || !button || !chip) return;
  const nextExpanded = overview.hidden;
  overview.hidden = !nextExpanded;
  button.setAttribute("aria-expanded", String(nextExpanded));
  button.setAttribute("aria-label", nextExpanded ? "收合旅程資訊" : "展開旅程資訊");
  chip.textContent = nextExpanded ? "收合" : "資訊";
}

function renderTripCalendar(trip) {
  const activeDayId = state.activeDayId || chooseInitialDay(trip).id;
  const calendarMode = currentCalendarMode();
  updateCalendarModeButton(calendarMode);
  const calendar = document.querySelector("#trip-calendar");
  calendar.innerHTML = `
    <div class="${calendarMode === "month" ? "calendar-month" : "calendar-strip"}" aria-label="${calendarMode === "month" ? "月曆快速跳轉" : "每日快速跳轉"}">
      ${calendarMode === "month" ? monthCalendarTemplate(trip.days, activeDayId) : weekStripTemplate(trip.days, activeDayId)}
    </div>
  `;
  calendar.querySelectorAll("[data-jump-day]").forEach((button) => {
    button.addEventListener("click", () => {
      jumpToDayFromCalendar(trip, button.dataset.jumpDay, calendarMode);
    });
  });
  calendar.querySelector("[data-open-day-summary]")?.addEventListener("click", (event) => {
    const dayId = event.currentTarget.dataset.openDaySummary;
    openDayFromMonthSummary(trip, dayId);
  });
}

function jumpToDayFromCalendar(trip, dayId, calendarMode) {
  if (calendarMode === "month") {
    setActiveDay(dayId);
    renderTripCalendar(trip);
    return;
  }
  openDayFromCalendar(dayId, calendarMode);
}

function openDayFromMonthSummary(trip, dayId) {
  setCalendarMode(trip, "strip", { center: false });
  openDayFromCalendar(dayId, "month");
}

function openDayFromCalendar(dayId, previousMode = "strip") {
  state.isCalendarJumping = true;
  window.clearTimeout(state.calendarJumpTimer);
  setActiveDay(dayId, { center: true });
  window.setTimeout(() => {
    setActiveDay(dayId, { center: true });
    scrollToDayCard(dayId);
  }, previousMode === "month" ? 80 : 160);
  state.calendarJumpTimer = window.setTimeout(() => {
    setActiveDay(dayId, { center: true });
    state.isCalendarJumping = false;
  }, 1200);
}

function scrollToDayCard(dayId) {
  const card = document.querySelector(`#${dayId}`);
  if (!card) return;
  const stickyOffset = stickyHeaderOffset();
  const targetTop = card.getBoundingClientRect().top + window.scrollY - stickyOffset;
  window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
}

function scrollToTripInitialView() {
  window.setTimeout(() => {
    const tripView = document.querySelector("#trip-view");
    if (!tripView) return;
    const topbarHeight = document.querySelector(".topbar")?.getBoundingClientRect().height || 0;
    const targetTop = tripView.getBoundingClientRect().top + window.scrollY - topbarHeight - 8;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  }, 40);
}

function stickyHeaderOffset() {
  const topbarHeight = document.querySelector(".topbar")?.getBoundingClientRect().height || 0;
  const calendarHeight = document.querySelector("#trip-calendar")?.getBoundingClientRect().height || 0;
  return topbarHeight + calendarHeight + 14;
}

function currentCalendarMode() {
  return state.calendarMode || "month";
}

function setCalendarMode(trip, calendarMode, options = {}) {
  if (!trip || state.calendarMode === calendarMode) return;
  state.calendarMode = calendarMode;
  renderTripCalendar(trip);
  updateCalendarModeButton(calendarMode);
  setActiveDay(state.activeDayId || chooseInitialDay(trip).id, { center: options.center !== false });
}

function updateCalendarModeButton(calendarMode) {
  const button = document.querySelector("#calendar-mode-button");
  const tripView = document.querySelector("#trip-view");
  const nextLabel = calendarMode === "month" ? "目前為月曆模式" : "目前為行程列模式，點擊返回頁首";
  tripView?.classList.toggle("calendar-month-mode", calendarMode === "month");
  tripView?.classList.toggle("calendar-strip-mode", calendarMode === "strip");
  button.querySelector("span[aria-hidden='true']").innerHTML = calendarMode === "month" ? monthCalendarIcon() : rowCalendarIcon();
  button.setAttribute("aria-label", nextLabel);
  button.setAttribute("title", nextLabel);
}

function monthCalendarIcon() {
  return `
    <svg class="mode-icon" viewBox="0 0 24 24" role="img" aria-label="月曆">
      <rect x="4" y="5" width="16" height="15" rx="3"></rect>
      <path d="M8 3v4M16 3v4M4 10h16"></path>
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01M16 17h.01"></path>
    </svg>
  `;
}

function rowCalendarIcon() {
  return `
    <svg class="mode-icon" viewBox="0 0 24 24" role="img" aria-label="行程列">
      <path d="M5 7h14M5 12h14M5 17h14"></path>
      <path d="M3 7h.01M3 12h.01M3 17h.01"></path>
    </svg>
  `;
}

function weekStripTemplate(days, activeDayId) {
  return days.map((day) => dayJumpTemplate(day, day.id === activeDayId)).join("");
}

function dayJumpTemplate(day, active) {
  return `
    <button class="day-jump ${active ? "active" : ""}" type="button" data-jump-day="${day.id}" aria-label="跳到 Day ${day.day}">
      <span class="day-jump-number">Day ${day.day}</span>
      <span class="day-jump-date">${shortDateWithWeekday(day)}</span>
    </button>
  `;
}

function monthCalendarTemplate(days, activeDayId) {
  const dayByDate = new Map(days.map((day) => [day.date, day]));
  const firstDate = parseDate(days[0].date);
  const lastDate = parseDate(days[days.length - 1].date);
  const range = monthCalendarDateRange(firstDate, lastDate);
  const cursor = new Date(range.start);
  const end = new Date(range.end);
  const cells = [];
  while (cursor <= end) {
    const iso = toIsoDate(cursor);
    const day = dayByDate.get(iso);
    cells.push(calendarCellTemplate(cursor, day, activeDayId));
    cursor.setDate(cursor.getDate() + 1);
  }
  return `
    <div class="calendar-weekdays">
      ${["日", "一", "二", "三", "四", "五", "六"].map((label) => `<span>${label}</span>`).join("")}
    </div>
    <div class="calendar-grid">
      ${cells.join("")}
    </div>
    ${monthDaySummaryTemplate(days.find((day) => day.id === activeDayId) || days[0])}
  `;
}

function monthCalendarDateRange(firstDate, lastDate) {
  const tripStartWeek = startOfWeek(firstDate);
  const tripEndWeek = startOfWeek(lastDate);
  const tripWeekCount = Math.round((tripEndWeek - tripStartWeek) / 604800000) + 1;
  const displayWeekCount = Math.max(4, tripWeekCount);
  const displayStart = new Date(tripStartWeek);
  if (tripWeekCount === 1) displayStart.setDate(displayStart.getDate() - 7);
  const displayEnd = new Date(displayStart);
  displayEnd.setDate(displayEnd.getDate() + displayWeekCount * 7 - 1);
  return { start: displayStart, end: displayEnd };
}

function startOfWeek(date) {
  const result = new Date(date);
  result.setDate(result.getDate() - result.getDay());
  return result;
}

function calendarCellTemplate(date, day, activeDayId) {
  if (!day) {
    return `<div class="calendar-cell muted"><span class="calendar-date">${date.getMonth() + 1}/${date.getDate()}</span></div>`;
  }
  const confirmationClass = isCalendarConfirmedStatus(day.status) ? "confirmed" : "unconfirmed";
  return `
    <button class="calendar-cell has-trip ${confirmationClass} ${day.id === activeDayId ? "active" : ""}" type="button" data-jump-day="${day.id}" aria-label="跳到 Day ${day.day}">
      <span class="calendar-date">${date.getMonth() + 1}/${date.getDate()}</span>
      ${calendarMiniIcon(day)}
    </button>
  `;
}

function calendarMiniIcon(day) {
  const icon = calendarIconMap[day.calendarIcon];
  if (!icon) return "";
  return `<img class="calendar-mini-icon" src="${escapeAttr(icon)}" alt="">`;
}

function monthDaySummaryTemplate(day) {
  const detailLines = monthDaySummaryDetails(day);
  return `
    <button class="month-day-summary" type="button" data-open-day-summary="${day.id}" aria-label="打開 Day ${day.day} 完整行程">
      ${dayStatusBadge(day)}
      <span class="month-day-summary-header">
        <span class="month-day-summary-kicker">Day ${day.day} · ${formatDate(day.date)}（${day.weekday}）</span>
        <strong>${escapeHtml(day.city)}</strong>
      </span>
      <span class="month-day-more" aria-hidden="true">›</span>
      <span class="month-day-summary-details">
        ${detailLines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}
      </span>
    </button>
  `;
}

function monthDaySummaryDetails(day) {
  const lines = [
    day.highlights,
    monthSummaryScheduleText(day),
    day.lodging ? `住宿：${day.lodging}` : "",
    day.cost ? `費用：${day.cost}` : ""
  ].filter(Boolean);
  while (lines.length < 4) lines.push("查看當日完整行程");
  return lines.slice(0, 4);
}

function monthSummaryScheduleText(day) {
  const schedule = Array.isArray(day.schedule) ? day.schedule.filter((item) => item.time || item.title) : [];
  if (schedule.length) {
    const first = schedule[0];
    return `行程：${[first.time, first.title].filter(Boolean).join(" ")}`;
  }
  return day.transport ? `行程：${day.transport}` : "";
}

function dayNumberClass(dayNumber) {
  return `day-number-${((Number(dayNumber) - 1) % 10) + 1}`;
}

function setActiveDayJump(dayId) {
  document.querySelectorAll(".day-jump, .calendar-cell.has-trip").forEach((button) => {
    button.classList.toggle("active", button.dataset.jumpDay === dayId);
  });
}

function setActiveDay(dayId, options = {}) {
  if (!dayId) return;
  state.activeDayId = dayId;
  setActiveDayJump(dayId);
  updateMonthDaySummary(dayId);
  if (options.center) centerDayJump(dayId);
}

function updateMonthDaySummary(dayId) {
  if (currentCalendarMode() !== "month") return;
  const summary = document.querySelector(".month-day-summary");
  if (!summary) return;
  const trip = state.tripDetails.get(state.activeTripId);
  const day = trip?.days.find((item) => item.id === dayId);
  if (!day) return;
  summary.outerHTML = monthDaySummaryTemplate(day);
  document.querySelector("[data-open-day-summary]")?.addEventListener("click", (event) => {
    openDayFromMonthSummary(trip, event.currentTarget.dataset.openDaySummary);
  });
}

function centerDayJump(dayId) {
  const activeButton = document.querySelector(`.day-jump[data-jump-day="${dayId}"]`);
  if (!activeButton) return;
  activeButton.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

function bindBannerCalendarMode(trip) {
  unbindBannerCalendarMode();
  let ticking = false;
  state.bannerCalendarScrollHandler = () => {
    if (state.isCalendarJumping || ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      ticking = false;
      updateCalendarModeFromBanner(trip);
    });
  };
  window.addEventListener("scroll", state.bannerCalendarScrollHandler, { passive: true });
  updateCalendarModeFromBanner(trip);
}

function unbindBannerCalendarMode() {
  if (!state.bannerCalendarScrollHandler) return;
  window.removeEventListener("scroll", state.bannerCalendarScrollHandler);
  state.bannerCalendarScrollHandler = null;
}

function updateCalendarModeFromBanner(trip) {
  const hero = document.querySelector("#trip-hero");
  if (!hero || document.querySelector("#trip-view")?.classList.contains("hidden")) return;
  const topbarHeight = document.querySelector(".topbar")?.getBoundingClientRect().height || 0;
  const heroBottom = hero.getBoundingClientRect().bottom;
  const nextMode = heroBottom > topbarHeight + 8 ? "month" : "strip";
  setCalendarMode(trip, nextMode, { center: nextMode === "strip" });
}

function bindDayScrollSpy(days) {
  if (state.dayScrollHandler) {
    window.removeEventListener("scroll", state.dayScrollHandler);
  }
  if (state.dayObserver) {
    state.dayObserver.disconnect();
  }
  const dayIds = days.map((day) => day.id);
  let ticking = false;
  state.dayScrollHandler = () => {
    if (state.isCalendarJumping || ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      ticking = false;
      updateActiveDayFromScroll(dayIds);
    });
  };
  window.addEventListener("scroll", state.dayScrollHandler, { passive: true });
  state.dayObserver = new IntersectionObserver(() => {
    if (!state.isCalendarJumping) updateActiveDayFromScroll(dayIds);
  }, {
    root: null,
    rootMargin: "-35% 0px -45% 0px",
    threshold: [0, 0.15, 0.35, 0.6]
  });
  dayIds.forEach((dayId) => {
    const card = document.querySelector(`#${dayId}`);
    if (card) state.dayObserver.observe(card);
  });
}

function updateActiveDayFromScroll(dayIds) {
  const focusLine = getReadingFocusLine();
  const visibleDay = dayIds.find((dayId) => {
    const card = document.querySelector(`#${dayId}`);
    if (!card) return false;
    const rect = card.getBoundingClientRect();
    return rect.top <= focusLine && rect.bottom >= focusLine;
  });
  if (visibleDay && visibleDay !== state.activeDayId) {
    setActiveDay(visibleDay, { center: true });
  }
}

function getReadingFocusLine() {
  return Math.max(stickyHeaderOffset() + 66, window.innerHeight * 0.34);
}

function findTodayDay(trip) {
  const today = stripTime(new Date());
  return trip.days.find((day) => {
    const date = parseDate(day.date);
    return date.getTime() === today.getTime();
  });
}

function chooseInitialDay(trip) {
  const today = stripTime(new Date());
  const upcoming = trip.days.find((day) => parseDate(day.date) >= today);
  return upcoming || trip.days[trip.days.length - 1];
}

function isConfirmedStatus(status) {
  return status.includes("已確認") || status.includes("已付款") || status.includes("已訂房");
}

function isCalendarConfirmedStatus(status) {
  return !status.includes("待規劃");
}

function statusClass(status) {
  if (isConfirmedStatus(status)) return "confirmed";
  if (status.includes("待")) return "pending";
  return "partial";
}

function compactCity(city) {
  return String(city).replace("紐約大都會區", "NY Metro").replace("Ocean Cay MSC Marine Reserve", "Ocean Cay");
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function renderTripSections(trip) {
  renderOverview(trip);
  await renderDays(trip);
  renderBookings(trip);
  await renderRecordBook(trip);
  renderPending(trip);
}

function renderOverview(trip) {
  const status = tripStatus(trip);
  const overview = document.querySelector("#overview");
  overview.hidden = true;
  document.querySelector("#overview").innerHTML = `
    <div class="overview-card trip-summary-card">
      <div class="overview-full-text">
        <div class="day-icon"><img src="${iconMap["ny-skyline"]}" alt=""></div>
        <div>
          <p><strong>${escapeHtml(status)} · ${escapeHtml(trip.destination)}</strong></p>
          ${trip.subtitle ? `<p>${escapeHtml(trip.subtitle)}</p>` : ""}
          <p>${escapeHtml(trip.peopleNote || `${trip.people} 人`)}。${modeText(trip)}</p>
          ${overviewFactText(trip)}
          ${peopleGroupsText(trip)}
          <p>使用提醒：第一版資料保存在這台裝置的瀏覽器內；更換裝置後不會自動同步。</p>
        </div>
      </div>
    </div>
  `;
}

function overviewFactText(trip) {
  if (!trip.quickFacts?.length) return "";
  return trip.quickFacts.map((fact) => `<p>${escapeHtml(fact.label)}：${escapeHtml(fact.value)}</p>`).join("");
}

function peopleGroupsText(trip) {
  if (!trip.groups?.length) return "";
  const groups = trip.groups.map((group) => `${escapeHtml(group.label)} ${group.count} 人，${escapeHtml(group.note)}`).join("；");
  return `<p>成員分組：${groups}。</p>`;
}

function peopleGroupsTemplate(trip) {
  if (!trip.groups?.length) return "";
  return `
    <div class="summary-panel">
      <h3>成員分組</h3>
      <ul>
        ${trip.groups.map((group) => `<li>${escapeHtml(group.label)}：${group.count} 人，${escapeHtml(group.note)}</li>`).join("")}
      </ul>
    </div>
  `;
}

function modeText(trip) {
  const status = tripStatus(trip);
  if (status === "旅程中") return "旅程中模式：優先查看今日行程、交通、地址與票券。";
  if (status === "規劃中") return "規劃中模式：優先查看待確認事項、費用與訂單狀態。";
  return "回憶中模式：優先查看照片、心得與旅行紀錄書。";
}

async function renderDays(trip) {
  const container = document.querySelector("#days");
  container.innerHTML = "";
  for (const day of trip.days) {
    const card = document.createElement("article");
    card.className = "day-card";
    card.id = day.id;
    card.innerHTML = dayCardTemplate(trip.id, day);
    container.appendChild(card);
    bindDayCard(trip.id, day, card);
    await hydrateDayCard(trip.id, day, card);
  }
}

function dayCardTemplate(tripId, day) {
  return `
    <div class="day-card-header">
      ${dayStatusBadge(day)}
      <div>
        <div class="day-title-row">
          <h3>${escapeHtml(day.city)}</h3>
        </div>
        <p class="day-date">${formatDate(day.date)}（${day.weekday}）</p>
      </div>
    </div>
    <div class="detail-grid">
      ${detailItem("當日重點", day.highlights, "map-pin")}
      ${scheduleDetailItem(day)}
      ${lodgingDetailItem(day.lodging)}
      ${detailItem("費用", day.cost, "ticket")}
    </div>
    ${sourceLinks(day.sources)}
    <button
      class="day-journal-toggle"
      type="button"
      data-journal-toggle
      aria-label="展開旅行紀錄"
      aria-expanded="false"
      aria-controls="journal-${tripId}-${day.id}"
    >
      <span aria-hidden="true">›</span>
    </button>
    <div id="journal-${tripId}-${day.id}" class="day-journal" hidden>
      <textarea class="note-input" data-note="${tripId}:${day.id}" placeholder="寫下今天的心得、提醒或旅行小故事..."></textarea>
      <label class="photo-upload-label">
        上傳照片
        <input type="file" accept="image/*" multiple data-photo-input="${tripId}:${day.id}">
      </label>
      <div class="photo-strip" data-photo-strip="${tripId}:${day.id}"></div>
    </div>
  `;
}

function dayStatusBadge(day) {
  return `
    <div class="day-status-badge ${dayNumberClass(day.day)} ${statusClass(day.status)}" aria-label="Day ${day.day}，${escapeAttr(day.status)}">
      <span class="day-status-number">${day.day}</span>
      <span class="day-status-text">${shortStatusText(day.status)}</span>
    </div>
  `;
}

function shortStatusText(status) {
  if (status.includes("已確認") || status.includes("已付款") || status.includes("已訂房")) return "已確認";
  if (status.includes("部分")) return "部分";
  if (status.includes("待規劃")) return "待規劃";
  if (status.includes("待")) return "待確認";
  return status;
}

function detailItem(label, value, iconKey = "map-pin") {
  return `
    <div class="detail-item">
      ${detailLabel(label, iconKey)}
      <span>${escapeHtml(value || "待確認")}</span>
    </div>
  `;
}

function detailLabel(label, iconKey) {
  return `
    <span class="detail-label">
      <img src="${iconMap[iconKey] || iconMap["map-pin"]}" alt="">
      <span>${escapeHtml(label)}</span>
    </span>
  `;
}

function scheduleDetailItem(day) {
  const schedule = Array.isArray(day.schedule) ? day.schedule.filter((item) => item.title || item.note) : [];
  return `
    <div class="detail-item">
      ${detailLabel("行程", "ticket")}
      ${schedule.length ? scheduleList(schedule) : transportFallback(day.transport)}
    </div>
  `;
}

function scheduleList(schedule) {
  return `
    <div class="schedule-list">
      ${schedule.map((item) => `
        <div class="schedule-row">
          <span class="schedule-time">${escapeHtml(item.time || "待確認")}</span>
          <span class="schedule-content">
            <strong>${escapeHtml(item.title || "待確認")}</strong>
            ${item.note ? `<span>${escapeHtml(item.note)}</span>` : ""}
          </span>
        </div>
      `).join("")}
    </div>
  `;
}

function transportFallback(value) {
  const lines = String(value || "待確認").split("；").map((item) => item.trim()).filter(Boolean);
  return `
    <div class="schedule-list">
      ${lines.map((line) => fallbackScheduleRow(line)).join("")}
    </div>
  `;
}

function fallbackScheduleRow(line) {
  const parsed = parseFallbackScheduleLine(line);
  if (!parsed.time) {
    return `
      <div class="schedule-row schedule-row-simple">
        <span>${escapeHtml(line)}</span>
      </div>
    `;
  }
  return `
    <div class="schedule-row">
      <span class="schedule-time">${escapeHtml(parsed.time)}</span>
      <span class="schedule-content">
        <strong>${escapeHtml(parsed.title)}</strong>
        ${parsed.note ? `<span>${escapeHtml(parsed.note)}</span>` : ""}
      </span>
    </div>
  `;
}

function parseFallbackScheduleLine(line) {
  const flightMatch = line.match(/^(.+?)\s+([A-Z]{3})\s+(\d{1,2}:\d{2})\s*->\s*([A-Z]{3})\s+(\d{1,2}:\d{2})$/);
  if (flightMatch) {
    return {
      time: flightMatch[3],
      title: `${flightMatch[1]} ${flightMatch[2]} -> ${flightMatch[4]}`,
      note: `${flightMatch[5]} 抵達`
    };
  }

  const leadingTimeMatch = line.match(/^(\d{1,2}:\d{2})(?:\s*[-–]\s*(\d{1,2}:\d{2}))?(?:\s+|：)?(.+)$/);
  if (leadingTimeMatch) {
    return {
      time: leadingTimeMatch[1],
      title: leadingTimeMatch[3],
      note: leadingTimeMatch[2] ? `${leadingTimeMatch[2]} 結束` : ""
    };
  }

  return { time: "", title: line, note: "" };
}

function lodgingDetailItem(value) {
  const mapLink = mapLinkForLodging(value);
  return `
    <div class="detail-item">
      ${detailLabel("住宿", "hotel")}
      <span class="detail-value-row">
        <span>${escapeHtml(value || "待確認")}</span>
        ${mapLink ? `
          <a class="gps-link" href="${escapeAttr(mapLink)}" target="_blank" rel="noopener noreferrer" aria-label="用 Google Maps 開啟 ${escapeAttr(value)}">
            <img src="${iconMap.gps}" alt="">
          </a>
        ` : ""}
      </span>
    </div>
  `;
}

function mapLinkForLodging(value) {
  if (!value) return "";
  const lodging = String(value);
  const knownLocations = [
    { match: "1057 Harding Road", query: "1057 Harding Road, Elizabeth, NJ" },
    { match: "Beach Plaza Hotel", query: "Beach Plaza Hotel, 1401 Collins Ave, Miami Beach, FL" },
    { match: "Golden Tulip Incheon", query: "Golden Tulip Incheon Airport Hotel & Suites" },
    { match: "Crowne Plaza Niagara Falls", query: "Crowne Plaza Niagara Falls NY - Riverside by IHG" },
    { match: "Hotel Hokke Club Osaka", query: "Hotel Hokke Club Osaka, 12 Toganocho, Kita Ward, Osaka" }
  ];
  const location = knownLocations.find((item) => lodging.includes(item.match));
  if (!location) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.query)}`;
}

function sourceLinks(sources = []) {
  if (!sources.length) return "";
  return `
    <div class="source-links">
      ${sources.map((source, index) => `<button class="source-link" type="button" data-preview-source="${escapeAttr(source)}">附件 ${index + 1}</button>`).join("")}
    </div>
  `;
}

function statusPill(status) {
  const className = statusClass(status);
  return `<span class="status-pill ${className}">${escapeHtml(status)}</span>`;
}

function bindDayCard(tripId, day, card) {
  const toggle = card.querySelector("[data-journal-toggle]");
  const journal = card.querySelector(".day-journal");
  toggle.addEventListener("click", () => {
    const nextExpanded = journal.hidden;
    journal.hidden = !nextExpanded;
    toggle.classList.toggle("active", nextExpanded);
    toggle.setAttribute("aria-expanded", String(nextExpanded));
    toggle.setAttribute("aria-label", nextExpanded ? "收起旅行紀錄" : "展開旅行紀錄");
  });
  const note = card.querySelector("[data-note]");
  note.addEventListener("input", () => saveDayRecord(tripId, day.id, { note: note.value }));
  const input = card.querySelector("[data-photo-input]");
  input.addEventListener("change", async () => {
    for (const file of input.files) {
      await saveDayPhoto(tripId, day.id, file);
    }
    input.value = "";
    await renderPhotoStrip(tripId, day.id, card.querySelector("[data-photo-strip]"));
    const trip = state.tripDetails.get(tripId);
    if (trip) await renderRecordBook(trip);
  });
}

async function hydrateDayCard(tripId, day, card) {
  const record = loadDayRecord(tripId, day.id);
  card.querySelector("[data-note]").value = record.note || "";
  await renderPhotoStrip(tripId, day.id, card.querySelector("[data-photo-strip]"));
}

function renderBookings(trip) {
  document.querySelector("#bookings").innerHTML = `
    <div class="section-heading">
      <p class="eyebrow">Bookings</p>
      <h2>票券 / 住宿 / 交通摘要</h2>
    </div>
    <div class="booking-grid">
      ${(trip.bookings || []).map((booking) => `
        <article class="booking-card">
          <div class="booking-card-header">
            <div class="day-icon"><img src="${iconMap[booking.type] || iconMap.ticket}" alt=""></div>
            <div>
              <h3>${escapeHtml(booking.title)}</h3>
              ${statusPill(booking.status)}
              <p>${escapeHtml(booking.summary)}</p>
              <div class="booking-meta">
                <span class="chip">${escapeHtml(booking.price || "費用待確認")}</span>
              </div>
            </div>
          </div>
          ${booking.source ? `<div class="source-links"><button class="source-link" type="button" data-preview-source="${escapeAttr(booking.source)}">查看來源</button></div>` : ""}
        </article>
      `).join("")}
    </div>
  `;
}

function renderPending(trip) {
  document.querySelector("#pending").innerHTML = `
    <div class="section-heading">
      <p class="eyebrow">Checklist</p>
      <h2>待確認事項</h2>
    </div>
    <article class="pending-card">
      <ul>
        ${(trip.pendingItems || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </article>
  `;
}

async function renderRecordBook(trip) {
  const days = [];
  for (const day of trip.days) {
    const record = loadDayRecord(trip.id, day.id);
    const photos = await loadDayPhotos(trip.id, day.id);
    if ((record.note && record.note.trim()) || photos.length) {
      days.push({ day, record, photos });
    }
  }
  document.querySelector("#record").innerHTML = `
    <div class="section-heading">
      <p class="eyebrow">Record Book</p>
      <h2>旅行紀錄書</h2>
      <p>每天上傳的照片與心得會自動整理到這裡。</p>
    </div>
    ${days.length ? `<div class="record-grid">${days.map(recordDayTemplate).join("")}</div>` : '<div class="empty-state">還沒有照片或心得。旅途中每天補一點，這裡就會慢慢變成一本旅行書。</div>'}
  `;
}

function recordDayTemplate(item) {
  return `
    <article class="record-day">
      <p class="eyebrow">Day ${item.day.day} · ${formatDate(item.day.date)}</p>
      <h3>${escapeHtml(item.day.city)}</h3>
      <p>${escapeHtml(item.record.note || item.day.highlights)}</p>
      ${item.photos.length ? `<div class="record-photo-grid">${item.photos.map((photo) => `<div class="photo-thumb"><img src="${photo.url}" alt="Day ${item.day.day} photo" data-preview-image="${photo.url}" data-preview-title="Day ${item.day.day} photo"></div>`).join("")}</div>` : ""}
    </article>
  `;
}

function saveDayRecord(tripId, dayId, data) {
  const key = `trip-portal:record:${tripId}:${dayId}`;
  localStorage.setItem(key, JSON.stringify({ ...loadDayRecord(tripId, dayId), ...data }));
}

function loadDayRecord(tripId, dayId) {
  const key = `trip-portal:record:${tripId}:${dayId}`;
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

function openPhotoDb() {
  return new Promise((resolve) => {
    if (!("indexedDB" in window)) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("photos")) {
        db.createObjectStore("photos", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

async function saveDayPhoto(tripId, dayId, file) {
  if (!state.db) return;
  const record = {
    id: `${tripId}:${dayId}:${crypto.randomUUID()}`,
    tripId,
    dayId,
    name: file.name,
    type: file.type,
    createdAt: Date.now(),
    blob: file
  };
  await dbPut("photos", record);
}

async function loadDayPhotos(tripId, dayId) {
  if (!state.db) return [];
  const all = await dbGetAll("photos");
  return all
    .filter((photo) => photo.tripId === tripId && photo.dayId === dayId)
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((photo) => ({ ...photo, url: URL.createObjectURL(photo.blob) }));
}

async function deleteDayPhoto(id) {
  if (!state.db) return;
  await dbDelete("photos", id);
}

function dbPut(storeName, value) {
  return new Promise((resolve, reject) => {
    const tx = state.db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(value);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function dbGetAll(storeName) {
  return new Promise((resolve, reject) => {
    const tx = state.db.transaction(storeName, "readonly");
    const request = tx.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function dbDelete(storeName, id) {
  return new Promise((resolve, reject) => {
    const tx = state.db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function renderPhotoStrip(tripId, dayId, container) {
  const photos = await loadDayPhotos(tripId, dayId);
  if (!photos.length) {
    container.innerHTML = "";
    return;
  }
  container.innerHTML = photos.map((photo) => `
    <div class="photo-thumb">
      <img src="${photo.url}" alt="${escapeAttr(photo.name)}" data-preview-image="${photo.url}" data-preview-title="${escapeAttr(photo.name)}">
      <button type="button" data-delete-photo="${photo.id}" aria-label="刪除照片">×</button>
    </div>
  `).join("");
  container.querySelectorAll("[data-delete-photo]").forEach((button) => {
    button.addEventListener("click", async () => {
      await deleteDayPhoto(button.dataset.deletePhoto);
      await renderPhotoStrip(tripId, dayId, container);
      const trip = state.tripDetails.get(tripId);
      if (trip) await renderRecordBook(trip);
    });
  });
}

function formatDate(date) {
  return date.replaceAll("-", ".");
}

function shortDate(date) {
  const [, month, day] = date.split("-");
  return `${Number(month)}/${Number(day)}`;
}

function shortDateWithWeekday(day) {
  return `${shortDate(day.date)}（${day.weekday}）`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
