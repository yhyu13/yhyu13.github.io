export type CraftItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  /** platform / source label */
  source: string;
  /** optional extra badge (date, duration, language, stars) */
  meta?: string;
  /** optional topic tags */
  tags?: string[];
  /** image URL; if omitted or broken a placeholder is shown */
  image?: string;
};

export type CraftSection = {
  id: "github" | "gitee" | "zhihu" | "bilibili";
  label: string;
  profileUrl: string;
  profileLabel: string;
  items: CraftItem[];
};

export type PlatformStats = {
  publicRepos?: number;
  followers?: number;
  following?: number;
  stars?: number;
  /** Zhihu article count */
  articles?: number;
  /** Zhihu answer count */
  answers?: number;
  /** Zhihu upvote total */
  upvotes?: number;
  /** Bilibili video count */
  videos?: number;
  /** Bilibili total likes */
  likes?: number;
  /** ISO date string */
  joinedAt?: string;
  avatarUrl?: string;
  /** external chart/image URL (e.g. GitHub contribution graph) */
  chartUrl?: string;
  /** extra flavor text */
  flavor?: string;
};

export const GITHUB_PROFILE = "https://github.com/yhyu13";
export const GITEE_PROFILE = "https://gitee.com/yhyu13";
export const ZHIHU_PROFILE = "https://www.zhihu.com/people/ao-ta-kang-007";
export const BILIBILI_PROFILE = "https://space.bilibili.com/1526329479";

// Snapshot from https://api.github.com/users/yhyu13 (2026-10-31).
export const GITHUB_STATS: PlatformStats = {
  publicRepos: 472,
  followers: 103,
  following: 96,
  joinedAt: "2016-05-14T20:18:33Z",
  avatarUrl: "https://avatars.githubusercontent.com/u/19365678?v=4",
  chartUrl: "https://ghchart.rshah.org/945a3e/yhyu13",
  flavor: "A zealot of AI.",
};

// Snapshot from https://gitee.com/api/v5/users/yhyu13 (2026-10-31).
export const GITEE_STATS: PlatformStats = {
  publicRepos: 36,
  followers: 0,
  following: 4,
  joinedAt: "2021-02-27T11:47:22+08:00",
  avatarUrl: "https://gitee.com/assets/no_portrait.png",
  flavor: "Mirrors and original repos.",
};

// Snapshot from https://www.zhihu.com/api/v4/members/ao-ta-kang-007 (2026-10-31).
export const ZHIHU_STATS: PlatformStats = {
  followers: 149,
  articles: 121,
  answers: 62,
  upvotes: 412,
  avatarUrl: "https://picx.zhimg.com/v2-ef69d369588e9764f9252225e6dc29ce_xl.jpg",
  flavor: "Long-form writing on AI and systems.",
};

// Snapshot from https://api.bilibili.com/x/web-interface/card?mid=1526329479 (2026-10-31).
export const BILIBILI_STATS: PlatformStats = {
  followers: 166,
  following: 4960,
  videos: 218,
  likes: 1826,
  avatarUrl: "https://i0.hdslb.com/bfs/face/b1ba364995cbdbee6ba792d1ac934c8cc79ce17f.jpg",
  flavor: "Indie game jams; UE engine work.",
};

function githubOg(repo: string) {
  return `https://opengraph.githubassets.com/1/yhyu13/${repo}`;
}

// AI-related public repos from https://github.com/yhyu13 (curated subset).
export const GITHUB_AI_REPOS: CraftItem[] = [
  {
    id: "agent-skills-vault",
    title: "AgentSkillsVault",
    description: "Most beloved agent skills used in hourly work.",
    url: "https://github.com/yhyu13/AgentSkillsVault",
    source: "GitHub",
    meta: "Python · 3 stars",
    tags: ["agents", "skills"],
    image: githubOg("AgentSkillsVault"),
  },
  {
    id: "alpha-go-zero",
    title: "AlphaGOZero-python-tensorflow",
    description: "Educational reimplementation of DeepMind's AlphaGo Zero in TensorFlow.",
    url: "https://github.com/yhyu13/AlphaGOZero-python-tensorflow",
    source: "GitHub",
    meta: "Python · 340 stars",
    tags: ["rl", "go", "tensorflow"],
    image: githubOg("AlphaGOZero-python-tensorflow"),
  },
  {
    id: "doom3-ai-native",
    title: "DOOM3_AINative",
    description: "Doom 3 source harness for AI-native engine experiments.",
    url: "https://github.com/yhyu13/DOOM3_AINative",
    source: "GitHub",
    meta: "HTML/C++",
    tags: ["game", "engine"],
    image: githubOg("DOOM3_AINative"),
  },
  {
    id: "claude-bridge",
    title: "claude-bridge",
    description: "Drive Claude Code CLI from an Android browser over Tailscale.",
    url: "https://github.com/yhyu13/claude-bridge",
    source: "GitHub",
    meta: "JavaScript",
    tags: ["agent", "tooling"],
    image: githubOg("claude-bridge"),
  },
  {
    id: "openarch",
    title: "OpenArch",
    description: "From-scratch PyTorch implementations of modern open-source LLM architectures.",
    url: "https://github.com/yhyu13/OpenArch",
    source: "GitHub",
    meta: "Python",
    tags: ["llm", "pytorch"],
    image: githubOg("OpenArch"),
  },
  {
    id: "agent-mod-generator",
    title: "AgentMODGenerator",
    description: "Generate modular agent behavior specifications.",
    url: "https://github.com/yhyu13/AgentMODGenerator",
    source: "GitHub",
    meta: "Python · 2 stars",
    tags: ["agents", "mod"],
    image: githubOg("AgentMODGenerator"),
  },
  {
    id: "ainiagara",
    title: "AINiagara",
    description: "Unreal Engine 5 plugin that uses Gemini to generate Niagara particle systems.",
    url: "https://github.com/yhyu13/AINiagara",
    source: "GitHub",
    meta: "C++ / Blueprints",
    tags: ["ue5", "vfx", "gen-ai"],
    image: githubOg("AINiagara"),
  },
  {
    id: "img2threejs",
    title: "img2threejs",
    description: "Rebuild a reference image as a procedural, animation-ready Three.js model.",
    url: "https://github.com/yhyu13/img2threejs",
    source: "GitHub",
    meta: "JavaScript",
    tags: ["3d", "three.js", "image-to-3d"],
    image: githubOg("img2threejs"),
  },
  {
    id: "renderdoc-skill",
    title: "renderdoc-skill",
    description: "Claude Code skill for GPU frame debugging with RenderDoc via rdc-cli.",
    url: "https://github.com/yhyu13/renderdoc-skill",
    source: "GitHub",
    meta: "Python",
    tags: ["rendering", "debugging", "skill"],
    image: githubOg("renderdoc-skill"),
  },
  {
    id: "auto-claude-code-research",
    title: "Auto-claude-code-research-in-sleep",
    description: "Lightweight Markdown-only skills for autonomous ML research loops.",
    url: "https://github.com/yhyu13/Auto-claude-code-research-in-sleep",
    source: "GitHub",
    meta: "Python",
    tags: ["research", "agents"],
    image: githubOg("Auto-claude-code-research-in-sleep"),
  },
];

// AI-related public repos from https://gitee.com/yhyu13 (curated subset).
export const GITEE_AI_REPOS: CraftItem[] = [
  {
    id: "gitee-ai-radar-vault",
    title: "AIRadarVault",
    description: "AI radar and tooling collection.",
    url: "https://gitee.com/yhyu13/airadar-vault",
    source: "Gitee",
    tags: ["ai", "tools"],
  },
  {
    id: "gitee-ai-video",
    title: "AIVideo",
    description: "AI video experiments and utilities.",
    url: "https://gitee.com/yhyu13/aivideo",
    source: "Gitee",
    tags: ["video", "gen-ai"],
  },
  {
    id: "gitee-ai-news",
    title: "AI_News",
    description: "Curated AI news and notes.",
    url: "https://gitee.com/yhyu13/AI_News",
    source: "Gitee",
    meta: "1 star",
    tags: ["news", "llm"],
  },
  {
    id: "gitee-llama-tools",
    title: "LLAMA_TOOLS",
    description: "LLaMA utilities and scripts.",
    url: "https://gitee.com/yhyu13/llama_-tools",
    source: "Gitee",
    meta: "3 stars",
    tags: ["llama", "llm"],
  },
  {
    id: "gitee-emotivoice",
    title: "Emotivoice_TTS",
    description: "Emotion-aware text-to-speech experiments.",
    url: "https://gitee.com/yhyu13/Emotivoice_TTS",
    source: "Gitee",
    tags: ["tts", "audio"],
  },
  {
    id: "gitee-hf-diffuser-book",
    title: "HF_Diffuser_Book",
    description: "Hugging Face Diffusers learning notes.",
    url: "https://gitee.com/yhyu13/hf_-diffuser_-book",
    source: "Gitee",
    tags: ["diffusion", "hf"],
  },
  {
    id: "gitee-stable-diffusion-playground",
    title: "StableDisffusionPlayeground",
    description: "Manager repo to download and run Stable Diffusion.",
    url: "https://gitee.com/yhyu13/stable-disffusion-playeground",
    source: "Gitee",
    tags: ["sd", "diffusion"],
  },
  {
    id: "gitee-transformer-tools",
    title: "Transformer_TOOLS",
    description: "Hugging Face transformer utilities.",
    url: "https://gitee.com/yhyu13/transformer_-tools",
    source: "Gitee",
    tags: ["transformers", "nlp"],
  },
];

// Zhihu: the article list endpoint requires auth, so this is a channel entry
// point that carries the real public counts. Add item cards here when a list
// becomes available.
export const ZHIHU_ARTICLES: CraftItem[] = [
  {
    id: "zhihu-channel",
    title: "知乎 · 奥塔康007",
    description: "121 articles, 62 answers and 412 upvotes on AI and systems.",
    url: ZHIHU_PROFILE,
    source: "Zhihu",
    meta: "149 followers",
    tags: ["ai", "systems", "notes"],
    image: "https://picx.zhimg.com/v2-ef69d369588e9764f9252225e6dc29ce_xl.jpg",
  },
];

// Bilibili: video search endpoints need signed requests, so this is a channel
// entry point with the real public counts. Add item cards here when a list
// becomes available.
export const BILIBILI_VIDEOS: CraftItem[] = [
  {
    id: "bilibili-channel",
    title: "Bilibili · 杀死士大夫",
    description: "218 videos, 1.8k likes. Indie game jams and UE engine work.",
    url: BILIBILI_PROFILE,
    source: "Bilibili",
    meta: "166 fans",
    tags: ["video", "game-jam", "ue"],
    image: "https://i0.hdslb.com/bfs/face/b1ba364995cbdbee6ba792d1ac934c8cc79ce17f.jpg",
  },
];

export const CRAFT_SECTIONS: CraftSection[] = [
  {
    id: "github",
    label: "GitHub · AI projects",
    profileUrl: GITHUB_PROFILE,
    profileLabel: "Profile",
    items: GITHUB_AI_REPOS,
  },
  {
    id: "gitee",
    label: "Gitee · AI projects",
    profileUrl: GITEE_PROFILE,
    profileLabel: "Profile",
    items: GITEE_AI_REPOS,
  },
  {
    id: "zhihu",
    label: "Zhihu · Articles",
    profileUrl: ZHIHU_PROFILE,
    profileLabel: "Profile",
    items: ZHIHU_ARTICLES,
  },
  {
    id: "bilibili",
    label: "Bilibili · Videos",
    profileUrl: BILIBILI_PROFILE,
    profileLabel: "Space",
    items: BILIBILI_VIDEOS,
  },
];

/** How many cards to show per section before requiring a refresh. */
export const CARDS_PER_SECTION = 4;

/**
 * Self-hosted works: pages this site serves itself, as opposed to the
 * external platform listings above. Each one is a static folder under
 * `public/labs/`, so the href points at that folder's index.html.
 */
export type CraftWork = {
  id: string;
  kind: string;
  title: string;
  description: string;
  href: string;
  meta?: string;
  tags?: string[];
};

export const CRAFT_WORKS: CraftWork[] = [
  {
    id: "student-sim",
    kind: "论文精读 · 可交互页",
    title: "StudentSim：AI 教师好不好，看学生变了没有",
    description:
      "UIUC × Microsoft Research 的 StudentSim 精读页：0.51 / 0.91 的 F×R 双维度、90.5% 专家盲评，配 18 页 deck、两支讲解视频与逐字稿。",
    href: "/labs/student-sim/index.html",
    meta: "arXiv 2609.01591 · 2026",
    tags: ["AI 教育", "论文精读"],
  },
  {
    id: "wuxia-town",
    kind: "可玩原型 · Three.js",
    title: "武侠世界 · 白模 Demo",
    description:
      "村、城、塞三块场景的可玩白模，单文件运行、零外部依赖，用来验证「武侠小镇」的空间尺度与动线是否成立。",
    href: "/labs/wuxia-town/index.html",
    meta: "单文件 · 9.3 MB",
    tags: ["游戏原型", "Three.js"],
  },
  {
    id: "march-witness",
    kind: "互动叙事 · 单文件",
    title: "随军记 — 560 天的长征见证",
    description:
      "薄复礼（Alfred Bosshardt）1934.10—1936.4 随红六军团转战五省：六章、十八则见证，环顾他看见的世界，把发光的见证记入日记。手机转动机身，电脑拖动画面或方向键。",
    href: "/labs/march-witness/index.html",
    meta: "单文件 · 775 KB",
    tags: ["互动叙事", "长征史"],
  },
  {
    id: "saltline-dock",
    kind: "可走场景 · 程序化材质",
    title: "雨夜码头 — 一张图都没用",
    description:
      "集装箱的波纹与锈、地面的积水、雨丝，全部由代码算出：WASD 走一圈雨夜码头，还能拧「灰模」和「湿度」两个旋钮看材质怎么变。",
    href: "/labs/saltline-dock/index.html",
    meta: "单文件 · 15 KB（three.js 走 CDN）",
    tags: ["程序化材质", "WebGL"],
  },
  {
    id: "march-witness-showreel",
    kind: "口播影院 · 单页",
    title: "随军记 · 口播影院",
    description:
      "同一段 560 天的见证，换成影院坐席：一页排完六个章节的旁白与画面节拍，按下播放就跟着走完。",
    href: "/labs/march-witness-showreel/index.html",
    meta: "index.html + 旁白 m4a · 3.4 MB",
    tags: ["口播", "长征史"],
  },
  {
    id: "a16z-radar",
    kind: "检索页 · 单文件",
    title: "a16z 研报雷达 · 793 篇",
    description:
      "把 a16z 2010–2026 的 793 篇 posts 做成一张可检索的表：按标题/作者/分类搜、只看 AI 相关（516 篇）、或按字数翻长文，共 163 万词。只存标题与链接，正文回原文读。",
    href: "/labs/a16z-radar/index.html",
    meta: "单文件 · 191 KB · 零依赖",
    tags: ["索引", "a16z"],
  },
];
