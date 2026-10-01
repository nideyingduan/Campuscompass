# 校航 PWA（广东医科大学）

纯前端静态导航页：把校内常用网站、小程序、App 聚合在一个页面里，手机浏览器打开后可"添加到主屏幕"当 App 用。

> 个人学习项目，非学校官方服务。仅做网址聚合，不涉及任何数据抓取、破解接口或越权功能。
> 采用 **MIT 开源许可**（见 LICENSE），可自由使用、修改与分享，保留署名即可。

---

## 文件说明

```
校内导航PWA/
├── index.html      # 页面本体（含全部样式和卡片数据）
├── manifest.json   # PWA 配置（添加到主屏幕用）
├── sw.js           # 离线缓存（Service Worker）
├── icons/          # 应用图标
│   ├── icon.svg
│   ├── icon-192.png
│   └── icon-512.png
├── qrcodes/        # 小程序二维码图片
│   ├── 订桶装水.jpg
│   ├── 物业报修.jpg
│   └── 广东医缴费.jpg
├── maps/           # 学校地图图片
│   └── 校园地图-东莞.jpg
└── timetables/     # 课表文件（班级名.xls，用"安装课表.bat"自动放入）
    ├── 26级莞临床02班.xls
    └── ...
```

## 怎么加一张卡片（最重要）

打开 `index.html`，往下找到 `const SCHOOLS = {...}`，这就是全部数据。**加卡片 = 在对应学校的 groups → 分类 → items 数组里加一行**，例如：

```js
// 网页卡片（如果是校外需要先连 VPN 的系统，加 vpn: true）
{ name: "我的新入口", url: "https://xxx.com", icon: "globe", desc: "一句话说明", vpn: true },

// 小程序二维码卡片（图片要先放进 qrcodes/ 文件夹）
{ name: "某某小程序", type: "qr", img: "qrcodes/图片名.jpg", icon: "qrcode", desc: "长按识别" },
// 有链接的小程序码：再加 link 字段，点卡片会显示二维码 + 可复制的链接
{ name: "某某小程序", type: "qr", img: "qrcodes/图片名.jpg", link: "https://...", icon: "qrcode", desc: "长按识别" },

// 微信小程序口令卡（点卡片弹出口令 + 复制按钮，去微信粘贴发送后点击打开）
{ name: "某某小程序", type: "wxcopylink", link: "#小程序://小程序名/xxx", icon: "qrcode", desc: "说明" },

// 应用商店提示卡（点卡片弹提示，不做任何跳转）
{ name: "某某App", type: "app", icon: "phone", desc: "说明" },

// 微信搜索提示卡
{ name: "某某小程序", type: "search", icon: "search", desc: "说明" },
```

`icon` 字段决定卡片左边的线性图标，图标库在 `index.html` 里搜 `const ICONS =`，里面的名字都能用（globe 地球、book 书本、wifi 网络、shield 盾牌、wrench 扳手、card 银行卡、home 房子、heart 爱心、flag 旗帜、calendar 日历、code 代码、phone 手机、qrcode 二维码等）。

想加一个新分类，就复制一段 `{ title: "分类名", color: "#十六进制颜色", items: [...] }` 加进去。

## 怎么加一所学校（多校切换）

页面顶部有学校切换按钮，数据都在 `SCHOOLS` 里。**加学校 = 复制一段学校对象**：

```js
const SCHOOLS = {
  gdmu: { name: "广东医科大学", groups: [ ...分类和卡片... ] },
  // ↓ 从这里开始复制
  xxxx: {
    name: "新学校名",
    groups: [
      { title: "分类名", color: "#颜色", items: [ ...卡片... ] },
    ]
  },
};
```

保存后刷新页面，顶部会自动出现新的学校按钮，点击即可切换。二维码图片放进 `qrcodes/` 文件夹，不同学校的图片可以加前缀区分（如 `gdmu-xxx.jpg`）。

**改完任何内容后**：把 `sw.js` 最上面的版本号 `Campuscompass-v12` 改成 `Campuscompass-v13`（每次改内容就 +1），同学重新打开页面才会看到新内容（离线缓存机制要求）。

## 课表功能（可选，当前未启用）

课表功能默认关闭，需要时按三步开启：
1. 把课表 .xls 文件放进 `timetables/` 文件夹（文件名 = "班级名.xls"，如 `26级莞临床02班.xls`）。
2. 在 `index.html` 的 `SCHOOLS` → 广东医科大学对象里，把"课表功能（可选）"注释块打开，填入 学院 → 班级列表。
3. 在"学习考试"分类加一张卡片：`{ name: "课表", type: "timetable", icon: "calendar", desc: "按学院班级查看" }`。

## 使用声明

每次打开页面，第一个弹窗是**使用声明**：说明本页面为个人学习项目、非学校官方服务、不涉及任何越权功能。文案在 `index.html` 里搜索"使用声明"即可修改。

## 本地预览

- 最简单：直接双击 `index.html` 用浏览器打开。
- 完整效果（PWA 功能需要）：在项目文件夹开终端，运行 `npx serve` 或 `python -m http.server 8080`，浏览器访问 `http://localhost:8080`。

## 部署到 GitHub + Vercel（公网可访问）

### 第 1 步：传到 GitHub

1. 注册/登录 [GitHub](https://github.com)（免费）。
2. 右上角 `+` → **New repository** → 名字填 **`Campuscompass`** → 选 **Public**（开源给同学用）→ 不要勾选任何初始化文件 → **Create repository**。
3. 在仓库页面点 **uploading an existing file**（上传已有文件）：
   - 把 `index.html`、`manifest.json`、`sw.js` 拖进去；
   - 点页面顶部把文件夹也拖进去：`icons` 和 `qrcodes` 两个文件夹；
   - 提交（Commit changes）。

### 第 2 步：Vercel 一键部署

1. 注册/登录 [Vercel](https://vercel.com)，用 **GitHub 账号登录**最省事。
2. 点 **Add New... → Project**。
3. 在列表里选刚才那个仓库（`Campuscompass`），Vercel 会自动识别这是静态项目。
4. 直接点 **Deploy**，等一两分钟。
5. 完成后会给你一个网址：`https://Campuscompass-xxx.vercel.app`，这就是公网地址。

### 第 3 步：手机使用

1. 手机浏览器打开 Vercel 给的网址。
2. 右上角菜单（或浏览器地址栏）选 **"添加到主屏幕" / "安装应用"**。
3. 桌面上就会出现"校航"图标，点开即用，支持离线打开。

> 以后改卡片：本地改完重新上传到 GitHub 仓库，Vercel 会自动重新部署，约 1 分钟生效。

## 发布更新（同学怎么拿到新版）

这个项目已经做了**自动更新**：同学每次打开页面都会检查并获取最新版（每次打开检查更新 + 页面文件网络优先 + 检测到新版自动刷新），**不需要重新安装、不用清缓存**。

你更新内容的操作流程：
1. 本地改好文件（如 `index.html` 加卡片）。
2. **把 `sw.js` 顶部版本号 +1**（现在是 `Campuscompass-v12`，改一次内容就 +1，如 v13、v14）。
3. 把改过的文件上传到 GitHub（覆盖同名文件），Vercel 约 1 分钟自动部署。
4. 同学下次打开页面就会自动看到新版；正在使用的同学也会自动刷新。

> 如果加了新图片/新文件，记得把新文件也一起传上 GitHub，否则线上找不到会 404。

## 常见问题

- **微信里打不开某些系统**：微信内置浏览器与系统浏览器 Cookie 不互通。请用手机自带浏览器打开本页并添加到主屏幕。
- **小程序卡片怎么用**：在微信里打开本页 → 长按二维码图片 → 识别 → 打开小程序。系统浏览器里长按无效，需用微信扫一扫。
- **登录状态**：教务系统、智慧学工等登录后，Cookie 保存在你的浏览器里，下次打开自动登录。
- **教务系统外网限制**：教务系统每天 8:00–20:00 才允许校外访问，其他时间需连 VPN。
