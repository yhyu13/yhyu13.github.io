#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Build the public landing page for the StudentSim content pack.

  site/index.html            the public page (self-contained, no CDN)
  site/assets/site.css       styles
  site/downloads/…           PPTX / 精读 MD / 转写 / 口播 deck / 可交互页
  site/media/…               slide preview images

Numbers come from content.py where possible so the page never drifts from the deck.
"""
import io
import os
import shutil
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE)
sys.path.insert(0, ROOT)

import content as C  # noqa: E402

SITE = os.path.join(BASE, 'site')
DL = os.path.join(SITE, 'downloads')
MEDIA = os.path.join(SITE, 'media')
ASSETS = os.path.join(SITE, 'assets')

META = C.META


def copytree(src, dst):
    for root, dirs, files in os.walk(src):
        rel = os.path.relpath(root, src)
        target = os.path.join(dst, rel) if rel != '.' else dst
        os.makedirs(target, exist_ok=True)
        for f in files:
            shutil.copy2(os.path.join(root, f), os.path.join(target, f))


# ---------------------------------------------------------------- ROI ladder
ROI_STEPS = [
    {'n': '0', 't': '先用 F / R 给现有系统体检',
     'do': '拿一批真实留出记录，跑一遍「像不像学生」和「听不听话」两个指标',
     'cost': '极低', 'costk': 'good', 'sure': '高', 'surek': 'good',
     'when': '永远先做这一步 —— 一次投入，之后每次迭代都能用'},
    {'n': '1', 't': '用你自己的日志造 S 集 / T 集',
     'do': 'S 集 = 单轮（题 + 学生的作答）；T 集 = 多轮（题 → 错答 → 指导 → 改对）',
     'cost': '低', 'costk': 'good', 'sure': '高', 'surek': 'good',
     'when': '日志里已经有「纠正前后」记录的话，这一步数据采集成本接近 0'},
    {'n': '2', 't': '训 per-student LoRA 模拟器',
     'do': 'pooled 训练学领域共性 → 每个学生一个 adapter（4B 起步，开源可本地跑）',
     'cost': '中', 'costk': 'warn', 'sure': '中', 'surek': 'warn',
     'when': '迭代次数多、单个学生的数据又特别稀疏时'},
    {'n': '3', 't': '模拟器当 reward 做 RL',
     'do': 'GRPO 训 tutor policy，reward = 学生接受指导前后的表现差',
     'cost': '高', 'costk': 'bad', 'sure': '低', 'surek': 'bad',
     'when': '论文自陈是 proof of concept —— 最后再考虑'},
]

ROI_WHY = [
    ('评估端的收益是线性的',
     'F / R 两个指标一次建好，之后每次改模型都能立刻知道「是更像学生了，还是更能听劝了」。'
     '这是永久复用的资产。'),
    ('训练端的收益是二阶的，而且会被放大',
     '模拟器一旦错了，RL 会把这个错误当成学生的真实反应去优化 tutor —— '
     '论文里用 GPT-5.4 当 reward，accuracy 只有 71.6%，'
     '比完全不训练 RL 的 75.7% 还低。'),
    ('所以顺序必须是：先能测 → 再能模拟 → 最后能训练',
     '跳过前面直接做 RL，等于在没有量尺的情况下练技术：'
     '你的 tutor 变好了，你也不知道是它真的变好，还是你的模拟器骗了你。'),
]

ROI_STACK = [
    ('你已经有 BKT / DKT 知识追踪',
     '那你已经站在 <b>F 这一维</b>上了 —— 知识追踪本质上就是 state-tracking，'
     '也就是论文里的 Maia2 那一类：<b>高保真、接不住干预</b>。'),
    ('StudentSim 补的是 R 这一维',
     '不是「 tutor 说的话对不对」，而是 <b>学生到底会不会照做</b>。'
     '这是两个不同的缺口，混起来做会互相掩盖。'),
    ('你的掌握度仪表盘就是天然的落点',
     '把它从「掌握度变化」扩成两个数：'
     '<b>像不像</b>（错题画像 / 掌握概率比对）+ <b>听不听话</b>（纠正前后掌握度比对）。'
     '这一步不需要训练任何模型。'),
    ('你的错题本直接就是 S 集',
     '单轮记录 = 题 + 学生的作答。你只是把它从「给人看」变成了「给模型训」。'),
    ('你的纠正记录直接就是 T 集',
     '题 → 错答 → 指导 → 改对。这四元组多数 tutor 日志里本来就存在，'
     '只是没被标成训练数据。<b>这是 ROI 最陡的一步。</b>'),
]

ROI_NOT = [
    ('迭代次数少的时候，不要做',
     '讲者原话：只做一个小的干预的话，学生模拟器可能并没有那么强的必要 —— '
     '直接上真实学生更划算。'),
    ('反馈不稀疏的场景，没有 ROI',
     '日志量大、反馈快、用户多的产品，拿真人反馈比造模拟器便宜得多。'),
    ('没有「个体差异」的领域，R 这一维没有信号',
     '所有人同一道题、同一个答案，就不存在「这一位学生」的模拟对象。'),
]


def build_html():
    facts = ''.join(
        '<div class="num-card"><div class="v">%s</div><div class="l">%s</div>'
        '<div class="n">%s</div></div>' % (f['value'], f['label'], f['note'])
        for f in C.FACTS)

    concls = ''.join(
        '<li><span class="cn">%02d</span><div><b>%s</b><p>%s</p><p class="l2">%s</p></div></li>'
        % (i, c['h'], c['l1'], c['l2']) for i, c in enumerate(C.CONCLUSIONS, 1))

    roi_rows = ''.join(
        '<tr><td class="step"><span class="sn">%s</span></td>'
        '<td class="rt"><b>%s</b><span>%s</span></td>'
        '<td class="pill %s">%s</td><td class="pill %s">%s</td><td class="when">%s</td></tr>'
        % (s['n'], s['t'], s['do'], s['costk'], s['cost'], s['surek'], s['sure'], s['when'])
        for s in ROI_STEPS)

    roi_why = ''.join(
        '<div class="why"><b>%s</b><p>%s</p></div>' % (t, d) for t, d in ROI_WHY)

    roi_stack = ''.join(
        '<li><b>%s</b><p>%s</p></li>' % (t, d) for t, d in ROI_STACK)

    roi_not = ''.join(
        '<li><b>%s</b><p>%s</p></li>' % (t, d) for t, d in ROI_NOT)

    quad = (
        '<div class="quad">'
        '<div class="q t-amber"><span class="ax">高 R · 低 F</span><b>prompt LLM</b>'
        '<span class="d">接得住指导，但演的不是那个人 —— 信号嘈杂</span></div>'
        '<div class="q t-teal"><span class="ax">高 F · 高 R</span><b>StudentSim</b>'
        '<span class="d">两个都要高 —— 这就是目标</span></div>'
        '<div class="q t-muted"><span class="ax">低 F · 低 R</span><b>通用 LLM（未训练）</b>'
        '<span class="d">两个维度都不行</span></div>'
        '<div class="q t-amber"><span class="ax">高 F · 低 R</span><b>state-tracking</b>'
        '<span class="d">后验记录很准，但接不住干预</span></div>'
        '</div>'
    )

    tpl = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>StudentSim：让 AI 教师在真实学生研究前获得可度量反馈</title>
<meta name="description" content="UIUC × Microsoft Research 论文 StudentSim（arXiv:2609.01591）的精读、可交互页、口播 deck 与 PPTX。含全部关键数字、F×R 双维度框架，以及落地 ROI 的四步路径。">
<link rel="stylesheet" href="assets/site.css">
</head>
<body>

<header class="hero">
  <div class="wrap">
    <p class="eyebrow">UIUC × Microsoft Research　·　arXiv:2609.01591　·　NICE 学术 第 209 期</p>

    <h1>AI 教师好不好，<br>不看它讲得多漂亮，<br><span class="hl">看学生收到之后变了没有。</span></h1>

    <p class="sub">但这份反馈要等真学生 —— 短则几个月，长则几年。<br>
       StudentSim 把「学生」换成了<strong>按每个学生单独训练的 LLM 模拟器</strong>：
       先在虚拟学生身上把 AI 教师练到会教，再用真人做最终验收。</p>

    <div class="hero-nums">
      <div><b>0.51 / 0.91</b><span>棋类 F / R（Maia2 0.45/0.27，GPT-5.4 0.23/0.72）</span></div>
      <div><b>90.5%</b><span>专家盲评 Accuracy（GPT-5.4 当 reward 只有 71.6%）</span></div>
      <div><b>4B</b><span>基座模型规模 · 却是三个领域全面第一</span></div>
    </div>

    <div class="cta">
      <a class="btn" href="downloads/StudentSim-AI教师反馈.pptx">下载 PPTX（18 页 · 含逐页备注）</a>
      <a class="btn ghost" href="deck/index.html">在线看口播 deck（按 S 演讲者视图）</a>
      <a class="btn ghost" href="downloads/explainer.html">可交互精读页</a>
      <a class="btn ghost" href="downloads/00-核心结论.md">精读 Markdown</a>
    </div>
  </div>
</header>

<main class="wrap">

<section>
  <p class="sec-num">01</p>
  <h2>一句话讲清</h2>
  <p class="lead">教育是一个环：判断一条指导的好坏，不看它本身写得漂不漂亮，而看它落到学生身上之后，学生产生了什么反应。
    而这一层的反馈，是整个研发流程的<b>瓶颈</b>。</p>
  <div class="three">
    <div><b>瓶颈在时间</b><p>你可能只改了一个很小的技术细节，但要拿到对应的学生信号，还要再花几个月甚至几年。</p></div>
    <div><b>出路是代理信号</b><p>迭代期用 AI 模拟器替代真人当 proxy 提供反馈，把反馈拉到机器的时间尺度上。</p></div>
    <div><b>红线：不能替代真人</b><p>模拟器只服务于早期迭代。产品落地前，仍然必须在真实学生身上测一遍。</p></div>
  </div>
</section>

<section>
  <p class="sec-num">02</p>
  <h2>关键数字</h2>
  <p class="lead">全部出自 arXiv:2609.01591 的摘要与正文 Table 2 / 3 / 4，不是二手转述。</p>
  <div class="nums">@@facts@@</div>
</section>

<section>
  <p class="sec-num">03</p>
  <h2>全文的枢轴：F × R</h2>
  <p class="lead">这篇工作第一个贡献不是模型，是<b>把问题定义清楚</b>。旧方法各占一角，右上角才是目标。</p>
  <div class="quad-wrap">@@quad@@</div>
  <div class="two">
    <div><b>F · Behavioral Fidelity　行为保真</b>
      <p>模拟器在起始状态下的作答，是否匹配这一位学生真实的强项与弱项。<br>
         棋类 = top-1 走子准确率；L2 写作 = 错误画像匹配；数学 = 选中的选项是否一致。</p></div>
    <div><b>R · Guidance Responsiveness　指导响应</b>
      <p>学生读完老师的指导之后，能不能把认知状态往前推一步。<br>
         测的是多轮：题 → 错答 → 指导 → 改对。</p></div>
  </div>
  <p class="note-line">两条旧路各占一角：<b>Maia2</b> 像但不听（没有自然语言输入通路，R 其实是零指导下限）；
     <b>prompt LLM</b> 听但不像（太有能力，演不出认知落差，讲者叫它「能力悖论」）。</p>
</section>

<section>
  <p class="sec-num">04</p>
  <h2>方法：两阶段训练</h2>
  <p class="lead">每个学生的数据稀疏到不可能直接训 —— 二语写作数据集采了整整一年，人均 3 篇、超 70% 的人不超过 5 篇。</p>
  <div class="flow">
    <div><span class="n">1</span><b>Stage 1 · pooled training</b>
      <p>把所有学生的记录汇总，训一个领域级 base adapter（Qwen3-4B + LoRA）。单轮与多轮记录按 0.2 比例混合采样：单轮训 F，多轮训 R。</p></div>
    <div><span class="n">2</span><b>Stage 2 · per-student LoRA</b>
      <p>在这个已经学好的底座上，用这一位学生自己的记录继续训练，得到专属 adapter。不是从零开始训。</p></div>
    <div><span class="n">3</span><b>StudentSimEval</b>
      <p>60 名学生、3 个领域（chess 30 / L2 写作 15 / math 15）。所有方法在同记录 fit、同留出记录评。</p></div>
    <div><span class="n">4</span><b>模拟器当 reward</b>
      <p>GRPO 训 tutor policy，reward = 学生接受指导前后的表现差。personalization 与 perception 作为乘性门。</p></div>
  </div>
</section>

<section>
  <p class="sec-num">05</p>
  <h2>结果，以及一个反直觉的发现</h2>
  <p class="lead">三个领域、两个指标，StudentSim 全面超过 GPT-5.4 —— 而基座只有 4B。</p>
  <div class="tables">
    <div class="tbl-wrap">
      <h3>棋类：F 与 R 分开看，结论完全相反</h3>
      <table>
        <thead><tr><th>方法</th><th>Behavior Fidelity F ↑</th><th>Guidance Responsiveness R ↑</th></tr></thead>
        <tbody>
          <tr class="hl"><td>StudentSim（Qwen3-4B + per-player LoRA）</td><td>0.51</td><td>0.91</td></tr>
          <tr><td>GPT-5.4（in-context 提示）</td><td>0.23</td><td>0.72</td></tr>
          <tr><td>Maia2（state-tracking，无语言输入通路）</td><td>0.45</td><td>0.27</td></tr>
        </tbody>
      </table>
    </div>
    <div class="tbl-wrap">
      <h3>人类专家盲评：8 位有段位的棋手，74 条标注</h3>
      <table>
        <thead><tr><th>条件</th><th>Accuracy (%) ↑</th><th>Guidance ↑</th><th>Personalization ↑</th></tr></thead>
        <tbody>
          <tr class="hl"><td>StudentSim reward</td><td>90.5</td><td>3.31</td><td>3.93</td></tr>
          <tr><td>No RL</td><td>75.7</td><td>2.99</td><td>2.80</td></tr>
          <tr><td>GPT-5.4 reward</td><td>71.6</td><td>3.08</td><td>2.42</td></tr>
        </tbody>
      </table>
      <p class="cap">三个条件共享同一个 tutor policy、同一个 SFT 起点、同一套 GRPO 设置 —— 唯一变量是 reward。</p>
    </div>
  </div>
  <div class="callout">
    <span class="tag">反直觉</span>
    <b>用 GPT-5.4 当 reward，教出来的老师反而更差。</b>
    <p>accuracy 只有 71.6%，比完全不训练 RL 的 75.7% 还低 —— 因为它不懂「过往记录 → 应有表现」这一步 mapping，
       生成的步骤是乱的，<b>噪声信号没法指出下一步该往哪走</b>。<br>
       这条结果反过来印证了「能力悖论」：<b>信号质量，比信号强度重要得多。</b></p>
  </div>
</section>

<section class="roi">
  <p class="sec-num">06</p>
  <h2>落地 ROI：从哪边入手？</h2>
  <p class="lead">答案很明确：<b>从「评估端」切入，不要从「训练端」切入。</b>
     下面这一节是本次整理的落地推论，<b>不是论文结论</b>；论文只提供了 F / R 两个尺子和「需要多迭代才划算」这个前提。</p>

  <div class="roi-ladder">
    <h3>四个台阶，按顺序上</h3>
    <table class="roi-tbl">
      <thead><tr><th></th><th>要做什么</th><th>一次性成本</th><th>收益确定性</th><th>什么时候值得</th></tr></thead>
      <tbody>@@roi_rows@@</tbody>
    </table>
  </div>

  <div class="why-grid">@@roi_why@@</div>

  <div class="roi-stack">
    <h3>如果你已经有 AI tutor 的技术栈，从这三处切进去</h3>
    <ul>@@roi_stack@@</ul>
  </div>

  <div class="roi-not">
    <h3>三种情况，不要做</h3>
    <ul>@@roi_not@@</ul>
  </div>

  <div class="formula">
    <b>收益公式</b>
    <p>ROI ≈ <span class="f">每轮迭代省下的等待时间 × 剩余迭代次数</span> − <span class="f">建 S/T 集 + 训模拟器的一次性成本</span></p>
    <p class="cap">临界点就是讲者那句话：「<b>当我们需要多能迭代的时候</b>，可能才会需要学生模拟器的介入。」</p>
  </div>
</section>

<section>
  <p class="sec-num">07</p>
  <h2>八条结论</h2>
  <p class="lead">每条都能回查到视频的哪一段、论文的哪一张表。</p>
  <ol class="concl">@@concls@@</ol>
</section>

<section>
  <p class="sec-num">08</p>
  <h2>四个还没解决的问题</h2>
  <p class="lead">这四条比结论更值得记住 —— 它们决定了这个方法能不能离开实验室。</p>
  <div class="opens">
    <div><b>只有 one-guided step</b><p>遗忘、顿悟这类长程行为需要长时间追踪 —— 数据、隐私、发布都难。</p></div>
    <div><b>隐私</b><p>拿一个学生的数据去训他自己的模拟器，学生没授权怎么办。
       讲者原话：<b>privacy 是技术面前不可翻越的高墙</b>。</p></div>
    <div><b>代表性（validity）</b><p>模拟出来的学生群体和真实分布对不上，reviewer 会直接打回。</p></div>
    <div><b>开销</b><p>只做小改动的话，直接上真实学生可能更划算；需要大量迭代时模拟器才划算。</p></div>
  </div>
</section>

<section>
  <p class="sec-num">09</p>
  <h2>拿走这些</h2>
  <div class="dl">
    <a href="downloads/StudentSim-AI教师反馈.pptx"><b>PPTX · 18 页</b><span>16:9，每页带演讲者备注（PowerPoint 备注视图）</span></a>
    <a href="deck/index.html"><b>口播 HTML deck</b><span>按 S 进演讲者视图（当前页/下一页/逐字稿/计时器）</span></a>
    <a href="downloads/explainer.html"><b>可交互精读页</b><span>结论折叠 · F×R 象限 · 核对清单</span></a>
    <a href="downloads/00-核心结论.md"><b>精读 Markdown</b><span>8 条结论 + Mermaid 结构图 + 回查表</span></a>
    <a href="downloads/transcript.md"><b>完整转写</b><span>21,562 字，按 10 分钟分片</span></a>
    <a href="downloads/README.md"><b>交付说明</b><span>流水线、QA 命令、复现步骤</span></a>
  </div>
</section>

</main>

<footer>
  <div class="wrap">
    <div class="cols">
      <div>
        <h4>出处</h4>
        <p>视频：<a href="https://www.bilibili.com/video/BV1EMJQ6tE8d">BV1EMJQ6tE8d</a>（NICE 学术 第 209 期，63 分 15 秒）</p>
        <p>论文：<a href="https://arxiv.org/abs/2609.01591">arXiv:2609.01591</a> — StudentSim: Training LLM-based Student Simulators（2026-09-01）</p>
        <p>代码：<a href="https://github.com/microsoft/StudentSim">github.com/microsoft/StudentSim</a></p>
        <p>讲者主页：<a href="https://empathyang.github.io">empathyang.github.io</a></p>
      </div>
      <div>
        <h4>口径与边界</h4>
        <p>第 06 节的 ROI 推论是<b>本次整理的落地判断</b>，不是论文结论。</p>
        <p>网上流传的「2000+ Elo 子集 93.3% vs 56.7%」在本次核对的 arXiv 全文中<b>未检索到</b>，故未采用；论文只写该子集与三重标注子集「给出相同排序」。</p>
        <p>时间戳是 10 分钟分片边界，不是词级时间戳。</p>
      </div>
    </div>
    <p class="dis">免责声明：本页由 AI 辅助生成，仅用于信息整理与研究参考，不构成专业意见或决策依据。</p>
  </div>
</footer>

</body>
</html>
"""
    for _k, _v in {
        'facts': facts, 'concls': concls, 'quad': quad,
        'roi_rows': roi_rows, 'roi_why': roi_why, 'roi_stack': roi_stack, 'roi_not': roi_not,
    }.items():
        tpl = tpl.replace('@@' + _k + '@@', _v)
    return tpl


CSS = """/* StudentSim public page · self-contained, no CDN */
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#0B1220;--ink2:#15203A;--paper:#FFFFFF;--bg:#F7F6F2;--bg2:#EFEEE8;
  --text:#1A2333;--body:#414E63;--muted:#6C7A90;--faint:#9AA5B6;
  --line:#DFE3EA;--card:#FFFFFF;
  --teal:#0E7C86;--tealbg:#E4F1F2;--amber:#9A6410;--amberbg:#FAF0DC;
  --coral:#B23A3F;--coralbg:#FAECEC;--green:#1F7A4D;--greenbg:#E6F3EC;
  --sans:"Inter","Helvetica Neue",-apple-system,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",sans-serif;
  --serif:"Playfair Display",Georgia,"Songti SC","Noto Serif SC","SimSun",serif;
  --mono:"JetBrains Mono","SF Mono",Consolas,monospace;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:var(--sans);line-height:1.72;
     -webkit-font-smoothing:antialiased;font-size:16px}
.wrap{max-width:1080px;margin:0 auto;padding:0 28px}
a{color:var(--teal);text-decoration:none}
a:hover{text-decoration:underline}

/* ---------- hero ---------- */
.hero{background:var(--ink);color:#fff;padding:88px 0 76px;position:relative;overflow:hidden}
.hero::after{content:"";position:absolute;right:-120px;top:-140px;width:520px;height:520px;
  background:radial-gradient(circle,rgba(14,124,134,.30),transparent 62%)}
.hero::before{content:"";position:absolute;left:-100px;bottom:-200px;width:460px;height:460px;
  background:radial-gradient(circle,rgba(232,163,61,.16),transparent 65%)}
.hero .wrap{position:relative;z-index:2}
.eyebrow{font-family:var(--mono);font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;
  color:#7FD3DD;margin-bottom:26px}
.hero h1{font-family:var(--serif);font-size:clamp(34px,6.2vw,68px);line-height:1.16;letter-spacing:-.015em;
  font-weight:700;max-width:18em}
.hero h1 .hl{color:#F0B65A}
.hero .sub{margin-top:26px;max-width:44em;font-size:clamp(16px,2.1vw,19px);color:#C3CEDF;line-height:1.66}
.hero .sub strong{color:#fff;font-weight:600}
.hero-nums{display:flex;flex-wrap:wrap;gap:16px;margin-top:38px}
.hero-nums>div{background:rgba(255,255,255,.055);border:1px solid #25355A;border-radius:14px;
  padding:16px 22px;min-width:238px;flex:1 1 238px}
.hero-nums b{display:block;font-family:var(--serif);font-size:30px;color:#7FD3DD;line-height:1.1}
.hero-nums span{display:block;font-size:12.5px;color:#9FB0C9;margin-top:7px;line-height:1.5}
.cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:36px}
.btn{display:inline-block;background:#F0B65A;color:#0B1220;font-weight:700;font-size:15px;
  padding:13px 24px;border-radius:10px;border:1px solid #F0B65A;transition:transform .15s,background .15s}
.btn:hover{background:#FFC873;text-decoration:none;transform:translateY(-1px)}
.btn.ghost{background:transparent;color:#DCE4F0;border-color:#31456E}
.btn.ghost:hover{background:rgba(255,255,255,.07);border-color:#5A7099;text-decoration:none}

/* ---------- sections ---------- */
main{padding:0 0 20px}
section{padding:72px 0 8px}
.sec-num{font-family:var(--mono);font-size:12px;letter-spacing:.18em;color:var(--teal);
  font-weight:700;margin-bottom:10px}
h2{font-family:var(--serif);font-size:clamp(26px,4vw,40px);line-height:1.24;letter-spacing:-.01em;
  margin-bottom:14px}
.lead{font-size:17.5px;color:var(--body);max-width:46em;margin-bottom:26px}
.lead b{color:var(--text);font-weight:700}

/* three-up */
.three{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.three>div{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px 24px}
.three b{display:block;font-size:17px;margin-bottom:8px}
.three p{font-size:14.5px;color:var(--body)}

/* numbers */
.nums{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.num-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px 22px}
.num-card .v{font-family:var(--serif);font-size:32px;color:var(--teal);line-height:1.1;font-weight:700}
.num-card .l{font-size:14px;font-weight:700;margin-top:8px}
.num-card .n{font-size:12.5px;color:var(--muted);margin-top:6px;line-height:1.5}

/* quad */
.quad-wrap{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:26px}
.quad{display:contents}
.q{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px 24px}
.q .ax{display:block;font-size:12px;font-weight:700;color:var(--muted);margin-bottom:6px}
.q b{display:block;font-family:var(--serif);font-size:22px;margin-bottom:6px}
.q .d{font-size:14px;color:var(--body)}
.q.t-teal{background:var(--tealbg);border-color:var(--teal)}
.q.t-teal .ax{color:var(--teal)}
.q.t-amber{background:var(--amberbg);border-color:#E2C286}
.q.t-amber .ax{color:var(--amber)}
.q.t-muted{opacity:.78}
.two{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:18px}
.two>div{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px 24px}
.two b{display:block;font-size:16px;margin-bottom:8px}
.two p{font-size:14.5px;color:var(--body)}
.note-line{font-size:14.5px;color:var(--body);background:var(--bg2);border-radius:12px;padding:16px 20px}

/* flow */
.flow{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.flow>div{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px 22px}
.flow .n{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;
  background:var(--teal);color:#fff;font-family:var(--mono);font-size:14px;font-weight:700;margin-bottom:14px}
.flow b{display:block;font-size:16px;margin-bottom:8px}
.flow p{font-size:13.5px;color:var(--body)}

/* tables */
.tables{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-bottom:26px}
.tbl-wrap h3{font-size:16px;margin-bottom:12px}
.tbl-wrap table{width:100%;border-collapse:collapse;font-size:14px;background:var(--card);
  border:1px solid var(--line);border-radius:12px;overflow:hidden}
.tbl-wrap th{background:#E7EAEF;color:var(--text);text-align:left;padding:11px 13px;font-size:12.5px;
  border-bottom:2px solid var(--teal)}
.tbl-wrap th:not(:first-child){text-align:center}
.tbl-wrap td{padding:11px 13px;border-bottom:1px solid var(--line);color:var(--body)}
.tbl-wrap td:not(:first-child){text-align:center;font-weight:600}
.tbl-wrap tr.hl td{background:var(--tealbg);color:var(--text);font-weight:700}
.cap{font-size:12.5px;color:var(--muted);margin-top:10px}

/* callout */
.callout{background:var(--coralbg);border:1px solid #E9C4C4;border-left:4px solid var(--coral);
  border-radius:12px;padding:22px 26px}
.callout .tag{display:inline-block;background:var(--coral);color:#fff;font-size:11.5px;font-weight:700;
  letter-spacing:.1em;padding:3px 10px;border-radius:999px;margin-bottom:12px}
.callout b{display:block;font-size:18px;margin-bottom:8px}
.callout p{font-size:15px;color:var(--body)}

/* ---------- ROI ---------- */
.roi{background:var(--bg2);margin-top:64px;padding:64px 28px;border-radius:20px}
.roi .wrap{padding:0}
.roi-ladder h3,.roi-stack h3,.roi-not h3{font-family:var(--serif);font-size:22px;margin-bottom:16px}
.roi-tbl{width:100%;border-collapse:collapse;font-size:14px;background:var(--card);
  border:1px solid var(--line);border-radius:12px;overflow:hidden;margin-bottom:28px}
.roi-tbl th{background:#E7EAEF;text-align:left;padding:12px 14px;font-size:12.5px;color:var(--text)}
.roi-tbl td{padding:14px;border-bottom:1px solid var(--line);color:var(--body);vertical-align:top}
.roi-tbl .step{width:52px}
.roi-tbl .sn{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;
  border-radius:50%;background:var(--ink);color:#fff;font-family:var(--mono);font-weight:700;font-size:13px}
.roi-tbl .rt b{display:block;color:var(--text);font-size:15px;margin-bottom:4px}
.roi-tbl .rt span{font-size:13px;color:var(--body)}
.roi-tbl .when{font-size:13px;color:var(--muted);max-width:18em}
.pill{display:inline-block;font-size:12px;font-weight:700;padding:4px 11px;border-radius:999px;white-space:nowrap}
.pill.good{background:var(--greenbg);color:var(--green)}
.pill.warn{background:var(--amberbg);color:var(--amber)}
.pill.bad{background:var(--coralbg);color:var(--coral)}
.why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:30px}
.why{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px 24px}
.why b{display:block;font-size:16px;margin-bottom:8px}
.why p{font-size:14px;color:var(--body)}
.roi-stack ul,.roi-not ul{list-style:none;display:grid;gap:12px}
.roi-stack li,.roi-not li{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px 22px}
.roi-stack li b,.roi-not li b{display:block;font-size:15.5px;margin-bottom:6px}
.roi-stack li p,.roi-not li p{font-size:14px;color:var(--body)}
.roi-not li{border-left:4px solid var(--coral)}
.formula{margin-top:26px;background:var(--ink);color:#E7ECF4;border-radius:14px;padding:26px 30px}
.formula b{display:block;font-family:var(--serif);font-size:19px;margin-bottom:12px;color:#fff}
.formula p{font-size:15.5px;color:#C3CEDF}
.formula .f{color:#7FD3DD;font-weight:600}
.formula .cap{color:#9FB0C9}

/* conclusions */
.concl{list-style:none;counter-reset:none}
.concl li{display:grid;grid-template-columns:52px 1fr;gap:16px;align-items:start;
  padding:18px 0;border-bottom:1px solid var(--line)}
.concl .cn{font-family:var(--mono);font-size:13px;font-weight:700;color:var(--teal);background:var(--tealbg);
  width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center}
.concl b{display:block;font-size:17px;margin-bottom:6px}
.concl p{font-size:14.5px;color:var(--body)}
.concl p.l2{color:var(--muted);margin-top:4px}

/* open problems */
.opens{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.opens>div{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--coral);
  border-radius:12px;padding:20px 24px}
.opens b{display:block;font-size:16px;margin-bottom:6px}
.opens p{font-size:14.5px;color:var(--body)}

/* downloads */
.dl{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.dl a{display:block;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px 24px;
  transition:transform .15s,box-shadow .15s,border-color .15s}
.dl a:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(20,32,58,.10);
  border-color:var(--teal);text-decoration:none}
.dl b{display:block;font-size:16px;color:var(--text);margin-bottom:7px}
.dl span{font-size:13px;color:var(--muted);line-height:1.5}

/* footer */
footer{background:var(--ink);color:#B7C3D6;margin-top:72px;padding:56px 0 40px}
footer h4{color:#fff;font-size:15px;margin-bottom:12px}
footer p{font-size:13.5px;margin-bottom:7px;overflow-wrap:anywhere}
footer a{color:#7FD3DD}
footer .cols{display:grid;grid-template-columns:1fr 1fr;gap:36px;margin-bottom:28px}
footer .dis{font-size:12px;color:#7A8AA4;border-top:1px solid #25355A;padding-top:20px}
footer b{color:#E3E9F2}

/* ---------- responsive ---------- */
@media (max-width:900px){
  .three,.nums,.flow,.why-grid,.dl,.tables,.opens,.quad-wrap,.two,.footer .cols{grid-template-columns:1fr}
  .hero{padding:60px 0 52px}
  section{padding:52px 0 4px}
  .roi{padding:40px 18px}
}
@media (max-width:600px){
  .wrap{padding:0 18px}
  .hero-nums>div{min-width:100%}
}
"""


def main():
    os.makedirs(SITE, exist_ok=True)
    for d in (DL, MEDIA, ASSETS):
        os.makedirs(d, exist_ok=True)

    with io.open(os.path.join(SITE, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(build_html())
    with io.open(os.path.join(ASSETS, 'site.css'), 'w', encoding='utf-8') as f:
        f.write(CSS)

    # downloads
    shutil.copy2(os.path.join(ROOT, 'slides', 'output', 'StudentSim-AI教师反馈.pptx'),
                 os.path.join(DL, 'StudentSim-AI教师反馈.pptx'))
    shutil.copy2(os.path.join(ROOT, 'analysis', '00-核心结论.md'),
                 os.path.join(DL, '00-核心结论.md'))
    shutil.copy2(os.path.join(ROOT, 'analysis', 'explainer.html'),
                 os.path.join(DL, 'explainer.html'))
    shutil.copy2(os.path.join(ROOT, 'transcript.md'), os.path.join(DL, 'transcript.md'))
    shutil.copy2(os.path.join(ROOT, 'README.md'), os.path.join(DL, 'README.md'))

    # the spoken deck, browsable on the site
    copytree(os.path.join(ROOT, 'deck'), os.path.join(SITE, 'deck'))
    for junk in ('build_deck.py', 'render.py', 'preview'):
        p = os.path.join(SITE, 'deck', junk)
        if os.path.isdir(p):
            shutil.rmtree(p)
        elif os.path.exists(p):
            os.remove(p)

    # media: slide previews
    n = 0
    for name in sorted(os.listdir(os.path.join(ROOT, 'deck', 'preview'))):
        if name.endswith('.png'):
            shutil.copy2(os.path.join(ROOT, 'deck', 'preview', name),
                         os.path.join(MEDIA, name))
            n += 1

    total = 0
    for root, dirs, files in os.walk(SITE):
        for f in files:
            total += os.path.getsize(os.path.join(root, f))
    print('site built ->', SITE)
    print('  slide previews:', n)
    print('  total size: %.2f MB' % (total / 1024 / 1024))


if __name__ == '__main__':
    main()
