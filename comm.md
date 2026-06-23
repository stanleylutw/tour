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
