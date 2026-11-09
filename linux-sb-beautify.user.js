// @updateURL    https://raw.githubusercontent.com/xiaomeng-0126/linux-sb-beautify/main/linux-sb-beautify.user.js
// @downloadURL  https://raw.githubusercontent.com/xiaomeng-0126/linux-sb-beautify/main/linux-sb-beautify.user.js

// ==UserScript==
// @name         LINUX SB · 圆角卡片美化
// @namespace    local.linux-sb.card-theme
// @version      1.0.0
// @description  独立圆角卡片、宽松留白、舒适阅读；支持浅深色、三种强调色、字号与间距设置。
// @match        https://linux.sb/*
// @match        http://linux.sb/*
// @run-at       document-start
// @noframes
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// ==/UserScript==

(() => {
  'use strict';

  const STORAGE_KEY = 'linux-sb-card-theme:v1';
  const STYLE_ID = 'lsb-card-theme-style';
  const HOST_ID = 'lsb-card-theme-controls';
  const DEFAULTS = Object.freeze({
    enabled: true,
    theme: 'site',
    accent: 'mint',
    spacing: 'airy',
    fontSize: 16,
  });

  // All page rules are gated by our own attribute. Switching off restores the
  // site's cascade without rewriting posts, moving elements, or reloading.
  const PAGE_CSS = String.raw`
html[data-lsb-beautify] {
  --bg: #f3f6f4 !important;
  --panel: #ffffff !important;
  --line: #e1e9e4 !important;
  --line-soft: #edf2ee !important;
  --text: #253830 !important;
  --text-muted: #526a5f !important;
  --text-subtle: #64766c !important;
  --text-disabled: #8b9a91 !important;
  --brand: #237b60 !important;
  --brand-hover: #1a644c !important;
  --brand-soft: #e8f3ec !important;
  --success: #28764e !important;
  --success-soft: #e9f5ed !important;
  --danger: #b94653 !important;
  --danger-soft: #fff0f1 !important;
  --warning: #92602c !important;
  --warning-soft: #fff4e5 !important;
  --info: #496daf !important;
  --info-soft: #edf2ff !important;
  --inverse: #172820 !important;
  --inverse-border: #314b3e !important;
  --inverse-text: #f5faf7 !important;
  --shadow-base: rgba(27, 55, 39, .035) !important;
  --shadow-medium: rgba(27, 55, 39, .085) !important;
  --focus-ring: #438a70 !important;
  --radius: 20px !important;
  --radius-sm: 10px !important;
  --lsb-accent-ink: #237b60;
  --lsb-top: rgba(249, 252, 250, .94);
  --lsb-halo: rgba(185, 219, 196, .25);
  --lsb-pin: #f4faf6;
  --lsb-card-shadow: 0 3px 12px rgba(26, 56, 39, .025);
  --lsb-card-hover: 0 7px 22px rgba(26, 56, 39, .065);
  --lsb-card-pad: 22px;
  --lsb-content-pad: 28px;
  --lsb-card-gap: 14px;
  --lsb-avatar: 44px;
  --lsb-font: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", Arial, sans-serif;
  color-scheme: light;
  scrollbar-color: #bccdc1 var(--bg);
}
html[data-lsb-beautify][data-lsb-theme="dark"] {
  --bg: #111a16 !important;
  --panel: #1b2720 !important;
  --line: #33463a !important;
  --line-soft: #29382f !important;
  --text: #e4eee7 !important;
  --text-muted: #b1c3b7 !important;
  --text-subtle: #9caf9f !important;
  --text-disabled: #74877a !important;
  --brand: #2d795e !important;
  --brand-hover: #24614c !important;
  --brand-soft: #263e31 !important;
  --success: #a0d7ae !important;
  --success-soft: #253e2d !important;
  --danger: #d56b78 !important;
  --danger-soft: #412931 !important;
  --warning: #e4be84 !important;
  --warning-soft: #3c3325 !important;
  --info: #a2bcea !important;
  --info-soft: #293747 !important;
  --inverse: #101b15 !important;
  --inverse-border: #314c3b !important;
  --shadow-base: rgba(0, 0, 0, .12) !important;
  --shadow-medium: rgba(0, 0, 0, .24) !important;
  --focus-ring: #a0dbbf !important;
  --lsb-accent-ink: #a0dbbf;
  --lsb-top: rgba(19, 29, 23, .95);
  --lsb-halo: rgba(57, 96, 70, .18);
  --lsb-pin: #203227;
  --lsb-card-shadow: 0 3px 12px rgba(0, 0, 0, .1);
  --lsb-card-hover: 0 8px 24px rgba(0, 0, 0, .2);
  color-scheme: dark;
  scrollbar-color: #485f50 var(--bg);
}
html[data-lsb-beautify][data-lsb-accent="indigo"] {
  --brand: #6256ad !important;
  --brand-hover: #4f448f !important;
  --brand-soft: #eeebf9 !important;
  --lsb-accent-ink: #6256ad;
  --lsb-halo: rgba(199, 190, 229, .24);
  --lsb-pin: #f8f6fc;
  --focus-ring: #796bc2 !important;
}
html[data-lsb-beautify][data-lsb-accent="amber"] {
  --brand: #a3622b !important;
  --brand-hover: #844c21 !important;
  --brand-soft: #faf0e2 !important;
  --lsb-accent-ink: #975622;
  --lsb-halo: rgba(232, 207, 166, .25);
  --lsb-pin: #fdf9f2;
  --focus-ring: #aa743c !important;
}
html[data-lsb-beautify][data-lsb-theme="dark"][data-lsb-accent="indigo"] {
  --brand: #6155a4 !important;
  --brand-hover: #4f4588 !important;
  --brand-soft: #34304b !important;
  --lsb-accent-ink: #cdc2f5;
  --lsb-halo: rgba(104, 88, 150, .12);
  --lsb-pin: #272b30;
  --focus-ring: #cdc2f5 !important;
}
html[data-lsb-beautify][data-lsb-theme="dark"][data-lsb-accent="amber"] {
  --brand: #925b2b !important;
  --brand-hover: #774a23 !important;
  --brand-soft: #403528 !important;
  --lsb-accent-ink: #efc38e;
  --lsb-halo: rgba(140, 104, 52, .12);
  --lsb-pin: #2e3026;
  --focus-ring: #efc38e !important;
}
html[data-lsb-beautify][data-lsb-spacing="balanced"] {
  --lsb-card-pad: 16px;
  --lsb-content-pad: 22px;
  --lsb-card-gap: 10px;
  --lsb-avatar: 40px;
}
html[data-lsb-beautify] body {
  background: radial-gradient(ellipse 70% 440px at 20% 0, var(--lsb-halo), transparent 78%), var(--bg);
  color: var(--text);
  font-family: var(--lsb-font);
  -webkit-font-smoothing: antialiased;
}
html[data-lsb-beautify] ::selection { background: var(--brand-soft); color: var(--text); }
html[data-lsb-beautify] .top {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--lsb-top);
  border-bottom: 1px solid var(--line);
  box-shadow: 0 3px 18px var(--shadow-base);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
html[data-lsb-beautify] .bar { max-width: 1280px; height: 68px; padding: 0 24px; gap: 12px; }
html[data-lsb-beautify] .brand { font-size: 18px; font-weight: 750; letter-spacing: -.35px; }
html[data-lsb-beautify] :is(.bar-left, .bar-right, .bar-action-group) { gap: 8px; }
html[data-lsb-beautify] :is(.forum-link, .forum-more-link) { border-radius: 10px; }
html[data-lsb-beautify] .search-page-fake-input { border-radius: 12px; background: var(--line-soft); }
html[data-lsb-beautify] .wrap { max-width: 1280px; padding: 28px 24px 64px; }
html[data-lsb-beautify] .home-shell {
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
html[data-lsb-beautify] .home-shell .forum-layout { gap: 28px; }
html[data-lsb-beautify] .main-panel:has(> .post-list) { background: transparent; overflow: visible; }
html[data-lsb-beautify] .forum-main { min-width: 0; }
html[data-lsb-beautify] :is(.topic-toolbar, .profile-toolbar) {
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--panel);
  box-shadow: var(--lsb-card-shadow);
}
html[data-lsb-beautify] :is(.topic-toolbar, .profile-toolbar) .tab-bar { flex-wrap: wrap; gap: 5px; }
html[data-lsb-beautify] :is(.topic-toolbar, .profile-toolbar) .tab {
  padding: 9px 14px;
  margin: 0;
  border: 0;
  border-radius: 11px;
  background: transparent;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
}
html[data-lsb-beautify] :is(.topic-toolbar, .profile-toolbar) .tab:hover { background: var(--line-soft); }
html[data-lsb-beautify] :is(.topic-toolbar, .profile-toolbar) .tab.active {
  background: var(--brand-soft);
  color: var(--lsb-accent-ink);
  font-weight: 650;
}
html[data-lsb-beautify] :is(.topic-toolbar, .profile-toolbar) .tab.active::before { display: none; }
html[data-lsb-beautify] .post-list { display: grid; gap: var(--lsb-card-gap); }
html[data-lsb-beautify] .post-list > .post-item {
  gap: 16px;
  min-width: 0;
  padding: var(--lsb-card-pad);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--panel);
  box-shadow: var(--lsb-card-shadow);
  transition: border-color .18s ease, box-shadow .18s ease, background-color .18s ease;
  scroll-margin-top: 92px;
}
html[data-lsb-beautify] .post-list:not(.topic-post-list) > .post-item { min-height: 102px; align-items: flex-start; }
html[data-lsb-beautify] .post-list > .topic-pinned {
  padding-inline-start: calc(var(--lsb-card-pad) - 2px);
  border-inline-start: 3px solid var(--lsb-accent-ink);
  background: linear-gradient(110deg, var(--lsb-pin), var(--panel) 65%);
}
@media (hover: hover) {
  html[data-lsb-beautify] .post-list:not(.topic-post-list) > .post-item:hover {
    border-color: var(--lsb-accent-ink);
    box-shadow: var(--lsb-card-hover);
  }
}
html[data-lsb-beautify] .post-item .post-avatar {
  width: var(--lsb-avatar);
  height: var(--lsb-avatar);
  border-radius: 14px;
  margin-top: 2px;
  box-shadow: 0 0 0 3px var(--line-soft);
}
html[data-lsb-beautify] .post-list:not(.topic-post-list) .post-title {
  color: var(--text);
  font-size: var(--lsb-reading-size, 16px);
  font-weight: 600;
  line-height: 1.7;
  overflow-wrap: anywhere;
}
html[data-lsb-beautify] .post-title:hover { color: var(--lsb-accent-ink); }
html[data-lsb-beautify] .post-list :is(.post-title, .post-content, .post-readability-content, .nb-editor-post-content) { font-family: var(--lsb-font); }
html[data-lsb-beautify][data-lsb-theme="dark"] .post-list:not(.topic-post-list) .post-title[style*="color"] { color: var(--lsb-accent-ink) !important; }
html[data-lsb-beautify] .post-meta { margin-top: 8px; gap: 5px 10px; font-size: 12px; line-height: 1.6; }
html[data-lsb-beautify] .post-meta .meta-icon { width: 12px; height: 12px; }
html[data-lsb-beautify] .post-tag { padding: 5px 9px; margin-top: 3px; border-radius: 8px; background: var(--line-soft); font-size: 11px; }
html[data-lsb-beautify] .topic-badge { height: 21px; padding: 1px 7px; font-size: 11px; }
html[data-lsb-beautify] .topic-badge.pinned { background: var(--brand-soft); color: var(--lsb-accent-ink); }
html[data-lsb-beautify] .topic-pages { gap: 4px; }
html[data-lsb-beautify] .topic-pages a { min-width: 18px; height: 20px; border-radius: 5px; background: var(--line-soft); }
html[data-lsb-beautify] .sidebar { gap: 20px; }
html[data-lsb-beautify] :is(.sidebar > .card, .forum-enhancements-left-navigation, .forum-enhancements-left-announcements) {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--panel);
  box-shadow: var(--lsb-card-shadow);
}
html[data-lsb-beautify] .sidebar :is(.user-wrap, .quick-wrap, .stats-wrap, .online-users-wrap) { padding: 20px; }
html[data-lsb-beautify] :is(.quick-title, .new-users-title) { margin-bottom: 14px; font-size: 14px; font-weight: 650; }
html[data-lsb-beautify] .quick-links a { min-height: 35px; line-height: 1.65; }
html[data-lsb-beautify] .sidebar .btn-post { margin: 0 20px 20px; padding: 12px; border-radius: 12px; }
html[data-lsb-beautify] .sidebar-promotions-wrap { padding: 12px; }
html[data-lsb-beautify] .sidebar-promotions-image-slots { gap: 8px; }
html[data-lsb-beautify] .sidebar-promotions-slot-image { border-radius: 10px; overflow: hidden; }
html[data-lsb-beautify] .sidebar-promotions-text-slots { gap: 6px; margin-top: 12px; }
html[data-lsb-beautify] .sidebar-promotions-slot-text { border: 1px solid var(--line); border-radius: 8px; background: var(--line-soft) !important; color: var(--text-muted) !important; }
html[data-lsb-beautify] .sidebar-promotions-slot-text strong { font-weight: 500; }
html[data-lsb-beautify] .sidebar-promotions-slot-text:hover { background: var(--brand-soft) !important; color: var(--lsb-accent-ink) !important; border-color: var(--lsb-accent-ink); }
html[data-lsb-beautify] .stats-item { padding: 12px 3px; border-radius: 12px; }
html[data-lsb-beautify] .daily-hot-topics-tabs { flex-wrap: wrap; gap: 4px; }
html[data-lsb-beautify] .daily-hot-topics-tabs .tab { padding: 6px 8px; margin: 0; border: 0; border-radius: 8px; background: var(--line-soft); }
html[data-lsb-beautify] .daily-hot-topics-tabs .tab.active { color: var(--lsb-accent-ink); background: var(--brand-soft); }
html[data-lsb-beautify] .forum-enhancements-left-navigation ul { padding: 10px; }
html[data-lsb-beautify] .forum-enhancements-left-navigation li { border: 0; }
html[data-lsb-beautify] .forum-enhancements-left-navigation a { min-height: 39px; padding: 7px; border-radius: 10px; }
html[data-lsb-beautify] .forum-enhancements-left-navigation :is(a:hover, a.active) { color: var(--lsb-accent-ink); background: var(--brand-soft); }
html[data-lsb-beautify] .forum-enhancements-left-announcements { margin-top: 18px; }
html[data-lsb-beautify] .forum-enhancements-left-announcements .quick-wrap { padding: 16px; }
html[data-lsb-beautify] .breadcrumb { padding: 0 3px 14px; color: var(--text-subtle); line-height: 1.7; }
html[data-lsb-beautify] .main-panel > .post-topic-title {
  padding: var(--lsb-content-pad);
  margin-bottom: 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--panel);
  box-shadow: var(--lsb-card-shadow);
}
html[data-lsb-beautify] .main-panel > .post-topic-title .post-content-title { font-size: 26px; line-height: 1.55; letter-spacing: -.3px; }
html[data-lsb-beautify] .main-panel > .post-topic-title .post-content-stats { flex-basis: 100%; margin-top: 8px; gap: 12px; font-size: 12px; }
html[data-lsb-beautify] .topic-post-list > .post-entry { grid-template-columns: var(--lsb-avatar) minmax(0, 1fr); padding: var(--lsb-content-pad); row-gap: 12px; }
html[data-lsb-beautify] .post-entry .post-author { font-size: 14px; line-height: 1.6; font-weight: 650; }
html[data-lsb-beautify] .post-entry > .post-body > .post-meta { margin-top: 6px; gap: 6px 10px; line-height: 1.5; }
html[data-lsb-beautify] .post-entry .post-content { margin-top: 6px; padding-top: 20px; border-top: 1px solid var(--line-soft); }
html[data-lsb-beautify] :is(.post-content, .post-readability-content) { font-size: var(--lsb-reading-size, 16px); line-height: 1.9; }
html[data-lsb-beautify] .topic-post-list .post-entry > .post-content { font-size: var(--lsb-reading-size, 16px); line-height: 1.9; }
html[data-lsb-beautify] .post-content p { margin-bottom: 1em; }
html[data-lsb-beautify] .post-content p:last-child { margin-bottom: 0; }
html[data-lsb-beautify] .post-content :is(h1, h2, h3, h4) { margin: 1.4em 0 .65em; line-height: 1.5; }
html[data-lsb-beautify] .post-content :is(ul, ol) { line-height: 1.9; }
html[data-lsb-beautify] .post-content a:not(.btn):not(.post-mention) { color: var(--lsb-accent-ink); text-underline-offset: 4px; }
html[data-lsb-beautify] .post-content blockquote { margin: 18px 0; padding: 14px 18px; border-left: 3px solid var(--lsb-accent-ink); border-radius: 0 12px 12px 0; background: var(--brand-soft); color: var(--text-muted); }
html[data-lsb-beautify] .post-content :not(pre) > code { padding: .15em .4em; border-radius: 5px; background: var(--line-soft); font-size: .875em; }
html[data-lsb-beautify] .post-content pre { margin: 20px 0; padding: 20px; border-radius: 14px; box-shadow: none; font-size: 13px; line-height: 1.8; }
html[data-lsb-beautify] .post-content :is(th, td) { padding: 11px 14px; }
html[data-lsb-beautify] .post-content img { max-width: 100%; border-radius: 12px; }
html[data-lsb-beautify] .post-signature-content { padding-top: 16px; margin-top: 20px; font-size: 12px; color: var(--text-subtle); }
html[data-lsb-beautify] :is(.reply-panel, .replies-login-visible-card) { margin-top: 20px; padding: 24px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--panel); box-shadow: var(--lsb-card-shadow); }
html[data-lsb-beautify] .reply-panel { scroll-margin-top: 92px; }
html[data-lsb-beautify] .reply-panel textarea { font-size: var(--lsb-reading-size, 16px); line-height: 1.8; }
html[data-lsb-beautify] .pagination-bar { padding: 24px 0; }
html[data-lsb-beautify] .pagination { flex-wrap: wrap; gap: 5px; }
html[data-lsb-beautify] .pagination :is(a, .ellipsis) { min-width: 34px; height: 34px; border-radius: 10px; }
html[data-lsb-beautify] .pagination li.active a { background: var(--brand-soft); color: var(--lsb-accent-ink); font-weight: 650; }
html[data-lsb-beautify] :is(a, button, input, select, textarea):focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 3px; }
html[data-lsb-beautify] .back-to-top-button { right: 24px; bottom: calc(22px + env(safe-area-inset-bottom)); width: 40px; height: 40px; border-radius: 13px; }
html[data-lsb-beautify] .footer { max-width: 1280px; padding: 0 24px 28px; line-height: 1.8; }
@media (min-width: 721px) {
  html[data-lsb-beautify] .forum-layout-has-sidebar { grid-template-columns: minmax(0, 1fr) 260px; }
  html[data-lsb-beautify] .sidebar { width: 260px; }
}
@media (min-width: 1536px) {
  html[data-lsb-beautify] :is(.wrap, .bar) { max-width: min(1280px, calc(100vw - 360px)); }
  html[data-lsb-beautify] .forum-enhancements-left-fixed { top: 96px; left: max(16px, calc((100vw - 1640px) / 2)); width: 164px; max-height: calc(100dvh - 120px); }
}
@media (min-width: 721px) and (max-width: 1000px) {
  html[data-lsb-beautify] .forum-layout-has-sidebar { grid-template-columns: minmax(0, 1fr) 220px; }
  html[data-lsb-beautify] .sidebar { width: 220px; }
  html[data-lsb-beautify] .home-shell .forum-layout { gap: 18px; }
  html[data-lsb-beautify] .sidebar :is(.user-wrap, .quick-wrap, .stats-wrap, .online-users-wrap) { padding: 16px; }
}
@media (max-width: 720px) {
  html[data-lsb-beautify] { --lsb-card-pad: 16px; --lsb-content-pad: 18px; --lsb-card-gap: 12px; --lsb-avatar: 36px; --radius: 17px !important; }
  html[data-lsb-beautify][data-lsb-spacing="balanced"] { --lsb-card-pad: 12px; --lsb-content-pad: 15px; --lsb-card-gap: 9px; }
  html[data-lsb-beautify] .bar { height: 58px; padding: 0 14px; gap: 6px; }
  html[data-lsb-beautify] :is(.bar-left, .bar-right, .bar-action-group) { gap: 4px; }
  html[data-lsb-beautify] .brand { font-size: 16px; }
  html[data-lsb-beautify] .wrap { padding: 18px 12px 92px; }
  html[data-lsb-beautify] .home-shell .forum-layout { gap: 20px; }
  html[data-lsb-beautify] :is(.topic-toolbar, .profile-toolbar) { padding: 6px; margin-bottom: 16px; border-radius: 15px; }
  html[data-lsb-beautify] :is(.topic-toolbar, .profile-toolbar) .tab { padding: 7px 9px; font-size: 12px; }
  html[data-lsb-beautify] .post-list > .post-item { gap: 12px; }
  html[data-lsb-beautify] .post-list:not(.topic-post-list) > .post-item { min-height: 94px; }
  html[data-lsb-beautify] .post-item .post-avatar { border-radius: 11px; box-shadow: 0 0 0 2px var(--line-soft); }
  html[data-lsb-beautify] .post-meta { gap: 4px 7px; font-size: 11px; }
  html[data-lsb-beautify] .mobile-forum-strip { padding-bottom: 5px; margin-bottom: 14px; gap: 6px; }
  html[data-lsb-beautify] .mobile-forum-link { padding: 7px 10px; border-radius: 10px; }
  html[data-lsb-beautify] .mobile-forum-link.active { background: var(--brand-soft); color: var(--lsb-accent-ink); }
  html[data-lsb-beautify] .main-panel > .post-topic-title .post-content-title { font-size: 21px; }
  html[data-lsb-beautify] .topic-post-list > .post-entry { row-gap: 12px; }
  html[data-lsb-beautify] .post-content pre { padding: 15px; font-size: 12px; }
  html[data-lsb-beautify] :is(.reply-panel, .replies-login-visible-card) { padding: 18px; }
  html[data-lsb-beautify] .back-to-top-button { right: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  html[data-lsb-beautify] :is(.post-item, .top, .tab, .card, .post-avatar) { transition: none; }
}
@media print {
  #lsb-card-theme-controls { display: none !important; }
  html[data-lsb-beautify] .top { position: static; }
  html[data-lsb-beautify] .post-list > .post-item { box-shadow: none; }
}
`;

  // Shadow DOM keeps the settings' styles and form controls separate from the
  // forum's forms, delegated handlers, and broad button/input selectors.
  const PANEL_CSS = String.raw`
:host {
  all: initial;
  --ui-bg: #fff;
  --ui-soft: #f4f7f4;
  --ui-line: #e1e9e3;
  --ui-text: #253830;
  --ui-muted: #61766a;
  --ui-accent: #237b60;
  --ui-tint: #e8f3ec;
  --ui-accent-text: #fff;
  position: relative;
  z-index: 100;
  font: 14px/1.6 -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", Arial, sans-serif;
  color: var(--ui-text);
  color-scheme: light;
}
:host([data-theme="dark"]) { --ui-bg: #1b2720; --ui-soft: #24352a; --ui-line: #3b5141; --ui-text: #e5eee7; --ui-muted: #b1c3b7; --ui-accent: #a0dbbf; --ui-tint: #2c4837; --ui-accent-text: #153123; color-scheme: dark; }
:host([data-accent="indigo"]) { --ui-accent: #6256ad; --ui-tint: #eeebf9; }
:host([data-accent="amber"]) { --ui-accent: #a3622b; --ui-tint: #faf0e2; }
:host([data-theme="dark"][data-accent="indigo"]) { --ui-accent: #cdc2f5; --ui-tint: #34304b; }
:host([data-theme="dark"][data-accent="amber"]) { --ui-accent: #efc38e; --ui-tint: #403528; }
*, *::before, *::after { box-sizing: border-box; }
button, input { font: inherit; }
button { cursor: pointer; }
button, input { -webkit-tap-highlight-color: transparent; }
button:focus-visible, input:focus-visible { outline: 2px solid var(--ui-accent); outline-offset: 3px; }
button { color: var(--ui-text); }
svg { display: block; width: 18px; height: 18px; flex: 0 0 auto; }
.launcher { position: fixed; right: 24px; bottom: calc(80px + env(safe-area-inset-bottom)); display: flex; align-items: center; gap: 7px; min-height: 42px; padding: 10px 14px; border: 1px solid var(--ui-line); border-radius: 14px; background: var(--ui-bg); color: var(--ui-accent); box-shadow: 0 6px 24px #172a2020; font-size: 13px; font-weight: 600; }
.launcher:hover { background: var(--ui-tint); border-color: var(--ui-accent); }
.launcher[aria-label*="未启用"] { color: var(--ui-muted); }
dialog { width: min(440px, calc(100vw - 28px)); max-height: calc(100dvh - 36px); padding: 0; margin: auto; overflow: auto; border: 1px solid var(--ui-line); border-radius: 24px; background: var(--ui-bg); color: var(--ui-text); box-shadow: 0 28px 100px #07180e45; overscroll-behavior: contain; }
dialog::backdrop { background: rgba(12, 28, 18, .34); backdrop-filter: blur(5px); }
.panel-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 26px 26px 16px; }
.eyebrow { margin: 0 0 5px; color: var(--ui-accent); font-size: 10px; font-weight: 750; letter-spacing: 1.8px; }
h2 { margin: 0; font-size: 23px; line-height: 1.4; font-weight: 700; letter-spacing: -.5px; }
.close { display: grid; place-items: center; width: 34px; height: 34px; padding: 0; border: 0; border-radius: 50%; background: var(--ui-soft); color: var(--ui-muted); }
.close:hover { background: var(--ui-tint); color: var(--ui-accent); }
.preview { display: flex; align-items: center; gap: 13px; margin: 0 26px 8px; padding: 16px; border: 1px solid var(--ui-line); border-radius: 15px; background: var(--ui-soft); }
.preview-icon { display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid var(--ui-line); border-radius: 12px; background: var(--ui-bg); color: var(--ui-accent); }
.preview strong { font-size: 14px; }
.preview p { margin: 2px 0 0; font-size: 12px; color: var(--ui-muted); }
.panel-body { display: grid; gap: 20px; padding: 18px 26px 22px; }
.enable-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; font-weight: 600; }
.enable-row small { display: block; margin-top: 2px; font-size: 11px; font-weight: 400; color: var(--ui-muted); }
input[role="switch"] { appearance: none; position: relative; width: 42px; height: 25px; flex: 0 0 42px; border: 1px solid var(--ui-line); border-radius: 999px; background: var(--ui-muted); cursor: pointer; }
input[role="switch"]::before { position: absolute; content: ""; width: 17px; height: 17px; top: 3px; left: 3px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px #0003; transition: transform .15s; }
input[role="switch"]:checked { background: var(--ui-accent); border-color: var(--ui-accent); }
input[role="switch"]:checked::before { transform: translateX(17px); background: var(--ui-accent-text); }
fieldset { min-width: 0; padding: 0; margin: 0; border: 0; }
legend, .size-label { padding: 0; margin-bottom: 9px; font-size: 12px; font-weight: 650; color: var(--ui-muted); }
.choices { display: flex; gap: 6px; padding: 4px; border-radius: 12px; background: var(--ui-soft); }
.choices button { flex: 1; min-width: 0; min-height: 37px; padding: 7px 6px; border: 1px solid transparent; border-radius: 9px; background: transparent; font-size: 12px; color: var(--ui-muted); }
.choices button:hover { color: var(--ui-accent); }
.choices button[aria-pressed="true"] { border-color: var(--ui-line); background: var(--ui-bg); color: var(--ui-accent); font-weight: 650; box-shadow: 0 2px 4px #173b2208; }
.swatches { display: flex; gap: 8px; }
.swatches button { flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; min-height: 42px; padding: 7px 4px; border: 1px solid var(--ui-line); border-radius: 11px; background: var(--ui-bg); font-size: 12px; color: var(--ui-muted); }
.swatches button[aria-pressed="true"] { border-color: var(--ui-accent); color: var(--ui-accent); background: var(--ui-tint); font-weight: 600; }
.swatch { width: 12px; height: 12px; border-radius: 50%; }
.size-label { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
output { color: var(--ui-accent); font-variant-numeric: tabular-nums; }
input[type="range"] { width: 100%; margin: 0; accent-color: var(--ui-accent); cursor: pointer; }
.range-labels { display: flex; justify-content: space-between; color: var(--ui-muted); font-size: 10px; }
.panel-foot { padding: 15px 26px 22px; border-top: 1px solid var(--ui-line); }
.foot-actions { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.reset { padding: 7px 0; border: 0; background: transparent; color: var(--ui-muted); font-size: 12px; }
.reset:hover { color: var(--ui-accent); }
.done { min-width: 92px; min-height: 39px; padding: 8px 20px; border: 0; border-radius: 11px; background: var(--ui-accent); color: var(--ui-accent-text); font-weight: 600; }
.status { min-height: 17px; margin: 10px 0 0; color: var(--ui-muted); font-size: 11px; }
@media (max-width: 480px) { .launcher { right: 16px; padding: 10px 12px; } .panel-head { padding: 22px 20px 14px; } .preview { margin-inline: 20px; } .panel-body { padding-inline: 20px; gap: 18px; } .panel-foot { padding-inline: 20px; } }
@media (prefers-reduced-motion: reduce) { *::before { transition: none !important; } }
@media print { :host { display: none !important; } }
`;

  const GRID_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>';

  function normalize(value) {
    const source = value && typeof value === 'object' ? value : {};
    return {
      enabled: typeof source.enabled === 'boolean' ? source.enabled : DEFAULTS.enabled,
      theme: ['site', 'light', 'dark'].includes(source.theme) ? source.theme : DEFAULTS.theme,
      accent: ['mint', 'indigo', 'amber'].includes(source.accent) ? source.accent : DEFAULTS.accent,
      spacing: ['airy', 'balanced'].includes(source.spacing) ? source.spacing : DEFAULTS.spacing,
      fontSize: Number.isFinite(source.fontSize) ? Math.min(20, Math.max(14, Math.round(source.fontSize))) : DEFAULTS.fontSize,
    };
  }

  function readSettings() {
    try {
      const raw = typeof GM_getValue === 'function' ? GM_getValue(STORAGE_KEY, null) : localStorage.getItem(STORAGE_KEY);
      return normalize(typeof raw === 'string' ? JSON.parse(raw) : raw);
    } catch {
      return { ...DEFAULTS };
    }
  }

  function boot() {
    const root = document.documentElement;
    if (document.getElementById(STYLE_ID)) return;

    let settings = readSettings();
    let host;
    let shadow;
    let dialog;
    let returnFocus;
    const media = matchMedia('(prefers-color-scheme: dark)');
    const themeAttributes = ['data-dark-mode-theme', 'data-color-scheme-dark-mode-theme', 'data-themes-color-mode'];

    if (typeof GM_addStyle === 'function') {
      const sheet = GM_addStyle(PAGE_CSS);
      if (sheet) sheet.id = STYLE_ID;
    } else {
      const sheet = document.createElement('style');
      sheet.id = STYLE_ID;
      sheet.textContent = PAGE_CSS;
      (document.head || root).append(sheet);
    }

    function resolvedTheme() {
      if (settings.theme !== 'site') return settings.theme;
      for (const attribute of themeAttributes) {
        const value = root.getAttribute(attribute);
        if (value === 'dark' || value === 'light') return value;
      }
      return media.matches ? 'dark' : 'light';
    }

    function apply() {
      const theme = resolvedTheme();
      if (settings.enabled) {
        root.setAttribute('data-lsb-beautify', '');
        root.setAttribute('data-lsb-theme', theme);
        root.setAttribute('data-lsb-accent', settings.accent);
        root.setAttribute('data-lsb-spacing', settings.spacing);
        root.style.setProperty('--lsb-reading-size', `${settings.fontSize}px`);
      } else {
        ['data-lsb-beautify', 'data-lsb-theme', 'data-lsb-accent', 'data-lsb-spacing'].forEach(name => root.removeAttribute(name));
        root.style.removeProperty('--lsb-reading-size');
      }
      if (!host) return;
      host.dataset.theme = theme;
      host.dataset.accent = settings.accent;
      shadow.querySelector('.launcher').setAttribute('aria-label', settings.enabled ? '打开美化外观设置' : '打开美化外观设置（未启用）');
      shadow.querySelector('[name="enabled"]').checked = settings.enabled;
      shadow.querySelectorAll('[data-field]').forEach(button => {
        button.setAttribute('aria-pressed', String(settings[button.dataset.field] === button.dataset.value));
      });
      shadow.querySelector('[name="fontSize"]').value = String(settings.fontSize);
      shadow.querySelector('output').value = `${settings.fontSize} px`;
    }

    function save() {
      settings = normalize(settings);
      apply();
      let saved = true;
      try {
        const value = JSON.stringify(settings);
        if (typeof GM_setValue === 'function') GM_setValue(STORAGE_KEY, value);
        else localStorage.setItem(STORAGE_KEY, value);
      } catch {
        saved = false;
      }
      if (shadow) {
        shadow.querySelector('.status').textContent = saved
          ? (settings.enabled ? '设置已保存，下次访问会自动使用。' : '已切回原站样式，可随时重新启用。')
          : '当前页面已生效，浏览器未能保存设置。';
      }
    }

    function openPanel() {
      if (!dialog) {
        if (document.body) mount();
        else document.addEventListener('DOMContentLoaded', openPanel, { once: true });
      }
      if (!dialog || dialog.open) return;
      returnFocus = shadow.activeElement || document.activeElement;
      dialog.showModal();
      shadow.querySelector('.launcher').setAttribute('aria-expanded', 'true');
    }

    function mount() {
      if (host || document.getElementById(HOST_ID)) return;
      host = document.createElement('div');
      host.id = HOST_ID;
      shadow = host.attachShadow({ mode: 'open' });
      // This markup is entirely static; no page content or stored value is
      // interpolated as HTML. User preferences are applied via DOM properties.
      shadow.innerHTML = `
        <style>${PANEL_CSS}</style>
        <button class="launcher" type="button" aria-label="打开美化外观设置" aria-haspopup="dialog" aria-expanded="false" aria-controls="appearance">${GRID_ICON}<span>外观</span></button>
        <dialog id="appearance" aria-labelledby="appearance-title" aria-describedby="appearance-description">
          <header class="panel-head">
            <div><p class="eyebrow">LINUX SB · CARD THEME</p><h2 id="appearance-title">外观设置</h2></div>
            <button class="close" type="button" aria-label="关闭外观设置" autofocus><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
          </header>
          <div class="preview"><div class="preview-icon">${GRID_ICON}</div><div><strong>圆角卡片，宽松留白</strong><p id="appearance-description">把界面调成你喜欢的样子。</p></div></div>
          <div class="panel-body">
            <label class="enable-row"><span>启用界面美化<small>关闭后即时恢复原站样式</small></span><input name="enabled" type="checkbox" role="switch"></label>
            <fieldset><legend>明暗模式</legend><div class="choices">
              <button type="button" data-field="theme" data-value="site">跟随原站</button>
              <button type="button" data-field="theme" data-value="light">浅色</button>
              <button type="button" data-field="theme" data-value="dark">深色</button>
            </div></fieldset>
            <fieldset><legend>强调色</legend><div class="swatches">
              <button type="button" data-field="accent" data-value="mint"><span class="swatch" style="background:#438d6b" aria-hidden="true"></span>薄荷绿</button>
              <button type="button" data-field="accent" data-value="indigo"><span class="swatch" style="background:#8471be" aria-hidden="true"></span>鸢尾紫</button>
              <button type="button" data-field="accent" data-value="amber"><span class="swatch" style="background:#c68c4a" aria-hidden="true"></span>暖杏橙</button>
            </div></fieldset>
            <fieldset><legend>卡片间距</legend><div class="choices">
              <button type="button" data-field="spacing" data-value="airy">留白充足</button>
              <button type="button" data-field="spacing" data-value="balanced">适中</button>
            </div></fieldset>
            <div><label class="size-label" for="reading-size">阅读字号<output for="reading-size">16 px</output></label><input id="reading-size" name="fontSize" type="range" min="14" max="20" step="1"><div class="range-labels" aria-hidden="true"><span>14 px</span><span>20 px</span></div></div>
          </div>
          <footer class="panel-foot"><div class="foot-actions"><button class="reset" type="button">恢复默认</button><button class="done" type="button">完成</button></div><p class="status" role="status" aria-live="polite">调整即时生效，设置会自动保存。</p></footer>
        </dialog>`;
      document.body.append(host);
      dialog = shadow.querySelector('dialog');
      shadow.addEventListener('click', event => event.stopPropagation());
      shadow.addEventListener('keydown', event => {
        if (event.key === 'Escape') event.stopPropagation();
      });
      shadow.querySelector('.launcher').addEventListener('click', openPanel);
      shadow.querySelectorAll('.close, .done').forEach(button => button.addEventListener('click', () => dialog.close()));
      dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
      });
      dialog.addEventListener('close', () => {
        shadow.querySelector('.launcher').setAttribute('aria-expanded', 'false');
        if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
      });
      shadow.querySelector('[name="enabled"]').addEventListener('change', event => {
        settings.enabled = event.target.checked;
        save();
      });
      shadow.querySelectorAll('[data-field]').forEach(button => button.addEventListener('click', () => {
        settings[button.dataset.field] = button.dataset.value;
        save();
      }));
      shadow.querySelector('[name="fontSize"]').addEventListener('input', event => {
        settings.fontSize = Number(event.target.value);
        save();
      });
      shadow.querySelector('.reset').addEventListener('click', () => {
        settings = { ...DEFAULTS };
        save();
      });
      apply();
    }

    apply();
    // Observe only the site's three theme attributes, never the post subtree.
    new MutationObserver(apply).observe(root, { attributes: true, attributeFilter: themeAttributes });
    media.addEventListener('change', () => { if (settings.theme === 'site') apply(); });

    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('圆角卡片 · 外观设置', openPanel);
      GM_registerMenuCommand('圆角卡片 · 启用 / 恢复原站', () => {
        settings.enabled = !settings.enabled;
        save();
      });
    }
    if (document.body) mount();
    else document.addEventListener('DOMContentLoaded', mount, { once: true });
  }

  if (document.documentElement) boot();
  else {
    const ready = new MutationObserver(() => {
      if (!document.documentElement) return;
      ready.disconnect();
      boot();
    });
    ready.observe(document, { childList: true });
  }
})();
