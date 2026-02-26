(function () {
  'use strict';

  // ----------------------------
  // Data model (easy to maintain)
  // ----------------------------
  const DATA = [
    {
      id: 'client',
      title: 'Client Software Installers',
      hint: 'Common workstation installs',
      icon: 'download',
      items: [
        { name: 'Microsoft Office 365', href: '/downloads/OfficeSetup.exe', desc: 'M365 Office application installer' },
        { name: 'HP Image Assistant', href: '/downloads/hp-hpia-5.3.3.exe', desc: 'Version 5.3.3' },
        { name: 'Splashtop Streamer', href: '/downloads/streamersetup.msi', desc: 'Version 3.7.4.4' },
        { name: 'Splashtop Streamer - Z stock', href: '/downloads/Splashtop_Streamer_Windows_v3.8.0.4.exe', desc: 'Version 3.8.0.4 - Remote Client Management - Z Stock' },
        { name: 'Sentinel One', href: '/downloads/SentinelInstaller_windows_64bit_v25_1_4_434.msi', desc: 'Version 25.1.4.434' },
        { name: 'Ninite', href: '/downloads/tsninite.exe', desc: 'Package includes Chrome, .NET 4.8, and more' },
      ],
    },
    {
      id: '3cx',
      title: '3CX Downloads',
      hint: 'ISOs, SBC, and TS utilities',
      icon: 'phone',
      items: [
        { name: '3CX SBC v20 Installer', href: '/downloads/3CXSBC20.msi', desc: 'Version 20 - Updated 2024-01-15' },
        { name: '3CX Prep Tool', href: '/downloads/3cxprep.v0.2.3.exe', desc: 'Version 0.2.3 - Scanner for 3CX compatibility' },
        { name: '3CX Windows Client v20', href: '/downloads/3CX-WIN-CLIENT-V20.msix', desc: 'Windows Desktop App - Version 20.0.1.0' },
        { name: '3CX v18 ISO', href: '/downloads/debian-amd64-netinst-3cx-v18.iso', desc: 'Debian 10 ISO with 3CX v18' },
        { name: '3CX v20 ISO', href: '/downloads/debian-amd64-netinst-3cx-v20.iso', desc: 'Debian 12 ISO with 3CX v20' },
      ],
    },
    {
      id: 'network',
      title: 'Network Tools',
      hint: 'Scanning, packet capture, SSH',
      icon: 'network',
      items: [
        { name: 'TS Watchdog', href: '/downloads/watchdog.v0.30b.exe', desc: 'Version 0.30b - Watchdog and network utility' },
        { name: 'Advanced IP Scanner', href: '/downloads/Advanced_IP_Scanner_2.5.4594.1.exe', desc: 'Version 2.5.4594.1 - Network scanner' },
        { name: 'Wireshark Portable', href: '/downloads/WiresharkPortable64_4.4.6.paf.exe', desc: 'Version 4.4.6 - Network protocol analyzer' },
        { name: 'PuTTY', href: '/downloads/putty.exe', desc: 'Version 0.83 - SSH and telnet client' },
      ],
    },
    {
      id: 'system',
      title: 'System Utilities',
      hint: 'Cleanup and diagnostics',
      icon: 'tools',
      items: [
        { name: 'CCleaner', href: '/downloads/ccsetup635.exe', desc: 'Version 6.35 - System optimization tool' },
        { name: 'Revo Uninstaller', href: '/downloads/RevoUninstaller_Portable.zip', desc: 'Version 2.5.8 - Advanced application removal' },
        { name: 'HWiNFO', href: '/downloads/hwi_824.zip', desc: 'Version 8.22.5670 - Hardware information tool' },
        { name: 'Malwarebytes', href: '/downloads/MBSetup.exe', desc: 'Version 5.3 - Malware and threat removal tool' },
        { name: 'AdwCleaner', href: '/downloads/adwcleaner.exe', desc: 'Version 8.5.0 - Adware and PUP cleanup utility' },

        // Added per request:
        { name: 'SpaceSniffer', href: '/downloads/spacesniffer_1_3_0_2.zip', desc: 'Version 1.3.0.2 - Disk space visualization tool' },
      ],
    },
  ];

  // ----------------------------
  // Utilities
  // ----------------------------
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  function icons(name) {
    // Simple inline SVG set
    switch (name) {
      case 'download':
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5 21h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>`;
      case 'phone':
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6.5 3.5h3l1 4-2 1.5a14 14 0 0 0 6 6L16 13.5l4 1v3c0 1-1 2-2 2-8.5 0-15.5-7-15.5-15.5 0-1 1-2 2-2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        </svg>`;
      case 'network':
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M7 7h10v6H7V7Z" stroke="currentColor" stroke-width="2"/>
          <path d="M12 13v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M9 21h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>`;
      case 'tools':
      default:
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M14 7 7 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M10 6a4 4 0 1 0 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M16 18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>`;
    }
  }

  function toast(title, msg) {
    const host = $('#toastHost');
    if (!host) return;

    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `
      <div class="toast__dot"></div>
      <div>
        <div class="toast__title">${escapeHtml(title)}</div>
        <div class="toast__msg">${escapeHtml(msg)}</div>
      </div>
    `;
    host.appendChild(el);

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(4px)';
      el.style.transition = 'opacity 200ms ease, transform 200ms ease';
    }, 2800);

    setTimeout(() => el.remove(), 3200);
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  async function copyText(text) {
    // Clipboard API
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Fallback
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        return ok;
      } catch (e2) {
        return false;
      }
    }
  }

  function isLocalFile() {
    return location.protocol === 'file:';
  }

  // ----------------------------
  // Rendering
  // ----------------------------
  function render(categories, filterText = '') {
    const container = $('#categories');
    const meta = $('#resultsMeta');
    const empty = $('#emptyState');

    if (!container) return;

    const q = filterText.trim().toLowerCase();

    const filtered = categories
      .map(cat => {
        const items = cat.items.filter(it => {
          if (!q) return true;
          const hay = `${it.name} ${it.desc} ${it.href}`.toLowerCase();
          return hay.includes(q);
        });
        return { ...cat, items };
      })
      .filter(cat => cat.items.length > 0);

    container.innerHTML = '';
    empty.hidden = filtered.length > 0;

    const totalItems = filtered.reduce((sum, c) => sum + c.items.length, 0);
    meta.textContent = q
      ? `${totalItems} result${totalItems === 1 ? '' : 's'} across ${filtered.length} categor${filtered.length === 1 ? 'y' : 'ies'}`
      : `${categories.reduce((s, c) => s + c.items.length, 0)} items in ${categories.length} categories`;

    for (const cat of filtered) {
      container.appendChild(renderCategory(cat, q));
    }
  }

  function renderCategory(cat, q) {
    const wrapper = document.createElement('section');
    wrapper.className = 'category';
    wrapper.dataset.categoryId = cat.id;
    wrapper.dataset.open = q ? 'true' : 'false'; // auto-open on search

    const count = cat.items.length;

    wrapper.innerHTML = `
      <button class="category__button" type="button" aria-expanded="${q ? 'true' : 'false'}">
        <div class="category__left">
          <div class="category__icon" aria-hidden="true">${icons(cat.icon)}</div>
          <div class="category__titleWrap">
            <div class="category__title">${escapeHtml(cat.title)}</div>
            <div class="category__hint">${escapeHtml(cat.hint || '')}</div>
          </div>
        </div>
        <div class="category__right">
          <span class="count">${count}</span>
          <span class="chev" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </div>
      </button>

      <div class="category__content" role="region">
        <div class="tools">
          ${cat.items.map(renderTool).join('')}
        </div>
      </div>
    `;

    const btn = $('.category__button', wrapper);
    const content = $('.category__content', wrapper);

    // Set initial height
    setContentOpen(wrapper, content, wrapper.dataset.open === 'true');

    btn.addEventListener('click', () => {
      const open = wrapper.dataset.open !== 'true';
      setContentOpen(wrapper, content, open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Action handlers
    wrapper.addEventListener('click', async (e) => {
      const t = e.target;

      const copyBtn = t.closest?.('[data-action="copy"]');
      if (copyBtn) {
        const href = copyBtn.getAttribute('data-href');
        const url = buildAbsoluteUrl(href);

        const ok = await copyText(url);
        toast(ok ? 'Copied' : 'Copy failed', ok ? url : 'Your browser blocked clipboard access.');
        return;
      }

      const dlBtn = t.closest?.('[data-action="download"]');
      if (dlBtn) {
        const href = dlBtn.getAttribute('data-href');
        // In file:// testing, relative /downloads links won't exist. We still navigate so you can see behavior.
        window.location.href = href;
      }
    });

    return wrapper;
  }

  function renderTool(item) {
    const fileName = item.href.split('/').pop();
    const badge = fileName ? `<span class="badge">${escapeHtml(fileName)}</span>` : '';

    return `
      <article class="tool">
        <div class="tool__info">
          <div class="tool__name">
            <a href="${escapeHtml(item.href)}">${escapeHtml(item.name)}</a>
            ${badge}
          </div>
          <div class="tool__desc">${escapeHtml(item.desc || '')}</div>
        </div>

        <div class="actions">
          <button class="btn btn--ghost" type="button" data-action="copy" data-href="${escapeHtml(item.href)}" title="Copy full URL">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 9h10v10H9V9Z" stroke="currentColor" stroke-width="2"/>
              <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Copy URL
          </button>

          <button class="btn btn--primary" type="button" data-action="download" data-href="${escapeHtml(item.href)}" title="Download">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5 21h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Download
          </button>
        </div>
      </article>
    `;
  }

  function setContentOpen(wrapper, content, open) {
    wrapper.dataset.open = open ? 'true' : 'false';

    // Animate to/from explicit height because "auto" can't transition cleanly
    if (open) {
      content.style.height = 'auto';
      const h = content.scrollHeight;
      content.style.height = '0px';
      // next frame
      requestAnimationFrame(() => {
        content.style.height = h + 'px';
      });
    } else {
      const h = content.scrollHeight;
      content.style.height = h + 'px';
      requestAnimationFrame(() => {
        content.style.height = '0px';
      });
    }

    // After transition, lock open to auto so it can grow/shrink if content changes
    const onEnd = () => {
      content.removeEventListener('transitionend', onEnd);
      if (wrapper.dataset.open === 'true') content.style.height = 'auto';
    };
    content.addEventListener('transitionend', onEnd);
  }

  function buildAbsoluteUrl(href) {
    // When hosted, this becomes full URL. When file://, we generate a "best effort" URL.
    try {
      return new URL(href, window.location.href).toString();
    } catch (e) {
      return href;
    }
  }

  // ----------------------------
  // Search + keyboard shortcuts
  // ----------------------------
  function initSearch() {
    const input = $('#searchInput');
    const clearBtn = $('#clearSearchBtn');
    if (!input) return;

    const apply = () => render(DATA, input.value);

    input.addEventListener('input', apply);

    clearBtn?.addEventListener('click', () => {
      input.value = '';
      input.focus();
      render(DATA, '');
    });

    document.addEventListener('keydown', (e) => {
      // "/" focuses search unless you're typing in an input already
      if (e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        input.focus();
      }
      // Escape clears search (if focused) or collapses all
      if (e.key === 'Escape') {
        if (document.activeElement === input && input.value) {
          input.value = '';
          render(DATA, '');
        } else {
          collapseAll();
        }
      }
    });
  }

  function collapseAll() {
    $$('.category').forEach(cat => {
      const content = $('.category__content', cat);
      const btn = $('.category__button', cat);
      if (!content || !btn) return;
      if (cat.dataset.open === 'true') {
        setContentOpen(cat, content, false);
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----------------------------
  // Boot
  // ----------------------------
  document.addEventListener('DOMContentLoaded', () => {
    render(DATA, '');
    initSearch();

    // Tiny local-dev hint if opened as file://
    if (isLocalFile()) {
      toast('Local preview', 'Saved links (like /downloads/...) will work once hosted on toolbox.techserviceswi.com.');
    }
  });
})();
