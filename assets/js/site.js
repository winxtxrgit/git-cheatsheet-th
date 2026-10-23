(function () {
  "use strict";

  var doc = document.getElementById("doc");
  if (!doc) return;

  var EMOJI_PREFIX = /^[\p{Extended_Pictographic}\p{Regional_Indicator}\p{Emoji_Modifier}‍️\s]+/u;
  var LINK_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>';
  var COPY_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
  var CHECK_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17 19 7"/></svg>';

  // ---------- Copy + toast ----------
  var toast = document.getElementById("toast");
  var toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(area);
    });
  }

  function shorten(text) {
    var line = text.trim().split("\n")[0];
    return line.length > 42 ? line.slice(0, 40) + "…" : line;
  }

  // ---------- Group the rendered README into sections ----------
  // Each topic starts with <p><a id="slug"></a></p> followed by its <h2>.
  var headings = Array.prototype.slice.call(doc.querySelectorAll(":scope > h2"));
  var starts = headings.map(function (h2) {
    var prev = h2.previousElementSibling;
    var anchor = prev && prev.tagName === "P" && prev.children.length === 1 && prev.querySelector("a[id]");
    return { h2: h2, start: anchor ? prev : h2, id: anchor ? anchor.id : null };
  });

  var sections = [];
  starts.forEach(function (item, i) {
    var stop = starts[i + 1] ? starts[i + 1].start : document.getElementById("empty-state");
    var section = document.createElement("section");
    section.className = "sec";
    doc.insertBefore(section, item.start);
    var node = item.start;
    while (node && node !== stop) {
      var next = node.nextSibling;
      section.appendChild(node);
      node = next;
    }
    if (!item.id) {
      // Contribute / License live in the page footer instead.
      section.remove();
      return;
    }
    section.setAttribute("aria-labelledby", item.id + "-title");
    sections.push({ el: section, h2: item.h2, id: item.id });
  });

  var tocList = document.getElementById("toc-list");
  var tocLinks = {};

  sections.forEach(function (sec, i) {
    var number = String(i + 1).padStart(2, "0");
    var title = sec.h2.textContent.replace(EMOJI_PREFIX, "").trim();
    var isOops = sec.id === "oops";
    sec.title = title;
    if (isOops) sec.el.classList.add("is-oops");

    sec.h2.id = sec.id + "-title";
    sec.h2.textContent = "";
    var n = document.createElement("span");
    n.className = "n";
    n.textContent = number;
    n.setAttribute("aria-hidden", "true");
    var label = document.createElement("span");
    label.textContent = title;
    var anchor = document.createElement("button");
    anchor.type = "button";
    anchor.className = "anchor";
    anchor.innerHTML = LINK_ICON + '<span class="sr-only">คัดลอกลิงก์หัวข้อ ' + title + "</span>";
    anchor.addEventListener("click", function () {
      var url = location.href.split("#")[0] + "#" + sec.id;
      history.replaceState(null, "", "#" + sec.id);
      copyText(url).then(function () { showToast("คัดลอกลิงก์หัวข้อแล้ว"); });
    });
    sec.h2.append(n, label, anchor);

    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + sec.id;
    if (isOops) a.className = "is-oops";
    a.innerHTML = '<span class="n" aria-hidden="true">' + number + "</span><span></span>";
    a.lastChild.textContent = title;
    li.appendChild(a);
    tocList.appendChild(li);
    tocLinks[sec.id] = a;
    sec.li = li;
  });

  // ---------- Tables: scroll wrapper + click-to-copy commands ----------
  doc.querySelectorAll("table").forEach(function (table) {
    var wrap = document.createElement("div");
    wrap.className = "table-wrap";
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });

  var commandCount = 0;
  doc.querySelectorAll("td code").forEach(function (code) {
    if (!/^(git|gh)\b/.test(code.textContent.trim())) return;
    commandCount++;
    code.classList.add("copyable");
    code.setAttribute("tabindex", "0");
    code.setAttribute("role", "button");
    code.setAttribute("title", "คลิกเพื่อคัดลอก");
    function copy() {
      copyText(code.textContent.trim()).then(function () {
        showToast("คัดลอกแล้ว: " + shorten(code.textContent));
      });
    }
    code.addEventListener("click", copy);
    code.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); copy(); }
    });
  });

  // ---------- Code blocks: language label + copy button ----------
  doc.querySelectorAll("div.highlighter-rouge").forEach(function (block) {
    var match = block.className.match(/language-(\w+)/);
    var lang = match ? match[1] : "text";
    var pre = block.querySelector("pre");
    if (!pre) return;

    pre.textContent.split("\n").forEach(function (line) {
      if (/^\s*(git|gh)\s/.test(line)) commandCount++;
    });

    var wrap = document.createElement("div");
    wrap.className = "codeblock";
    var bar = document.createElement("div");
    bar.className = "codeblock-bar";
    var label = document.createElement("span");
    label.className = "codeblock-lang";
    label.textContent = lang === "plaintext" ? "text" : lang;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "copy-btn";
    button.innerHTML = COPY_ICON + "<span>คัดลอก</span>";
    button.addEventListener("click", function () {
      copyText(pre.textContent.replace(/\n$/, "")).then(function () {
        button.classList.add("done");
        button.innerHTML = CHECK_ICON + "<span>คัดลอกแล้ว</span>";
        setTimeout(function () {
          button.classList.remove("done");
          button.innerHTML = COPY_ICON + "<span>คัดลอก</span>";
        }, 1600);
      });
    });
    bar.append(label, button);
    block.parentNode.insertBefore(wrap, block);
    wrap.append(bar, block);
  });

  // ---------- Hero stats ----------
  function setStat(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  setStat("stat-sections", sections.length);
  setStat("stat-commands", commandCount >= 20 ? Math.floor(commandCount / 10) * 10 + "+" : commandCount);
  setStat("stat-fixes", doc.querySelectorAll("section.is-oops details").length);

  // ---------- Scrollspy ----------
  var activeId = null;
  function setActive(id) {
    if (id === activeId) return;
    if (activeId && tocLinks[activeId]) {
      tocLinks[activeId].classList.remove("active");
      tocLinks[activeId].removeAttribute("aria-current");
    }
    activeId = id;
    var link = tocLinks[id];
    if (!link) return;
    link.classList.add("active");
    link.setAttribute("aria-current", "true");
    var toc = document.getElementById("toc");
    var top = link.offsetTop - toc.clientHeight / 2;
    if (link.offsetTop < toc.scrollTop || link.offsetTop > toc.scrollTop + toc.clientHeight - 40) {
      toc.scrollTo({ top: top });
    }
  }

  if ("IntersectionObserver" in window) {
    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.dataset.sec] = entry.isIntersecting; });
      for (var i = 0; i < sections.length; i++) {
        if (visible[sections[i].id] && !sections[i].el.hidden) { setActive(sections[i].id); break; }
      }
    }, { rootMargin: "-120px 0px -55% 0px" });
    sections.forEach(function (sec) {
      sec.el.dataset.sec = sec.id;
      observer.observe(sec.el);
    });
  }

  // ---------- Progress bar + back to top ----------
  var bar = document.getElementById("progress-bar");
  var toTop = document.querySelector(".to-top");
  var ticking = false;
  function onScroll() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    bar.style.transform = "scaleX(" + ratio + ")";
    toTop.hidden = window.scrollY < 900;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  toTop.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0 });
    document.getElementById("search-input").focus({ preventScroll: true });
  });

  // ---------- Mobile table of contents drawer ----------
  var toc = document.getElementById("toc");
  var toggle = document.querySelector(".toc-toggle");
  var closeBtn = document.querySelector(".toc-close");
  var backdrop = document.querySelector(".toc-backdrop");
  function openToc() {
    toc.classList.add("open");
    backdrop.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    var current = toc.querySelector("a.active") || toc.querySelector("a");
    if (current) current.focus();
  }
  function closeToc(restoreFocus) {
    if (!toc.classList.contains("open")) return;
    toc.classList.remove("open");
    backdrop.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener("click", openToc);
  closeBtn.addEventListener("click", function () { closeToc(true); });
  backdrop.addEventListener("click", function () { closeToc(true); });
  toc.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeToc(false);
  });

  // ---------- Search ----------
  var input = document.getElementById("search-input");
  var status = document.getElementById("search-status");
  var empty = document.getElementById("empty-state");
  var emptyQuery = document.getElementById("empty-query");
  var canHighlight = typeof Highlight === "function" && window.CSS && CSS.highlights;
  var openedBySearch = [];

  function textOf(el) { return el.textContent.toLowerCase(); }

  function highlight(query) {
    if (!canHighlight) return;
    CSS.highlights.delete("search");
    if (!query) return;
    var ranges = [];
    var walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (node.parentElement.closest("[hidden], .codeblock-bar, .anchor, h2 .n")) continue;
      var text = node.nodeValue.toLowerCase();
      var from = 0;
      var at;
      while ((at = text.indexOf(query, from)) !== -1) {
        var range = new Range();
        range.setStart(node, at);
        range.setEnd(node, at + query.length);
        ranges.push(range);
        from = at + query.length;
      }
    }
    CSS.highlights.set("search", new Highlight(...ranges));
  }

  function resetSearch() {
    sections.forEach(function (sec) {
      sec.el.hidden = false;
      sec.li.hidden = false;
      sec.el.querySelectorAll("[hidden]").forEach(function (el) { el.hidden = false; });
    });
    openedBySearch.forEach(function (d) { d.open = false; });
    openedBySearch = [];
    status.textContent = "";
    empty.hidden = true;
    highlight("");
  }

  function runSearch() {
    var query = input.value.trim().toLowerCase();
    resetSearch();
    if (!query) return;

    var shownSections = 0;
    var shownItems = 0;
    sections.forEach(function (sec) {
      var titleHit = sec.title.toLowerCase().indexOf(query) !== -1;
      if (titleHit) {
        shownSections++;
        return;
      }
      var hit = false;
      sec.el.querySelectorAll("tbody tr").forEach(function (row) {
        var match = textOf(row).indexOf(query) !== -1;
        row.hidden = !match;
        if (match) { hit = true; shownItems++; }
      });
      sec.el.querySelectorAll("details").forEach(function (d) {
        var match = textOf(d).indexOf(query) !== -1;
        d.hidden = !match;
        if (match) {
          hit = true;
          shownItems++;
          if (!d.open) { d.open = true; openedBySearch.push(d); }
        }
      });
      Array.prototype.forEach.call(sec.el.children, function (child) {
        if (child.matches("h2, .table-wrap, details, p:has(> a[id]:only-child)")) return;
        var match = textOf(child).indexOf(query) !== -1;
        child.hidden = !match;
        if (match) hit = true;
      });
      sec.el.querySelectorAll(".table-wrap").forEach(function (wrap) {
        wrap.hidden = !wrap.querySelector("tbody tr:not([hidden])");
      });
      sec.el.hidden = !hit;
      sec.li.hidden = !hit;
      if (hit) shownSections++;
    });

    if (shownSections === 0) {
      empty.hidden = false;
      emptyQuery.textContent = input.value.trim();
      status.textContent = "";
    } else {
      status.textContent = "พบใน " + shownSections + " หัวข้อ" + (shownItems ? " · " + shownItems + " รายการ" : "");
    }
    highlight(query);
  }

  var searchTimer;
  input.addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      runSearch();
      var docTop = doc.getBoundingClientRect().top + window.scrollY - 140;
      if (input.value.trim() && window.scrollY < docTop) window.scrollTo({ top: docTop });
    }, 120);
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      input.value = "";
      runSearch();
      input.blur();
    }
  });

  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    var typing = tag === "input" || tag === "textarea" || e.target.isContentEditable;
    if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      input.focus();
      input.select();
    } else if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      input.focus();
      input.select();
    } else if (e.key === "Escape") {
      closeToc(true);
    }
  });

  // ---------- GitHub star count ----------
  var starCount = document.getElementById("star-count");
  function showStars(count) {
    if (typeof count !== "number" || count < 1) return;
    starCount.textContent = count.toLocaleString("th-TH");
    starCount.hidden = false;
  }
  var cached = null;
  try { cached = JSON.parse(sessionStorage.getItem("gcth-stars") || "null"); } catch (e) { cached = null; }
  if (cached && Date.now() - cached.at < 10 * 60 * 1000) {
    showStars(cached.count);
  } else if (window.fetch) {
    fetch("https://api.github.com/repos/winxtxrgit/git-cheatsheet-th")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data) return;
        showStars(data.stargazers_count);
        try { sessionStorage.setItem("gcth-stars", JSON.stringify({ count: data.stargazers_count, at: Date.now() })); } catch (e) { /* storage unavailable */ }
      })
      .catch(function () { /* offline or rate limited: the button still links to the repo */ });
  }

  // ?q=reset opens the page with that search applied, so a search can be shared.
  try {
    var initial = new URLSearchParams(location.search).get("q");
    if (initial) {
      input.value = initial;
      runSearch();
    }
  } catch (e) { /* URLSearchParams unavailable */ }

  // Open a "พังแล้วทำไงดี" item when the URL points inside it.
  if (location.hash) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    var details = target && target.closest("details");
    if (details) details.open = true;
  }
})();
