(() => {
  const STORE_KEY = 'typingWorldSave';
  const readSavedData = () => {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    } catch {
      return {};
    }
  };

  const saved = readSavedData();
  const tests = Array.isArray(saved.tests) ? saved.tests : [];
  const bestWpm = Number(saved.bestWpm || 0);

  document.querySelectorAll('[data-home-world]').forEach((card) => {
    const worldIndex = Number(card.dataset.homeWorld);
    const requirement = Number(card.querySelector('[data-world-requirement]')?.dataset.worldRequirement || 0);
    const unlocked = worldIndex === 0 || bestWpm >= requirement;
    card.classList.toggle('is-available', unlocked);
    card.classList.toggle('is-locked', !unlocked);

    if (worldIndex === 0) return;

    const status = card.querySelector('.home-world-state');
    if (unlocked) {
      card.href = '/practice';
      status.textContent = 'Unlocked';
      status.insertAdjacentHTML('beforeend', ' <span aria-hidden="true">→</span>');
    } else {
      card.href = '/worlds';
      status.textContent = `🔒 Unlock at ${requirement} WPM`;
    }
  });

  const chartWrap = document.getElementById('homeChartWrap');
  const emptyState = document.getElementById('homeProgressEmpty');
  const recentActivity = document.getElementById('homeRecentActivity');
  const chart = document.getElementById('homeProgressChart');

  const recentTests = tests.slice(0, 6).reverse();
  if (!recentTests.length || !chartWrap || !emptyState || !chart) return;

  chartWrap.hidden = false;
  emptyState.hidden = true;

  const width = 600;
  const height = 160;
  const padding = 12;
  const wpmValues = recentTests.map((test) => Number(test.wpm) || 0);
  const accuracyValues = recentTests.map((test) => Number(test.accuracy) || 0);
  const maxWpm = Math.max(...wpmValues, 1);
  const minAccuracy = Math.min(...accuracyValues);
  const maxAccuracy = Math.max(...accuracyValues);
  const accuracyRange = Math.max(maxAccuracy - minAccuracy, 1);
  const xAt = (index) => recentTests.length === 1 ?
    width / 2 :
    padding + index * (width - padding * 2) / (recentTests.length - 1);
  const wpmYAt = (value) => height - padding - (value / maxWpm) * (height - padding * 2);
  const accuracyYAt = (value) => height - padding - ((value - minAccuracy) / accuracyRange) * (height - padding * 2);
  const wpmPoints = wpmValues.map((value, index) => `${xAt(index)},${wpmYAt(value)}`).join(' ');
  const accuracyPoints = accuracyValues.map((value, index) => `${xAt(index)},${accuracyYAt(value)}`).join(' ');
  const grid = [0, 1, 2, 3].map((line) => {
    const y = padding + line * (height - padding * 2) / 3;
    return `<line class="home-grid-line" x1="0" y1="${y}" x2="${width}" y2="${y}" />`;
  }).join('');
  const dots = wpmValues.map((value, index) =>
    `<circle class="home-chart-dot" cx="${xAt(index)}" cy="${wpmYAt(value)}" r="4"><title>${Math.round(value)} WPM</title></circle>`
  ).join('');

  chart.innerHTML = `${grid}<polyline class="home-accuracy-line" points="${accuracyPoints}" /><polyline class="home-speed-line" points="${wpmPoints}" />${dots}`;
  chart.setAttribute('aria-label', `Recent practice: ${recentTests.map((test) => `${Math.round(Number(test.wpm) || 0)} WPM, ${Math.round(Number(test.accuracy) || 0)} percent accuracy`).join('; ')}`);

  if (recentActivity) {
    const latest = tests[0];
    const summary = document.getElementById('homeRecentSummary');
    const date = document.getElementById('homeRecentDate');
    if (latest && summary && date) {
      summary.textContent = `${Math.round(Number(latest.wpm) || 0)} WPM · ${Math.round(Number(latest.accuracy) || 0)}% accuracy`;
      date.textContent = latest.date || 'Recent session';
      recentActivity.hidden = false;
    }
  }
})();
