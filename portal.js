(() => {
  const key = 'cnpsm-ia-2026-missoes-v1';
  const boxes = [...document.querySelectorAll('[data-mission]')];
  let progress = [];
  try { const saved = JSON.parse(localStorage.getItem(key) || '[]'); if (Array.isArray(saved)) progress = saved; } catch (_) {}
  const report = document.querySelector('#progress-label');
  const update = () => { if (report) report.textContent = `${boxes.filter(box => box.checked).length} de ${boxes.length} missões concluídas`; };
  boxes.forEach(box => { box.checked = progress.includes(box.dataset.mission); box.addEventListener('change', () => { try { localStorage.setItem(key, JSON.stringify(boxes.filter(x => x.checked).map(x => x.dataset.mission))); } catch (_) {} update(); }); });
  document.querySelector('#reset-progress')?.addEventListener('click', () => { boxes.forEach(x => { x.checked = false; }); try { localStorage.removeItem(key); } catch (_) {} update(); });
  update();
  const revealHash = () => { const id = decodeURIComponent(location.hash.slice(1)); const target = document.getElementById(id); const details = target?.classList.contains('mission') ? target.querySelector('.mission-details') : null; if (details) details.open = true; };
  revealHash(); window.addEventListener('hashchange', revealHash);
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const source = document.getElementById(button.dataset.copy);
      const feedback = button.closest('.prompt-box').querySelector('.copy-feedback');
      if (!source) return;
      let copied = false;
      try { await navigator.clipboard.writeText(source.textContent); copied = true; } catch (_) {
        const field = document.createElement('textarea');
        field.value = source.textContent; field.style.position = 'fixed'; field.style.opacity = '0';
        document.body.appendChild(field); field.select();
        try { copied = document.execCommand('copy'); } catch (_) {}
        field.remove(); button.focus();
      }
      if (copied) { button.textContent = 'Copiado ✓'; feedback.textContent = 'Texto copiado. Abram o Claude e colem-no na conversa.'; }
      else {
        const range = document.createRange(); range.selectNodeContents(source);
        const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
        feedback.textContent = 'O navegador não permitiu copiar. O texto está selecionado: usem Ctrl+C ou ⌘C.';
      }
    });
  });
  let states;
  window.addEventListener('beforeprint', () => { states = [...document.querySelectorAll('details')].map(el => [el, el.open]); states.forEach(([el]) => { el.open = true; }); });
  window.addEventListener('afterprint', () => { states?.forEach(([el, open]) => { el.open = open; }); });
  document.querySelector('#print-page')?.addEventListener('click', () => window.print());
})();
