# Family Trip Portal HTML 規劃 v1.2

Last updated: 2026-06-25 23:25:00 [Codex]

## Revision History

| Version | Date Time | Summary | Who |
|---|---|---|---|
| v1.2 | 2026-06-25 23:25:00 | 補充首次登入主選單、summary 住宿短版與行程分行規則 | Codex |
| v1.1 | 2026-06-24 23:43:20 | 新增 NY UI template 與新旅程資料夾規則 | Codex |
| v1.0 | 2026-06-24 00:00:00 | 建立 Family Trip Portal 第一版 HTML 規劃 | Codex |

## 專案定位

本專案不是單一的 NY itinerary 頁面，而是 **Family Trip Portal 家庭旅行入口網站**。

2026 NY itinerary 是第一個旅程，未來可繼續加入日本、歐洲、郵輪、迪士尼等其他行程。使用者第一次輸入 passcode 登入時，預設先進入主選單查看所有旅程；已登入後重新開啟或重新整理時，首頁可自動判斷目前日期，直接進入固定旅程、最接近或正在進行中的旅程。

## 第一版目標

第一版先做本機靜態 HTML prototype，不接後端，不接 Google Drive。

第一版需要完成：

- Family Trip Portal 主入口。
- 自動切換最近 / 進行中的 itinerary。
- 可回到所有旅程主選單。
- 2026 NY trip 詳細頁。
- Day 1-23 每日行程卡片。
- 每日照片上傳與心得。
- 本機儲存照片與文字紀錄。
- HTML travel record book 旅行紀錄書模式。
- 交通、住宿、票券、郵輪、活動摘要。
- 待確認事項清單。
- 隱藏敏感資訊。

## 建議檔案架構

```text
index.html
styles.css
script.js
data/
  trips.json
  trips/
    2026-ny.json
assets/
  icons/
  trips/
    <tour-id>/
      images/
      attachments/
        images/
        pdf/
        raw/
```

目前已有素材可先保留在：

```text
assets/images/ny_itinerary_banner_2026.png
assets/images/family_logo_2026.png
assets/icons/
attachments/
```

實作第一版時，可先直接使用現有路徑；若要進一步整理，再搬到 `assets/trips/2026-ny/`。

## NY UI Template 與新旅程建立規則

2026 NY tour 是第一個實作完成的旅程，也作為後續所有 tour 的 UI template。

新增日本、歐洲、郵輪或其他旅程時，原則如下：

- 不複製新的 HTML app。
- 不為單一旅程新增獨立 CSS / JS。
- 所有旅程共用 `index.html`、`styles.css`、`script.js`。
- 新旅程只新增資料與素材：`data/trips/<tour-id>.json`、`assets/trips/<tour-id>/...`。
- 新旅程必須更新 `data/trips.json`，讓首頁可以自動選擇最近或進行中的旅程。
- 新旅程的 UI 應沿用目前 NY tour 的格式：login、main menu、banner、overview、month calendar、row calendar、daily cards、bookings、record book、pending checklist、附件預覽 modal。
- 若使用者提供 DOCX、PDF、截圖或訂單資料，需深度掃描並把可顯示於 HTML 的資訊寫入 JSON，例如每日活動、餐食、候選飯店、費用、旅行社聯絡、入境提醒、行李與小費提醒。
- 若 detail page 需要完整資訊但 summary card 只適合短文字，使用短版欄位，例如 `days[].summaryLodging`。
- 若每日 `行程` 沒有可靠時間但包含多個景點，`days[].transport` 使用中文分號 `；` 分隔，讓 UI 一項一列呈現。

新旅程 ID 建議使用：

```text
YYYY-destination
```

範例：

```text
2027-japan
2028-europe
2029-alaska-cruise
```

當使用者上傳新 tour 的附件時，Codex 應建立：

```text
assets/trips/<tour-id>/
  images/
  attachments/
    images/
    pdf/
    raw/
```

檔案用途：

- `images/`：旅程 banner、family logo、封面素材。
- `attachments/images/`：截圖、票券圖片、飯店確認圖。
- `attachments/pdf/`：訂房確認、票券 PDF、收據 PDF。
- `attachments/raw/`：文字、OCR、原始貼上資料。

新旅程 JSON 的路徑範例：

```json
{
  "id": "2027-japan",
  "title": "2027 日本家庭旅行",
  "destination": "Japan",
  "startDate": "2027-02-01",
  "endDate": "2027-02-10",
  "banner": "assets/trips/2027-japan/images/banner.png",
  "logo": "assets/trips/2027-japan/images/family-logo.png",
  "data": "data/trips/2027-japan.json"
}
```

若新旅程資料尚未完整，仍可先建立 draft tour。缺少時間、價格、票券、住宿或交通時，在 JSON 裡使用 `待確認` 或 `待規劃`，不要空白。

## 多旅程資料設計

首頁不應把 NY itinerary 寫死在 HTML。NY 應該是第一筆 trip data。

`data/trips.json` 建議格式：

```json
[
  {
    "id": "2026-ny",
    "title": "2026 暑假 我們在紐約！",
    "destination": "New York City",
    "startDate": "2026-07-07",
    "endDate": "2026-07-29",
    "status": "planned",
    "banner": "assets/images/ny_itinerary_banner_2026.png",
    "logo": "assets/images/family_logo_2026.png",
    "data": "data/trips/2026-ny.json"
  }
]
```

每個 trip 的詳細資料放在獨立 JSON，例如 `data/trips/2026-ny.json`。

## 自動切換最近旅程

第一次輸入 passcode 登入後流程：

```text
讀取 trips.json
  ↓
顯示所有旅程主選單
```

已登入狀態重新開啟 / 重新整理 app：

```text
讀取 trips.json
  ↓
若有固定旅程，進入固定旅程
  ↓
若無固定旅程，依照今天日期判斷旅程狀態
  ↓
如果今天在某個 trip 日期內，進入該 trip
  ↓
如果沒有進行中的 trip，進入最近即將開始的 trip
  ↓
如果沒有未來 trip，進入最近結束的 trip
```

排序規則：

1. 進行中的 trip 優先。
2. 即將開始且距離今天最近的 trip 次之。
3. 已結束但結束日期距離今天最近的 trip 最後。

需要提供 override：

- `所有旅程`：回主選單。
- `目前旅程`：回到自動判斷的最近旅程。
- `固定此旅程`：讓使用者暫時固定目前旅程。
- `取消固定`：回到自動判斷邏輯。

首次登入永遠先顯示主選單，讓使用者知道目前有哪些旅程；回訪才使用固定 / 最近旅程快速進入。

## UI 與風格

整體風格：**家庭旅行相簿 + 行程手冊 + 輕量控制台**。

設計方向：

- 手機優先。
- 繁體中文為主。
- 航班、飯店、地址、訂單名稱保留英文。
- 使用明亮、歡樂、紐約旅行感。
- 不做商務 dashboard。
- 不做過度花俏的裝飾，資訊查找要快。

主色建議：

- Navy：`#0B3D91`
- Red：`#D62828`
- Yellow：`#FBBF24`
- Sky：`#38BDF8`
- White：`#FFFFFF`

首頁主視覺：

- 使用 `assets/images/ny_itinerary_banner_2026.png` 作為 2026 NY trip hero。
- 使用 `assets/images/family_logo_2026.png` 作為 family logo。
- 使用 `assets/icons/` 的 SVG icons 作為行程卡片與狀態標籤。

## 頁面模式

系統應有三種主要模式：

1. `旅程中`
   - 今日行程、地址、交通、票券、導航最重要。
   - 如果今天落在 trip 日期範圍內，預設進入此模式。

2. `規劃中`
   - 待確認事項、費用摘要、訂單狀態最重要。
   - 如果 trip 尚未開始，預設進入此模式。

3. `回憶中`
   - 照片、每日心得、旅行紀錄書最重要。
   - 如果 trip 已結束，預設進入此模式。

## 主要 UI 區塊

### 1. Login Screen

第一版使用本機 family passcode，不做真正帳號系統。

功能：

- 輸入 family passcode 後進入。
- 使用 `localStorage` 記住登入狀態。
- 提供登出按鈕。

第二版才改成 Google Sign-In。

### 2. Family Trip Portal 主選單

內容：

- Current / Nearest Trip。
- Upcoming Trips。
- Past Trips。
- Future Trip placeholder。

每個 trip card 顯示：

- 旅程名稱。
- 日期範圍。
- 目的地。
- 封面圖。
- 人數。
- 狀態：`規劃中`、`旅程中`、`已完成`。

### 3. Trip Detail 旅程詳細頁

以 2026 NY 為第一個 trip。

區塊：

- Hero banner。
- Trip quick summary。
- Day 1-23 timeline。
- 交通與住宿摘要。
- 票券與訂單摘要。
- 每日照片與心得。
- 旅行紀錄書。
- 待確認事項。

### 4. Daily Itinerary Cards

每一天一張卡片。

每張卡片包含：

- Day 編號。
- 日期與星期。
- 城市 / 地點。
- 交通時間。
- 住宿。
- 當日重點。
- 費用摘要。
- 狀態標籤。
- 附件來源連結。
- 每日照片上傳。
- 每日心得 / 備註。

### 5. Travel Record Book

旅行紀錄書由每日卡片自動產生。

第一版輸出 HTML Album：

- 每日照片。
- 每日心得。
- 當日行程亮點。
- 重要票券或地點摘要。

暫不做 PDF 匯出，保留第二版功能。

## 本機資料儲存

第一版使用本機儲存：

- `localStorage`：登入狀態、每日心得、勾選狀態、固定旅程。
- `IndexedDB`：每日上傳照片。

所有 key 必須包含 `tripId`，避免未來多旅程資料混在一起。

範例：

```text
trip-portal:auth
trip-portal:pinned-trip-id
trip-portal:record:2026-ny:day-01
trip-portal:photos:2026-ny:day-01
```

儲存介面需可替換，方便第二版接 Google Drive：

```js
saveDayRecord(tripId, dayId, data)
loadDayRecord(tripId, dayId)
saveDayPhoto(tripId, dayId, file)
loadDayPhotos(tripId, dayId)
```

## 未來 Google Drive 版本

第二版才接 Google Drive。

方向：

- Google Sign-In。
- 照片存到 Google Drive。
- 每日文字紀錄存成 JSON。
- 每個 trip 建立獨立資料夾。

建議 Drive 結構：

```text
Family Trip Portal/
  2026-ny/
    record-book-data.json
    photos/
      day-01/
      day-02/
    attachments/
```

## 隱私與敏感資訊

HTML 頁面預設只顯示摘要，不顯示敏感資訊。

需隱藏：

- 信用卡末四碼。
- Member ID。
- 個人證件資訊。
- 完整付款資訊。
- 不適合公開分享的訂單細節。

附件連結可放在「私人資料來源」區塊。未來若要分享給朋友，可一鍵隱藏此區塊。

## 第一版不做的功能

為了避免第一版過大，以下功能先不做：

- 真正 Google 登入。
- 多人即時同步。
- PDF 匯出。
- 照片拖拉排序。
- 照片批次壓縮。
- 雲端備份。
- 後端 API。

## 第一版驗收標準

- 開啟 `index.html` 後會自動進入最近 / 進行中的 trip。
- 可回到所有旅程主選單。
- 2026 NY trip 可完整顯示 Day 1-23。
- Banner、family logo、SVG icons 正常顯示。
- 每日照片可上傳並保存在本機。
- 每日心得可輸入並保存在本機。
- 重新整理頁面後，本機資料仍存在。
- Travel Record Book 可依每日照片與心得自動產生。
- 待確認事項可清楚顯示。
- 手機寬度 390px / 430px 無文字重疊。
- 桌面寬度 1440px 版面清楚。
- 敏感資訊不出現在公開主畫面。

## 建議實作順序

1. 建立 `data/trips.json` 與 `data/trips/2026-ny.json`。
2. 建立 `index.html`、`styles.css`、`script.js`。
3. 實作 local login。
4. 實作自動選擇最近 trip。
5. 實作所有旅程主選單。
6. 實作 2026 NY trip 詳細頁。
7. 實作每日行程卡片。
8. 實作本機每日心得儲存。
9. 實作 IndexedDB 照片上傳。
10. 實作 Travel Record Book。
11. 實作待確認事項與私人附件來源區。
12. 做手機與桌面視覺檢查。

## 備註

第一版的重點是先做出可用、可展示、可記錄旅行的本機版本。資料架構一開始就要支援多旅程與 `tripId`，這樣第二版接 Google Drive 或新增其他 itinerary 時，不需要推倒重來。
