/* =========================================================
   PROJETO EVA 55 — "Cuidar de mim também faz parte."
   App de uso pessoal. Não é aplicativo médico: não faz
   diagnóstico, prescrição clínica nem promessa de emagrecimento.
   Todos os dados ficam salvos apenas neste dispositivo.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------- Storage keys ---------------- */
  const K = {
    config: "eva55.config",
    routine: "eva55.routine",
    exercisePlan: "eva55.exercisePlan",
    menu: "eva55.menu",
    shopping: "eva55.shopping",
    prep: "eva55.prep",
    days: "eva55.days",
    ui: "eva55.ui",
  };

  const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
  const WEEKDAY_LABEL = { dom: "Domingo", seg: "Segunda", ter: "Terça", qua: "Quarta", qui: "Quinta", sex: "Sexta", sab: "Sábado" };
  const MEAL_SLOTS = [
    { id: "cafe", label: "Café da manhã" },
    { id: "lancheManha", label: "Lanche" },
    { id: "almoco", label: "Almoço" },
    { id: "lancheTarde", label: "Lanche da tarde" },
    { id: "jantar", label: "Jantar" },
  ];
  const PHRASES = [
    "Um dia de cada vez.",
    "Constância vale mais que perfeição.",
    "Cuidar de mim também faz parte.",
    "Hoje eu só preciso cuidar do dia de hoje.",
    "Pequenos passos também são progresso.",
  ];

  /* ---------------- Defaults ---------------- */
  function defaultConfig() {
    return {
      name: "Eva",
      startWeight: 62,
      goalWeight: 55,
      height: 1.59,
      age: 34,
      waterGoalMl: 2000,
      people: 1,
      createdAt: todayKey(),
    };
  }

  function defaultRoutine() {
    return [
      { id: "acordar", time: "06:30", title: "Acordar", subtitle: "Comece o dia com calma.", type: "rotina" },
      { id: "agua1", time: "06:35", title: "Água", subtitle: "1 copo grande de água.", type: "agua" },
      { id: "cafe", time: "07:00", title: "Café da manhã", subtitle: "", type: "refeicao", mealSlot: "cafe" },
      { id: "leitura", time: "07:30", title: "Leitura", subtitle: "20 minutos", type: "leitura" },
      { id: "agua2", time: "09:30", title: "Água", subtitle: "", type: "agua" },
      { id: "lanche1", time: "10:00", title: "Lanche", subtitle: "", type: "refeicao", mealSlot: "lancheManha" },
      { id: "agua3", time: "11:30", title: "Água", subtitle: "", type: "agua" },
      { id: "almoco", time: "12:00", title: "Almoço", subtitle: "", type: "refeicao", mealSlot: "almoco" },
      { id: "agua4", time: "14:30", title: "Água", subtitle: "", type: "agua" },
      { id: "lanche2", time: "16:00", title: "Lanche da tarde", subtitle: "", type: "refeicao", mealSlot: "lancheTarde" },
      { id: "agua5", time: "17:00", title: "Água", subtitle: "", type: "agua" },
      { id: "exercicio", time: "17:30", title: "Exercício", subtitle: "", type: "exercicio" },
      { id: "jantar", time: "19:00", title: "Jantar", subtitle: "", type: "refeicao", mealSlot: "jantar" },
      { id: "agua6", time: "20:30", title: "Água", subtitle: "Somente se não atrapalhar o sono.", type: "agua" },
      { id: "desacelerar", time: "22:15", title: "Desacelerar", subtitle: "Diminua estímulos e prepare-se para dormir.", type: "rotina" },
      { id: "dormir", time: "22:45", title: "Dormir", subtitle: "", type: "sono" },
    ];
  }

  function defaultExercisePlan() {
    return {
      seg: "Treino de força",
      ter: "Caminhada de 20–30 minutos",
      qua: "Treino de força",
      qui: "Caminhada",
      sex: "Treino de força",
      sab: "Atividade livre — caminhada ou dança",
      dom: "Descanso",
    };
  }

  function defaultMenu() {
    return {
      seg: { cafe: "Cuscuz + ovo + café com leite", lancheManha: "Banana", almoco: "Arroz, feijão, frango e salada", lancheTarde: "Iogurte + fruta", jantar: "Omelete + legumes" },
      ter: { cafe: "Pão + queijo ou ovo + café com leite", lancheManha: "Maçã", almoco: "Arroz, feijão, carne moída e legumes", lancheTarde: "Biscoito + fruta", jantar: "Sopa de legumes com frango" },
      qua: { cafe: "Tapioca + ovo + café com leite", lancheManha: "Mamão", almoco: "Arroz, feijão, frango e salada", lancheTarde: "Iogurte + granola", jantar: "Omelete + legumes" },
      qui: { cafe: "Cuscuz + ovo + café com leite", lancheManha: "Banana", almoco: "Arroz, feijão, peixe e legumes", lancheTarde: "Fruta + biscoito", jantar: "Sanduíche de queijo + fruta" },
      sex: { cafe: "Pão + queijo ou ovo + café com leite", lancheManha: "Fruta da estação", almoco: "Arroz, feijão, frango e salada", lancheTarde: "Iogurte + fruta", jantar: "Omelete + legumes" },
      sab: { cafe: "Tapioca + ovo + café com leite", lancheManha: "Fruta", almoco: "Almoço em família / livre", lancheTarde: "Café da tarde tranquilo", jantar: "Algo leve, como sopa ou sanduíche" },
      dom: { cafe: "Café da manhã com calma", lancheManha: "Fruta", almoco: "Almoço em família / livre", lancheTarde: "Fruta + biscoito", jantar: "Algo leve" },
    };
  }

  function defaultShopping() {
    let n = 0;
    const item = (name) => ({ id: "it" + n++, name, checked: false });
    return {
      people: 1,
      categories: [
        { id: "hortifruti", label: "Hortifruti", items: [item("Banana"), item("Maçã"), item("Mamão"), item("Tomate"), item("Alface"), item("Cenoura")].map(x => x) },
        { id: "proteinas", label: "Proteínas", items: [item("Ovos"), item("Frango"), item("Carne moída"), item("Peixe")] },
        { id: "cafe", label: "Café da manhã", items: [item("Flocão / cuscuz"), item("Tapioca"), item("Pão"), item("Café"), item("Leite")] },
        { id: "laticinios", label: "Laticínios", items: [item("Queijo"), item("Iogurte")] },
        { id: "despensa", label: "Despensa", items: [item("Arroz"), item("Feijão"), item("Biscoito"), item("Granola")] },
      ],
    };
  }

  function defaultPrep() {
    let n = 0;
    const item = (text) => ({ id: "pp" + n++, text, checked: false });
    return [
      item("Higienizar frutas"),
      item("Higienizar verduras"),
      item("Separar porções"),
      item("Preparar frango"),
      item("Cozinhar feijão"),
      item("Organizar lanches"),
      item("Congelar o que for necessário"),
    ];
  }

  /* ---------------- Storage helpers ---------------- */
  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }
  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      toast("Não foi possível salvar agora. Verifique o espaço do dispositivo.");
    }
  }

  function ensureBootstrap() {
    if (!localStorage.getItem(K.config)) save(K.config, defaultConfig());
    if (!localStorage.getItem(K.routine)) save(K.routine, defaultRoutine());
    if (!localStorage.getItem(K.exercisePlan)) save(K.exercisePlan, defaultExercisePlan());
    if (!localStorage.getItem(K.menu)) save(K.menu, defaultMenu());
    if (!localStorage.getItem(K.shopping)) save(K.shopping, defaultShopping());
    if (!localStorage.getItem(K.prep)) save(K.prep, defaultPrep());
    if (!localStorage.getItem(K.days)) save(K.days, {});
    if (!localStorage.getItem(K.ui)) save(K.ui, { tab: "hoje" });
  }

  /* ---------------- Date helpers ---------------- */
  function pad2(n) { return String(n).padStart(2, "0"); }
  function todayKey(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }
  function weekdayKey(d) {
    d = d || new Date();
    return WEEKDAYS[d.getDay()];
  }
  function formatDateLong(d) {
    d = d || new Date();
    const dias = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    return `${dias[d.getDay()][0].toUpperCase()}${dias[d.getDay()].slice(1)}, ${d.getDate()} de ${meses[d.getMonth()]}`;
  }
  function timeToMinutes(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  /* ---------------- Day record helpers ---------------- */
  function getDay(dateKey) {
    const days = load(K.days, {});
    if (!days[dateKey]) {
      days[dateKey] = { tasks: {}, waterMl: 0, checkin: null, weight: null, waist: null, fritura: null };
      save(K.days, days);
    }
    return days[dateKey];
  }
  function updateDay(dateKey, patch) {
    const days = load(K.days, {});
    const current = days[dateKey] || { tasks: {}, waterMl: 0, checkin: null, weight: null, waist: null, fritura: null };
    days[dateKey] = Object.assign({}, current, patch);
    save(K.days, days);
    return days[dateKey];
  }
  function toggleTask(dateKey, taskId) {
    const day = getDay(dateKey);
    const tasks = Object.assign({}, day.tasks);
    tasks[taskId] = !tasks[taskId];
    updateDay(dateKey, { tasks });
  }

  /* ---------------- Toast ---------------- */
  function toast(msg) {
    const root = document.getElementById("toast-root");
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  /* ---------------- SVG icons ---------------- */
  const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l6 6L20 6"/></svg>';
  const ICON_DROP = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s7 8.5 7 13a7 7 0 1 1-14 0c0-4.5 7-13 7-13Z"/></svg>';
  const ICON_BOOK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5.5A2 2 0 0 1 6 3.5h13a.5.5 0 0 1 .5.5v14.5H6A2 2 0 0 0 4 20.5V5.5Z"/><path d="M4 20.5A2 2 0 0 1 6 18.5h13.5"/></svg>';
  const ICON_MOVE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="4.5" r="1.8"/><path d="M6 21l3.5-7 2-3M18 21l-3.5-7M9.5 11l-3-1.5M14.5 11l3-1.5M9.5 11h5"/></svg>';
  const ICON_MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></svg>';
  const ICON_MEAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 3v7a2 2 0 0 0 2 2v9M7 3v18M9 3v6M11 3v9M17 3c-1.5 0-2.5 2-2.5 5s1 5 2.5 5v9"/></svg>';

  function typeIcon(type) {
    switch (type) {
      case "agua": return ICON_DROP;
      case "leitura": return ICON_BOOK;
      case "exercicio": return ICON_MOVE;
      case "sono": return ICON_MOON;
      case "refeicao": return ICON_MEAL;
      default: return "";
    }
  }

  /* ---------------- Router / render ---------------- */
  const viewEl = document.getElementById("view");

  function setTab(tab) {
    const ui = load(K.ui, {});
    ui.tab = tab;
    save(K.ui, ui);
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      if (btn.dataset.tab === tab) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
    render();
  }

  function render() {
    const ui = load(K.ui, { tab: "hoje" });
    viewEl.scrollTop = 0;
    window.scrollTo(0, 0);
    switch (ui.tab) {
      case "cardapio": return renderCardapio();
      case "compras": return renderCompras();
      case "progresso": return renderProgresso();
      case "mais": return renderMais();
      default: return renderHoje();
    }
  }

  /* =====================================================
     TELA HOJE
     ===================================================== */
  function renderHoje() {
    const now = new Date();
    const dateKey = todayKey(now);
    const wk = weekdayKey(now);
    const config = load(K.config, defaultConfig());
    const routine = load(K.routine, defaultRoutine());
    const exercisePlan = load(K.exercisePlan, defaultExercisePlan());
    const menu = load(K.menu, defaultMenu());
    const day = getDay(dateKey);

    // hydrate dynamic subtitles (exercise + menu) without mutating stored routine
    const items = routine.slice().sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)).map((t) => {
      const copy = Object.assign({}, t);
      if (t.type === "exercicio") copy.subtitle = exercisePlan[wk] || t.subtitle;
      if (t.type === "refeicao" && t.mealSlot && menu[wk] && menu[wk][t.mealSlot]) copy.subtitle = menu[wk][t.mealSlot];
      return copy;
    });

    const doneCount = items.filter((t) => day.tasks[t.id]).length;
    const total = items.length;
    const pct = total ? Math.round((doneCount / total) * 100) : 0;

    const nowMin = now.getHours() * 60 + now.getMinutes();
    let nextTask = items.find((t) => !day.tasks[t.id] && timeToMinutes(t.time) >= nowMin);
    if (!nextTask) nextTask = items.find((t) => !day.tasks[t.id]);
    let nowTag = "PRÓXIMO";
    if (nextTask) {
      const idx = items.indexOf(nextTask);
      const isCurrent = timeToMinutes(nextTask.time) <= nowMin && (idx === items.length - 1 || timeToMinutes(items[idx + 1].time) > nowMin);
      nowTag = isCurrent ? "AGORA" : "PRÓXIMO";
    }

    const phrase = PHRASES[now.getDate() % PHRASES.length];
    const waterGoal = config.waterGoalMl || 2000;
    const waterPct = Math.min(100, Math.round((day.waterMl / waterGoal) * 100));
    const drops = 8;
    const filledDrops = Math.round((day.waterMl / waterGoal) * drops);

    viewEl.innerHTML = `
      <div>
        <div class="eyebrow-date">${formatDateLong(now)}</div>
        <h1 class="greeting">Bom dia, ${escapeHtml(config.name)}</h1>
        <div class="phrase">${phrase}</div>
      </div>

      <div class="hero-card">
        <div class="hero-top">
          <div>
            <div class="project-tag">Projeto Eva 55</div>
            <div class="weight-line">${config.startWeight} kg → <b>${config.goalWeight} kg</b></div>
          </div>
        </div>
        <div class="progress-wrap">
          <div class="progress-meta"><span>${doneCount} de ${total} concluídos</span><span>${pct}% do dia</span></div>
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        </div>
      </div>

      ${nextTask ? `
      <div class="now-card">
        <div>
          <div class="tag">${nowTag}</div>
          <div class="time">${nextTask.time}</div>
          <div class="title">${escapeHtml(nextTask.title)}</div>
        </div>
        <button class="check" data-action="toggle-task" data-id="${nextTask.id}">${ICON_CHECK}</button>
      </div>` : `<div class="day-complete">Dia concluído 🌷</div>`}

      <div class="water-card">
        <div class="water-head">
          <div class="water-amount">${(day.waterMl / 1000).toFixed(2).replace(".00","").replace(/0$/,"")} L</div>
          <div class="water-goal">meta: ${(waterGoal / 1000)} L</div>
        </div>
        <div class="water-drops">${Array.from({ length: drops }).map((_, i) => `<div class="drop ${i < filledDrops ? "filled" : ""}"></div>`).join("")}</div>
        <div class="water-actions">
          <button class="chip" data-action="add-water" data-ml="250">+ 250 ml</button>
          <button class="chip" data-action="add-water" data-ml="500">+ 500 ml</button>
          <button class="chip ghost" data-action="reset-water">Reiniciar</button>
        </div>
      </div>

      <h2 class="section-title">Seu dia de hoje</h2>
      <div id="task-list">
        ${items.map((t) => taskCardHtml(t, !!day.tasks[t.id])).join("")}
      </div>

      <button class="checkin-btn ${day.checkin ? "saved" : ""}" data-action="open-checkin">
        ${day.checkin ? "Check-in do dia salvo ✓ (toque para editar)" : "Fazer check-in da noite 🌙"}
      </button>

      <div class="privacy-note">Seus registros ficam armazenados apenas neste dispositivo.</div>
    `;

    bindHojeEvents(dateKey);
  }

  function taskCardHtml(t, done) {
    return `
      <div class="task-card ${done ? "done" : ""}" data-task-id="${t.id}">
        <button class="task-check" data-action="toggle-task" data-id="${t.id}">${ICON_CHECK}</button>
        <div class="task-body">
          <div class="task-time">${t.time}</div>
          <div class="task-title">${escapeHtml(t.title)}</div>
          ${t.subtitle ? `<div class="task-sub">${escapeHtml(t.subtitle)}</div>` : ""}
          ${done ? `<div class="task-done-label">Concluído</div>` : ""}
        </div>
      </div>`;
  }

  function bindHojeEvents(dateKey) {
    viewEl.querySelectorAll('[data-action="toggle-task"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        toggleTask(dateKey, btn.dataset.id);
        const day = getDay(dateKey);
        const routine = load(K.routine, defaultRoutine());
        if (routine.length && routine.every((t) => day.tasks[t.id])) {
          checkAchievements();
          render();
          setTimeout(() => toast("Dia concluído! 🌷"), 150);
        } else {
          render();
        }
      });
    });
    viewEl.querySelectorAll('[data-action="add-water"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const day = getDay(dateKey);
        updateDay(dateKey, { waterMl: day.waterMl + Number(btn.dataset.ml) });
        render();
      });
    });
    const resetBtn = viewEl.querySelector('[data-action="reset-water"]');
    if (resetBtn) resetBtn.addEventListener("click", () => { updateDay(dateKey, { waterMl: 0 }); render(); });

    const checkinBtn = viewEl.querySelector('[data-action="open-checkin"]');
    if (checkinBtn) checkinBtn.addEventListener("click", () => openCheckinModal(dateKey));
  }

  /* =====================================================
     CHECK-IN DA NOITE (modal)
     ===================================================== */
  function openCheckinModal(dateKey) {
    const day = getDay(dateKey);
    const c = day.checkin || { alimentacao: null, agua: null, movimento: null, doces: null, sonoHoras: "", humor: null, melhorar: "" };

    const opts = (name, options, current) => `
      <div class="option-row" data-group="${name}">
        ${options.map((o) => `<button type="button" class="option-btn ${current === o.v ? "selected" : ""}" data-value="${o.v}">${o.label}</button>`).join("")}
      </div>`;

    openModal(`
      <div class="modal-title">Check-in do dia 🌙</div>

      <div class="field">
        <label>Como foi sua alimentação?</label>
        ${opts("alimentacao", [{ v: "otima", label: "Ótima" }, { v: "boa", label: "Boa" }, { v: "melhorar", label: "Poderia melhorar" }], c.alimentacao)}
      </div>

      <div class="field">
        <label>Bebi minha água?</label>
        ${opts("agua", [{ v: "sim", label: "Sim" }, { v: "parcial", label: "Parcialmente" }, { v: "nao", label: "Não" }], c.agua)}
      </div>

      <div class="field">
        <label>Fiz meu movimento/treino?</label>
        ${opts("movimento", [{ v: "sim", label: "Sim" }, { v: "nao", label: "Não" }, { v: "descanso", label: "Era descanso" }], c.movimento)}
      </div>

      <div class="field">
        <label>Como foi com os doces?</label>
        ${opts("doces", [{ v: "nao", label: "Não comi" }, { v: "planejado", label: "Porção planejada" }, { v: "mais", label: "Mais do que pretendia" }], c.doces)}
      </div>

      <div class="field">
        <label>Sono da noite anterior (horas)</label>
        <input type="text" inputmode="decimal" id="ci-sono" placeholder="Ex: 6h30" value="${escapeAttr(c.sonoHoras || "")}" />
      </div>

      <div class="field">
        <label>Como estou me sentindo?</label>
        <div class="mood-row">
          ${["🙂", "😐", "😴", "😣"].map((m) => `<button type="button" class="mood-btn ${c.humor === m ? "selected" : ""}" data-mood="${m}">${m}</button>`).join("")}
        </div>
      </div>

      <div class="field">
        <label>O que eu quero fazer melhor amanhã?</label>
        <textarea id="ci-melhorar" rows="2" placeholder="Escreva livremente...">${escapeHtml(c.melhorar || "")}</textarea>
      </div>

      <button class="btn block" id="ci-save">Salvar meu dia</button>
    `);

    const state = Object.assign({}, c);
    document.querySelectorAll('.modal-sheet [data-group]').forEach((group) => {
      group.querySelectorAll(".option-btn").forEach((b) => {
        b.addEventListener("click", () => {
          state[group.dataset.group] = b.dataset.value;
          group.querySelectorAll(".option-btn").forEach((x) => x.classList.toggle("selected", x === b));
        });
      });
    });
    document.querySelectorAll(".mood-btn").forEach((b) => {
      b.addEventListener("click", () => {
        state.humor = b.dataset.mood;
        document.querySelectorAll(".mood-btn").forEach((x) => x.classList.toggle("selected", x === b));
      });
    });
    document.getElementById("ci-save").addEventListener("click", () => {
      state.sonoHoras = document.getElementById("ci-sono").value.trim();
      state.melhorar = document.getElementById("ci-melhorar").value.trim();
      updateDay(dateKey, { checkin: state });
      closeModal();
      render();
      toast("Seu dia foi salvo.");
    });
  }

  /* =====================================================
     TELA CARDÁPIO
     ===================================================== */
  function renderCardapio() {
    const ui = load(K.ui, {});
    const wk = ui.cardapioDay || weekdayKey(new Date());
    const menu = load(K.menu, defaultMenu());
    const editing = !!ui.cardapioEditing;

    viewEl.innerHTML = `
      <h1 class="greeting">Cardápio da semana</h1>
      <div class="muted">Variedade reaproveitando ingredientes ao longo da semana.</div>

      <div class="weekday-row">
        ${["seg","ter","qua","qui","sex","sab","dom"].map((d) => `<button class="day-chip ${d===wk?"active":""}" data-day="${d}">${WEEKDAY_LABEL[d]}</button>`).join("")}
      </div>

      <div class="row" style="margin-top:16px;">
        <h2 class="section-title first" style="margin:0;">${WEEKDAY_LABEL[wk]}</h2>
        <button class="btn ghost" data-action="toggle-edit">${editing ? "Concluir edição" : "Editar"}</button>
      </div>

      ${MEAL_SLOTS.map((slot) => `
        <div class="card meal-slot">
          <div class="slot-label">${slot.label}</div>
          ${editing
            ? `<textarea data-slot="${slot.id}">${escapeHtml(menu[wk][slot.id] || "")}</textarea>`
            : `<div class="slot-text">${escapeHtml(menu[wk][slot.id] || "—")}</div>
               <button class="btn ghost" data-action="swap" data-slot="${slot.id}">Trocar refeição</button>`
          }
        </div>
      `).join("")}
    `;

    viewEl.querySelectorAll("[data-day]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ui2 = load(K.ui, {});
        ui2.cardapioDay = btn.dataset.day;
        save(K.ui, ui2);
        render();
      });
    });

    const editBtn = viewEl.querySelector('[data-action="toggle-edit"]');
    editBtn.addEventListener("click", () => {
      if (editing) {
        const menu2 = load(K.menu, defaultMenu());
        viewEl.querySelectorAll("textarea[data-slot]").forEach((ta) => {
          menu2[wk][ta.dataset.slot] = ta.value.trim();
        });
        save(K.menu, menu2);
        toast("Cardápio atualizado.");
      }
      const ui2 = load(K.ui, {});
      ui2.cardapioEditing = !editing;
      save(K.ui, ui2);
      render();
    });

    viewEl.querySelectorAll('[data-action="swap"]').forEach((btn) => {
      btn.addEventListener("click", () => openSwapMealModal(wk, btn.dataset.slot));
    });
  }

  function openSwapMealModal(wk, slotId) {
    const menu = load(K.menu, defaultMenu());
    const slotLabel = MEAL_SLOTS.find((s) => s.id === slotId).label;
    // gather alternative options already used across the week for this slot
    const options = Array.from(new Set(Object.values(menu).map((d) => d[slotId]).filter(Boolean)));

    openModal(`
      <div class="modal-title">Trocar ${slotLabel.toLowerCase()}</div>
      <div class="field">
        <label>Opções já cadastradas</label>
        <div class="option-row" id="swap-options" style="flex-direction:column; align-items:stretch;">
          ${options.map((o) => `<button type="button" class="option-btn" data-val="${escapeAttr(o)}" style="text-align:left;">${escapeHtml(o)}</button>`).join("")}
        </div>
      </div>
      <div class="field">
        <label>Ou escreva uma nova opção</label>
        <input type="text" id="swap-custom" placeholder="Ex: Tapioca + queijo" />
      </div>
      <button class="btn block" id="swap-save">Salvar</button>
    `);
    document.querySelectorAll("#swap-options .option-btn").forEach((b) => {
      b.addEventListener("click", () => { document.getElementById("swap-custom").value = b.dataset.val; });
    });
    document.getElementById("swap-save").addEventListener("click", () => {
      const val = document.getElementById("swap-custom").value.trim();
      if (!val) { toast("Escreva ou selecione uma opção."); return; }
      const menu2 = load(K.menu, defaultMenu());
      menu2[wk][slotId] = val;
      save(K.menu, menu2);
      closeModal();
      render();
      toast("Refeição atualizada.");
    });
  }

  /* =====================================================
     TELA COMPRAS
     ===================================================== */
  function renderCompras() {
    const shopping = load(K.shopping, defaultShopping());
    const prep = load(K.prep, defaultPrep());
    const total = shopping.categories.reduce((n, c) => n + c.items.length, 0);
    const done = shopping.categories.reduce((n, c) => n + c.items.filter((i) => i.checked).length, 0);
    const prepDone = prep.filter((p) => p.checked).length;

    viewEl.innerHTML = `
      <h1 class="greeting">Lista de compras</h1>
      <div class="muted">Compra principal: sábado de manhã · ${done} de ${total} itens comprados · para ${shopping.people} ${shopping.people > 1 ? "pessoas" : "pessoa"}</div>

      <div class="progress-wrap" style="margin-top:14px;">
        <div class="progress-track"><div class="progress-fill" style="width:${total ? Math.round((done/total)*100) : 0}%"></div></div>
      </div>

      ${shopping.categories.map((cat) => `
        <h2 class="section-title">${cat.label}</h2>
        <div class="card tight">
          ${cat.items.map((it) => `
            <div class="list-item ${it.checked ? "checked" : ""}" data-cat="${cat.id}" data-item="${it.id}">
              <div class="box">${ICON_CHECK}</div>
              <div class="label">${escapeHtml(it.name)}</div>
            </div>`).join("")}
        </div>
      `).join("")}

      <button class="btn secondary block" id="add-item-btn" style="margin-bottom:8px;">+ Adicionar item</button>

      <h2 class="section-title">Preparar no sábado</h2>
      <div class="muted" style="margin-top:-8px; margin-bottom:10px;">${prepDone} de ${prep.length} concluídos</div>
      <div class="card tight">
        ${prep.map((p) => `
          <div class="list-item ${p.checked ? "checked" : ""}" data-prep="${p.id}">
            <div class="box">${ICON_CHECK}</div>
            <div class="label">${escapeHtml(p.text)}</div>
          </div>`).join("")}
      </div>
    `;

    viewEl.querySelectorAll("[data-item]").forEach((row) => {
      row.addEventListener("click", () => {
        const s = load(K.shopping, defaultShopping());
        const cat = s.categories.find((c) => c.id === row.dataset.cat);
        const item = cat.items.find((i) => i.id === row.dataset.item);
        item.checked = !item.checked;
        save(K.shopping, s);
        render();
      });
    });
    viewEl.querySelectorAll("[data-prep]").forEach((row) => {
      row.addEventListener("click", () => {
        const p = load(K.prep, defaultPrep());
        const item = p.find((x) => x.id === row.dataset.prep);
        item.checked = !item.checked;
        save(K.prep, p);
        render();
      });
    });
    document.getElementById("add-item-btn").addEventListener("click", openAddShoppingItemModal);
  }

  function openAddShoppingItemModal() {
    const shopping = load(K.shopping, defaultShopping());
    openModal(`
      <div class="modal-title">Adicionar item</div>
      <div class="field">
        <label>Nome do item</label>
        <input type="text" id="new-item-name" placeholder="Ex: Cenoura" />
      </div>
      <div class="field">
        <label>Categoria</label>
        <div class="option-row" id="new-item-cat">
          ${shopping.categories.map((c, i) => `<button type="button" class="option-btn ${i===0?"selected":""}" data-cat="${c.id}">${c.label}</button>`).join("")}
        </div>
      </div>
      <button class="btn block" id="new-item-save">Adicionar</button>
    `);
    let selectedCat = shopping.categories[0].id;
    document.querySelectorAll("#new-item-cat .option-btn").forEach((b) => {
      b.addEventListener("click", () => {
        selectedCat = b.dataset.cat;
        document.querySelectorAll("#new-item-cat .option-btn").forEach((x) => x.classList.toggle("selected", x === b));
      });
    });
    document.getElementById("new-item-save").addEventListener("click", () => {
      const name = document.getElementById("new-item-name").value.trim();
      if (!name) return;
      const s = load(K.shopping, defaultShopping());
      const cat = s.categories.find((c) => c.id === selectedCat);
      cat.items.push({ id: "it" + Date.now(), name, checked: false });
      save(K.shopping, s);
      closeModal();
      render();
    });
  }

  /* =====================================================
     TELA PROGRESSO
     ===================================================== */
  function renderProgresso() {
    const config = load(K.config, defaultConfig());
    const days = load(K.days, {});
    const routine = load(K.routine, defaultRoutine());
    const entries = Object.keys(days)
      .filter((k) => typeof days[k].weight === "number")
      .sort()
      .map((k) => ({ date: k, weight: days[k].weight }));
    const lastWeight = entries.length ? entries[entries.length - 1].weight : config.startWeight;

    const last7 = lastNDateKeys(7);
    const aguaMetaDias = last7.filter((k) => days[k] && days[k].waterMl >= (config.waterGoalMl || 2000)).length;
    const treinoDias = last7.filter((k) => days[k] && days[k].tasks && days[k].tasks["exercicio"]).length;
    const leituraDias = last7.filter((k) => days[k] && days[k].tasks && days[k].tasks["leitura"]).length;
    const sonoHoras = last7.map((k) => parseSonoHoras(days[k] && days[k].checkin && days[k].checkin.sonoHoras)).filter((v) => v != null);
    const sonoMedia = sonoHoras.length ? (sonoHoras.reduce((a, b) => a + b, 0) / sonoHoras.length) : null;
    const alimentacaoBoa = last7.filter((k) => days[k] && days[k].checkin && (days[k].checkin.alimentacao === "otima" || days[k].checkin.alimentacao === "boa")).length;

    viewEl.innerHTML = `
      <h1 class="greeting">Progresso</h1>
      <div class="muted">O peso é só uma parte da história — constância importa tanto quanto.</div>

      <div class="weight-figures" style="margin-top:16px;">
        <div class="figure"><div class="num">${config.startWeight} kg</div><div class="lab">Peso inicial</div></div>
        <div class="figure"><div class="num">${lastWeight} kg</div><div class="lab">Último registro</div></div>
        <div class="figure"><div class="num">${config.goalWeight} kg</div><div class="lab">Objetivo</div></div>
      </div>

      <div class="chart-wrap">${weightChartSvg(entries, config)}</div>
      <button class="btn secondary block" id="add-weight-btn" style="margin-top:10px;">Registrar peso desta semana</button>

      <h2 class="section-title">Constância — últimos 7 dias</h2>
      <div class="card tight">
        <div class="constancy-row"><div class="ico">${ICON_DROP}</div><div class="info"><div class="k">Água</div><div class="v">${aguaMetaDias} de 7 dias na meta</div></div></div>
        <div class="constancy-row"><div class="ico">${ICON_MOVE}</div><div class="info"><div class="k">Movimento</div><div class="v">${treinoDias} de 7 dias</div></div></div>
        <div class="constancy-row"><div class="ico">${ICON_BOOK}</div><div class="info"><div class="k">Leitura</div><div class="v">${leituraDias} de 7 dias</div></div></div>
        <div class="constancy-row"><div class="ico">${ICON_MOON}</div><div class="info"><div class="k">Sono</div><div class="v">${sonoMedia ? "média de " + sonoMedia.toFixed(1).replace(".0","") + "h" : "sem registros ainda"}</div></div></div>
        <div class="constancy-row"><div class="ico">${ICON_MEAL}</div><div class="info"><div class="k">Alimentação</div><div class="v">${alimentacaoBoa} de 7 dias avaliados bem</div></div></div>
      </div>

      <h2 class="section-title">Conquistas</h2>
      <div class="badges">${achievementsHtml()}</div>

      <button class="btn ghost block" id="open-history-btn" style="margin-top:20px;">Ver histórico de dias</button>
    `;

    document.getElementById("add-weight-btn").addEventListener("click", openWeightModal);
    document.getElementById("open-history-btn").addEventListener("click", openHistoryModal);
  }

  function lastNDateKeys(n) {
    const arr = [];
    const d = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const dd = new Date(d);
      dd.setDate(d.getDate() - i);
      arr.push(todayKey(dd));
    }
    return arr;
  }
  function parseSonoHoras(str) {
    if (!str) return null;
    const m = String(str).match(/(\d+)\s*h?\s*(\d{0,2})/i);
    if (!m) return null;
    const h = Number(m[1]);
    const min = m[2] ? Number(m[2]) : 0;
    if (isNaN(h)) return null;
    return h + min / 60;
  }

  function weightChartSvg(entries, config) {
    if (entries.length < 2) {
      return `<div class="card tight" style="text-align:center; color:var(--ink-soft); padding:26px 12px;">Registre seu peso semanalmente para ver o gráfico de evolução aqui.</div>`;
    }
    const w = 300, h = 120, pad = 14;
    const weights = entries.map((e) => e.weight);
    const min = Math.min(...weights, config.goalWeight) - 1;
    const max = Math.max(...weights, config.startWeight) + 1;
    const xs = entries.map((_, i) => pad + (i * (w - pad * 2)) / (entries.length - 1));
    const ys = weights.map((wt) => h - pad - ((wt - min) / (max - min)) * (h - pad * 2));
    const points = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
    const goalY = h - pad - ((config.goalWeight - min) / (max - min)) * (h - pad * 2);
    return `
      <svg viewBox="0 0 ${w} ${h}" style="width:100%; height:auto;">
        <line x1="${pad}" y1="${goalY}" x2="${w - pad}" y2="${goalY}" stroke="#C9A66B" stroke-width="1" stroke-dasharray="4 4" />
        <polyline points="${points}" fill="none" stroke="#B76E79" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
        ${xs.map((x, i) => `<circle cx="${x}" cy="${ys[i]}" r="3.4" fill="#9A5760" />`).join("")}
      </svg>`;
  }

  function openWeightModal() {
    const config = load(K.config, defaultConfig());
    openModal(`
      <div class="modal-title">Registrar progresso</div>
      <div class="field"><label>Data</label><input type="date" id="wt-date" value="${todayKey()}" /></div>
      <div class="field"><label>Peso (kg)</label><input type="number" step="0.1" id="wt-value" placeholder="Ex: 60.5" /></div>
      <div class="field"><label>Medida da cintura (cm) — opcional</label><input type="number" step="0.1" id="wt-waist" /></div>
      <button class="btn block" id="wt-save">Salvar registro</button>
    `);
    document.getElementById("wt-save").addEventListener("click", () => {
      const date = document.getElementById("wt-date").value || todayKey();
      const weight = parseFloat(document.getElementById("wt-value").value);
      const waist = document.getElementById("wt-waist").value ? parseFloat(document.getElementById("wt-waist").value) : null;
      if (!weight) { toast("Informe um peso válido."); return; }
      updateDay(date, { weight, waist });
      closeModal();
      render();
      toast("Registro salvo.");
    });
  }

  /* ---- Achievements ---- */
  function achievementsHtml() {
    const list = computeAchievements();
    return list.map((a) => `<span class="badge ${a.unlocked ? "" : "locked"}">${a.label}</span>`).join("");
  }
  function computeAchievements() {
    const days = load(K.days, {});
    const config = load(K.config, defaultConfig());
    const keys = Object.keys(days).sort();
    const daysWithActivity = keys.filter((k) => days[k].tasks && Object.values(days[k].tasks).some(Boolean));
    const last7 = lastNDateKeys(7);
    const treinoDias = last7.filter((k) => days[k] && days[k].tasks && days[k].tasks["exercicio"]).length;
    const leituraDias = last7.filter((k) => days[k] && days[k].tasks && days[k].tasks["leitura"]).length;
    const aguaMetaVezes = keys.filter((k) => days[k].waterMl >= (config.waterGoalMl || 2000)).length;

    return [
      { label: "Primeira semana concluída", unlocked: daysWithActivity.length >= 7 },
      { label: "3 treinos na semana", unlocked: treinoDias >= 3 },
      { label: "7 dias de leitura", unlocked: leituraDias >= 7 },
      { label: "Meta de água 5 vezes", unlocked: aguaMetaVezes >= 5 },
    ];
  }
  function checkAchievements() {
    // reserved for future toasts on new unlocks
  }

  /* ---- Histórico ---- */
  function openHistoryModal() {
    openModal(`
      <div class="modal-title">Histórico</div>
      <div class="field"><label>Escolha uma data</label><input type="date" id="hist-date" max="${todayKey()}" value="${todayKey()}" /></div>
      <div id="hist-result"></div>
    `);
    const showDate = () => {
      const key = document.getElementById("hist-date").value;
      const days = load(K.days, {});
      const routine = load(K.routine, defaultRoutine());
      const day = days[key];
      const result = document.getElementById("hist-result");
      if (!day) { result.innerHTML = `<div class="empty-state"><div class="big">Nada por aqui</div>Nenhum registro para este dia.</div>`; return; }
      const doneItems = routine.filter((t) => day.tasks && day.tasks[t.id]);
      result.innerHTML = `
        <div class="card tight">
          <div class="row"><span class="muted">Água</span><b>${((day.waterMl||0)/1000).toFixed(2)} L</b></div>
          <div class="row"><span class="muted">Tarefas concluídas</span><b>${doneItems.length} de ${routine.length}</b></div>
          ${day.weight ? `<div class="row"><span class="muted">Peso registrado</span><b>${day.weight} kg</b></div>` : ""}
          ${day.checkin ? `<div class="row"><span class="muted">Check-in</span><b>feito</b></div>` : ""}
          ${day.checkin && day.checkin.melhorar ? `<div class="row" style="display:block; margin-top:8px;"><span class="muted">Observação</span><div style="margin-top:4px;">${escapeHtml(day.checkin.melhorar)}</div></div>` : ""}
        </div>`;
    };
    document.getElementById("hist-date").addEventListener("change", showDate);
    showDate();
  }

  /* =====================================================
     TELA MAIS
     ===================================================== */
  function renderMais() {
    const config = load(K.config, defaultConfig());
    viewEl.innerHTML = `
      <h1 class="greeting">Mais</h1>
      <div class="muted">Projeto Eva 55 — “Cuidar de mim também faz parte.”</div>

      <h2 class="section-title">Meu projeto</h2>
      <div class="card tight menu-list">
        <div class="list-item" data-open="projeto"><div class="label">Peso inicial, objetivo e altura</div><span class="chev">›</span></div>
      </div>

      <h2 class="section-title">Rotina</h2>
      <div class="card tight menu-list">
        <div class="list-item" data-open="routine"><div class="label">Editar meus horários</div><span class="chev">›</span></div>
        <div class="list-item" data-open="exercise"><div class="label">Programação de exercícios</div><span class="chev">›</span></div>
        <div class="list-item" data-open="water"><div class="label">Meta de água</div><span class="chev">›</span></div>
      </div>

      <h2 class="section-title">Compras</h2>
      <div class="card tight menu-list">
        <div class="list-item" data-open="people"><div class="label">Para quantas pessoas comprar</div><span class="chev">›</span></div>
      </div>

      <h2 class="section-title">Dados</h2>
      <div class="card tight menu-list">
        <div class="list-item" data-open="export"><div class="label">Exportar backup (JSON)</div><span class="chev">›</span></div>
        <div class="list-item" data-open="import"><div class="label">Importar backup</div><span class="chev">›</span></div>
        <div class="list-item" data-open="reset"><div class="label">Apagar todos os dados</div><span class="chev">›</span></div>
      </div>

      <div class="privacy-note">Este não é um aplicativo médico. Ele não faz diagnóstico, prescrição clínica ou cálculo de dieta terapêutica — é apenas um painel pessoal de organização. Seus dados ficam somente neste dispositivo.</div>
    `;

    viewEl.querySelectorAll("[data-open]").forEach((row) => {
      row.addEventListener("click", () => openMaisModal(row.dataset.open));
    });
  }

  function openMaisModal(which) {
    const config = load(K.config, defaultConfig());
    if (which === "projeto") {
      openModal(`
        <div class="modal-title">Meu projeto</div>
        <div class="field"><label>Nome</label><input type="text" id="m-name" value="${escapeAttr(config.name)}" /></div>
        <div class="field"><label>Peso inicial (kg)</label><input type="number" step="0.1" id="m-start" value="${config.startWeight}" /></div>
        <div class="field"><label>Objetivo (kg)</label><input type="number" step="0.1" id="m-goal" value="${config.goalWeight}" /></div>
        <div class="field"><label>Altura (m)</label><input type="number" step="0.01" id="m-height" value="${config.height}" /></div>
        <button class="btn block" id="m-save">Salvar</button>
      `);
      document.getElementById("m-save").addEventListener("click", () => {
        const c = load(K.config, defaultConfig());
        c.name = document.getElementById("m-name").value.trim() || c.name;
        c.startWeight = parseFloat(document.getElementById("m-start").value) || c.startWeight;
        c.goalWeight = parseFloat(document.getElementById("m-goal").value) || c.goalWeight;
        c.height = parseFloat(document.getElementById("m-height").value) || c.height;
        save(K.config, c);
        closeModal(); render(); toast("Dados atualizados.");
      });
    }

    if (which === "routine") {
      const routine = load(K.routine, defaultRoutine()).slice().sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
      openModal(`
        <div class="modal-title">Editar meus horários</div>
        <div id="routine-rows">
          ${routine.map((t) => `
            <div class="routine-edit-row" data-id="${t.id}">
              <input type="time" value="${t.time}" data-field="time" />
              <input type="text" value="${escapeAttr(t.title)}" data-field="title" />
            </div>`).join("")}
        </div>
        <button class="btn block" id="routine-save" style="margin-top:14px;">Salvar horários</button>
      `);
      document.getElementById("routine-save").addEventListener("click", () => {
        const r = load(K.routine, defaultRoutine());
        document.querySelectorAll("#routine-rows .routine-edit-row").forEach((row) => {
          const item = r.find((x) => x.id === row.dataset.id);
          if (!item) return;
          item.time = row.querySelector('[data-field="time"]').value || item.time;
          item.title = row.querySelector('[data-field="title"]').value.trim() || item.title;
        });
        save(K.routine, r);
        closeModal(); render(); toast("Horários atualizados.");
      });
    }

    if (which === "exercise") {
      const plan = load(K.exercisePlan, defaultExercisePlan());
      openModal(`
        <div class="modal-title">Programação de exercícios</div>
        ${["seg","ter","qua","qui","sex","sab","dom"].map((d) => `
          <div class="field"><label>${WEEKDAY_LABEL[d]}</label><input type="text" data-day="${d}" value="${escapeAttr(plan[d])}" /></div>
        `).join("")}
        <button class="btn block" id="ex-save">Salvar</button>
      `);
      document.getElementById("ex-save").addEventListener("click", () => {
        const p = load(K.exercisePlan, defaultExercisePlan());
        document.querySelectorAll("[data-day]").forEach((inp) => { p[inp.dataset.day] = inp.value.trim(); });
        save(K.exercisePlan, p);
        closeModal(); render(); toast("Programação atualizada.");
      });
    }

    if (which === "water") {
      openModal(`
        <div class="modal-title">Meta de água</div>
        <div class="field"><label>Meta diária (ml)</label><input type="number" step="50" id="w-goal" value="${config.waterGoalMl}" /></div>
        <button class="btn block" id="w-save">Salvar</button>
      `);
      document.getElementById("w-save").addEventListener("click", () => {
        const c = load(K.config, defaultConfig());
        c.waterGoalMl = parseInt(document.getElementById("w-goal").value, 10) || c.waterGoalMl;
        save(K.config, c);
        closeModal(); render(); toast("Meta de água atualizada.");
      });
    }

    if (which === "people") {
      const shopping = load(K.shopping, defaultShopping());
      openModal(`
        <div class="modal-title">Para quantas pessoas comprar</div>
        <div class="option-row">
          ${[1,2,3,4,5].map((n) => `<button type="button" class="option-btn ${shopping.people===n?"selected":""}" data-n="${n}">${n}</button>`).join("")}
        </div>
        <div class="muted" style="margin-top:12px;">Isso é apenas uma referência prática de compras — não é uma prescrição nutricional.</div>
      `);
      document.querySelectorAll(".option-btn[data-n]").forEach((b) => {
        b.addEventListener("click", () => {
          const s = load(K.shopping, defaultShopping());
          s.people = Number(b.dataset.n);
          save(K.shopping, s);
          closeModal(); render(); toast("Preferência salva.");
        });
      });
    }

    if (which === "export") {
      const backup = {
        exportedAt: new Date().toISOString(),
        config: load(K.config, defaultConfig()),
        routine: load(K.routine, defaultRoutine()),
        exercisePlan: load(K.exercisePlan, defaultExercisePlan()),
        menu: load(K.menu, defaultMenu()),
        shopping: load(K.shopping, defaultShopping()),
        prep: load(K.prep, defaultPrep()),
        days: load(K.days, {}),
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `eva55-backup-${todayKey()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      toast("Backup exportado.");
    }

    if (which === "import") {
      openModal(`
        <div class="modal-title">Importar backup</div>
        <div class="field"><label>Selecione o arquivo JSON exportado</label><input type="file" id="import-file" accept="application/json" /></div>
        <div class="muted">Isso substituirá os dados atuais deste dispositivo.</div>
        <button class="btn block" id="import-btn" style="margin-top:14px;">Importar</button>
      `);
      document.getElementById("import-btn").addEventListener("click", () => {
        const file = document.getElementById("import-file").files[0];
        if (!file) { toast("Selecione um arquivo."); return; }
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const data = JSON.parse(reader.result);
            if (data.config) save(K.config, data.config);
            if (data.routine) save(K.routine, data.routine);
            if (data.exercisePlan) save(K.exercisePlan, data.exercisePlan);
            if (data.menu) save(K.menu, data.menu);
            if (data.shopping) save(K.shopping, data.shopping);
            if (data.prep) save(K.prep, data.prep);
            if (data.days) save(K.days, data.days);
            closeModal(); render(); toast("Backup importado com sucesso.");
          } catch (e) {
            toast("Não foi possível ler este arquivo.");
          }
        };
        reader.readAsText(file);
      });
    }

    if (which === "reset") {
      openModal(`
        <div class="modal-title">Apagar todos os dados</div>
        <div class="muted">Esta ação não pode ser desfeita. Considere exportar um backup antes.</div>
        <div class="modal-actions" style="margin-top:16px;">
          <button class="btn secondary block" id="reset-cancel">Cancelar</button>
          <button class="btn danger block" id="reset-confirm">Apagar tudo</button>
        </div>
      `);
      document.getElementById("reset-cancel").addEventListener("click", closeModal);
      document.getElementById("reset-confirm").addEventListener("click", () => {
        Object.values(K).forEach((k) => localStorage.removeItem(k));
        ensureBootstrap();
        closeModal(); setTab("hoje"); toast("Dados apagados.");
      });
    }
  }

  /* =====================================================
     MODAL helpers
     ===================================================== */
  function openModal(innerHtml) {
    const root = document.getElementById("modal-root");
    root.innerHTML = `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-sheet" role="dialog" aria-modal="true">
          <div class="modal-handle"></div>
          <button class="modal-close" id="modal-close-btn" aria-label="Fechar">Fechar</button>
          ${innerHtml}
        </div>
      </div>`;
    document.getElementById("modal-close-btn").addEventListener("click", closeModal);
    document.getElementById("modal-overlay").addEventListener("click", (e) => {
      if (e.target.id === "modal-overlay") closeModal();
    });
  }
  function closeModal() {
    document.getElementById("modal-root").innerHTML = "";
  }

  /* ---------------- utils ---------------- */
  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function escapeAttr(str) { return escapeHtml(str); }

  /* ---------------- init ---------------- */
  function initNav() {
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => setTab(btn.dataset.tab));
    });
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {});
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureBootstrap();
    initNav();
    registerServiceWorker();
    render();
    // refresh the "agora/próximo" card roughly every minute
    setInterval(() => {
      const ui = load(K.ui, {});
      if (!ui.tab || ui.tab === "hoje") render();
    }, 60000);
  });
})();
