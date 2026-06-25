$css = @'

/* ═══════════════════════════════════════════════════════════
   EXTENDED DESIGN SYSTEM — Platform v2
═══════════════════════════════════════════════════════════ */

/* ── XP / LEVEL SYSTEM ──────────────────────────────────── */
.xp-bar-wrap { display: flex; flex-direction: column; gap: 4px; min-width: 160px; }
.xp-bar-labels { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; }
.xp-bar-track { height: 8px; background: var(--color-surface-3); border-radius: var(--radius-full); overflow: hidden; }
.xp-bar-fill { height: 100%; background: linear-gradient(90deg, var(--color-primary), var(--color-gold)); border-radius: var(--radius-full); transition: width 1s cubic-bezier(0.4,0,0.2,1); }

.level-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: var(--radius-full); font-size: 12px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
.level-a1 { background: rgba(107,114,128,0.2); border: 1px solid rgba(107,114,128,0.4); color: #9ca3af; }
.level-a2 { background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.35); color: #60a5fa; }
.level-b1 { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.35); color: #34d399; }
.level-b2 { background: rgba(0,212,170,0.15); border: 1px solid rgba(0,212,170,0.35); color: #00d4aa; }
.level-c1 { background: rgba(108,99,255,0.2); border: 1px solid rgba(108,99,255,0.4); color: #8b84ff; }
.level-c2 { background: rgba(251,191,36,0.2); border: 1px solid rgba(251,191,36,0.4); color: #fbbf24; }

.nav-streak { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 800; color: var(--color-gold); }
.nav-xp { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: var(--color-primary-light); }
.nav-avatar { width: 36px; height: 36px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--color-primary), var(--color-purple)); display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 800; color: #fff; cursor: pointer; }

/* ── AUTH PAGES ─────────────────────────────────────────── */
.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; background: radial-gradient(ellipse at 20% 50%, rgba(108,99,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,212,170,0.06) 0%, transparent 50%), var(--color-bg); }
.auth-card { width: 100%; max-width: 460px; background: var(--color-surface-2); border: 1px solid var(--color-border-strong); border-radius: var(--radius-2xl); padding: 48px 40px; box-shadow: var(--shadow-lg); }
.auth-title { font-family: var(--font-display); font-size: 26px; font-weight: 900; text-align: center; margin-bottom: 6px; }
.auth-sub { font-size: 14px; color: var(--color-text-2); text-align: center; margin-bottom: 32px; }
.auth-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
.auth-divider span { font-size: 12px; color: var(--color-text-3); font-weight: 600; white-space: nowrap; }
.auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--color-border-strong); }
.auth-google-btn { width: 100%; padding: 13px; border-radius: var(--radius-md); background: var(--color-surface-3); border: 1px solid var(--color-border-strong); color: var(--color-text); font-weight: 700; font-size: 14px; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: var(--transition); }
.auth-google-btn:hover { background: rgba(255,255,255,0.08); }
.auth-footer { text-align: center; font-size: 13px; color: var(--color-text-3); margin-top: 20px; }
.auth-footer a { color: var(--color-primary-light); font-weight: 700; }
.input-label { font-size: 13px; font-weight: 700; color: var(--color-text-2); margin-bottom: 6px; display: block; }
.input-group { margin-bottom: 16px; }

/* ── VOCAB ───────────────────────────────────────────────── */
.word-hero { background: linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(0,212,170,0.08) 100%); border: 1px solid var(--color-border-strong); border-radius: var(--radius-2xl); padding: 40px; position: relative; overflow: hidden; }
.word-main { font-family: var(--font-display); font-size: 52px; font-weight: 900; line-height: 1; margin-bottom: 8px; }
.word-phonetic { font-size: 16px; color: var(--color-text-3); font-style: italic; margin: 4px 0 16px; }
.word-definition { font-size: 16px; line-height: 1.7; color: var(--color-text-2); margin: 12px 0; }
.word-hindi { font-size: 14px; color: var(--color-gold); font-weight: 700; padding: 6px 14px; background: rgba(251,191,36,0.1); border-radius: var(--radius-full); display: inline-block; border: 1px solid rgba(251,191,36,0.2); }
.word-example { padding: 14px 18px; background: var(--color-surface); border-left: 3px solid var(--color-primary); border-radius: 0 var(--radius-md) var(--radius-md) 0; font-size: 14px; font-style: italic; color: var(--color-text-2); margin: 8px 0; }
.synonym-tag { display: inline-block; padding: 4px 12px; background: rgba(108,99,255,0.12); border: 1px solid rgba(108,99,255,0.25); border-radius: var(--radius-full); font-size: 12px; font-weight: 600; color: var(--color-primary-light); margin: 3px; }
.mistake-box { background: rgba(255,107,107,0.08); border: 1px solid rgba(255,107,107,0.2); border-radius: var(--radius-md); padding: 14px 18px; font-size: 13px; line-height: 1.6; }
.vocab-list-item { display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: var(--color-surface-2); border: 1px solid var(--color-border); border-radius: var(--radius-lg); transition: var(--transition); cursor: pointer; }
.vocab-list-item:hover { border-color: var(--color-border-strong); background: var(--color-surface-3); transform: translateX(4px); }
.vocab-list-word { font-weight: 800; font-size: 15px; font-family: var(--font-display); }
.vocab-list-def { font-size: 12px; color: var(--color-text-3); margin-top: 2px; }
.mastery-dots { display: flex; gap: 4px; margin-left: auto; flex-shrink: 0; }
.mastery-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-surface-3); border: 1px solid var(--color-border-strong); }
.mastery-dot.filled { background: var(--color-secondary); border-color: var(--color-secondary); }

/* ── QUIZ ────────────────────────────────────────────────── */
.quiz-option { width: 100%; padding: 16px 20px; text-align: left; background: var(--color-surface-2); border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: 15px; font-weight: 600; color: var(--color-text); cursor: pointer; transition: var(--transition); font-family: inherit; }
.quiz-option:hover { border-color: var(--color-primary); background: rgba(108,99,255,0.08); }
.quiz-option.correct { border-color: var(--color-secondary); background: rgba(0,212,170,0.1); color: var(--color-secondary); }
.quiz-option.wrong { border-color: var(--color-accent); background: rgba(255,107,107,0.08); color: var(--color-accent); }
.quiz-option.selected { border-color: var(--color-primary); background: rgba(108,99,255,0.12); }

/* ── WAVEFORM ────────────────────────────────────────────── */
.waveform { display: flex; align-items: center; justify-content: center; gap: 3px; height: 60px; }
.waveform-bar { width: 4px; border-radius: 2px; background: var(--color-primary); height: 8px; transition: height 0.1s ease; }
.waveform.recording .waveform-bar { animation: wdance 0.8s ease-in-out infinite; }
.waveform-bar:nth-child(2) { animation-delay: 0.1s; }
.waveform-bar:nth-child(3) { animation-delay: 0.2s; }
.waveform-bar:nth-child(4) { animation-delay: 0.3s; }
.waveform-bar:nth-child(5) { animation-delay: 0.2s; }
.waveform-bar:nth-child(6) { animation-delay: 0.1s; }
@keyframes wdance { 0%, 100% { height: 8px; } 50% { height: 40px; } }

/* ── BAR CHART ───────────────────────────────────────────── */
.bar-chart { display: flex; align-items: flex-end; gap: 10px; height: 160px; padding-bottom: 24px; position: relative; }
.bar-chart-col { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; height: 100%; justify-content: flex-end; }
.bar-chart-bar { width: 100%; border-radius: var(--radius-sm) var(--radius-sm) 0 0; background: linear-gradient(180deg, var(--color-primary), var(--color-primary-dark)); transition: height 0.8s cubic-bezier(0.4,0,0.2,1); min-height: 4px; }
.bar-chart-val { font-size: 10px; font-weight: 800; color: var(--color-primary-light); }
.bar-chart-label { font-size: 11px; font-weight: 700; color: var(--color-text-3); }

/* ── CHALLENGE CARDS ─────────────────────────────────────── */
.challenge-card { background: var(--color-surface-2); border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: 28px; position: relative; overflow: hidden; transition: var(--transition-slow); }
.challenge-card:hover { transform: translateY(-3px); border-color: var(--color-border-strong); box-shadow: var(--shadow-md); }
.challenge-icon { font-size: 36px; line-height: 1; margin-bottom: 12px; }
.challenge-title { font-family: var(--font-display); font-size: 18px; font-weight: 800; margin-bottom: 6px; }
.challenge-desc { font-size: 13px; color: var(--color-text-2); line-height: 1.6; margin-bottom: 20px; }
.challenge-xp { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 800; color: var(--color-gold); }

/* ── INTERVIEW ───────────────────────────────────────────── */
.role-card { background: var(--color-surface-2); border: 2px solid var(--color-border); border-radius: var(--radius-xl); padding: 24px; cursor: pointer; transition: var(--transition); text-align: center; }
.role-card:hover { border-color: var(--color-primary); background: rgba(108,99,255,0.08); transform: translateY(-2px); }
.role-card.selected { border-color: var(--color-primary); background: rgba(108,99,255,0.12); box-shadow: var(--shadow-primary); }
.role-icon { font-size: 40px; margin-bottom: 12px; }
.role-title { font-weight: 800; font-size: 15px; font-family: var(--font-display); margin-bottom: 4px; }
.role-level { font-size: 12px; color: var(--color-text-3); }
.interview-scorecard { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.score-item { background: var(--color-surface-3); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 20px; text-align: center; }
.score-item-value { font-family: var(--font-display); font-size: 36px; font-weight: 900; line-height: 1; margin-bottom: 6px; }
.score-item-label { font-size: 12px; font-weight: 700; color: var(--color-text-3); text-transform: uppercase; letter-spacing: 0.06em; }

/* ── TABS ────────────────────────────────────────────────── */
.tab-list { display: flex; gap: 2px; background: var(--color-surface-3); padding: 4px; border-radius: var(--radius-lg); margin-bottom: 28px; flex-wrap: wrap; }
.tab-item { padding: 9px 18px; border-radius: var(--radius-md); font-size: 13px; font-weight: 700; color: var(--color-text-3); cursor: pointer; transition: var(--transition); border: none; background: none; font-family: inherit; white-space: nowrap; }
.tab-item:hover { color: var(--color-text); }
.tab-item.active { background: var(--color-surface-2); color: var(--color-text); box-shadow: var(--shadow-sm); }

/* ── MODE PILLS ──────────────────────────────────────────── */
.mode-pill { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: var(--radius-full); font-size: 13px; font-weight: 700; border: 1px solid var(--color-border-strong); background: var(--color-surface-2); color: var(--color-text-2); cursor: pointer; transition: var(--transition); }
.mode-pill:hover { border-color: var(--color-primary); color: var(--color-primary-light); background: rgba(108,99,255,0.1); }
.mode-pill.active { background: rgba(108,99,255,0.15); border-color: var(--color-primary); color: var(--color-primary-light); }

/* ── STREAK WIDGET ───────────────────────────────────────── */
.streak-widget { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 20px; border-radius: var(--radius-xl); background: linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,191,36,0.04)); border: 1px solid rgba(251,191,36,0.2); }
.streak-flame { font-size: 40px; animation: flicker 2s ease-in-out infinite; }
@keyframes flicker { 0%, 100% { transform: scale(1) rotate(-2deg); } 50% { transform: scale(1.08) rotate(2deg); } }
.streak-number { font-family: var(--font-display); font-size: 36px; font-weight: 900; color: var(--color-gold); line-height: 1; }
.streak-label { font-size: 11px; font-weight: 700; color: rgba(251,191,36,0.7); text-transform: uppercase; letter-spacing: 0.08em; }

/* ── LEADERBOARD ─────────────────────────────────────────── */
.lb-row { display: flex; align-items: center; gap: 14px; padding: 12px 16px; border-radius: var(--radius-md); transition: var(--transition); }
.lb-row:hover { background: rgba(255,255,255,0.03); }
.lb-rank { font-family: var(--font-display); font-size: 18px; font-weight: 900; width: 28px; text-align: center; flex-shrink: 0; }
.lb-rank.gold { color: var(--color-gold); }
.lb-rank.silver { color: #94a3b8; }
.lb-rank.bronze { color: #cd7c2e; }
.lb-avatar { width: 36px; height: 36px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; flex-shrink: 0; }
.lb-name { font-weight: 700; font-size: 14px; flex: 1; }
.lb-xp { font-size: 13px; font-weight: 800; color: var(--color-primary-light); }

/* ── DAILY TASKS ─────────────────────────────────────────── */
.daily-task { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: var(--radius-md); background: var(--color-surface-3); border: 1px solid var(--color-border); transition: var(--transition); }
.daily-task.done .daily-task-check { background: var(--color-secondary); border-color: var(--color-secondary); color: #000; }
.daily-task-check { width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--color-border-strong); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 12px; }
.daily-task-label { font-weight: 700; font-size: 14px; }
.daily-task-sub { font-size: 12px; color: var(--color-text-3); }
.daily-task-xp { margin-left: auto; font-size: 12px; font-weight: 800; color: var(--color-gold); flex-shrink: 0; }

/* ── PROFILE ─────────────────────────────────────────────── */
.profile-hero { display: flex; align-items: center; gap: 28px; padding: 32px; background: linear-gradient(135deg, var(--color-surface-2), var(--color-surface-3)); border: 1px solid var(--color-border); border-radius: var(--radius-2xl); margin-bottom: 28px; }
.profile-avatar { width: 88px; height: 88px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--color-primary), var(--color-purple)); display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 900; color: #fff; flex-shrink: 0; box-shadow: 0 0 0 4px var(--color-surface-2), 0 0 0 6px var(--color-primary); }
.profile-name { font-family: var(--font-display); font-size: 24px; font-weight: 900; margin-bottom: 4px; }
.badge-showcase-item { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px 16px; border-radius: var(--radius-lg); border: 1px solid var(--color-border); text-align: center; transition: var(--transition); }
.badge-showcase-item.earned { background: var(--color-surface-2); }
.badge-showcase-item.locked { background: var(--color-surface-3); opacity: 0.45; }
.badge-emoji { font-size: 32px; }
.badge-name { font-size: 12px; font-weight: 800; }
.badge-desc { font-size: 10px; color: var(--color-text-3); line-height: 1.4; }

/* ── ADMIN ───────────────────────────────────────────────── */
.admin-layout { display: flex; min-height: calc(100vh - 68px); }
.admin-sidebar { width: 220px; flex-shrink: 0; background: var(--color-surface); border-right: 1px solid var(--color-border); padding: 24px 12px; display: flex; flex-direction: column; gap: 4px; position: sticky; top: 68px; height: calc(100vh - 68px); overflow-y: auto; }
.admin-main { flex: 1; padding: 32px; overflow-y: auto; }
.admin-stat { padding: 20px 24px; background: var(--color-surface-2); border: 1px solid var(--color-border); border-radius: var(--radius-lg); }
.admin-stat-num { font-family: var(--font-display); font-size: 28px; font-weight: 900; }
.admin-stat-label { font-size: 12px; color: var(--color-text-3); font-weight: 600; margin-top: 4px; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-3); border-bottom: 1px solid var(--color-border); }
.data-table td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid var(--color-border); }
.data-table tr:hover td { background: rgba(255,255,255,0.02); }
.data-table tr:last-child td { border-bottom: none; }

/* ── SETTINGS ────────────────────────────────────────────── */
.settings-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--color-border); gap: 20px; }
.settings-row:last-child { border-bottom: none; }
.settings-label { font-weight: 700; font-size: 14px; }
.settings-sub { font-size: 12px; color: var(--color-text-3); margin-top: 2px; }
.toggle { position: relative; width: 44px; height: 24px; flex-shrink: 0; display: inline-block; }
.toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
.toggle-slider { position: absolute; inset: 0; background: var(--color-surface-3); border-radius: 24px; border: 1px solid var(--color-border-strong); cursor: pointer; transition: var(--transition); }
.toggle-slider::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: var(--color-text-3); transition: var(--transition); }
.toggle input:checked + .toggle-slider { background: var(--color-primary); border-color: var(--color-primary); }
.toggle input:checked + .toggle-slider::after { transform: translateX(20px); background: #fff; }

/* ── MODAL ───────────────────────────────────────────────── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
.modal-box { background: var(--color-surface-2); border: 1px solid var(--color-border-strong); border-radius: var(--radius-2xl); padding: 40px; max-width: 520px; width: 100%; position: relative; box-shadow: var(--shadow-lg); }
.modal-close { position: absolute; top: 20px; right: 20px; width: 32px; height: 32px; border-radius: var(--radius-sm); background: var(--color-surface-3); color: var(--color-text-3); display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; font-size: 18px; transition: var(--transition); }
.modal-close:hover { background: var(--color-surface); color: var(--color-text); }

/* ── EMPTY STATE ─────────────────────────────────────────── */
.empty-state { text-align: center; padding: 60px 20px; }
.empty-state-icon { font-size: 56px; opacity: 0.3; margin-bottom: 16px; }
.empty-state-title { font-weight: 800; font-size: 18px; margin-bottom: 8px; }
.empty-state-desc { font-size: 14px; color: var(--color-text-3); line-height: 1.6; }

/* ── RESPONSIVE ADDITIONS ────────────────────────────────── */
@media (max-width: 768px) {
  .interview-scorecard { grid-template-columns: 1fr; }
  .auth-card { padding: 32px 24px; }
  .profile-hero { flex-direction: column; text-align: center; }
  .word-main { font-size: 36px; }
  .admin-layout { flex-direction: column; }
  .admin-sidebar { width: 100%; height: auto; position: relative; top: 0; flex-direction: row; flex-wrap: wrap; }
  .tab-list { overflow-x: auto; }
  .mode-pill { padding: 8px 12px; font-size: 12px; }
}
'@

Add-Content -Path "app\globals.css" -Value $css
Write-Host "Done"
