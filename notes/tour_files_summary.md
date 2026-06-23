# 2026 NY Itinerary 附件整理 v3.18

## 本次整理範圍

本文件整理 2026 NY itinerary 相關附件，保留原始檔並摘要可放入每日行程的重點資訊。

## 原始檔保存位置

| 類型 | 檔案 | 內容 |
| --- | --- | --- |
| 文字 | `attachments/raw/coney_island_note.txt` | 7/12 Coney Island 與小聯盟球賽提醒 |
| PDF | `attachments/pdf/booking_confirmation_1737543963.pdf` | Agoda Golden Tulip Incheon Airport Hotel & Suite 訂房確認 |
| 圖片 | `attachments/images/international_flights_trip_com_2026-07.png` | Trip.com 國際線機票截圖 |
| 圖片 | `attachments/images/hoboken_dinner_cruise_groupon_checkout.jpg` | Groupon Hoboken Dinner Cruise checkout 截圖 |
| 圖片 | `attachments/images/hoboken_dinner_cruise_cornucopia_checkout.jpg` | Cornucopia Cruise Line checkout 截圖 |
| 圖片 | `attachments/images/mets_taiwan_day_info.jpg` | Mets Taiwan Day 資訊截圖 |
| 圖片 | `attachments/images/united_ewr_mia_roundtrip_review_booking.jpg` | United EWR-MIA 來回機票 review booking 截圖 |
| 圖片 | `attachments/images/beach_plaza_hotel_reservation_details_1.jpg` | Beach Plaza Hotel 訂房明細截圖 |
| 圖片 | `attachments/images/beach_plaza_hotel_reservation_fees.jpg` | Beach Plaza Hotel 費用與押金截圖 |
| 圖片 | `attachments/images/msc_seaside_booking_69082908.jpg` | MSC Seaside booking 69082908 截圖 |
| 圖片 | `attachments/images/msc_seaside_booking_69082323.jpg` | MSC Seaside booking 69082323 截圖 |
| HTML asset | `assets/images/ny_itinerary_banner_2026.png` | 2026 NY itinerary HTML 頁首布條，2048 x 768 |
| HTML asset | `assets/images/family_logo_2026.png` | 2026 NY itinerary family logo，透明背景 PNG，1448 x 1087 |
| HTML icons | `assets/icons/` | 2026 NY itinerary SVG icons，11 個 trip essentials icons |
| HTML plan | `notes/html_itinerary_plan.md` | Family Trip Portal HTML 中文實作規劃 |
| HTML QA | `notes/first_edition_checklist.md` | 第一版 itinerary 資料完整度與待補項目檢查 |
| HTML app | `index.html` | Family Trip Portal 第一版本機入口 |
| HTML app | `styles.css` | Family Trip Portal 第一版樣式 |
| HTML app | `script.js` | Family Trip Portal 第一版互動、登入、本機儲存與紀錄書邏輯 |
| JSON data | `data/trips.json` | 多旅程入口清單 |
| JSON data | `data/trips/2026-ny.json` | 2026 NY 第一個旅程資料 |

## HTML 開發素材

- 頁首布條：`assets/images/ny_itinerary_banner_2026.png`
- 尺寸：2048 x 768。
- 建議用途：itinerary HTML 首頁 hero / banner image。
- Family logo：`assets/images/family_logo_2026.png`
- 尺寸：1448 x 1087，RGBA 透明背景 PNG。
- 建議用途：HTML 頁首、人物介紹、封面區塊或浮水印式裝飾。
- SVG icons：`assets/icons/`
- 內容：自由女神、NY skyline、地鐵、飛機、飯店、郵輪、棒球、票券、相機、地點標記、GPS。
- 建議用途：行程卡片、快速導覽、交通住宿標籤、照片上傳與票券附件按鈕。
- 第一版 HTML app：`index.html`
- 預覽方式：建議使用本機 server 開啟，例如 `http://127.0.0.1:8765/`，避免瀏覽器限制 `file://` 讀取 JSON。
- Header tour calendar：第一版 HTML app 已加入 hero 下方的旅程日曆摘要，可橫向選 Day 1-23，點選後跳到指定日期。
- Calendar mode：旅程日曆已加入 Week 分組，並可用切換按鈕在「行程列」與「月曆模式」之間切換；兩種模式都可點日期跳到指定 Day。
- Header compact layout：縮小 hero 高度、family logo、標題與 summary 區塊，讓手機第一屏更快看到旅程日曆與內容。
- Calendar label update：行程列模式的 Day 卡片改為顯示 `7/7（二）` 這類日期與星期格式，不再顯示週次。
- Calendar cleanup：移除 Tour Calendar 上方的 23 天 / 已確認 / 待確認 / 下一站 summary stats，降低 header 高度。
- Calendar toolbar cleanup：移除「行程列模式」、日期範圍與 Week label，只保留模式切換按鈕與日期快速跳轉卡片。
- Hero cleanup：移除 hero 區塊中的「旅行紀錄書」與「固定」按鈕，讓封面區更乾淨；固定旅程功能仍保留在所有旅程主選單。
- Overview cleanup：將「旅程總覽」改成單一卡片並預設收合，點擊後才顯示總覽細節。
- People grouping：旅程總人數維持 8 人，並新增分組資訊：台灣出發 4 人 + NY 會合 4 人；國際線資訊標示為台灣出發 4 人。
- Calendar switch layout：將月曆 / 行程列切換按鈕併入日期快速列，不再獨占一整行，降低 header 高度。
- Button color tuning：將月曆切換、active day、tabs、一般操作按鈕從深藍實心改成柔和淡藍底與 navy 文字，降低視覺搶眼程度。
- Day picker centering：在行程列模式點選日期後，選中的 Day card 會自動橫向捲動到日期列中央。
- Day picker color tuning：未選取日期改為低彩度灰藍色，避免紅色過於搶眼；選取中的日期以 navy 強調。
- Day scroll sync：捲動每日行程正文時，上方行程列 / 月曆會自動同步目前閱讀中的 Day，例如捲到 7/17 會自動切換到 Day 11。
- Calendar control relocation：將「月曆 / 行程列」切換按鈕移到 topbar header 右側，日期列第一格改回顯示 Day 1，減少行程列空間浪費。
- Hotel GPS links：住宿欄位新增 GPS 按鈕，已知住宿地址與飯店會自動連到 Google Maps；新增 `assets/icons/gps.svg`。
- GPS icon refinement：GPS 按鈕改為純 icon，移除 `GPS` 文字，並將 `assets/icons/gps.svg` 更新為地圖加定位針樣式。
- Month calendar jump：月曆模式點選日期後會自動切回行程列，將選取的 Day card 置中，並把正文跳到該日資訊。
- Topbar title cleanup：左側「所有旅程」改為純三線 menu icon，目前旅程按鈕改為顯示行程標題；回主選單時顯示 `Family Trip Portal`。
- Topbar menu alignment：修正三線 menu icon 被 `margin-left: auto` 推離左側的問題，讓 menu icon 固定在 topbar 左側。
- Today itinerary auto jump：開啟旅程時若今天精準對應某一個行程日期，會自動跳到當日行程；若今天不在旅程日期內，保持初始頁首。
- Calendar strip compact UI：移除行程列外層大卡片感、陰影與左右邊框，縮小上下 padding 並隱藏水平捲軸，讓 Day cards 更像貼近頁面的水平導覽。
- Daily card detail order：每日行程卡片內容順序調整為「當日重點、交通 / 時間、住宿、費用」。
- Precise day jump：行程列點選日期時改用 sticky topbar/calendar 高度計算精準捲動位置，避免畫面停在前一天的上傳照片區。
- First edition checklist：新增 `notes/first_edition_checklist.md`，整理第一版資料完整度、優先待補項目與每日行程缺口。
- Mobile calendar continuity：移除行程列的週分組容器，讓 Day 1-23 在手機上成為真正連續的一排，避免週交界出現大空白。
- Row calendar card simplification：行程列 Day card 簡化為 `Day XX` 與日期兩行，手機寬度一屏顯示 3 張完整卡片，選取卡片置中，左右留白與內容區一致。
- Login background cleanup：登入頁背景改為一般淺色背景，不再使用 NY banner；NY banner 保留在旅程主頁 hero。

## 行程重點整理

### Day 1，2026-07-07，台北 -> 首爾 -> 紐約

來源：`attachments/images/international_flights_trip_com_2026-07.png`

- 航班異動提醒：截圖顯示航班發生變更，需查看詳情。
- OZ712：TPE 12:25 -> ICN 15:55。
- OZ224：ICN 21:05 -> JFK 23:00。
- 國際線機票金額：TWD 125,946。
- Trip Coins：963 Trip Coins，約 TWD 304。

### Day 6，2026-07-12，Coney Island

來源：`attachments/raw/coney_island_note.txt`

- 7/12 可以安排 Coney Island 走走。
- 可順便看小聯盟球賽。
- 目前仍需確認球賽時間、票價與交通安排。

### Day 10，2026-07-16，Hoboken Dinner Cruise

來源：

- `attachments/images/hoboken_dinner_cruise_groupon_checkout.jpg`
- `attachments/images/hoboken_dinner_cruise_cornucopia_checkout.jpg`

已知資訊：

- 活動：Hoboken Dinner Cruise，weekday。
- 日期時間：Thursday, July 16, 2026，19:00-22:00。
- 登船時間：18:30。
- 人數：8 人。
- Groupon 截圖金額：US$348.48，promo code `MOM`，畫面顯示 checkout 階段。
- Cornucopia Cruise Line 截圖金額：US$239.28，畫面顯示 checkout 階段。
- 附件可見合計金額：US$587.76，8 人平均約 US$73.47 / 人。

注意事項：

- 目前附件可確認金額組成：Groupon US$348.48 + Cornucopia Cruise Line US$239.28 = US$587.76。
- 正式訂單狀態：附件畫面為 checkout / secure booking 階段，未顯示 payment completed、confirmation number 或正式訂單完成頁。
- 後續若有正式 confirmation 或信用卡付款紀錄，可再補成「已付款並完成訂位」。

### Day 12，2026-07-18，New Jersey -> Miami

來源：

- `attachments/images/united_ewr_mia_roundtrip_review_booking.jpg`
- `attachments/images/beach_plaza_hotel_reservation_details_1.jpg`
- `attachments/images/beach_plaza_hotel_reservation_fees.jpg`

United 機票資訊：

- 訂票狀態：已付款並開票。
- 總額：US$1,375.92，含稅費。
- 去程：Saturday, July 18，EWR 17:29 -> MIA 20:37。
- 回程：Friday, July 24，MIA 17:20 -> EWR 20:26。
- 艙等：Basic Economy。
- 票種或艙位：United Economy (N)。
- 餐飲：Snacks for Purchase。

Beach Plaza Hotel 訂房資訊：

- 飯店：Beach Plaza Hotel。
- 地址：1401 Collins Ave, Miami Beach, FL, US。
- 電話：1-305-531-6421。
- 入住：Saturday, July 18, 2026 at 15:00。
- 退房：Monday, July 20, 2026 at 11:00。
- 住宿：2 天，2 間房。
- Guest Name：Winnie Chang。
- 房型：Standard, 2 Double。
- 入住年齡：需滿 18 歲。
- 付款資訊：2 rooms / 2 nights US$948.28，Taxes & Fees US$216.52，Due Today US$1,164.80。
- 現場押金：Deposit US$150.00 per stay。
- 停車：Covered valet parking fee US$45 per day，含 in/out privileges。
- Late checkout fee：US$49，視供應情況。

注意事項：

- Beach Plaza Hotel 截圖未顯示 booking number，後續若有確認信可再補。
- United EWR-MIA 來回機票已確認付款成功並開票，票價以截圖 header 顯示的 US$1,375.92 為準。

### Day 14-18，2026-07-20 至 2026-07-24，MSC Bahamas Cruise

來源：

- `attachments/images/msc_seaside_booking_69082908.jpg`
- `attachments/images/msc_seaside_booking_69082323.jpg`

共同資訊：

- 郵輪公司：MSC Cruises。
- 船名：MSC SEASIDE。
- 登船日期：2026-07-20。
- 下船日期：2026-07-24。
- 登船港口：Miami, Florida。
- 下船港口：Miami, Florida。
- 艙房類型：OR1 - Ocean view Stateroom，Deluxe Ocean View。
- Experience：FANTASTICA。
- Dining Request：First seating。
- 幣別：USD。
- 每筆 booking 總額：US$1,559.00。
- 訂金：US$396.00，due within 2026-01-06。
- 尾款：US$1,163.00，due within 2026-05-06。
- 截圖顯示已付款：US$396.00。
- 截圖顯示餘額：US$1,163.00。

Booking 69082908：

- Booking confirmation issued：2026-01-07 03:50。
- Booking number：69082908。
- Cabin：5147 - Booked。
- Price description：ESCAPE TO SEA CRUISE ONLY。
- Guest(s)：MAK, KENNETH；LU, WEI YING；LU, CHEN CHAUN；LU, SUNG LIN。

Booking 69082323：

- Booking confirmation issued：2026-01-06 21:35。
- Booking number：69082323。
- Cabin：5151 - Booked。
- Price description：CRUISE ONLY OBC INCLUDED。
- Guest(s)：CHANG, WINNIE；MAK, LIAM；MAK, LUKAS；KUNG, FANG PEI。

注意事項：

- 兩筆 booking 各 4 人，合計 8 人。
- 每筆尾款 US$1,163.00，兩筆合計尾款 US$2,326.00，需確認是否已於 2026-05-06 前付清。
- 這些截圖標示為 Guest Copy，且警語說明文件不是 ticket 或 invoice，正式登船文件仍需另行確認。

### Day 20，2026-07-26，Mets Taiwan Day

來源：`attachments/images/mets_taiwan_day_info.jpg`

- 活動：大都會台灣日，道奇 vs. 大都會。
- 日期時間：2026/07/26 Sunday 13:40。
- 地點：花旗球場 / Mets Stadium，41 Seaver Way, Flushing, NY。
- 付款狀態：已付款。
- 票數 / 人數：8 人。
- 贈品：球衣與茄芷袋，數量有限，售完為止。
- 取票方式：不預先安排座位，需一起取票，英文原文為「We dont prearrange seats just pickup tickets together」。
- Section 524-529：早鳥價 US$95，6/26 後 US$105。
- Section 125-126：已售完，早鳥價 US$215，6/26 後 US$225。
- Box 205 享無限量餐飲：已售完，早鳥價 US$650，6/26 後 US$700。

### Day 22，2026-07-28，仁川住宿

來源：`attachments/pdf/booking_confirmation_1737543963.pdf`

- 平台：Agoda。
- Booking ID：1737543963。
- 住客姓名：Sung Lin Lu。
- Member ID：37847927。
- 飯店：Golden Tulip Incheon Airport Hotel & Suite。
- 地址：8 Huinbawi-ro 59beon-gil, Jung-gu, Incheon, 韓國。
- 入住日期：2026-07-28。
- 退房日期：2026-07-29。
- 入住時間：15:00-00:00。
- 退房時間：12:00。
- 房間數：1。
- 成人：2。
- 兒童：0。
- 房型：Deluxe Hollywood King Room。
- 付款方式：MasterCard，末四碼 9516。
- 未來價格：2026-07-23 以 TWD 收款，KRW 96,158 會在該日換算成 TWD。
- 取消規則：2026-07-25 前可免費取消；入住前 3 天內取消需支付全額房費；No-Show 需支付訂單金額 100%。
- 優惠或備註：HighFloor、AirportTransfer、OZ221 / 16:30。
- Package Benefits：迎賓飲料、來回機場接送、免費停車 5 天。
- 交通安排：2026-07-28 ICN 到飯店搭 MRT；2026-07-29 飯店到 ICN 搭飯店 shuttle。

## 待確認事項

1. Hoboken Dinner Cruise 已可由附件確認合計金額 US$587.76，但仍需正式 confirmation 或付款完成紀錄確認訂單狀態。
2. Coney Island 小聯盟球賽的球隊、開賽時間、票價與購票狀態。
3. 國際線航班異動內容是否需要到 Trip.com 查看完整變更細節。
4. Beach Plaza Hotel 是否有 booking number 或正式確認信。
5. MSC Cruise 兩筆 booking 的尾款是否已付清，以及正式登船文件是否已取得。
