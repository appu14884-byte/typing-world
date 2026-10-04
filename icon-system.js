(() => {
  const paths = {
    keyboard: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M6 9h.01M9.5 9h.01M13 9h.01M16.5 9h.01M6 12h.01M9.5 12h.01M13 12h.01M16.5 12h.01M8 15h8"/>',
    home: '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/>',
    gamepad: '<path d="M6 12h4m-2-2v4"/><path d="M15.5 11.5h.01M18 13.5h.01"/><path d="M7 7h10a4 4 0 0 1 3.8 5.2l-1.1 3.6a2.4 2.4 0 0 1-3.9 1.1L13 15h-2l-2.8 1.9a2.4 2.4 0 0 1-3.9-1.1l-1.1-3.6A4 4 0 0 1 7 7Z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    trophy: '<path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4"/>',
    chart: '<path d="M4 19V5m0 14h17"/><path d="m7 15 4-4 3 2 5-6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.8Z"/>',
    flame: '<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-2-1-3-3-3-5-3 3-4 6-4 9a7 7 0 0 0 7 7Z"/><path d="M12 22a3 3 0 0 0 3-3c0-1.5-1-2.5-2-3.5-1 1-4 2-4 3.5a3 3 0 0 0 3 3Z"/>',
    star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>',
    play: '<path d="m8 5 12 7-12 7V5Z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    bolt: '<path d="m13 2-3 8h7l-6 12 2-9H6l7-11Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5m0 3h.01"/>',
    award: '<circle cx="12" cy="8" r="5"/><path d="m8.2 12-1.2 9 5-3 5 3-1.2-9"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    leaf: '<path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 10-6 8-16Z"/><path d="M4 21c3-5 7-8 12-11"/>',
    city: '<path d="M4 21V8l6-4v17m0-11h10v11M2 21h20"/><path d="M7 8h.01M7 12h.01M7 16h.01M14 13h.01M17 13h.01M14 17h.01M17 17h.01"/>',
    rocket: '<path d="M5 15c-1.5 1-2 3-2 5 2 0 4-.5 5-2m-3-3 5 5"/><path d="M12 16 8 12c1-5 5-9 13-10 0 8-5 12-9 14Z"/><circle cx="15" cy="8" r="1.5"/>',
    castle: '<path d="M3 21V9l3 2 3-2 3 2 3-2 3 2 3-2v12M2 21h20M9 21v-5h6v5M6 6V3h3v4m6-1V3h3v4"/>',
    robot: '<rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4m-4 5h.01M16 12h.01M9 16h6M2 12h2m16 0h2"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9A7 7 0 0 1 18 6l2 2M4 16l2 2a7 7 0 0 0 12.5-3"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    arrowLeft: '<path d="M19 12H5m6 6-6-6 6-6"/>',
    rain: '<path d="M20 16.2A4.5 4.5 0 0 0 18 7.7 6 6 0 0 0 6.4 9 3.5 3.5 0 0 0 7 16h13Z"/><path d="m8 19-1 2m6-2-1 2m6-2-1 2"/>',
    crown: '<path d="m2 8 5 4 5-7 5 7 5-4-2 12H4L2 8Z"/><path d="M4 20h16"/>',
    celebration: '<path d="m12 3 1.4 4.3L18 9l-4.6 1.7L12 15l-1.4-4.3L6 9l4.6-1.7L12 3Z"/><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14ZM5 15l.6 1.4L7 17l-1.4.6L5 19l-.6-1.4L3 17l1.4-.6L5 15Z"/>',
    moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3 3.8M6.2 6.2C3.5 8.1 2 12 2 12s3.5 7 10 7c1.2 0 2.3-.2 3.3-.6"/>',
    google: '<path d="M21 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3.1c1.8-1.7 2.7-4.2 2.7-7.2Z"/><path d="M12 21c2.5 0 4.6-.8 6.2-2.2l-3.1-2.4c-.9.6-1.9 1-3.1 1-2.4 0-4.5-1.6-5.2-3.8H3.6v2.5A9.4 9.4 0 0 0 12 21Z"/><path d="M6.8 13.6a5.7 5.7 0 0 1 0-3.3V7.8H3.6a9.3 9.3 0 0 0 0 8.3l3.2-2.5Z"/><path d="M12 6.5c1.4 0 2.6.5 3.6 1.4l2.7-2.7A9 9 0 0 0 12 3a9.4 9.4 0 0 0-8.4 4.8l3.2 2.5C7.5 8.1 9.6 6.5 12 6.5Z"/>',
    userPlus: '<path d="M15 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6m-3-3h6"/>',
    logOut: '<path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>',
    lockKey: '<rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4m-5 4v2"/>',
    userCheck: '<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>'
  };

  const symbols = {
    '⌨': 'keyboard',
    '🏠': 'home',
    '⌂': 'home',
    '🎮': 'gamepad',
    '🌎': 'globe',
    '🌍': 'globe',
    '🌐': 'globe',
    '🏆': 'trophy',
    '📊': 'chart',
    '📈': 'chart',
    '👤': 'user',
    '⚙': 'settings',
    '🔥': 'flame',
    '⭐': 'star',
    '🌟': 'star',
    '🚀': 'rocket',
    '▶': 'play',
    '🎯': 'target',
    '⚡': 'bolt',
    '⏱': 'clock',
    '⏰': 'clock',
    '❌': 'alert',
    '⚠': 'alert',
    '🏃': 'bolt',
    '🎖': 'award',
    '🔒': 'lock',
    '🌱': 'leaf',
    '🏙': 'city',
    '🏰': 'castle',
    '🤖': 'robot',
    '→': 'arrow',
    '✓': 'check',
    '✅': 'check',
    '↻': 'refresh',
    '📅': 'calendar',
    '🔍': 'search',
    '←': 'arrowLeft',
    '🌧': 'rain',
    '👑': 'crown',
    '🎉': 'celebration',
    '◐': 'moon',
    '✉': 'mail',
    '✉️': 'mail',
    '👁': 'eye',
    '👁️': 'eye',
    '🔑': 'lockKey',
    '＋': 'userPlus'
  };

  const colors = {
    home: 'purple',
    keyboard: 'cyan',
    gamepad: 'green',
    globe: 'teal',
    trophy: 'gold',
    chart: 'blue',
    user: 'pink',
    settings: 'slate',
    flame: 'orange',
    star: 'gold',
    play: 'purple',
    target: 'green',
    bolt: 'blue',
    clock: 'cyan',
    alert: 'red',
    award: 'gold',
    lock: 'slate',
    leaf: 'green',
    city: 'cyan',
    rocket: 'blue',
    castle: 'purple',
    robot: 'teal',
    arrow: 'purple',
    check: 'green',
    refresh: 'cyan',
    calendar: 'orange',
    search: 'blue',
    arrowLeft: 'purple',
    rain: 'cyan',
    crown: 'gold',
    celebration: 'gold',
    moon: 'slate',
    mail: 'cyan',
    eye: 'slate',
    eyeOff: 'slate',
    google: 'blue',
    userPlus: 'pink',
    logOut: 'red',
    lockKey: 'slate',
    userCheck: 'green'
  };

  const makeIcon = (name) => {
    const wrapper = document.createElement('span');
    wrapper.className = `tw-icon tw-icon-${name} tw-icon-color-${colors[name] || 'purple'}`;
    wrapper.setAttribute('aria-hidden', 'true');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML = paths[name];
    wrapper.appendChild(svg);
    return wrapper;
  };

  const targets = [
    '.nav-link', '.mobile-nav a', '.brand-mark', '.icon-button', '.menu-button',
    '.home-feature-icon', '.feature-icon', '.world-emoji', '.home-world-emoji',
    '.stat-icon', '.eyebrow', '.home-eyebrow', '.btn', '.home-button', '.pill',
    '.level-badge', '.home-streak', '.home-challenge-mark', '.achievement-icon',
    '.settings-icon', '.home-value-strip > div', '.home-section-kicker',
    '.home-challenge-kicker', '.home-level-icon', '.home-world-state',
    '.home-text-link', '.section-head h2', '.world-action', '.home-final-actions',
    '.home-trust-list', '.home-live-stats', '.home-world-number', '.home-stat-caption',
    '.home-level-arrow', '.home-analytics-header > a', '.home-empty-icon',
    '.brand', '.settings-section-heading', '.settings-note', '.home-float-key', '.auth-page'
  ].join(',');

  const convertTextNode = (node) => {
    if (!node.parentNode || node.parentElement?.closest('.tw-icon,script,style,textarea,input,select')) return;
    const text = node.nodeValue;
    const emojiPattern = /[⌨⌂🏠🎮🌎🌍🌐🏆📊📈👤⚙🔥⭐🌟🚀▶🎯⚡⏱⏰❌⚠🏃🎖🔒🌱🏙🏰🤖→✓✅↻📅🔍←🌧👑🎉◐✉👁🔑＋]/gu;
    let match;
    let lastIndex = 0;
    const replacements = [];
    while ((match = emojiPattern.exec(text))) {
      const key = match[0].replace(/\uFE0F/g, '');
      const name = symbols[key];
      if (name) replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        name
      });
    }
    if (!replacements.length) return;
    const fragment = document.createDocumentFragment();
    replacements.forEach(({
      start,
      end,
      name
    }) => {
      if (start > lastIndex) fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
      fragment.appendChild(makeIcon(name));
      lastIndex = end;
    });
    if (lastIndex < text.length) fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    node.parentNode.replaceChild(fragment, node);
  };

  const scan = (root = document) => {
    if (root.nodeType === Node.ELEMENT_NODE && root.matches?.(targets)) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(convertTextNode);
      return;
    }
    root.querySelectorAll?.(targets).forEach((element) => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(convertTextNode);
    });
  };

  scan();
  const observer = new MutationObserver((records) => {
    records.forEach((record) => record.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) scan(node);
      else if (node.nodeType === Node.TEXT_NODE) convertTextNode(node);
    }));
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
