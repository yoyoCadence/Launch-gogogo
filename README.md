# Launch-GoGoGo

Launch-GoGoGo 是一個手機優先、可加入主畫面使用的午餐 / 晚餐代訂與儲值金管理工具。第一版不需要登入、不做雲端同步，資料保存在瀏覽器 IndexedDB，並透過 Service Worker 支援離線開啟。

線上版：

```text
https://yoyocadence.github.io/Launch-gogogo/
```

## 檔案結構

```text
.
├── index.html
├── styles.css
├── app.js
├── manifest.json
├── service-worker.js
├── icon.svg
├── icon-192.png
├── icon-512.png
└── README.md
```

## 本機啟動

PWA 與 Service Worker 需要透過 HTTP/HTTPS 來源執行，不建議直接用 `file://` 開啟。

```bash
python -m http.server 8080
```

啟動後打開：

```text
http://localhost:8080
```

也可以用任何靜態檔案伺服器，例如 VS Code Live Server、`npx serve`、`http-server`。

## GitHub Pages 部署

本專案是純靜態 PWA，可直接部署到 GitHub Pages，不需要後端、登入系統或雲端同步。資料會繼續保存在使用者瀏覽器的 IndexedDB。

部署方式：

1. 將程式推送到 GitHub repository 的 `main` branch。
2. 到 GitHub repository 頁面打開 `Settings`。
3. 進入 `Pages`。
4. 在 `Build and deployment` 的 `Source` 選擇 `Deploy from a branch`。
5. Branch 選 `main`，資料夾選 `/ (root)`。
6. 儲存後等待 GitHub Pages 完成部署。

若 repository 名稱是 `Launch-gogogo`，部署網址通常會是：

```text
https://<你的 GitHub 帳號>.github.io/Launch-gogogo/
```

GitHub Pages 會把專案放在 repository 子路徑下，因此本專案所有本機資源都使用 `./` 相對路徑：

- `index.html` 使用 `./manifest.json`、`./styles.css`、`./app.js`。
- `manifest.json` 使用 `./index.html` 作為 `start_url`，並使用 `./` 作為 `scope`。
- `app.js` 使用 `navigator.serviceWorker.register("./service-worker.js")` 註冊 Service Worker。
- `service-worker.js` 快取清單使用 `./`、`./index.html` 等相對路徑。

## PWA 更新方式

App 會偵測新版 Service Worker。當新版已下載完成時，畫面會出現「有新版本可用」提示；按「更新」後會切換新版並重新載入 App。

資料仍保存在瀏覽器 IndexedDB，不會因為按更新而清除。

## Design System

Launch-GoGoGo 的 UI 採用 mobile-first、iOS dark productivity 風格。後續新增畫面或元件時，請沿用這套設計語彙，不要為單一功能新增一次性的視覺規則。

### 視覺方向

- 深色背景：預設使用接近純黑的背景，讓內容與互動元件凸顯。
- 列表優先：資料型內容使用 row + divider，不預設做厚重卡片。
- 膠囊互動：主要按鈕、次要按鈕、底部導航與小型操作都偏向 pill shape。
- 低裝飾：避免過度漸層、外框與陰影；只在 floating nav、toast、modal 這類浮層使用深度。
- 清楚層級：頁面標題大且重，section title 次之，列表主文字清楚，輔助文字使用灰階。

### Token Layer

主要設計 token 定義在 `styles.css` 的 `:root`：

- Color：`--ds-color-background`、`--ds-color-surface`、`--ds-color-surface-raised`、`--ds-color-border`、`--ds-color-text`、`--ds-color-text-secondary`、`--ds-color-primary`
- Spacing：`--ds-space-1` 到 `--ds-space-8`，以 4px / 8px 節奏延伸
- Typography：`--ds-font-caption`、`--ds-font-body`、`--ds-font-list-title`、`--ds-font-section`、`--ds-font-page`
- Radius：`--ds-radius-control`、`--ds-radius-card`、`--ds-radius-sheet`
- Shadow：`--ds-shadow-none`、`--ds-shadow-float`

### Component Rules

- Button：使用既有 `.primary-button`、`.secondary-button`、`.ghost-button`、`.danger-button`，不要新增功能專屬按鈕樣式。
- List row：新增資料列表時優先沿用 `.item` / `.store-card` 的 row + divider pattern。
- Form：欄位使用 `.field`，必填標籤使用 `.required-label`，輔助說明使用 `.field-hint`。
- Modal：新增編輯或設定流程時沿用現有 `<dialog>` bottom sheet 樣式。
- Navigation：主要頁面入口維持 `.bottom-tabs` floating pill navigation。
- Empty state：沒有資料時使用 `.empty`，文字簡短，避免加入大量說明。

### Layout Rules

- 手機優先，桌面只是提供更舒適的最大寬度，不改變主要資訊架構。
- 主要內容使用 section grouping；不要把 page section 包成過多巢狀卡片。
- 新 UI 優先使用既有 token 與 class；真的需要新增 class 時，先確認它可以被其他元件重用。

## 手機加入主畫面

1. 讓手機與電腦在同一個網路，或部署到 HTTPS 靜態網站。
2. 用手機瀏覽器開啟 App 網址。
3. Android Chrome：開啟選單，選「安裝應用程式」或「加入主畫面」。
4. iPhone Safari：按分享按鈕，選「加入主畫面」。

## 資料模型

### Coworker

```js
{
  id: string,
  name: string,
  balance: integer,
  createdAt: ISODateString,
  updatedAt: ISODateString
}
```

`balance` 使用整數金額，不使用浮點數。每次新增、修改、刪除交易後會由交易紀錄重新計算。

### Store

```js
{
  id: string,
  name: string,
  notes: string,
  rating: 1 | 2 | 3 | 4 | 5,
  review: string,
  searchUrl: string,
  customUrl: string,
  availableForLunch: boolean,
  availableForDinner: boolean,
  lunchUsedCount: integer,
  dinnerUsedCount: integer,
  lunchLastUsedDate: string,
  dinnerLastUsedDate: string,
  createdAt: ISODateString,
  updatedAt: ISODateString
}
```

午餐與晚餐使用同一個 Store 資料表，但用 `availableForLunch` / `availableForDinner` 分開顯示與統計。使用者可以把同一家店同時加入午餐與晚餐。

### Transaction

```js
{
  id: string,
  date: "YYYY-MM-DD",
  type: "topup" | "mealOrder" | "adjustment",
  mealType: "lunch" | "dinner" | null,
  coworkerId: string,
  storeId: string | null,
  mealName: string,
  amount: integer,
  paymentMethod: "prepaidBalance" | "cashToday" | "unpaid" | null,
  note: string,
  createdAt: ISODateString,
  updatedAt: ISODateString
}
```

目前 MVP UI 支援 `topup` 與 `mealOrder`。`adjustment` 已保留在模型中，適合下一版加入手動校正餘額。

## 已完成功能

- PWA 基礎架構：manifest、Service Worker、離線快取。
- 四個主要分頁：Ledger、Lunch Stores、Dinner Stores、Settings。
- 設定頁：可切換並保存 App 主題，主題色系參考 Orbit 的主題設計。
- IndexedDB 本機資料保存。
- 同事新增、編輯、刪除與餘額顯示。
- 儲值金新增、編輯、刪除。
- 餐點訂單新增、編輯、刪除。
- 付款方式：儲值金扣款、當天現金付款、尚未付款。
- 儲值金與未付款會更新同事餘額，餘額可為負數。
- 指定日期每日摘要。
- 同事歷史交易紀錄。
- 午餐 / 晚餐店家分開管理。
- 店家新增、編輯、刪除、評分、評語、類型 / 備註、連結。
- 無自訂連結時自動產生 Google 搜尋連結。
- 店家可從午餐加入晚餐，或從晚餐加入午餐。
- 訂餐使用店家後自動更新對應餐別的吃過次數與最後吃的日期。
- 新店家可在新增訂單時直接建立，並歸入對應餐別。
- 預設餐別：14:00 前為午餐，14:00 後為晚餐，表單可手動修改。
- 新增餐點訂單時會標示必填欄位，並依系統時間預選餐別：14:00 前午餐，14:00 後晚餐。

## 下一階段 Roadmap

1. 加入 `adjustment` 手動調整紀錄 UI，讓舊帳或特殊折扣更好處理。
2. 加入資料匯入 / 匯出 JSON，方便換手機與備份。
3. 加入店家菜單或常點餐點清單，讓訂餐輸入更快。
4. 加入每週 / 每月結算報表。
5. 加入搜尋與篩選，例如只看欠款同事、只看某店家紀錄。
6. 加入 iOS 啟動畫面設定與更多尺寸的 PWA 圖示。
7. 未來若需要多人共同使用，再加入雲端同步與權限設計。
