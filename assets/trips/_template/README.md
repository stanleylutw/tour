# 新旅程素材資料夾範本

這個資料夾是 Family Trip Portal 新 tour 的素材結構範本。

建立新旅程時，請複製此結構並改名為實際 tour id，例如：

```text
assets/trips/2027-japan/
```

標準結構：

```text
assets/trips/<tour-id>/
  images/
  attachments/
    images/
    pdf/
    raw/
```

使用規則：

- `images/`：旅程 banner、family logo、封面素材。
- `attachments/images/`：截圖、票券圖片、飯店確認圖。
- `attachments/pdf/`：訂房確認、票券 PDF、收據 PDF。
- `attachments/raw/`：文字、OCR、原始貼上資料。
- 新 tour 的 `data/trips/<tour-id>.json` 必須引用這些相對路徑。
- 不要把新 tour 附件混放到 2026 NY tour 的附件資料夾。
