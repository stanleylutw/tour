# 溝通規則

## 回覆規則
1. 第一步：提供使用者英文句子的修正。
2. 第二步：用繁體中文提供主要回覆。
3. 英文修正需短且自然。
4. 中文回覆需清楚，並以行動為主。
5. 技術請求需在相關處提供具體檔案路徑或設定。
6. 所有 Markdown 文件描述應使用中文，但特定技術詞可以保留英文。

## 輸出模板
English correction: `...`

中文主要回覆：...

## M2 開發快捷指令
1. `#m` = modify，修改目前指定功能或文件。
2. `#b` = build，建置目前 M2 firmware project，預設使用正式設定，不開啟 RTT debug。
3. `#f` = flash，燒錄目前 firmware。
4. `#j` = flash by J-Link tool，使用 J-Link tool 燒錄。
5. `#mb` = modify + build，修改後建置。
6. `#bf` = build + flash，建置後燒錄。
7. `#bj` = build + flash by J-Link tool，建置後使用 J-Link tool 燒錄。
8. `#mbf` = modify + build + flash，修改、建置、燒錄。
9. `#mbj` = modify + build + flash by J-Link tool，修改、建置後使用 J-Link tool 燒錄。

## RTT Debug Build 規則
1. Normal build 預設不開啟 RTT，避免影響正式功耗、Flash/RAM size 與量產測試。
2. 需要 RTT debug 時，必須明確指定 RTT 指令，不可混用 normal build。
3. RTT debug config 使用 `configs/debug/prj_rtt_debug.conf`。
4. `#rttb` = build with RTT debug，使用 `configs/debug/prj_rtt_debug.conf` 建置。
5. `#rttbj` = build with RTT debug + flash by J-Link tool，建置 RTT debug firmware 後使用 J-Link tool 燒錄。
6. RTT debug firmware 僅用於 bring-up、sensor log、CW/CCW 校正與問題分析；正式驗證需回到 normal build。

## GitHub / Git 操作規則
1. 若專案已連結 GitHub remote，Codex 修改檔案後不可自動 commit 或 push。
2. Commit、tag、push、pull request 等 GitHub 同步動作，必須等待使用者明確下指令後才可執行。
3. 修改完成後，Codex 只能回報修改內容、測試結果與目前 `git status`，不可主動建立 commit 或推送到遠端。
4. 若使用者只說「修改」、「調整」、「修正」、「更新 UI」等，代表只做檔案修改與驗證，不代表允許 commit 或 push。
5. 只有當使用者明確說「commit」、「push」、「上傳到 GitHub」、「發 PR」或同等意思時，Codex 才可以執行對應 Git 操作。

## Family Trip Portal 新旅程規則
1. 2026 NY tour 的 HTML UI 是 Family Trip Portal 的標準 template；新增旅程時不得為單一旅程另外複製一套 HTML/CSS/JS。
2. 新旅程必須沿用現有 `index.html`、`styles.css`、`script.js` 的共用 UI，由 `data/trips.json` 與 `data/trips/<tour-id>.json` 提供內容。
3. 新旅程 ID 使用小寫 slug，建議格式為 `YYYY-destination`，例如 `2027-japan`、`2028-europe`。
4. 每個新 itinerary 都必須有自己的 tour folder 與 itinerary page data：`assets/trips/<tour-id>/` 與 `data/trips/<tour-id>.json`。此 page 由共用 `index.html` 動態渲染，不另外複製 HTML/CSS/JS。
5. 使用者上傳新旅程附件時，Codex 必須建立對應資料夾：`assets/trips/<tour-id>/`。
6. 新旅程資料夾標準結構如下：

```text
assets/trips/<tour-id>/
  images/
  attachments/
    images/
    pdf/
    raw/
```

7. 新旅程的 banner、logo、附件、票券、訂房截圖與文字資料，都應保存到該旅程資料夾，不應再混放到 NY tour 的共用附件資料夾。
8. 若新旅程沒有提供 banner，Codex 必須參考 NY banner 的視覺風格，為該旅程設計一張新的專屬 banner，並保存為 `assets/trips/<tour-id>/images/banner.png`。
9. 新旅程 JSON 內的 `banner`、`logo`、`bookings[].source`、`days[].sources` 必須指向該旅程資料夾底下的相對路徑。
10. 新增或更新 hotel / stay house / 住宿地址時，Codex 必須同步建立 GPS Google Maps 連結，讓住宿欄位旁自動顯示 GPS icon；若地址不完整，需在待辦標示「補齊住宿 GPS 地址」。
11. 新旅程新增流程：先建立資料夾與 `data/trips/<tour-id>.json`，再更新 `data/trips.json`，最後確認首頁可自動選擇最近旅程。
12. 若使用者只提供部分資料，Codex 可以先建立 draft tour，缺少內容以 `待確認`、`待規劃` 標示。
13. 新旅程建立完成後，Codex 需回報新增資料夾、JSON 路徑、已整理附件與待補資訊；除非使用者明確要求，不可自動 commit 或 push。
14. 當使用者說 `create a new itinerary` 或類似意思時，Codex 必須依照 `notes/new_itinerary_creation_workflow.md` 逐步詢問初始資訊，不可一次要求所有資料，也不可直接複製新的 HTML/CSS/JS。
15. 旅程頁的 calendar 顯示邏輯由 banner 可見狀態控制：banner 還在畫面中時顯示 month calendar，點日期只更新 day summary；使用者往下滑到 banner 離開畫面後，自動切換為 row calendar，並讓每日詳細 Day card 成為主要閱讀內容；往上滑回頁首、banner 再次可見時，自動回到 month calendar + summary card。
16. 每日 Day card 的內容順序為「當日重點、行程、住宿、費用」；若某天有明確時間的活動或航班，應在 `days[].schedule[]` 填入 `time`、`title`、`note`，讓「行程」區塊用時間列表顯示；若沒有 `schedule[]`，UI 才使用 `transport` 文字作為 fallback。
17. Month calendar 必須至少顯示 4 週；如果旅程實際跨 5 週或更多週，則依實際週數顯示。若旅程只落在 1 週內，該旅程週應顯示在第 2 週，第一週保留作為前導空白。

## Plan Markdown 版本管理規則
1. 修改主要 plan 文件時，必須同步更新文件版本號。
2. 版本號格式使用 `vMAJOR.MINOR`，例如 `v1.3`。
3. 一般內容更新時增加 minor version，例如 `v1.3 -> v1.4`。
4. 當 minor version 從 `9` 再往上增加時，進位到下一個 major version，例如 `v1.9 -> v2.0`。
5. 若只是修正 typo、排版或不影響規格的文字，可不升版，但必須在回覆中說明原因。
6. Plan 文件 header 必須包含 `Last updated` 欄位，格式如下：

```text
Last updated: YYYY-MM-DD HH:MM:SS [Who]
```

7. Plan 文件 header 必須包含 `Revision History`，用簡短紀錄追蹤重要修改。
8. Revision History 建議放在文件前段，標題下方或專案摘要後方，格式如下：

```markdown
## Revision History

| Version | Date Time | Summary | Who |
|---|---|---|---|
| v1.4 | 2026-06-11 15:30:00 | Add E9 OTA mode flow and safety notes | Codex |
```

9. Revision summary 應簡短描述「修改了什麼」，不要寫過長的開發細節。
10. 修改 plan 時，應同時檢查文件標題、版本號、`Last updated` 與 `Revision History` 是否一致。

## 範例
English correction: `Please review comm.md again, and make sure all actions follow the rules.`

中文主要回覆：我已重新檢查 `comm.md`，並把回覆規則整理成固定流程。後續我會先提供英文修正，再用中文給主要回覆，並在技術任務中附上具體設定與檔案路徑。
