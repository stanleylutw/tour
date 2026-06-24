# New Itinerary Creation Workflow v1.0

Last updated: 2026-06-24 23:55:00 [Codex]

## Purpose

This document defines how Codex should create a new itinerary in the Family Trip Portal.

The 2026 NY tour is the standard itinerary template. When the user says:

```text
create a new itinerary
```

or similar wording, Codex must not immediately create random files. Codex should first ask for the initial itinerary information step by step, then create the new tour using the existing Family Trip Portal structure.

## Core Rule

The 2026 NY tour defines the shared UI pattern for all future tours.

New itineraries must reuse:

- `index.html`
- `styles.css`
- `script.js`

Every new itinerary must have its own folder and its own itinerary page data:

- Folder: `assets/trips/<tour-id>/`
- Page data: `data/trips/<tour-id>.json`

The itinerary page is rendered by the shared `index.html` app using the tour JSON. Do not create a duplicated standalone HTML page for each tour unless the user explicitly requests a separate export.

New itineraries must only add or update:

- `data/trips.json`
- `data/trips/<tour-id>.json`
- `assets/trips/<tour-id>/...`

Do not duplicate the HTML app for a single tour.

## Trigger Phrases

When the user says one of the following, Codex should start this workflow:

- `create a new itinerary`
- `create new itinerary`
- `新增一個行程`
- `建立新旅程`
- `幫我做新的 tour`
- `新增新的旅遊計畫`

Codex should treat these as a request to build a new Family Trip Portal tour, not a separate website.

## Conversation Language

Follow the project communication rule:

1. First provide a short English correction.
2. Then answer in Traditional Chinese.

Example:

```text
English correction: "Create a new itinerary."

好，我會用 Family Trip Portal 的 NY template 來建立新旅程。先請你提供旅程名稱。
```

## Step-by-Step Questions

Codex should ask only one small group of questions at a time. Do not ask for every detail at once.

### Step 1: Basic Trip Identity

Ask:

```text
請先提供這個新旅程的基本資訊：
1. 旅程名稱
2. 目的地
3. 預計年份
```

Example answer:

```text
2027 日本家庭旅行，日本，2027
```

From this, Codex should propose a tour id using lowercase slug format:

```text
2027-japan
```

If the destination is unclear, ask the user to confirm the slug before creating files.

### Step 2: Dates

Ask:

```text
請提供旅程日期：
1. 開始日期
2. 結束日期

如果還沒確定，可以先回答「待確認」。
```

Preferred date format:

```text
YYYY-MM-DD
```

If dates are unknown:

- Use `YYYY-MM-DD` placeholders only in draft examples.
- In real JSON fields that need user-visible content, use `待確認`.
- Add a pending item asking the user to confirm dates.

### Step 3: People and Groups

Ask:

```text
請提供人數與成員分組：
1. 總人數
2. 人數備註
3. 是否有分組，例如台灣出發、當地會合、不同家庭
```

If unknown:

- `people`: `0`
- `peopleNote`: `人數待確認`
- `groups`: `[]`

### Step 4: Trip Theme and Main Highlights

Ask:

```text
這趟旅行的主軸是什麼？
例如：親子旅行、美食、郵輪、迪士尼、賞櫻、城市散步、探親、購物。
```

Use this answer to fill:

- `subtitle`
- `quickFacts`
- `pendingItems`
- initial day highlights if dates are already known

If unknown, use:

```text
待規劃
```

### Step 5: Known Transportation

Ask:

```text
目前有已知交通資訊嗎？
例如：航班、火車、租車、郵輪、城市間移動。

如果還沒有，可以回答「待確認」。
```

Use the answer to create draft booking entries only when enough detail exists.

If the user provides screenshots, PDFs, or pasted text, save them under:

```text
assets/trips/<tour-id>/attachments/
```

### Step 6: Known Lodging

Ask:

```text
目前有已知住宿資訊嗎？
例如：飯店名稱、入住日期、退房日期、地址、訂房截圖。

如果還沒有，可以回答「待確認」。
```

If lodging is missing, every affected day should use:

```text
lodging: "待確認"
```

If lodging, hotel, or stay-house information is added:

- Create or update the Google Maps GPS link at the same time.
- The daily lodging field should show the GPS icon automatically when the lodging is rendered.
- If the app uses a known-location mapping, add the hotel / stay-house name and Google Maps query to that mapping.
- Prefer a full address when available; otherwise use the hotel or stay-house name plus city.
- If the address is incomplete, add a pending item: `補齊住宿 GPS 地址`。

### Step 7: Tickets, Activities, and Reservations

Ask:

```text
目前有已知活動、票券、餐廳或預約嗎？
例如：球賽、景點門票、餐廳、郵輪、表演、博物館。

如果還沒有，可以回答「待規劃」。
```

Use known items to create:

- `bookings`
- day `highlights`
- day `sources`
- `pendingItems`

### Step 8: Assets

Ask:

```text
是否有 banner、logo、照片、訂房截圖、票券 PDF 或其他附件？

如果有，請提供檔案；如果沒有 banner，我會依照 NY banner 的風格為這趟旅程設計新的專屬 banner。
```

Create this folder structure:

```text
assets/trips/<tour-id>/
  images/
  attachments/
    images/
    pdf/
    raw/
```

Add `.gitkeep` files to empty folders so Git preserves the structure.

If the user does not provide a banner:

- Use the NY tour banner as the style reference.
- Design a new destination-specific banner for the new tour.
- Save it as `assets/trips/<tour-id>/images/banner.png`.
- The banner should feel consistent with the Family Trip Portal style: bright, travel-focused, family-friendly, and suitable for the first viewport hero.
- Do not reuse an unrelated booking screenshot as the final banner unless it is only a temporary draft and clearly marked as pending replacement.

## File Creation Rules

After the initial information is collected, Codex should create:

```text
assets/trips/<tour-id>/
assets/trips/<tour-id>/images/
assets/trips/<tour-id>/attachments/images/
assets/trips/<tour-id>/attachments/pdf/
assets/trips/<tour-id>/attachments/raw/
data/trips/<tour-id>.json
```

This means each itinerary has:

- One dedicated asset folder: `assets/trips/<tour-id>/`
- One dedicated itinerary page data file: `data/trips/<tour-id>.json`

The visible page should still be rendered through the shared Family Trip Portal app.

Codex should also update:

```text
data/trips.json
```

Do not edit `index.html`, `styles.css`, or `script.js` unless the shared template needs a reusable feature for all tours.

## JSON Draft Rules

The new itinerary JSON should follow `data/trips/_template.json`.

Use the following conventions:

- Missing title detail: `待確認`
- Missing schedule detail: `待規劃`
- Missing lodging: `待確認`
- Missing transportation: `待確認`
- Missing cost: `待確認`
- Missing booking source: leave `sources` empty until an attachment exists
- Missing activity: add it to `pendingItems`

Every new tour should have at least one draft day.

If the trip dates are known, generate one `days[]` item per calendar date.

If the trip dates are unknown, generate only one draft day:

```json
{
  "id": "day-01",
  "day": 1,
  "date": "待確認",
  "weekday": "待確認",
  "city": "待規劃",
  "icon": "map-pin",
  "status": "待規劃",
  "transport": "待確認",
  "lodging": "待確認",
  "highlights": "待規劃",
  "cost": "待確認",
  "sources": []
}
```

## `data/trips.json` Entry Rules

Each new tour must be added to `data/trips.json`.

Example:

```json
{
  "id": "2027-japan",
  "title": "2027 日本家庭旅行",
  "subtitle": "待規劃",
  "destination": "Japan",
  "startDate": "2027-02-01",
  "endDate": "2027-02-10",
  "people": 0,
  "peopleNote": "人數待確認",
  "status": "draft",
  "banner": "assets/trips/2027-japan/images/banner.png",
  "logo": "assets/trips/2027-japan/images/family-logo.png",
  "data": "data/trips/2027-japan.json"
}
```

If dates are not confirmed, Codex should ask before adding the trip to `data/trips.json`, because the portal uses dates to choose the nearest trip.

## Confirmation Before Writing Files

Before creating files, Codex should summarize:

```text
我準備建立：
- tour id: <tour-id>
- JSON: data/trips/<tour-id>.json
- assets folder: assets/trips/<tour-id>/
- update: data/trips.json

缺少資訊會先標示為「待確認」或「待規劃」。
```

Then proceed unless the user corrects the basic trip identity.

## Final Report After Creation

After creating the new itinerary, Codex should report:

- Created tour id
- Created JSON path
- Created assets folder
- Whether `data/trips.json` was updated
- Missing information still marked as `待確認` or `待規劃`
- Validation result, such as JSON parse check or local app check

Do not commit or push unless the user explicitly says:

```text
git commit + push
```

## Example Start

User:

```text
create a new itinerary
```

Codex:

```text
English correction: "Create a new itinerary."

好，我會用 2026 NY tour 作為 Family Trip Portal 的 itinerary template。

第一步先請你提供：
1. 旅程名稱
2. 目的地
3. 預計年份

例如：2027 日本家庭旅行，日本，2027
```
