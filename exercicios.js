(() => {
  const cards = [...document.querySelectorAll('.exercise-card')];
  const topic = document.getElementById('topic-filter');
  const duration = document.getElementById('duration-filter');
  const count = document.getElementById('exercise-count');
  const empty = document.getElementById('exercise-empty');
  function filter() {
    let visible = 0;
    cards.forEach(card => {
      const match = (!topic.value || card.dataset.topic === topic.value) && (!duration.value || Number(card.dataset.duration) <= Number(duration.value));
      card.hidden = !match;
      if (match) visible++;
    });
    count.textContent = visible === 1 ? '1 exercício disponível' : `${visible} exercícios disponíveis`;
    empty.hidden = visible > 0;
  }
  topic.addEventListener('change', filter);
  duration.addEventListener('change', filter);
  document.getElementById('clear-filters').addEventListener('click', () => { topic.value = ''; duration.value = ''; filter(); });
  function revealHash() {
    const card = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (card?.classList.contains('exercise-card')) { topic.value = ''; duration.value = ''; filter(); card.querySelector('details').open = true; }
  }
  revealHash(); window.addEventListener('hashchange', revealHash);
  document.querySelectorAll('[data-copy-case]').forEach(button => {
    button.addEventListener('click', async () => {
      const source = document.getElementById(button.dataset.copyCase);
      const feedback = button.closest('.exercise-case').querySelector('.exercise-copy-feedback');
      let copied = false;
      try { await navigator.clipboard.writeText(source.textContent); copied = true; } catch (_) {
        const field = document.createElement('textarea'); field.value = source.textContent;
        field.style.position = 'fixed'; field.style.opacity = '0'; document.body.appendChild(field); field.select();
        try { copied = document.execCommand('copy'); } catch (_) {}
        field.remove(); button.focus();
      }
      if (copied) { button.textContent = 'Copiado ✓'; feedback.textContent = source.id.endsWith('-pedido') ? 'Pedido copiado. Adaptem-no ao resultado que pretendem.' : 'Caso copiado. Abram uma conversa nova e colem o texto.'; }
      else { const range = document.createRange(); range.selectNodeContents(source); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); feedback.textContent = 'Texto selecionado: usem Ctrl+C ou ⌘C para copiar.'; }
    });
  });
  let printStates;
  window.addEventListener('beforeprint', () => { printStates = [...document.querySelectorAll('details')].map(el => [el, el.open]); printStates.forEach(([el]) => { el.open = true; }); });
  window.addEventListener('afterprint', () => { printStates?.forEach(([el, open]) => { el.open = open; }); });
})();
