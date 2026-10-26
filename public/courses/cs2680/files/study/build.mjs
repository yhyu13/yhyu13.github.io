/**
 * build.mjs - generates the CS2680 static study site (courseware/html).
 *
 *   node build.mjs            regenerate index.html + decks/*.html
 *   node build.mjs --check    regenerate, then verify every number that appears
 *                              on a page against the course digest
 *
 * Source of truth for all content: courseware/_digest/part1.md, part2.md,
 * part3.md.  The digest is the only place facts are read from; this script
 * holds the slide *content model* and the layout renderers.
 *
 * Layout system: the html-ppt skill (assets/base.css, assets/runtime.js,
 * assets/themes/*.css, assets/animations/*).  Every colour, radius and
 * shadow used below is a CSS variable from those files - no literal colours.
 *
 * Course source: https://cs2680.seas.harvard.edu/
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DECKS } from './content.mjs';
import { CONCEPT_GROUPS, COURSE_ON_ONE_PAGE, DECK_LABELS } from './concepts.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIGEST_DIR = path.resolve(HERE, '..', '_digest');
const COURSE_DIR = path.resolve(HERE, '..', '..', 'course');
const NOTES_DIR = path.join(COURSE_DIR, 'notes');
const SLIDES_DIR = path.join(COURSE_DIR, 'slides');

const THEME = 'academic-paper';
const THEME_LIST = [
  'academic-paper',
  'editorial-serif',
  'minimal-white',
  'swiss-grid',
  'corporate-clean',
  'engineering-whiteprint',
];

const SITE_URL = 'https://cs2680.seas.harvard.edu';

/* ------------------------------------------------------------------ utils */

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Inline markup: **bold**, `code`, *italic*.  Escapes everything else. */
function md(s) {
  return esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/`([^`]+)`/g, '<code class="mono">$1</code>')
    .replace(/(^|[\s(])\*([^*]+)\*/g, '$1<i>$2</i>');
}

const list = (items, cls = '') =>
  `<ul class="clean ${cls}">${items.map((i) => `<li>${md(i)}</li>`).join('')}</ul>`;

/* ---------------------------------------------------------------- layouts */
/* Each renderer copies the class structure of the matching page in
   html-ppt/templates/single-page/*.html and swaps the demo data. */

const L = {};

L.cover = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <h1 class="h1 anim-fade-up" data-anim="fade-up">${md(s.title)}</h1>
  ${s.lede ? `<p class="lede">${md(s.lede)}</p>` : ''}
  ${s.pills ? `<div class="row wrap mt-l" style="gap:8px">${s.pills
    .map((p, i) => `<span class="pill ${i === 0 ? 'pill-accent' : ''}">${md(p)}</span>`)
    .join('')}</div>` : ''}
  ${s.meta ? `<p class="dim2 mt-l" style="font-size:15px">${md(s.meta)}</p>` : ''}`;

L.quote = (s) => `
  <div style="max-width:1040px;margin:0 auto">
    <div class="serif" style="font-size:120px;line-height:.9;color:var(--accent);opacity:.6">"</div>
    <blockquote class="serif anim-fade-up" data-anim="fade-up" style="font-size:46px;line-height:1.25;margin:-34px 0 20px;font-style:italic;font-weight:600">${md(
      s.text,
    )}</blockquote>
    <p class="dim" style="font-size:19px;letter-spacing:.06em">${md(s.attribution || '')}</p>
  </div>`;

L.bullets = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <h2 class="h2">${md(s.title)}</h2>
  ${s.lede ? `<p class="lede mb-l">${md(s.lede)}</p>` : ''}
  <ul class="grid g1 anim-stagger-list" style="list-style:none;padding:0;margin:0;gap:12px" data-anim-target>
    ${s.items
      .map(
        (it) =>
          `<li class="card card-accent"><h4>${md(it.h)}</h4>${it.p ? `<p class="dim">${md(it.p)}</p>` : ''}${
            it.li ? list(it.li) : ''
          }</li>`,
      )
      .join('')}
  </ul>`;

L.twocol = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <h2 class="h2">${md(s.title)}</h2>
  ${s.lede ? `<p class="lede mb-l">${md(s.lede)}</p>` : ''}
  <div class="grid g2 mt-l" style="align-items:start">
    <div class="card anim-fade-left" data-anim="fade-left">
      <h3>${md(s.left.h)}</h3>
      ${s.left.p ? `<p class="dim">${md(s.left.p)}</p>` : ''}
      ${s.left.li ? list(s.left.li) : ''}
    </div>
    <div class="card anim-fade-right" data-anim="fade-right">
      <h3>${md(s.right.h)}</h3>
      ${s.right.p ? `<p class="dim">${md(s.right.p)}</p>` : ''}
      ${s.right.li ? list(s.right.li) : ''}
    </div>
  </div>`;

L.threecol = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <h2 class="h2">${md(s.title)}</h2>
  ${s.lede ? `<p class="lede mb-l">${md(s.lede)}</p>` : ''}
  <div class="grid g3 mt-l anim-stagger-list" data-anim-target>
    ${s.cols
      .map(
        (c) =>
          `<div class="card"><h4>${md(c.h)}</h4>${c.p ? `<p class="dim">${md(c.p)}</p>` : ''}${
            c.li ? list(c.li) : ''
          }</div>`,
      )
      .join('')}
  </div>`;

L.cards = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <h2 class="h2">${md(s.title)}</h2>
  ${s.lede ? `<p class="lede mb-l">${md(s.lede)}</p>` : ''}
  <div class="grid ${s.cols ? 'g' + s.cols : 'g3'} mt-l anim-stagger-list" data-anim-target>
    ${s.cards
      .map(
        (c) =>
          `<div class="card ${c.cls || ''}"><h4>${md(c.h)}</h4>${c.p ? `<p class="dim">${md(c.p)}</p>` : ''}${
            c.li ? list(c.li) : ''
          }</div>`,
      )
      .join('')}
  </div>`;

L.groups = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <h2 class="h2">${md(s.title)}</h2>
  ${s.lede ? `<p class="lede mb-l">${md(s.lede)}</p>` : ''}
  <div class="grid g2 mt-l anim-stagger-list" style="align-items:start" data-anim-target>
    ${s.groups
      .map(
        (g) =>
          `<div class="card"><h4>${md(g.h)}</h4>${g.p ? `<p class="dim">${md(g.p)}</p>` : ''}${
            g.li ? list(g.li) : ''
          }</div>`,
      )
      .join('')}
  </div>`;

L.table = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <h2 class="h2">${md(s.title)}</h2>
  ${s.lede ? `<p class="lede mb-l">${md(s.lede)}</p>` : ''}
  <div class="card mt-l" style="padding:6px 12px">
    <table class="t ${s.small ? 'sm' : ''}">
      <thead><tr>${s.cols.map((c) => `<th${c.num ? ' class="num"' : ''}>${md(c.t ?? c)}</th>`).join('')}</tr></thead>
      <tbody>
        ${s.rows
          .map(
            (r) =>
              `<tr>${r
                .map(
                  (cell, i) =>
                    `<td${s.cols[i] && s.cols[i].num ? ' class="num"' : ''}>${md(cell)}</td>`,
                )
                .join('')}</tr>`,
          )
          .join('')}
      </tbody>
    </table>
  </div>
  ${s.note ? `<p class="dim2 mt-m" style="font-size:14px">${md(s.note)}</p>` : ''}`;

L.kpi = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <h2 class="h2">${md(s.title)}</h2>
  ${s.lede ? `<p class="lede mb-l">${md(s.lede)}</p>` : ''}
  <div class="grid g${s.n || 4} mt-l anim-stagger-list" data-anim-target>
    ${s.items
      .map(
        (it) =>
          `<div class="card"><p class="eyebrow">${md(it.label)}</p><div style="font-size:46px;font-weight:800;line-height:1.1">${
            it.value
          }${it.suffix ? `<span style="font-size:24px">${md(it.suffix)}</span>` : ''}</div>${
            it.sub ? `<p class="dim" style="font-size:14px">${md(it.sub)}</p>` : ''
          }</div>`,
      )
      .join('')}
  </div>
  ${s.note ? `<p class="dim2 mt-m" style="font-size:14px">${md(s.note)}</p>` : ''}`;

L.stat = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <div style="font-size:200px;line-height:1;font-weight:900;letter-spacing:-.04em">${md(s.value)}${
    s.suffix ? `<span style="font-size:70px">${md(s.suffix)}</span>` : ''
  }</div>
  <h3 class="mt-s">${md(s.caption)}</h3>
  ${s.lede ? `<p class="lede" style="margin:14px auto 0">${md(s.lede)}</p>` : ''}`;

L.steps = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <h2 class="h2">${md(s.title)}</h2>
  ${s.lede ? `<p class="lede mb-l">${md(s.lede)}</p>` : ''}
  <div class="steps anim-stagger-list" data-anim-target>
    ${s.steps
      .map(
        (st) =>
          `<div class="step"><div class="num">${md(st.n)}</div><h4>${md(st.h)}</h4><p>${md(st.p)}</p>${
            st.tag ? `<span class="tag">${md(st.tag)}</span>` : ''
          }</div>`,
      )
      .join('')}
  </div>`;

L.flow = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <h2 class="h2">${md(s.title)}</h2>
  ${s.lede ? `<p class="lede mb-l">${md(s.lede)}</p>` : ''}
  <div class="flow anim-stagger-list" data-anim-target>
    ${s.nodes
      .map(
        (n, i) =>
          `${i ? '<div class="arr">&rarr;</div>' : ''}<div class="node${n.hl ? ' hl' : ''}"><h4>${md(
            n.h,
          )}</h4>${n.p ? `<p>${md(n.p)}</p>` : ''}</div>`,
      )
      .join('')}
  </div>
  ${s.note ? `<p class="dim2 mt-m" style="font-size:14px">${md(s.note)}</p>` : ''}`;

L.compare = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <h2 class="h2">${md(s.title)}</h2>
  ${s.lede ? `<p class="lede mb-l">${md(s.lede)}</p>` : ''}
  <div class="vs">
    <div class="card bad-side side anim-fade-left" data-anim="fade-left">
      <h3>${md(s.left.h)}</h3>
      ${s.left.p ? `<p class="dim">${md(s.left.p)}</p>` : ''}
      ${list(s.left.li || [], 'vs-li')}
    </div>
    <div class="mid">&rarr;</div>
    <div class="card good-side side anim-fade-right" data-anim="fade-right">
      <h3>${md(s.right.h)}</h3>
      ${s.right.p ? `<p class="dim">${md(s.right.p)}</p>` : ''}
      ${list(s.right.li || [], 'vs-li')}
    </div>
  </div>
  ${s.note ? `<p class="dim2 mt-m" style="font-size:14px">${md(s.note)}</p>` : ''}`;

L.timeline = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <h2 class="h2">${md(s.title)}</h2>
  ${s.lede ? `<p class="lede mb-l">${md(s.lede)}</p>` : ''}
  <div class="tl">
    <div class="row anim-stagger-list" data-anim-target>
      ${s.items
        .map(
          (it) =>
            `<div class="item"><div class="year">${md(it.when)}</div><div class="dot"></div><h4>${md(
              it.h,
            )}</h4><p>${md(it.p)}</p></div>`,
        )
        .join('')}
    </div>
  </div>
  ${s.note ? `<p class="dim2 mt-m" style="font-size:14px">${md(s.note)}</p>` : ''}`;

L.arch = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <h2 class="h2">${md(s.title)}</h2>
  ${s.lede ? `<p class="lede mb-l">${md(s.lede)}</p>` : ''}
  <div class="arch anim-stagger-list" data-anim-target>
    ${s.tiers
      .map(
        (t) =>
          `<div class="tier${t.hl ? ' hl' : ''}"><div class="tname">${md(t.name)}</div><div class="cells${
            t.cells.length === 3 ? ' three' : ''
          }">${t.cells
            .map(
              (c) =>
                `<div class="cell"><h4>${md(c.h)}</h4>${c.p ? `<p>${md(c.p)}</p>` : ''}</div>`,
            )
            .join('')}</div></div>`,
      )
      .join('')}
  </div>
  ${s.note ? `<p class="dim2 mt-m" style="font-size:14px">${md(s.note)}</p>` : ''}`;

L.checklist = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <h2 class="h2">${md(s.title)}</h2>
  ${s.lede ? `<p class="lede mb-l">${md(s.lede)}</p>` : ''}
  <ul class="chk anim-stagger-list" data-anim-target>
    ${s.items
      .map(
        (it) =>
          `<li class="${it.done ? 'done' : ''}"><span class="b"></span><span class="t">${md(
            it.t,
          )}</span><span class="tag">${md(it.tag || '')}</span></li>`,
      )
      .join('')}
  </ul>`;

L.roadmap = (s) => `
  <p class="kicker">${md(s.kicker || '')}</p>
  <h2 class="h2">${md(s.title)}</h2>
  ${s.lede ? `<p class="lede mb-l">${md(s.lede)}</p>` : ''}
  <div class="rm">
    ${s.cols
      .map(
        (c) =>
          `<div class="col${c.now ? ' now' : ''}"><span class="tag">${md(c.tag)}</span><h4>${md(
            c.h,
          )}</h4>${list(c.li || [])}</div>`,
      )
      .join('')}
  </div>
  ${s.note ? `<p class="dim2 mt-m" style="font-size:14px">${md(s.note)}</p>` : ''}`;

/* --------------------------------------------------------------- slides */

function renderSlide(s) {
  const fn = L[s.layout];
  if (!fn) throw new Error(`unknown layout: ${s.layout}`);
  const cls = ['slide'];
  if (s.center) cls.push('center', 'tc');
  const title = s.title || s.kicker || s.layout;
  return `  <section class="${cls.join(' ')}" data-title="${esc(title)}">
${fn(s)}
    <div class="notes">${md(s.notes || '')}</div>
  </section>`;
}

/* ----------------------------------------------------------------- page */

const DECK_CSS = `    <style>
    /* deck-local styles - tokens only, no literal colours */
    .slide{padding:88px 96px 104px}
    .slide.dense .h2{font-size:40px}
    .slide.dense .lede{font-size:19px}
    .t{width:100%;border-collapse:collapse;font-size:16px}
    .t th,.t td{padding:9px 13px;text-align:left;border-bottom:1px solid var(--border);vertical-align:top}
    .t th{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-3);font-weight:600}
    .t tr:hover td{background:var(--surface-2)}
    .t td.num{font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}
    .t.sm{font-size:13px}
    .t.sm th,.t.sm td{padding:5px 9px}
    .t td code{font-size:.92em}
    ul.clean{list-style:none;padding:0;margin:10px 0 0}
    ul.clean li{position:relative;padding-left:18px;margin-bottom:6px;font-size:15px;color:var(--text-2);line-height:1.55}
    ul.clean li::before{content:"";position:absolute;left:0;top:.62em;width:6px;height:6px;background:var(--accent);border-radius:50%}
    .card h4{margin-bottom:6px}
    .card p{font-size:15px;line-height:1.55}
    .vs{display:grid;grid-template-columns:1fr 76px 1fr;gap:24px;align-items:stretch;margin-top:22px}
    .vs .side{padding:26px}
    .vs .mid{font-size:48px;font-weight:800;color:var(--text-3);display:flex;align-items:center;justify-content:center}
    .vs .bad-side{border-top:3px solid var(--bad)}
    .vs .good-side{border-top:3px solid var(--good)}
    .vs h3{font-size:22px}
    .vs .vs-li li{color:var(--text-2)}
    .steps{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:18px}
    .step{position:relative;padding:22px 24px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);box-shadow:var(--shadow)}
    .step .num{position:absolute;top:-22px;left:20px;width:44px;height:44px;border-radius:50%;background:var(--surface);border:2px solid var(--accent);color:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px}
    .step h4{margin:16px 0 6px;font-size:16px}
    .step p{font-size:13px;color:var(--text-2);line-height:1.55}
    .step .tag{display:inline-block;margin-top:8px;font-size:11px;padding:3px 10px;border-radius:999px;background:var(--surface-2);color:var(--text-3)}
    .flow{display:flex;align-items:stretch;gap:14px;margin-top:26px}
    .flow .node{flex:1;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;text-align:center;box-shadow:var(--shadow)}
    .flow .node h4{font-size:15px;margin:0 0 4px}
    .flow .node p{font-size:12px;color:var(--text-3);margin:0}
    .flow .arr{color:var(--text-3);font-size:26px;align-self:center}
    .flow .node.hl{border-color:var(--accent);border-width:2px}
    .tl{position:relative;margin-top:26px}
    .tl::before{content:"";position:absolute;left:0;right:0;top:44px;height:2px;background:var(--border)}
    .tl .row{display:grid;grid-template-columns:repeat(5,1fr);gap:20px;align-items:start}
    .tl .item{position:relative;padding-top:74px;text-align:center}
    .tl .dot{position:absolute;top:32px;left:50%;transform:translateX(-50%);width:22px;height:22px;border-radius:50%;background:var(--accent);border:4px solid var(--bg);box-shadow:0 0 0 2px var(--accent)}
    .tl .year{font-size:13px;color:var(--text-3);letter-spacing:.1em;text-transform:uppercase;position:absolute;top:0;left:0;right:0;font-weight:600}
    .tl h4{font-size:16px}
    .tl p{font-size:12px;color:var(--text-2)}
    .arch{margin-top:16px;display:grid;gap:16px}
    .arch .tier{display:grid;grid-template-columns:130px 1fr;align-items:stretch;gap:18px}
    .arch .tname{display:flex;align-items:center;justify-content:center;background:var(--surface-2);border-radius:var(--radius);padding:14px;font-weight:600;font-size:12px;color:var(--text-2);text-transform:uppercase;letter-spacing:.1em;text-align:center}
    .arch .cells{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
    .arch .cells.three{grid-template-columns:repeat(3,1fr)}
    .arch .cell{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px;text-align:center;box-shadow:var(--shadow)}
    .arch .cell h4{font-size:14px;margin:0 0 3px}
    .arch .cell p{font-size:11px;color:var(--text-3);margin:0}
    .arch .tier.hl .cell{border-top:3px solid var(--accent)}
    .chk{max-width:880px;margin-top:18px}
    .chk li{list-style:none;display:flex;align-items:flex-start;gap:13px;padding:11px 16px;border-bottom:1px solid var(--border)}
    .chk li .b{flex-shrink:0;width:20px;height:20px;border:2px solid var(--border-strong);border-radius:6px;display:flex;align-items:center;justify-content:center;margin-top:3px}
    .chk li.done .b{background:var(--good);border-color:var(--good);color:var(--surface)}
    .chk li.done .b::after{content:"\\2713";font-weight:900}
    .chk li.done .t{text-decoration:line-through;color:var(--text-3)}
    .chk li .t{font-size:17px}
    .chk li .tag{margin-left:auto;font-size:11px;color:var(--text-3);white-space:nowrap}
    .rm{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:20px;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
    .rm .col{padding:18px 20px;border-right:1px solid var(--border);background:var(--surface)}
    .rm .col:last-child{border-right:none}
    .rm .col .tag{display:inline-block;padding:3px 11px;border-radius:999px;font-size:11px;background:var(--surface-2);color:var(--text-2);margin-bottom:8px}
    .rm .col.now{background:var(--surface-2)}
    .rm .col.now .tag{background:var(--accent);color:var(--surface)}
    .rm h4{font-size:15px;margin:6px 0 2px}
    .rm ul.clean li{font-size:13px}
    .srcbox{border-left:3px solid var(--accent);padding:4px 0 4px 18px;margin-top:10px}
    .srcbox a{color:var(--accent)}
    .deck-footer{font-size:11px}
    </style>`;

function renderDeck(deck) {
  const slides = deck.slides.map(renderSlide).join('\n');
  const total = deck.slides.length;
  const sources = (deck.sources || [])
    .map(
      (s) =>
        `<li><a href="${esc(s.url)}">${esc(s.url)}</a> &mdash; ${md(s.label)}</li>`,
    )
    .join('');
  const extra = (deck.extraLinks || [])
    .map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en" data-theme="${THEME}" data-theme-base="../assets/themes/">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CS2680 &middot; ${esc(deck.title)}</title>
<link rel="stylesheet" href="../assets/fonts.css">
<link rel="stylesheet" href="../assets/base.css">
<link rel="stylesheet" id="theme-link" href="../assets/themes/${THEME}.css">
<link rel="stylesheet" href="../assets/animations/animations.css">
${DECK_CSS}
</head>
<body data-themes="${THEME_LIST.join(',')}" data-theme-base="../assets/themes/">
<div class="deck" data-themes="${THEME_LIST.join(',')}">

  <div class="deck-header">
    <span class="eyebrow">CS2680 &middot; Modern AI Systems: Agents and System Optimizations</span>
    <span class="eyebrow">Harvard SEAS &middot; Fall 2026</span>
  </div>
  <div class="deck-footer">
    <span class="dim2">${esc(deck.footerLabel)} &middot; Source: ${esc(deck.source)}</span>
    <span class="slide-number" data-current="1" data-total="${total}"></span>
  </div>

${slides}

  <section class="slide" data-title="Source &amp; navigation">
    <p class="kicker">Provenance</p>
    <h2 class="h2">Source &amp; navigation</h2>
    <p class="lede">Every fact on this deck comes from the published Harvard CS2680 material below.</p>
    <div class="card mt-l">
      <h4>Upstream</h4>
      <ul class="clean">
${sources}
      </ul>
    </div>
    <div class="row mt-l" style="gap:10px">
      <a class="pill pill-accent" href="../index.html">&larr; Course index</a>
      ${(deck.backLinks || [])
        .map((l) => `<a class="pill" href="${esc(l.href)}">${esc(l.label)}</a>`)
        .join('')}
    </div>
    <div class="notes">${md(
      `Provenance slide. The deck was generated from the course digest, which records the upstream URLs, the page markers and every number. The upstream source for this deck is ${deck.source}.`,
    )}</div>
  </section>
</div>
<script src="../assets/runtime.js"></script>
</body>
</html>
`;
}

/* ---------------------------------------------------------------- index */

function renderIndex() {
  const deckCard = (d) => `
      <div class="card">
        <h4>${esc(d.navTitle)}</h4>
        <p class="dim">${esc(d.navBlurb)}</p>
        <p style="margin-top:10px"><a class="pill pill-accent" href="decks/${esc(d.slug)}.html">Open deck</a>
        <span class="pill">${d.slides.length + 1} slides</span></p>
      </div>`;

  const group = (title, blurb, items) => `
    <section class="slide" data-title="${esc(title)}">
      <p class="kicker">${esc(blurb)}</p>
      <h2 class="h2">${esc(title)}</h2>
      <div class="grid g2 mt-l anim-stagger-list" style="align-items:start" data-anim-target>
${items.map(deckCard).join('\n')}
      </div>
      <div class="notes">${esc(`Navigation slide: ${title}.`)}</div>
    </section>`;

  const byId = Object.fromEntries(DECKS.map((d) => [d.id, d]));
  const pick = (ids) => ids.map((id) => byId[id]).filter(Boolean);
  // The course's own Part I runs Sep 2 - Oct 14 and includes lectures 5 to 8.
  // Part II begins on Oct 19 and has no published slides. The index therefore
  // splits Part I by date rather than reusing the reserved "Part II" label for
  // four Part I lectures.
  const partI = pick(['course-overview', 'lecture-01', 'lecture-02', 'lecture-03', 'lecture-04']);
  const partICont = pick(['lecture-05', 'lecture-06', 'lecture-07', 'lecture-08']);
  const partII = pick(['part-ii-status']);
  const refs = pick(['agent-evaluation', 'cost-effective-agents', 'transformers-llm-foundations']);
  const course = pick(['assignments-and-project']);

  /* ---- learning routes: real deep links into specific slides ---------- */

  const slideTitle = (slug, n) => {
    const d = byId[slug];
    if (!d) return '';
    if (n === d.slides.length + 1) return 'Source & navigation';
    const s = d.slides[n - 1];
    return s.title || s.kicker || '';
  };

  const stop = (slug, n) =>
    `<li><a href="decks/${esc(slug)}.html#/${n}">${esc(DECK_LABELS[slug] || slug)} &middot; slide ${n}</a><span>${esc(
      slideTitle(slug, n),
    )}</span></li>`;

  /* the standard pass visits each deck's first slide, so the deck name alone
     identifies it - the slide title would only repeat the link */
  const stopPlain = (slug, n) =>
    `<li><a href="decks/${esc(slug)}.html#/${n}">${esc(DECK_LABELS[slug] || slug)} &middot; slide ${n}</a></li>`;

  const routeA = [
    ['course-overview', 3],
    ['lecture-01', 11],
    ['lecture-04', 17],
    ['lecture-08', 2],
  ];

  const routeB = [
    ['course-overview', 1],
    ['lecture-01', 1],
    ['lecture-02', 1],
    ['lecture-03', 1],
    ['lecture-04', 1],
    ['lecture-05', 1],
    ['lecture-06', 1],
    ['lecture-07', 1],
    ['lecture-08', 1],
    ['assignments-and-project', 2],
  ];

  const routeC = [
    {
      h: 'Context',
      main: ['lecture-04', 14],
      more: [
        ['lecture-02', 6],
        ['lecture-04', 16],
      ],
    },
    {
      h: 'Memory',
      main: ['lecture-06', 2],
      more: [
        ['lecture-02', 8],
        ['lecture-06', 12],
      ],
    },
    {
      h: 'Multi-agent',
      main: ['lecture-05', 3],
      more: [
        ['lecture-03', 9],
        ['lecture-05', 14],
      ],
    },
    {
      h: 'Evaluation',
      main: ['lecture-07', 5],
      more: [
        ['agent-evaluation', 5],
        ['lecture-07', 18],
      ],
    },
    {
      h: 'Cost',
      main: ['lecture-08', 8],
      more: [
        ['cost-effective-agents', 2],
        ['lecture-08', 2],
      ],
    },
    {
      h: 'Reliability',
      main: ['lecture-06', 13],
      more: [
        ['lecture-06', 14],
        ['lecture-04', 18],
      ],
    },
  ];

  const routeCCard = routeC
    .map(
      (c) => `        <li><a href="decks/${esc(c.main[0])}.html#/${c.main[1]}">${esc(c.h)}</a><span>${esc(
        slideTitle(c.main[0], c.main[1]),
      )}</span><span class="more">${c.more
        .map((m) => `<a href="decks/${esc(m[0])}.html#/${m[1]}">${esc(DECK_LABELS[m[0]] || m[0])} &middot; slide ${m[1]}</a>`)
        .join(' &middot; ')}</span></li>`,
    )
    .join('\n');

  const routesSlide = `
  <section class="slide top" data-title="Three ways through the course">
    <p class="kicker">How to use this site</p>
    <h2 class="h2" style="font-size:40px;margin-bottom:6px">Three ways through the course</h2>
    <p class="lede mb-m" style="font-size:17px;max-width:none">Every link below opens a specific slide, not a deck's first page.</p>
    <div class="grid g3 routes anim-stagger-list" style="align-items:start;margin-top:18px" data-anim-target>
      <div class="card card-accent">
        <h4>Route A - fast orientation</h4>
        <p class="dim">Four slides: what the course is, what it optimizes, what the harness decides, and what it costs.</p>
        <ol class="stops">
${routeA.map(([s, n]) => `          ${stop(s, n)}`).join('\n')}
        </ol>
      </div>
      <div class="card">
        <h4>Route B - standard pass</h4>
        <p class="dim">The published Part I in order, then the assignments. Ten decks, start to finish.</p>
        <ol class="stops">
${routeB.map(([s, n]) => `          ${stopPlain(s, n)}`).join('\n')}
        </ol>
      </div>
      <div class="card">
        <h4>Route C - deep route</h4>
        <p class="dim">By system concern. Start from the concern, not from the calendar.</p>
        <ol class="stops">
${routeCCard}
        </ol>
      </div>
    </div>
    <div class="row" style="gap:10px;margin-top:18px">
      <a class="pill pill-accent" href="concepts.html">Concept index &middot; every idea, and the slide that teaches it</a>
      <a class="pill pill-accent" href="search.html">Search &middot; every slide and the whole course text</a>
    </div>
    <div class="notes">Three routes. Route A for a first pass, Route B for the whole published Part I, Route C when you already know which system problem you are chasing. The two new pages - the concept index and the search page - sit on this slide because they are the two ways in when you do not know which slide you want.</div>
  </section>`;

  const toolsSlide = `
  <section class="slide" data-title="Course tools">
    <p class="kicker">Course tools</p>
    <h2 class="h2">Two pages that cut across the decks</h2>
    <div class="grid g2 mt-l anim-stagger-list" style="align-items:start" data-anim-target>
      <a class="card card-accent" href="concepts.html" style="text-decoration:none">
        <h4>Concept index</h4>
        <p class="dim">Every idea the course teaches, grouped in the order the course teaches it, each linked to the exact slide that carries it. Start here when you know the topic but not the slide.</p>
        <p style="margin-top:12px"><span class="pill pill-accent">Open the concept index</span></p>
      </a>
      <a class="card" href="search.html" style="text-decoration:none">
        <h4>Search</h4>
        <p class="dim">Full-text search over the visible text of every slide in the ${DECKS.length} decks and the mirrored course text. Results carry the deck name, the slide number and a link to that slide.</p>
        <p style="margin-top:12px"><span class="pill">Open the search page</span></p>
      </a>
    </div>
    <div class="notes">The concept index is for browsing by idea; the search page is for looking one thing up. Both work offline and both link back here.</div>
  </section>`;

  return `<!DOCTYPE html>
<html lang="en" data-theme="${THEME}" data-theme-base="./assets/themes/">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CS2680 &middot; Modern AI Systems: Agents and System Optimizations &middot; study site</title>
<link rel="stylesheet" href="./assets/fonts.css">
<link rel="stylesheet" href="./assets/base.css">
<link rel="stylesheet" id="theme-link" href="./assets/themes/${THEME}.css">
<link rel="stylesheet" href="./assets/animations/animations.css">
${DECK_CSS.replace('../assets/', './assets/')}
<style>
    /* index-local styles - tokens only, no literal colours */
    .stops{margin:10px 0 0;padding:0;list-style:none;counter-reset:stop}
    .stops li{counter-increment:stop;position:relative;padding:3px 0 3px 22px;border-bottom:1px solid var(--border)}
    .stops li:last-child{border-bottom:0}
    .stops li::before{content:counter(stop);position:absolute;left:0;top:4px;width:17px;height:17px;border-radius:50%;background:var(--surface-2);color:var(--text-3);font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center}
    .stops a{font-size:12.5px;font-weight:600;display:block;color:var(--accent);line-height:1.3}
    .stops span{display:block;font-size:11.5px;color:var(--text-3);line-height:1.3}
    .stops .more{margin-top:1px}
    .stops .more a{display:inline;font-size:11px;font-weight:500}
    .routes .card{padding:20px 22px}
    .routes .card h4{font-size:19px;margin-bottom:4px}
    .routes .card p.dim{font-size:14px;line-height:1.5;margin-bottom:2px}
    a.card:hover{text-decoration:none;border-color:var(--accent)}
    a.card h4{color:var(--text-1)}
    .slide.top{justify-content:flex-start}
    </style>
</head>
<body data-themes="${THEME_LIST.join(',')}" data-theme-base="./assets/themes/">
<div class="deck" data-themes="${THEME_LIST.join(',')}">

  <div class="deck-header">
    <span class="eyebrow">CS2680 &middot; Modern AI Systems: Agents and System Optimizations</span>
    <span class="eyebrow">Harvard SEAS &middot; Fall 2026</span>
  </div>
  <div class="deck-footer">
    <span class="dim2">CS2680 study site &middot; Source: ${esc(SITE_URL)}/</span>
    <span class="slide-number" data-current="1" data-total="10"></span>
  </div>

  <section class="slide" data-title="CS2680 study site">
    <p class="kicker">Harvard SEAS &middot; Fall 2026 &middot; Juncheng Yang</p>
    <h1 class="h1 anim-fade-up" data-anim="fade-up">Modern AI Systems:<br>Agents and System Optimizations</h1>
    <p class="lede">A static study site built from the published CS2680 course material: eight lecture decks, three reference notes, the five assignments, the final project, and the policy pages.</p>
    <div class="row wrap mt-l" style="gap:8px">
      <span class="pill pill-accent">14 decks</span>
      <span class="pill">8 published lectures</span>
      <span class="pill">3 reference notes</span>
      <span class="pill">5 assignments</span>
      <span class="pill">No build step</span>
    </div>
    <div class="row mt-l" style="gap:10px">
      <a class="pill pill-accent" href="concepts.html">Concept index</a>
      <a class="pill pill-accent" href="search.html">Search</a>
    </div>
    <div class="notes">Landing page of the study site. Every deck is a slide deck; use the arrows to move between them, and the overview key for a grid. The two pills below are the cross-deck tools: the concept index and the search page.</div>
  </section>

${routesSlide}

  <section class="slide" data-title="How this site works">
    <p class="kicker">How this site works</p>
    <h2 class="h2">Read it like a deck</h2>
    <div class="grid g2 mt-l anim-stagger-list" style="align-items:start" data-anim-target>
      <div class="card">
        <h4>Keyboard</h4>
        <ul class="clean">
          <li><b>&larr; &rarr;</b> / Space / PgUp / PgDn - move between slides</li>
          <li><b>Home</b> / <b>End</b> - first / last slide</li>
          <li><b>F</b> - fullscreen</li>
          <li><b>O</b> - slide overview grid</li>
          <li><b>T</b> - cycle theme</li>
          <li><b>S</b> - presenter window with notes</li>
          <li><b>N</b> - notes drawer</li>
          <li><b>#/N</b> in the URL - deep link to slide N</li>
        </ul>
      </div>
      <div class="card">
        <h4>Reading</h4>
        <ul class="clean">
          <li>Open any deck from the index; the deck header and footer stay put while you read</li>
          <li>Every deck names its upstream Harvard URL on the final "Source &amp; navigation" slide and in the footer</li>
          <li>Numbers on a page always come from the course digest; where the published material disagrees with itself, the deck says so rather than picking a side</li>
          <li>The site works offline from the filesystem - no server, no network</li>
        </ul>
      </div>
    </div>
    <div class="row mt-l" style="gap:10px">
      <a class="pill" href="concepts.html">Concept index</a>
      <a class="pill" href="search.html">Search</a>
    </div>
    <div class="notes">Explain the two ways in: the arrow keys for a linear read, and the overview grid for jumping between sections.</div>
  </section>

${group('Part I - what an agent is made of', 'Sep 2 - Sep 16, 2026', partI)}
${group('Part I, continued - the deeper half', 'Sep 23 - Oct 7, 2026', partICont)}
${group('Part II - systems for LLMs and agents', 'Oct 19 - Dec 7, 2026 - no slides published yet', partII)}
${group('Reference notes', 'Curated by the instructor', refs)}
${group('Course mechanics', 'Assignments, project, policy, and the rules', course)}

${toolsSlide}

  <section class="slide" data-title="Provenance">
    <p class="kicker">Provenance</p>
    <h2 class="h2">Everything here is a restatement of published material</h2>
    <div class="grid g2 mt-l" style="align-items:start">
      <div class="card">
        <h4>Upstream</h4>
        <ul class="clean">
          <li><a href="${esc(SITE_URL)}/index.html">${esc(SITE_URL)}/index.html</a> - course home, schedule, grading</li>
          <li><a href="${esc(SITE_URL)}/slides/1_intro.pdf">${esc(SITE_URL)}/slides/1_intro.pdf</a> - lecture decks 1 to 8 and the Assignment 3 briefing</li>
          <li><a href="${esc(SITE_URL)}/notes/agent-evaluation.html">${esc(SITE_URL)}/notes/agent-evaluation.html</a></li>
          <li><a href="${esc(SITE_URL)}/notes/cost-effective-agents.html">${esc(SITE_URL)}/notes/cost-effective-agents.html</a></li>
          <li><a href="${esc(SITE_URL)}/notes/transformers.html">${esc(SITE_URL)}/notes/transformers.html</a></li>
          <li><a href="${esc(SITE_URL)}/assignments/index.html">${esc(SITE_URL)}/assignments/index.html</a> and the assignment 1 to 3 specs</li>
          <li><a href="${esc(SITE_URL)}/project.html">${esc(SITE_URL)}/project.html</a> and <a href="${esc(SITE_URL)}/policy.html">${esc(SITE_URL)}/policy.html</a></li>
        </ul>
      </div>
      <div class="card">
        <h4>Method</h4>
        <ul class="clean">
          <li>The site is generated by <code class="mono">build.mjs</code> from a content model derived from the course digest - the HTML is a reproducible artifact, not hand-typed</li>
          <li>No external script, font or chart library is required to render a page; the vendored asset set is local</li>
          <li>Screenshot-only source pages are not described; where the published pages disagree, both readings are shown with their source</li>
        </ul>
      </div>
    </div>
    <div class="notes">Provenance. The digest is the tiebreaker: if two published pages disagree, the deck states the conflict instead of silently choosing one.</div>
  </section>
</div>
<script src="./assets/runtime.js"></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------- concepts */

const CONCEPT_CSS = `    <style>
    /* concept index - deck-local styles, tokens only */
    .slide{padding:80px 88px 96px}
    .slide.dense .h2{font-size:40px}
    .slide.top{justify-content:flex-start}
    .slide.top .h2{font-size:38px;margin-bottom:8px}
    .cidx{width:100%;border-collapse:collapse;table-layout:fixed;font-size:13px}
    .cidx th{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-3);font-weight:600;text-align:left;padding:0 14px 8px 0;border-bottom:1px solid var(--border-strong)}
    .cidx td{padding:9px 14px 9px 0;border-bottom:1px solid var(--border);vertical-align:top;line-height:1.45}
    .cidx td.term{font-size:14px;font-weight:600;color:var(--text-1)}
    .cidx td.g{color:var(--text-2)}
    .cidx a.ck{display:inline-block;font-size:11px;padding:2px 9px;border-radius:999px;background:var(--surface-2);border:1px solid var(--border);color:var(--accent);text-decoration:none;margin:0 5px 4px 0}
    .cidx a.ck:hover{text-decoration:none;border-color:var(--accent)}
    .cgrp{display:flex;gap:14px;align-items:baseline;flex-wrap:wrap;margin-bottom:6px}
    .cgrp .part{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:700}
    .cgrp .ct{font-size:12px;color:var(--text-3)}
    .topics{columns:2;column-gap:22px;margin:0;padding:0;list-style:none}
    .assign-table{table-layout:fixed}
    .assign-table th,.assign-table td{padding:11px 12px}
    .assign-table td:nth-child(3){font-size:12.5px;line-height:1.4;color:var(--text-2)}
    .topics li{font-size:13px;color:var(--text-2);padding:3px 0 3px 16px;position:relative;break-inside:avoid}
    .topics li::before{content:"";position:absolute;left:0;top:.82em;width:5px;height:5px;border-radius:50%;background:var(--accent)}
    .deck-tools{display:flex;gap:12px;flex-wrap:wrap;margin-top:14px}
    .deck-tools a.tcard{display:block;text-decoration:none;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 18px;box-shadow:var(--shadow);min-width:260px}
    .deck-tools a.tcard:hover{text-decoration:none;border-color:var(--accent)}
    .deck-tools a.tcard h4{font-size:17px;margin:0 0 4px;color:var(--text-1)}
    .deck-tools a.tcard p{font-size:13px;color:var(--text-2);margin:0}
    </style>`;

/** One slide of the concept index. */
function conceptSlide(title, body, notes, cls) {
  return `  <section class="slide${cls ? ' ' + cls : ''}" data-title="${esc(title)}">
${body}
    <div class="notes">${md(notes || '')}</div>
  </section>`;
}

/**
 * Deterministic height-based chunking of a concept list into slides.
 * The chunk count is chosen first, then the concepts are spread across the
 * chunks as evenly as possible, so a group never ends with a 3-row slide.
 */
function chunkConcepts(list, maxUnits = 37) {
  const units = (c) => 1 + Math.ceil(c.gloss.length / 100) + 0.6;
  const total = list.reduce((n, c) => n + units(c), 0);
  const nChunks = Math.max(1, Math.ceil(total / maxUnits));
  const per = total / nChunks;
  const chunks = [];
  let cur = [];
  let acc = 0;
  for (const c of list) {
    const u = units(c);
    // close the chunk once it has reached its share, but never leave a
    // 1- or 2-row slide behind
    if (cur.length >= 3 && chunks.length < nChunks - 1 && acc + u > per) {
      chunks.push(cur);
      cur = [];
      acc = 0;
    }
    cur.push(c);
    acc += u;
  }
  if (cur.length) chunks.push(cur);
  return chunks;
}

function renderConcepts() {
  const byId = Object.fromEntries(DECKS.map((d) => [d.id, d]));

  const ck = (ref) => {
    const i = ref.lastIndexOf('#');
    const deck = ref.slice(0, i);
    const n = ref.slice(i + 1);
    const label = DECK_LABELS[deck] || deck;
    return `<a class="ck" href="decks/${deck}.html#/${n}">${esc(label)} &middot; slide ${esc(n)}</a>`;
  };

  const slides = [];

  /* -- cover ------------------------------------------------------- */
  slides.push(
    conceptSlide(
      'Concept index',
      `  <p class="kicker">CS2680 &middot; Modern AI Systems: Agents and System Optimizations</p>
  <h1 class="h1 anim-fade-up" data-anim="fade-up">Concept index</h1>
  <p class="lede">Every idea the course teaches, with the exact slide that teaches it. Each entry links straight to the slide in the deck, so you land on the page that carries the idea rather than on a deck's first slide.</p>
  <div class="row wrap mt-l" style="gap:8px">
    <span class="pill pill-accent">${CONCEPT_GROUPS.reduce((n, g) => n + g.concepts.length, 0)} concepts</span>
    <span class="pill">${CONCEPT_GROUPS.length} groups</span>
    <span class="pill">${DECKS.length} decks</span>
    <span class="pill">Every link is a deep link</span>
  </div>`,
      'The concept index is the answer to the question the calendar cannot answer: where is this idea taught? Every concept is a verbatim phrase from the course digest, and every link carries the deck and the slide number.',
    ),
  );

  /* -- the course in one page -------------------------------------- */
  const P = COURSE_ON_ONE_PAGE;
  slides.push(
    conceptSlide(
      'The course in one page',
      `  <p class="kicker">The course in one page</p>
  <h2 class="h2">One agentic system, from the agent loop down to the serving stack</h2>
  <p class="lede mb-l">${md(P.thesis)}</p>
  <div class="grid g2 mt-l" style="align-items:start">
    <div class="card card-accent">
      <h4>${esc(P.parts[0].h)} &middot; ${esc(P.parts[0].dates)}</h4>
      <ul class="topics mt-s">
${P.parts[0].topics.map((t) => `        <li>${md(t)}</li>`).join('\n')}
      </ul>
    </div>
    <div class="card">
      <h4>${esc(P.parts[1].h)} &middot; ${esc(P.parts[1].dates)}</h4>
      <ul class="topics mt-s">
${P.parts[1].topics.map((t) => `        <li>${md(t)}</li>`).join('\n')}
      </ul>
    </div>
  </div>
  <p class="dim2 mt-m" style="font-size:13px">${md(P.partIDates)} Part II has no published slide deck - see <a href="decks/part-ii-status.html#/3">Part II status</a>.</p>`,
      'One slide, the whole shape. Part I is published and mirrored; Part II has dates and topics but no slides. Everything on this slide comes from the course digest.',
    ),
  );

  /* -- the five assignments ----------------------------------------- */
  slides.push(
    conceptSlide(
      'The five assignments',
      `  <p class="kicker">Deliverables</p>
  <h2 class="h2">The five Mads assignments</h2>
  <div class="card mt-l" style="padding:6px 12px">
    <table class="t sm assign-table">
      <colgroup><col style="width:4%"><col style="width:13%"><col style="width:39%"><col style="width:8%"><col style="width:12%"><col style="width:15%"><col style="width:9%"></colgroup>
      <thead><tr><th>#</th><th>Codename</th><th>Title</th><th>Weight</th><th>Out</th><th>Due</th><th>Effort</th></tr></thead>
      <tbody>
${P.assignments
  .map(
    (r) =>
      `        <tr>${r.map((c, i) => `<td${i === 3 ? ' class="num"' : ''}>${md(c)}</td>`).join('')}</tr>`,
  )
  .join('\n')}
      </tbody>
    </table>
  </div>
  <p class="dim2 mt-m" style="font-size:14px">${md(P.assignmentsNote)}</p>
  <p class="mt-m"><a class="pill pill-accent" href="decks/assignments-and-project.html#/2">The assignments deck</a></p>`,
      'The five assignments walk down the stack: use an agent, replace the runtime with your own loop, optimize around a black-box API, own the serving engine, then optimize the whole stack.',
    ),
  );

  /* -- evaluation and cost ------------------------------------------ */
  slides.push(
    conceptSlide(
      'Evaluation and cost',
      `  <p class="kicker">The two scoreboards</p>
  <h2 class="h2">Evaluation and cost, and the trade-off between them</h2>
  <div class="grid g2 mt-l" style="align-items:start">
    <div class="card card-accent">
      <h4>Evaluation</h4>
      <p class="dim">${md(P.evaluation)}</p>
      <p class="dim mt-s">${md(P.evaluationNote)}</p>
      <p class="mt-m"><a class="pill" href="decks/lecture-07.html#/20">Lecture 7 &middot; slide 20</a> <a class="pill" href="decks/agent-evaluation.html#/4">Evaluation note &middot; slide 4</a></p>
    </div>
    <div class="card">
      <h4>Cost</h4>
      <p class="dim">${md(P.cost)}</p>
      <p class="dim mt-s">${md(P.costTerm)}. ${md(P.costNote)}</p>
      <p class="mt-m"><a class="pill" href="decks/lecture-08.html#/2">Lecture 8 &middot; slide 2</a> <a class="pill" href="decks/cost-effective-agents.html#/2">Cost note &middot; slide 2</a></p>
    </div>
  </div>
  <p class="dim2 mt-m" style="font-size:13px">Every saving has a counter-cost, and every benchmark carries a protocol. The two scoreboards are why Assignment 3 is graded on capability, cost and speed at once.</p>`,
      'Evaluation and cost are the two scoreboards the course keeps. The trade-off between them is the point of the harness competition.',
    ),
  );

  /* -- how the index is organised ------------------------------------ */
  const groupLinks = CONCEPT_GROUPS.map((g) => {
    const first = g.concepts[0];
    const deck = first.slides[0];
    const i = deck.lastIndexOf('#');
    return `<li><a class="ck" href="decks/${deck.slice(0, i)}.html#/${deck.slice(i + 1)}">${esc(
      g.title,
    )}</a></li>`;
  }).join('\n        ');
  slides.push(
    conceptSlide(
      'How this index is organised',
      `  <p class="kicker">Reading guide</p>
  <h2 class="h2">Groups follow the digest's lecture order</h2>
  <p class="lede mb-l">Each concept below carries the digest's own wording for the idea and the slides that teach it. Groups run in the order the course teaches them; the reference notes and the course mechanics come last.</p>
  <div class="card mt-l">
    <div class="cgrp"><span class="part">Groups</span><span class="ct">${CONCEPT_GROUPS.length} groups</span></div>
    <ul class="clean mt-s" style="font-size:13px">
        ${groupLinks}
    </ul>
  </div>
  <div class="deck-tools">
    <a class="tcard" href="index.html"><h4>Course index</h4><p>All 14 decks, with the three reading routes.</p></a>
    <a class="tcard" href="search.html"><h4>Search</h4><p>Find a term across every slide and the mirrored course text.</p></a>
  </div>`,
      'The groups are the digest\'s lecture order. The link on each group name jumps into the first deck that teaches that group.',
    ),
  );

  /* -- the concept groups -------------------------------------------- */
  for (const g of CONCEPT_GROUPS) {
    const chunks = chunkConcepts(g.concepts);
    chunks.forEach((chunk, ci) => {
      const more = chunks.length > 1 ? ` (${ci + 1} of ${chunks.length})` : '';
      slides.push(
        conceptSlide(
          `${g.title}${more}`,
          `  <div class="cgrp"><span class="part">${esc(g.part)}</span><span class="ct">${esc(
            g.blurb,
          )}</span></div>
  <h2 class="h2" style="margin-bottom:8px">${esc(g.title)}${esc(more)}</h2>
  <table class="cidx">
    <thead><tr><th style="width:23%">Concept</th><th style="width:55%">What the course digest says</th><th style="width:22%">Where it is taught</th></tr></thead>
    <tbody>
${chunk
  .map(
    (c) =>
      `      <tr><td class="term">${md(c.term)}</td><td class="g">${md(c.gloss)}</td><td>${ck(
        c.slides[0],
      )}${c.slides.length > 1 ? ck(c.slides[1]) : ''}</td></tr>`,
  )
  .join('\n')}
    </tbody>
  </table>`,
          `Concept group: ${g.title}. ${g.blurb}. Each row is a verbatim phrase from the course digest; the links on the right open the slide that teaches it.`,
        'top',
        ),
      );
    });
  }

  /* -- source & navigation ------------------------------------------- */
  slides.push(
    conceptSlide(
      'Source & navigation',
      `  <p class="kicker">Provenance</p>
  <h2 class="h2">Source &amp; navigation</h2>
  <p class="lede">Every concept on this page is a verbatim phrase from the course digest. The build refuses to emit the page if a single phrase is not in the digest.</p>
  <div class="grid g2 mt-l" style="align-items:start">
    <div class="card">
      <h4>Upstream</h4>
      <ul class="clean">
        <li><a href="${esc(SITE_URL)}/index.html">${esc(SITE_URL)}/index.html</a> - course home, schedule, grading</li>
        <li><a href="${esc(SITE_URL)}/slides/1_intro.pdf">${esc(SITE_URL)}/slides/1_intro.pdf</a> - the lecture decks</li>
        <li><a href="${esc(SITE_URL)}/notes/agent-evaluation.html">${esc(SITE_URL)}/notes/agent-evaluation.html</a></li>
        <li><a href="${esc(SITE_URL)}/notes/cost-effective-agents.html">${esc(SITE_URL)}/notes/cost-effective-agents.html</a></li>
        <li><a href="${esc(SITE_URL)}/notes/transformers.html">${esc(SITE_URL)}/notes/transformers.html</a></li>
      </ul>
    </div>
    <div class="card">
      <h4>How to read a row</h4>
      <ul class="clean">
        <li>The left column is the concept, worded the way the digest words it</li>
        <li>The middle column is the digest sentence the concept comes from</li>
        <li>The right column is the slide that teaches it - the link opens that deck at that slide</li>
        <li>Two links mean the same idea is taught in two places</li>
      </ul>
    </div>
  </div>
  <div class="row mt-l" style="gap:10px">
    <a class="pill pill-accent" href="index.html">&larr; Course index</a>
    <a class="pill" href="search.html">Search</a>
  </div>`,
      'Provenance slide. The concept index is generated by build.mjs from a data file whose every string is checked against the digest at build time.',
    ),
  );

  const total = slides.length;
  return `<!DOCTYPE html>
<html lang="en" data-theme="${THEME}" data-theme-base="./assets/themes/">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CS2680 &middot; Concept index</title>
<link rel="stylesheet" href="./assets/fonts.css">
<link rel="stylesheet" href="./assets/base.css">
<link rel="stylesheet" id="theme-link" href="./assets/themes/${THEME}.css">
<link rel="stylesheet" href="./assets/animations/animations.css">
${CONCEPT_CSS}
</head>
<body data-themes="${THEME_LIST.join(',')}" data-theme-base="./assets/themes/">
<div class="deck" data-themes="${THEME_LIST.join(',')}">

  <div class="deck-header">
    <span class="eyebrow">CS2680 &middot; Modern AI Systems: Agents and System Optimizations</span>
    <span class="eyebrow">Harvard SEAS &middot; Fall 2026</span>
  </div>
  <div class="deck-footer">
    <span class="dim2">CS2680 &middot; Concept index &middot; Source: ${esc(SITE_URL)}/</span>
    <span class="slide-number" data-current="1" data-total="${total}"></span>
  </div>

${slides.join('\n\n')}
</div>
<script src="./assets/runtime.js"></script>
</body>
</html>
`;
}

/* ---------------------------------------------------------------- search */

const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  middot: '·',
  mdash: '—',
  ndash: '–',
  rarr: '→',
  larr: '←',
  hellip: '…',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
  times: '×',
  minus: '−',
  ge: '≥',
  le: '≤',
  bull: '•',
  deg: '°',
  copy: '©',
  reg: '®',
  trade: '™',
  euro: '€',
  pound: '£',
  sect: '§',
  para: '¶',
  dagger: '†',
  permil: '‰',
  prime: '′',
  Prime: '″',
  infin: '∞',
  ne: '≠',
  le2: '≤',
};

function decodeEntities(s) {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (m, body) => {
    if (body[0] === '#') {
      const code =
        body[1] === 'x' || body[1] === 'X'
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return Object.prototype.hasOwnProperty.call(ENTITIES, body) ? ENTITIES[body] : m;
  });
}

/** The visible text of one rendered slide (speaker notes excluded). */
function visibleText(chunk) {
  return decodeEntities(
    chunk
      .replace(/<div class="notes">[\s\S]*?<\/div>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

/** Where each mirrored course file is taught, so a hit can link to a deck. */
const NOTE_TARGETS = {
  'notes_agent-evaluation.md': 'agent-evaluation',
  'notes_cost-effective-agents.md': 'cost-effective-agents',
  'notes_transformers.md': 'transformers-llm-foundations',
  'assignments_assignment1.md': 'assignments-and-project',
  'assignments_assignment2.md': 'assignments-and-project',
  'assignments_assignment3.md': 'assignments-and-project',
  'assignments_index.md': 'assignments-and-project',
  'policy.md': 'assignments-and-project',
  'project.md': 'assignments-and-project',
  'discussion.md': 'assignments-and-project',
  'to_release.md': 'assignments-and-project',
  'home.md': null,
  'header.md': null,
};
const COMPUTING_TARGET = 'assignments-and-project';

function buildSearchIndex() {
  const slides = [];
  for (const deck of DECKS) {
    const html = renderDeck(deck);
    const re = /<section class="slide[^"]*" data-title="([^"]*)">([\s\S]*?)<\/section>/g;
    let m;
    let n = 0;
    while ((m = re.exec(html))) {
      n += 1;
      slides.push({
        k: 'slide',
        d: deck.slug,
        dn: DECK_LABELS[deck.slug] || deck.navTitle,
        n,
        t: decodeEntities(m[1]),
        x: visibleText(m[2]),
      });
    }
  }

  const docs = [];
  if (fs.existsSync(NOTES_DIR)) {
    for (const f of fs.readdirSync(NOTES_DIR).sort()) {
      const p = path.join(NOTES_DIR, f);
      if (!fs.statSync(p).isFile()) continue;
      let raw = fs.readFileSync(p, 'utf8');
      raw = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
      const target =
        Object.prototype.hasOwnProperty.call(NOTE_TARGETS, f)
          ? NOTE_TARGETS[f]
          : f.startsWith('computing_')
            ? COMPUTING_TARGET
            : f.startsWith('readings')
              ? 'part-ii-status'
              : 'assignments-and-project';
      const h = target ? `decks/${target}.html` : 'index.html';
      docs.push({
        k: 'note',
        f,
        p: null,
        t: f.replace(/\.md$/, '').replace(/_/g, ' '),
        h,
        x: raw.replace(/\s+/g, ' ').trim(),
      });
    }
  }

  if (fs.existsSync(SLIDES_DIR)) {
    for (const f of fs.readdirSync(SLIDES_DIR).sort()) {
      const p = path.join(SLIDES_DIR, f);
      if (!fs.statSync(p).isFile()) continue;
      const raw = fs.readFileSync(p, 'utf8');
      const m = /^slides_(\d+)_/.exec(f);
      const num = m ? m[1].padStart(2, '0') : '';
      const target =
        f === 'slides_8_assignment3.txt'
          ? 'assignments-and-project'
          : `lecture-${num}`;
      const h = `decks/${target}.html`;
      const parts = raw.split(/^-{5}\s*page\s+(\d+)\s*-{5}\s*$/m);
      // parts[0] is the preamble; then pairs of (page number, text)
      for (let i = 1; i + 1 < parts.length; i += 2) {
        const page = Number(parts[i]);
        const text = parts[i + 1].replace(/\s+/g, ' ').trim();
        if (!text) continue;
        docs.push({
          k: 'slide-text',
          f,
          p: page,
          t: `${f.replace(/\.txt$/, '').replace(/_/g, ' ')} - page ${page}`,
          h,
          x: text,
        });
      }
      if (parts.length === 1 && raw.trim()) {
        docs.push({
          k: 'slide-text',
          f,
          p: null,
          t: f.replace(/\.txt$/, '').replace(/_/g, ' '),
          h,
          x: raw.replace(/\s+/g, ' ').trim(),
        });
      }
    }
  }

  return {
    site: 'CS2680 - Modern AI Systems: Agents and System Optimizations',
    generatedBy: 'courseware/html/build.mjs',
    slides,
    docs,
  };
}

/** JSON that is safe to sit inside a <script> element. */
function embedJson(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

const SEARCH_CSS = `    <style>
    /* search page - deck-local styles, tokens only */
    .srch-slide{justify-content:flex-start}
    .srch-bar{display:flex;gap:14px;align-items:center;margin-bottom:14px}
    .srch-box{flex:1;display:flex;gap:10px;align-items:center;background:var(--surface);border:1px solid var(--border-strong);border-radius:var(--radius);padding:9px 16px;box-shadow:var(--shadow)}
    .srch-box input{flex:1;border:0;outline:0;background:transparent;font:inherit;font-size:19px;color:var(--text-1);min-width:0}
    .srch-box input::placeholder{color:var(--text-3)}
    .srch-filters{display:flex;gap:7px;flex-wrap:wrap}
    .srch-filters button{font:inherit;font-size:12px;padding:5px 12px;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--text-2);cursor:pointer}
    .srch-filters button[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--surface)}
    .srch-count{font-size:13px;color:var(--text-3);white-space:nowrap}
    .srch-list{flex:1;overflow-y:auto;padding:2px 10px 4px 0}
    .srch-list::-webkit-scrollbar{width:10px}
    .srch-list::-webkit-scrollbar-thumb{background:var(--border-strong);border-radius:6px}
    .srh{background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--accent);border-radius:var(--radius);padding:11px 16px;margin-bottom:9px}
    .srh .t{font-size:15px;font-weight:600;line-height:1.3}
    .srh .m{font-size:12px;color:var(--text-3);margin:2px 0 5px}
    .srh .s{font-size:13px;color:var(--text-2);line-height:1.5}
    .srh mark{background:color-mix(in srgb,var(--accent) 18%,transparent);color:var(--text-1);border-radius:3px;padding:0 2px}
    .srh .lk{display:flex;gap:8px;flex-wrap:wrap;margin-top:7px}
    .srh .lk a{font-size:12px;padding:3px 10px;border-radius:999px;background:var(--surface-2);border:1px solid var(--border);color:var(--accent);text-decoration:none}
    .srh .lk a:hover{text-decoration:none;border-color:var(--accent)}
    .srch-hint{font-size:13px;color:var(--text-3);line-height:1.6}
    .srch-hint b{color:var(--text-2)}
    .srch-hint .ex{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 14px}
    .srch-hint .ex button{font:inherit;font-size:13px;padding:5px 13px;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--accent);cursor:pointer}
    .srch-hint .ex button:hover{border-color:var(--accent)}
    </style>`;

const SEARCH_JS = `
    /* Search over the static index.  No server, no build step at view time. */
    (function () {
      'use strict';
      var raw = '';
      var el = document.getElementById('cs2680-search-index');
      if (el) raw = el.textContent || '';
      var IDX = null;
      try { IDX = raw ? JSON.parse(raw) : null; } catch (e) { IDX = null; }

      function boot(data) {
        IDX = data;
        var SLIDES = IDX.slides || [];
        var DOCS = IDX.docs || [];
        var DECK_COUNT = ${DECKS.length};
        var EXAMPLES = ['prefix caching', 'SKYLINE', 'CLAUDE.md', 'pass^k', 'Pareto', 'KV-cache', 'Compaction', 'ReAct', 'Speculative actions', 'MCP gateway'];
        var q = document.getElementById('q');
        var list = document.getElementById('results');
        var count = document.getElementById('count');
        var filters = Array.prototype.slice.call(document.querySelectorAll('.srch-filters button'));
        var mode = 'all';

        /* token -> slides that contain it, for cross-referencing a course-text
           hit back to the slide that teaches the same words. */
        var STOP = { that: 1, this: 1, with: 1, from: 1, have: 1, they: 1, their: 1, there: 1, which: 1, where: 1, what: 1, when: 1, then: 1, than: 1, also: 1, into: 1, over: 1, only: 1, such: 1, some: 1, more: 1, most: 1, will: 1, does: 1, both: 1, each: 1, were: 1, been: 1, about: 1, after: 1, before: 1, under: 1, between: 1, through: 1, because: 1, while: 1, every: 1, other: 1, these: 1, those: 1, would: 1, could: 1, should: 1, using: 1, used: 1, makes: 1, make: 1, made: 1, need: 1, needs: 1, like: 1, well: 1, back: 1, even: 1, still: 1, must: 1, many: 1, same: 1, next: 1, long: 1, one: 1, two: 1, per: 1, its: 1, are: 1, was: 1, has: 1, had: 1, not: 1, but: 1, for: 1, and: 1, the: 1, you: 1, all: 1, can: 1, how: 1, why: 1, who: 1, out: 1, own: 1, per: 1, any: 1, its: 1, our: 1, one: 1 };
        var TOKENS = {};
        function toks(text) {
          return text.toLowerCase().match(/[a-z0-9][a-z0-9_+.#-]*/g) || [];
        }
        function key(t) {
          return t.length >= 4 && !STOP[t] ? t : null;
        }
        SLIDES.forEach(function (s, i) {
          s._lc = s.x.toLowerCase();
          s._tk = toks(s.x);
          s._tk.forEach(function (t) {
            var k = key(t);
            if (!k) return;
            (TOKENS[k] || (TOKENS[k] = [])).push(i);
          });
        });
        DOCS.forEach(function (d) {
          d._lc = d.x.toLowerCase();
        });

        function esc(s) {
          return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
        }

        function snippet(text, needle, len) {
          var i = text.toLowerCase().indexOf(needle);
          if (i < 0) i = 0;
          var start = Math.max(0, i - Math.floor(len / 3));
          var out = text.slice(start, start + len);
          if (start > 0) out = '… ' + out;
          if (start + len < text.length) out = out + ' …';
          return out;
        }

        function mark(text, needle) {
          var lc = text.toLowerCase();
          var n = needle.toLowerCase();
          var out = '';
          var i = 0;
          while (i < text.length) {
            var k = lc.indexOf(n, i);
            if (k < 0) { out += esc(text.slice(i)); break; }
            out += esc(text.slice(i, k));
            out += '<mark>' + esc(text.substr(k, n.length)) + '</mark>';
            i = k + n.length;
          }
          return out;
        }

        /* Which slide teaches the same words as this course-text hit? */
        function crossRef(text) {
          var tk = toks(text.slice(0, 400));
          var votes = {};
          var seen = {};
          tk.forEach(function (t) {
            var k = key(t);
            if (!k || seen[k]) return;
            seen[k] = 1;
            var list = TOKENS[k];
            if (!list) return;
            list.forEach(function (i) { votes[i] = (votes[i] || 0) + 1; });
          });
          var best = -1;
          var bestV = 0;
          for (var i in votes) {
            if (votes[i] > bestV) { bestV = votes[i]; best = Number(i); }
          }
          if (best < 0 || bestV < 2) return null;
          return { slide: SLIDES[best], votes: bestV };
        }

        function hit(text, terms) {
          var lc = text.toLowerCase();
          var i = lc.indexOf(terms[0]);
          if (i >= 0) return { pos: i, phrase: terms[0] };
          for (var k = 0; k < terms.length; k++) {
            var j = lc.indexOf(terms[k]);
            if (j >= 0) return { pos: j, phrase: terms[k] };
          }
          return null;
        }

        function run() {
          var raw = q.value.trim().toLowerCase();
          list.innerHTML = '';
          if (!raw) {
            count.textContent = SLIDES.length + ' slides · ' + DOCS.length + ' course-text pages indexed';
            list.innerHTML =
              '<div class="card" style="margin-bottom:14px"><h4>What is indexed</h4>' +
              '<ul class="clean">' +
              '<li>The visible text of all ' + SLIDES.length + ' slides in the ' + DECK_COUNT + ' decks</li>' +
              '<li>The mirrored course text: the notes and the slide transcripts</li>' +
              '<li>Speaker notes are excluded - only what a reader sees is indexed</li>' +
              '</ul></div>' +
              '<div class="srch-hint"><p><b>Try one of these:</b></p><p class="ex">' +
              EXAMPLES.map(function (e) { return '<button type="button" data-q="' + esc(e) + '">' + esc(e) + '</button>'; }).join('') +
              '</p><p>Every result carries the deck name, the slide number and a link to that slide.</p></div>';
            return;
          }
          var terms = raw.split(/\\s+/).filter(function (t) { return t.length > 1; });
          if (!terms.length) return;
          var results = [];
          var i;

          if (mode === 'all' || mode === 'slides') {
            for (i = 0; i < SLIDES.length; i++) {
              var s = SLIDES[i];
              var h = hit(s._lc, terms);
              if (!h) continue;
              var all = terms.every(function (t) { return s._lc.indexOf(t) >= 0; });
              results.push({
                kind: 'slide',
                score: (h.pos === 0 ? 1000 : 0) + (all ? 500 : 0) + Math.min(400, h.pos) * -1,
                title: s.t,
                meta: s.dn + ' · slide ' + s.n,
                text: snippet(s.x, h.phrase, 260),
                phrase: h.phrase,
                href: 'decks/' + s.d + '.html#/' + s.n,
                link: 'Open slide ' + s.n,
              });
            }
          }

          if (mode === 'all' || mode === 'text') {
            for (i = 0; i < DOCS.length; i++) {
              var d = DOCS[i];
              var hd = hit(d._lc, terms);
              if (!hd) continue;
              var allD = terms.every(function (t) { return d._lc.indexOf(t) >= 0; });
              results.push({
                kind: 'text',
                score: (hd.pos === 0 ? 1000 : 0) + (allD ? 500 : 0) + Math.min(400, hd.pos) * -1,
                title: d.t,
                meta: 'Course text · ' + d.f + (d.p ? ' · page ' + d.p : ''),
                text: snippet(d.x, hd.phrase, 260),
                phrase: hd.phrase,
                href: d.h,
                link: 'Open the deck',
                raw: d.x,
              });
            }
          }

          results.sort(function (a, b) { return b.score - a.score; });
          var shown = results.slice(0, 120);
          count.textContent =
            results.length + ' hit' + (results.length === 1 ? '' : 's') +
            ' · showing ' + shown.length;

          if (!shown.length) {
            list.innerHTML = '<div class="srch-hint"><p>No match for <b>' + esc(q.value) + '</b>.</p></div>';
            return;
          }

          var frag = document.createDocumentFragment();
          shown.forEach(function (r) {
            var d = document.createElement('div');
            d.className = 'srh';
            var extra = '';
            if (r.kind === 'text') {
              var ref = crossRef(r.raw || r.text);
              if (ref) {
                extra =
                  '<a href="decks/' + ref.slide.d + '.html#/' + ref.slide.n + '">Related slide: ' +
                  esc(ref.slide.dn) + ' · slide ' + ref.slide.n + '</a>';
              }
            }
            d.innerHTML =
              '<div class="t">' + esc(r.title) + '</div>' +
              '<div class="m">' + esc(r.meta) + '</div>' +
              '<div class="s">' + mark(r.text, r.phrase) + '</div>' +
              '<div class="lk"><a href="' + esc(r.href) + '">' + esc(r.link) + '</a>' + extra + '</div>';
            frag.appendChild(d);
          });
          list.appendChild(frag);
        }

        var timer = null;
        list.addEventListener('click', function (ev) {
          var b = ev.target && ev.target.closest ? ev.target.closest('button[data-q]') : null;
          if (!b) return;
          q.value = b.getAttribute('data-q');
          run();
        });
        q.addEventListener('input', function () {
          clearTimeout(timer);
          timer = setTimeout(run, 90);
        });
        filters.forEach(function (b) {
          b.addEventListener('click', function () {
            filters.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
            mode = b.getAttribute('data-mode');
            run();
          });
        });

        /* ?q=... opens the page already searching, so a search can be shared
           and a headless browser can be pointed straight at a query. */
        var initial = '';
        try {
          initial = new URLSearchParams(location.search).get('q') || '';
        } catch (e) {
          initial = '';
        }
        if (initial) q.value = initial;
        run();
      }

      /* The deck runtime binds Space and the arrow keys on the document, which
         would swallow them while the reader is typing a query.  This capture
         -phase guard runs first and stops them reaching the runtime. */
      document.addEventListener(
        'keydown',
        function (e) {
          var t = e.target;
          if (
            t &&
            (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
          ) {
            e.stopImmediatePropagation();
          }
        },
        true,
      );

      if (IDX) {
        boot(IDX);
      } else {
        /* No inline copy: fall back to the static JSON next to this page. */
        fetch('search-index.json')
          .then(function (r) { return r.json(); })
          .then(boot)
          .catch(function () {
            var list = document.getElementById('results');
            if (list) {
              list.innerHTML =
                '<div class="srch-hint"><p>The search index could not be loaded. Run <b>node build.mjs</b> in <b>courseware/html</b> to regenerate <b>search-index.json</b>.</p></div>';
            }
          });
      }
    })();
`;

function renderSearchPage(index) {
  const total = index.slides.length;
  const docCount = index.docs.length;
  const json = embedJson(index);

  return `<!DOCTYPE html>
<html lang="en" data-theme="${THEME}" data-theme-base="./assets/themes/">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CS2680 &middot; Search</title>
<link rel="stylesheet" href="./assets/fonts.css">
<link rel="stylesheet" href="./assets/base.css">
<link rel="stylesheet" id="theme-link" href="./assets/themes/${THEME}.css">
<link rel="stylesheet" href="./assets/animations/animations.css">
${SEARCH_CSS}
</head>
<body data-themes="${THEME_LIST.join(',')}" data-theme-base="./assets/themes/">
<div class="deck" data-themes="${THEME_LIST.join(',')}">

  <div class="deck-header">
    <span class="eyebrow">CS2680 &middot; Modern AI Systems: Agents and System Optimizations</span>
    <span class="eyebrow">Harvard SEAS &middot; Fall 2026</span>
  </div>
  <div class="deck-footer">
    <span class="dim2">CS2680 &middot; Search &middot; Source: ${esc(SITE_URL)}/</span>
    <span class="slide-number" data-current="1" data-total="2"></span>
  </div>

  <section class="slide srch-slide" data-title="Search">
    <p class="kicker">Search the whole site</p>
    <h2 class="h2" style="font-size:32px;margin-bottom:12px">Search ${total} slides and ${docCount} pages of course text</h2>
    <div class="srch-bar">
      <div class="srch-box">
        <input id="q" type="search" autocomplete="off" spellcheck="false" placeholder="prefix caching, SKYLINE, CLAUDE.md, pass^k …" aria-label="Search the slides and the course text">
      </div>
      <div class="srch-filters">
        <button type="button" data-mode="all" aria-pressed="true">Everything</button>
        <button type="button" data-mode="slides" aria-pressed="false">Slides</button>
        <button type="button" data-mode="text" aria-pressed="false">Course text</button>
      </div>
      <div class="srch-count" id="count"></div>
    </div>
    <div class="srch-list" id="results"></div>
    <div class="notes">The search page runs entirely in the browser. It reads a static JSON index built by build.mjs from the rendered slides and the mirrored course notes; there is no server and no build step when you open it.</div>
  </section>

  <section class="slide" data-title="Source &amp; navigation">
    <p class="kicker">Provenance</p>
    <h2 class="h2">Source &amp; navigation</h2>
    <div class="grid g2 mt-l" style="align-items:start">
      <div class="card">
        <h4>What is indexed</h4>
        <ul class="clean">
          <li>The visible text of all ${total} slides in the ${DECKS.length} decks, taken from the rendered HTML</li>
          <li>The mirrored course text: the notes under <code class="mono">course/notes</code> and the slide transcripts under <code class="mono">course/slides</code></li>
          <li>Speaker notes are excluded - only what a reader sees is indexed</li>
        </ul>
      </div>
      <div class="card">
        <h4>How a result links</h4>
        <ul class="clean">
          <li>A slide hit links to <code class="mono">decks/&lt;deck&gt;.html#/N</code> - the deck, at that slide</li>
          <li>A course-text hit links to the deck built from that file, and to the slide that carries the same words</li>
          <li>The index is a static file: <code class="mono">search-index.json</code>, next to this page</li>
        </ul>
      </div>
    </div>
    <div class="row mt-l" style="gap:10px">
      <a class="pill pill-accent" href="index.html">&larr; Course index</a>
      <a class="pill" href="concepts.html">Concept index</a>
      <a class="pill" href="search-index.json">search-index.json</a>
    </div>
    <div class="notes">Provenance. The search index is generated by build.mjs and committed alongside the page, so the page keeps working with no server and no build step at view time.</div>
  </section>
</div>
<script id="cs2680-search-index" type="application/json">${json}</script>
<script src="./assets/runtime.js"></script>
<script>${SEARCH_JS}</script>
</body>
</html>
`;
}

/* --------------------------------------------------- concept validation */

/**
 * Every concept term and gloss on the concept index, and every factual string
 * in the "course in one page" summary, must be a verbatim substring of the
 * course digest.  The build refuses to run otherwise, so no concept and no
 * number on the new pages can be invented.
 */
function validateConcepts() {
  const norm = (s) => String(s).replace(/\s+/g, ' ').trim().toLowerCase();
  const corpus = norm(digestCorpus());
  const problems = [];

  const check = (label, s) => {
    if (s == null) return;
    if (!corpus.includes(norm(s))) problems.push(`${label}: ${String(s).slice(0, 120)}`);
  };

  for (const g of CONCEPT_GROUPS) {
    for (const c of g.concepts) {
      check(`${g.id} term`, c.term);
      check(`${g.id} gloss`, c.gloss);
    }
  }

  const P = COURSE_ON_ONE_PAGE;
  for (const k of [
    'thesis',
    'thesisShort',
    'partIDates',
    'assignmentsNote',
    'evaluation',
    'evaluationNote',
    'costTerm',
    'cost',
    'costNote',
  ]) {
    check(`onepage.${k}`, P[k]);
  }
  for (const part of P.parts) {
    check('onepage.part.h', part.h);
    check('onepage.part.dates', part.dates);
    for (const t of part.topics) check('onepage.part.topic', t);
  }
  for (const row of P.assignments) for (const cell of row) check('onepage.assignments', cell);

  if (problems.length) {
    throw new Error(
      `concept validation failed - ${problems.length} string(s) are not in the course digest:\n  ` +
        problems.join('\n  '),
    );
  }
}

/* ------------------------------------------------------------------ main */


function writeIfChanged(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) return false;
  fs.writeFileSync(file, content, 'utf8');
  return true;
}

function main() {
  const decksDir = path.join(HERE, 'decks');
  fs.mkdirSync(decksDir, { recursive: true });

  validateConcepts();

  let written = 0;
  for (const deck of DECKS) {
    const html = renderDeck(deck);
    if (writeIfChanged(path.join(decksDir, `${deck.slug}.html`), html)) written += 1;
  }
  if (writeIfChanged(path.join(HERE, 'index.html'), renderIndex())) written += 1;
  if (writeIfChanged(path.join(HERE, 'concepts.html'), renderConcepts())) written += 1;

  const searchIndex = buildSearchIndex();
  if (writeIfChanged(path.join(HERE, 'search-index.json'), JSON.stringify(searchIndex, null, 0)))
    written += 1;
  if (writeIfChanged(path.join(HERE, 'search.html'), renderSearchPage(searchIndex))) written += 1;

  const totalSlides = DECKS.reduce((n, d) => n + d.slides.length + 1, 0);
  console.log(
    `built ${DECKS.length} decks + index.html + concepts.html + search.html (${written} file(s) changed, ${totalSlides} slides incl. provenance slides)`,
  );
  for (const d of DECKS) {
    console.log(`  decks/${d.slug}.html  ${d.slides.length + 1} slides  <- ${d.source}`);
  }
  console.log(
    `  concepts.html  ${CONCEPT_GROUPS.reduce((n, g) => n + g.concepts.length, 0)} concepts in ${CONCEPT_GROUPS.length} groups`,
  );
  console.log(
    `  search.html  ${searchIndex.slides.length} slides + ${searchIndex.docs.length} course-text pages indexed`,
  );

  if (process.argv.includes('--check')) {
    const report = checkNumbers();
    console.log('\n' + report.text);
    if (report.failures) process.exitCode = 1;
  }
}

/* ------------------------------------------------- digest number checking */

const ALLOW = new Set([
  // structural numbers that are not course facts
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17',
  '18', '19', '20', '01', '02', '03', '04', '05', '06', '07', '08', '09',
  // structural counts of this site itself (slide total across the 14 decks)
  '212',
]);

function digestCorpus() {
  const parts = ['part1.md', 'part2.md', 'part3.md'].map((f) =>
    fs.readFileSync(path.join(DIGEST_DIR, f), 'utf8'),
  );
  return parts.join('\n');
}

function checkNumbers() {
  const corpus = digestCorpus();
  const normalised = corpus.replace(/,/g, '');
  const failures = [];
  const seen = new Map();

  // Structural counts of this site itself, not course facts: the number of
  // concepts on the concept index and the number of course-text pages in the
  // search index.
  const structural = new Set([
    String(CONCEPT_GROUPS.reduce((n, g) => n + g.concepts.length, 0)),
    String(buildSearchIndex().docs.length),
  ]);

  const pages = [
    ...DECKS.map((d) => ({
      name: `decks/${d.slug}.html`,
      html: renderDeck(d),
    })),
    { name: 'index.html', html: renderIndex() },
    { name: 'concepts.html', html: renderConcepts() },
    { name: 'search.html', html: renderSearchPage(buildSearchIndex()) },
  ];

  for (const page of pages) {
    const text = page.html
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/g, ' ');
    for (const m of text.matchAll(/\d[\d,]*(?:\.\d+)?/g)) {
      const raw = m[0];
      const norm = raw.replace(/,/g, '');
      if (ALLOW.has(norm)) continue;
      if (structural.has(norm)) continue;
      if (!normalised.includes(norm)) {
        if (!seen.has(norm)) seen.set(norm, new Set());
        seen.get(norm).add(page.name);
      }
    }
  }

  const lines = [];
  if (seen.size === 0) {
    lines.push('number check: every number on every page appears in the course digest.');
    return { text: lines.join('\n'), failures: 0 };
  }
  for (const [num, pagesSet] of [...seen.entries()].sort()) {
    lines.push(`  ${num}  <- ${[...pagesSet].join(', ')}`);
  }
  lines.unshift(
    `number check: ${seen.size} number(s) not found verbatim in the digest (add to ALLOW with a reason, or fix the content):`,
  );
  return { text: lines.join('\n'), failures: seen.size };
}

main();
