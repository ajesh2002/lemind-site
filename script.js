// Always start at the top: stop the browser restoring the previous scroll position on refresh
if ("scrollRestoration" in history) history.scrollRestoration = "manual"

// Lemind site: page switching, shrinking header, parallax.
// Ported from the Figma Make React app to plain JavaScript.

const asset = (name) => `assets/${name}`

const projects = [
  { title: "Simply Tokenized", link: "#case-simply", description: "Revolutionize your corporate finance with Tokenization", tags: ["UI UX", "Web App", "Design System"], image: "work-simply.webp", tone: "#00b5cb" },
  { title: "Akay", link: "#case-akay", description: "Taste nature through technology", tags: ["UI UX", "Web Design"], image: "work-akay.webp", tone: "#c9d0d8" },
  { title: "Sanjeevini Wellness", description: "Streamline your lifestyle with expertise", tags: ["UI UX", "Web Design", "Web App"], image: "work-sanjeevini.webp", tone: "#727ba9" },
  { title: "FreshKart", description: "Groceries delivered in minutes, not hours", tags: ["UI UX", "Mobile App", "eCommerce"], image: "work-grocery.webp", tone: "#2b0a78" },
  { title: "Sanjeevini Life Care Village", description: "Wholeness in wellness, across web and mobile", tags: ["UI UX", "Web Design", "Mobile", "Branding"], image: "work-sanjeevini-site.webp", tone: "#91c7b3", wide: true },
  { title: "Ascension Team", description: "Connecting Airline Crew Teams", tags: ["UI UX", "Mobile App", "Product Design"], image: "work-ascension.webp", tone: "#4a5cc8" },
  { title: "Wiideman Consulting", description: "SEO Consulting, Training, Strategy & Procurement", tags: ["UI UX", "Web Design", "SEO"], image: "work-wiideman.webp", tone: "#ffffff" },
  { title: "Donica IFE", description: "Inflight entertainment product", tags: ["UI UX", "IFE System", "Product Design"], image: "work-donica.webp", tone: "#1e3a6b" },
  { title: "More work, soon", description: "New ideas are always taking shape.", tags: ["UI UX", "Web Design", "Strategy"], tone: "#3b0a9e" },
]

const serviceDetails = [
  {
    title: "Research & Innovation",
    description: "Aligning user needs with business goals through thoughtful, insight-driven planning.",
    items: ["UX audits", "Product strategy", "Roadmap consultation", "Heuristic evaluations", "Customer journey", "Workflow mapping", "Information architecture", "Navigation design", "Competitive UX benchmarking"],
    icon: ["d3b2b.svg"],
  },
  {
    title: "Experience Design",
    description: "Clean, intelligent, and accessible design systems for seamless enterprise experiences.",
    items: ["UX wireframes", "Interactive prototypes", "Responsive UI design", "Design systems", "Component libraries", "Accessibility Compliance", "High-fidelity mockups", "Micro-interactions", "Motion design"],
    icon: ["e9d80.svg", "147be.svg", "114c9.svg", "f5467.svg"],
  },
  {
    title: "Frontend Development",
    description: "Scalable, performant, and pixel-perfect frontend builds.",
    items: ["React / Angular / Vue development", "Tailwind, SCSS, CSS-in-JS architecture", "Component-based UI engineering", "API integration & dynamic data handling", "Performance optimization & Lighthouse audits", "Testing (unit, integration, visual regression)"],
    icon: ["4a08c.svg"],
  },
  {
    title: "Full-Stack Development",
    description: "Bringing ideas to life with solid, scalable engineering.",
    items: ["Custom web app development", "Database design", "Backend architecture", "Node.js / Express / Django / Laravel", "REST & GraphQL APIs", "Admin panels & internal tools", "DevOps & CI/CD setup"],
    icon: ["4f124.svg", "b0182.svg", "f2fca.svg", "c2b6d.svg", "a3656.svg", "a812b.svg", "5cecf.svg"],
  },
  {
    title: "Product Consultation",
    description: "Bringing ideas to life with solid, scalable engineering.",
    items: ["Product thinking & co-creation", "Redesigning legacy systems", "Design sprints & MVP planning", "Feature prioritization frameworks", "SaaS & enterprise UX consulting", "Product-market fit alignment"],
    icon: ["71910.svg"],
  },
  {
    title: "Branding & Identity",
    description: "Designing identities that speak with clarity, purpose, and distinction.",
    items: ["Brand Discovery & Strategy", "Logo Design & Mark Systems", "Visual Identity System", "Brand Guidelines Documentation", "Naming & Tagline Crafting", "Brand Applications"],
    icon: ["8bd32.svg"],
  },
]

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag)
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "text") node.textContent = value
    else if (key === "style") Object.assign(node.style, value)
    else node.setAttribute(key, value)
  }
  for (const child of children) node.append(child)
  return node
}

// Animated "concept" artwork for projects that have no image yet
function conceptArt() {
  const art = el("div", { class: "concept-art", "aria-hidden": "true" })
  art.innerHTML = `
    <span class="c-blob c-b1"></span><span class="c-blob c-b2"></span><span class="c-blob c-b3"></span>
    <span class="c-grid"></span>
    <span class="c-ring"></span><span class="c-ring c-r2"></span>
    <span class="c-orbit"><i></i></span><span class="c-orbit c-o2"><i></i></span>
    <span class="c-spark c-s1">✦</span><span class="c-spark c-s2">✦</span><span class="c-spark c-s3">✦</span>
    <span class="c-label"><b>✦</b> Next idea in progress<span class="c-dots"><i></i><i></i><i></i></span></span>`
  return art
}

function projectCard(project, index, { offsets = true } = {}) {
  const image = el("div", { class: "project-image", style: { backgroundColor: project.tone } })
  if (project.image) {
    // Image drifts inside its frame (inner parallax)
    image.append(
      el("img", {
        src: asset(project.image),
        alt: `${project.title} project presentation`,
        loading: "lazy",
        "data-parallax": "0.06",
        "data-parallax-max": "36",
      }),
    )
  } else {
    image.append(conceptArt())
  }
  const info = el("div", { class: "project-info" }, [
    el("h3", { text: project.title }),
    el("p", { text: project.description }),
    el("div", { class: "tags" }, project.tags.map((tag) => el("span", { text: tag }))),
  ])

  const attrs = {
    class: `project-card reveal-card${project.wide && offsets ? " project-wide" : ""}`,
    "data-tags": project.tags.join(" "),
  }
  // Left and right columns move at different speeds (outer parallax)
  if (offsets && !project.wide) {
    const leftColumn = index % 2 === 0
    attrs["data-parallax"] = leftColumn ? "0.025" : "-0.05"
    attrs["data-parallax-max"] = leftColumn ? "35" : "70"
  }
  const card = el("article", attrs, [image, info])
  // Projects with a case study: the whole card opens it
  if (project.link) {
    card.classList.add("has-case")
    card.append(el("a", { class: "card-link", href: project.link, "aria-label": `View ${project.title} case study` }))
    image.append(el("span", { class: "card-view", text: "View case study →" }))
  }
  return card
}

function renderProjects() {
  const grid = document.getElementById("project-grid")
  projects.forEach((project, index) => grid.append(projectCard(project, index)))

  // Dedicated work page: even grid, filterable
  const workGrid = document.getElementById("work-page-grid")
  if (workGrid) projects.forEach((project, index) => workGrid.append(projectCard(project, index)))
}

function renderServices() {
  const list = document.getElementById("services-list")
  for (const service of serviceDetails) {
    const icon = el(
      "div",
      { class: `service-icon service-icon-${service.icon.length}` },
      service.icon.map((name) => el("img", { src: asset(name), alt: "" })),
    )
    list.append(
      el("article", { class: "service-detail" }, [
        icon,
        el("h2", { text: service.title }),
        el("p", { text: service.description }),
        el("ul", {}, service.items.map((item) => el("li", { text: item }))),
      ]),
    )
  }
}

// ---------- Page switching (hash routing) ----------
const homePage = document.getElementById("home-page")
const subPages = {
  "#services-page": document.getElementById("services-page"),
  "#about-page": document.getElementById("about-page"),
  "#contact-page": document.getElementById("contact-page"),
  "#thank-you": document.getElementById("thank-you"),
  "#ai-sprint": document.getElementById("ai-sprint"),
  "#web3": document.getElementById("web3"),
  "#work-page": document.getElementById("work-page"),
  "#case-simply": document.getElementById("case-simply"),
  "#case-akay": document.getElementById("case-akay"),
  "#privacy": document.getElementById("privacy"),
}

const curtain = document.getElementById("page-curtain")
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let currentPage = null
let switching = false

function pageForHash(hash) {
  if (subPages[hash]) return subPages[hash]
  let target = null
  try { target = hash ? document.querySelector(hash) : null } catch { target = null }
  return target?.closest("main") || homePage
}

// The element a hash points to, unless it is the page itself
function hashTarget(page) {
  const hash = window.location.hash
  if (!hash || subPages[hash] === page) return null
  try { return page.querySelector(hash) } catch { return null }
}

// Jump (no smooth scroll) to the top or to the anchor in the URL.
function jumpToTarget(page) {
  const html = document.documentElement
  html.style.scrollBehavior = "auto"
  const target = hashTarget(page)
  if (target) target.scrollIntoView()
  else window.scrollTo(0, 0)
  html.style.scrollBehavior = ""
}

// Show one page, hide the others, and restart its entrance animations.
function swapTo(page) {
  homePage.hidden = page !== homePage
  for (const sub of Object.values(subPages)) sub.hidden = sub !== page
  currentPage = page
  updateMenuCurrent()
  jumpToTarget(page)
  hideReveals(page)
  measureParallax()
  updateHeader()
  document.body.classList.remove("page-ready")
  if (!reduceMotion) document.body.classList.add("page-entering")
}

// Start the open page's entrance animations (called as the curtain lifts).
function playEntrance() {
  requestAnimationFrame(() => {
    document.body.classList.remove("page-entering")
    setTimeout(measureParallax, 1150) // re-measure once the content has risen into place
    document.body.classList.add("page-ready")
    watchReveals(currentPage)
    resetCounters(currentPage)
    updateTimeline()
    updateFooter()
    if (approachObserver && currentPage.contains(approachSteps)) {
      approachSteps.classList.remove("is-drawn")
      approachObserver.unobserve(approachSteps)
      approachObserver.observe(approachSteps)
    }
  })
}

async function showPage() {
  const next = pageForHash(window.location.hash)

  // Anchor on the page already open: just scroll there smoothly.
  if (next === currentPage) {
    const target = hashTarget(next)
    if (target) target.scrollIntoView({ behavior: "smooth" })
    else if (subPages[window.location.hash] === next) window.scrollTo({ top: 0, behavior: "smooth" })
    return
  }

  if (reduceMotion || !currentPage) {
    swapTo(next)
    if (reduceMotion) playEntrance()
    return
  }
  if (switching) return
  switching = true

  // Curtain rises to cover the page, the page swaps, then the curtain lifts away.
  curtain.className = "page-curtain is-covering"
  await wait(1250) // panel rises, then the logo writes itself
  swapTo(next)
  await wait(120)
  curtain.className = "page-curtain is-leaving"
  playEntrance()
  await wait(750)
  curtain.className = "page-curtain"
  switching = false

  // The hash may have changed again during the transition.
  if (pageForHash(window.location.hash) !== currentPage) showPage()
}

// ---------- Shrinking header on the home page ----------
const header = document.querySelector(".site-header")
const hero = document.querySelector(".hero")
let headerFrame = 0

function updateHeader() {
  headerFrame = 0
  const toggle = document.getElementById("menu-toggle")
  if (homePage.hidden) {
    toggle.style.top = ""
    return
  }

  const travel = Math.max(hero.offsetHeight - 100, 1)
  const progress = Math.min(Math.max(window.scrollY / travel, 0), 1)
  const fullLogoWidth = window.innerWidth * 0.94
  const compactScale = Math.min(0.38, 190 / fullLogoWidth)
  const logoScale = 1 - progress * (1 - compactScale)

  header.style.setProperty("--header-progress", progress)
  header.style.setProperty("--logo-scale", logoScale)
  header.style.setProperty("--menu-left", `${50 + progress * 47}%`)
  header.style.setProperty("--menu-shift", `${-50 - progress * 50}%`)

  // Keep the kebab button vertically centred on the logo as it shrinks and moves up
  toggle.style.top = ""
  const baseTop = parseFloat(getComputedStyle(toggle).top)
  const logo = header.querySelector(".header-mark img")
  const logoTop = parseFloat(getComputedStyle(header.querySelector(".header-mark")).top) || 12
  const compactCenter = 12 + (logo.offsetHeight * logoScale) / 2
  const compactTop = compactCenter - toggle.offsetHeight / 2
  if (progress > 0) toggle.style.top = `${(baseTop + (compactTop - baseTop) * progress).toFixed(1)}px`
}

// ---------- Parallax ----------
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
let parallaxItems = []
let parallaxFrame = 0

function measureParallax() {
  if (reduceMotion) return
  parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"))
    .filter((node) => node.offsetParent !== null)
    .map((node) => {
      const bounds = node.getBoundingClientRect()
      const currentOffset = parseFloat(getComputedStyle(node).getPropertyValue("--parallax-y")) || 0
      return {
        node,
        center: bounds.top + window.scrollY - currentOffset + bounds.height / 2,
        speed: Number(node.dataset.parallax) || 0,
        maxOffset: Number(node.dataset.parallaxMax) || 80,
      }
    })
  updateParallax()
}

function updateParallax() {
  parallaxFrame = 0
  const viewportCenter = window.scrollY + window.innerHeight / 2
  for (const { node, center, speed, maxOffset } of parallaxItems) {
    const offset = Math.max(-maxOffset, Math.min(maxOffset, (viewportCenter - center) * speed))
    node.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`)
  }
}

// Footer curtain: --open goes 0 -> 1 as the page content slides off the footer
let footerFrame = 0
function updateFooter() {
  footerFrame = 0
  const footer = currentPage?.querySelector(".site-footer")
  if (!footer) return
  const body = footer.previousElementSibling
  const uncovered = window.innerHeight - body.getBoundingClientRect().bottom
  const open = Math.min(Math.max(uncovered / footer.offsetHeight, 0), 1)
  footer.style.setProperty("--open", open.toFixed(3))
}

function onScroll() {
  if (!footerFrame) footerFrame = requestAnimationFrame(updateFooter)
  if (!timelineFrame) timelineFrame = requestAnimationFrame(updateTimeline)
  if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader)
  if (!reduceMotion && !parallaxFrame) parallaxFrame = requestAnimationFrame(updateParallax)
}

// ---------- About page animations ----------
// Wrap each headline word so it can slide up on its own.
function splitWords() {
  document.querySelectorAll(".split-words").forEach((heading) => {
    const words = heading.textContent.trim().split(/\s+/)
    heading.setAttribute("aria-label", heading.textContent.trim())
    heading.textContent = ""
    words.forEach((word, i) => {
      const outer = el("span", { class: "word", "aria-hidden": "true" }, [
        el("span", { text: word, style: { "--i": i } }),
      ])
      outer.firstChild.style.setProperty("--i", i)
      heading.append(outer, " ")
    })
  })
}

// Fade elements in as they scroll into view.
const revealSelector = ".reveal, .reveal-scale, .reveal-fade, .reveal-card, .reveal-line"
let revealObserver = null

function setupReveal() {
  if (reduceMotion || !("IntersectionObserver" in window)) return
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible")
          revealObserver.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  )
}

// Hide a page's reveal elements again so they animate on each visit...
function hideReveals(page) {
  if (!revealObserver) return
  page.querySelectorAll(revealSelector).forEach((t) => t.classList.remove("is-visible"))
}

// ...and reveal them as they scroll into view.
function watchReveals(page) {
  const targets = page.querySelectorAll(revealSelector)
  if (!revealObserver) targets.forEach((t) => t.classList.add("is-visible"))
  else targets.forEach((t) => revealObserver.observe(t))
}


// ---------- Contact form ----------
// Submissions are emailed via FormSubmit (https://formsubmit.co), which needs no
// account. The first submission sends a one-time activation email to this address.
const FORM_EMAIL = "ajesh2002@gmail.com"
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${FORM_EMAIL}`

const contactForm = document.getElementById("contact-form")
const formStatus = document.getElementById("form-status")
const submitBtn = contactForm.querySelector(".submit-btn")

function validateField(field) {
  const input = field.querySelector("input, textarea")
  const value = input.value.trim()
  const valid = input.checkValidity() && (!input.required || value !== "")
  field.classList.toggle("invalid", !valid)
  return valid
}

function withTimeout(promise, ms) {
  return Promise.race([promise, wait(ms).then(() => { throw new Error("timeout") })])
}

// 1) Email through FormSubmit. Works on any normal web host.
async function sendByEmail(data) {
  const response = await withTimeout(
    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...data,
        _subject: `New Lemind enquiry from ${data["First name"]} ${data["Last name"] || ""}`.trim(),
        _template: "table",
        _captcha: "false",
      }),
    }),
    10000,
  )
  const result = await response.json().catch(() => ({}))
  if (!response.ok || String(result.success) !== "true") {
    throw new Error(result.message || "Email service error")
  }
  return "emailed"
}

// 2) Fallback inside the claude.ai preview (where outside requests are blocked):
//    save the message privately in the artifact's database.
async function saveToDatabase(data) {
  if (!window.claude?.use) throw new Error("No database available")
  const db = await Promise.race([window.claude.use("db"), wait(10000).then(() => null)])
  if (!db) throw new Error("No database available")
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  await db.doc(`messages/${id}`).set({ ...data, to: FORM_EMAIL, submittedAt: new Date().toISOString() })
  return "saved"
}

contactForm.querySelectorAll(".field").forEach((field) => {
  const input = field.querySelector("input, textarea")
  input.addEventListener("blur", () => input.value && validateField(field))
  input.addEventListener("input", () => field.classList.contains("invalid") && validateField(field))
})

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  formStatus.textContent = ""

  const fields = [...contactForm.querySelectorAll(".field")]
  const results = fields.map(validateField)
  if (results.includes(false)) {
    fields[results.indexOf(false)].querySelector("input, textarea").focus()
    return
  }

  const formData = new FormData(contactForm)
  if (formData.get("_honey")) return // bot
  formData.delete("_honey")
  const data = Object.fromEntries([...formData].map(([k, v]) => [k, String(v).trim()]))

  submitBtn.classList.add("is-sending")
  submitBtn.querySelector(".submit-text").textContent = "Sending…"

  let outcome = null
  try {
    outcome = await sendByEmail(data)
  } catch (emailError) {
    try {
      outcome = await saveToDatabase(data)
    } catch {
      outcome = null
    }
  }

  submitBtn.classList.remove("is-sending")
  submitBtn.querySelector(".submit-text").textContent = "Send message"

  if (!outcome) {
    formStatus.innerHTML = ""
    formStatus.append(
      "Sorry, your message couldn’t be sent right now. Please try again, or email us at ",
      el("strong", { text: "hello@lemind.designs" }),
      ".",
    )
    return
  }

  const name = data["First name"]
  document.getElementById("thanks-name").textContent = name ? `Thank you, ${name}!` : "Thank you!"
  document.getElementById("thanks-note").textContent =
    outcome === "saved" ? "Preview mode: your message was saved securely for the Lemind team." : ""
  contactForm.reset()
  fields.forEach((f) => f.classList.remove("invalid"))
  window.location.hash = "#thank-you"
})


// Give every remaining element on every page a scroll reveal.
// Text and cards slide up, images zoom in, and elements that already use a
// CSS transform (rotated art, centred footer logo...) just fade so their
// position isn't disturbed. Neighbours are staggered slightly.
const AUTO_REVEAL_TARGETS = [
  "section .service-icon", "section figure", "section .faq-item", "section .chips span", "section h1", "section h2", "section h3", "section p", "section li",
  "section img", "section a.text-link", "section article:not(.service-detail)", "section aside",
  "section .tags", ".client-strip img",
].join(", ")

// Areas that already have their own entrance or motion
const AUTO_REVEAL_SKIP = [
  ".reveal", ".reveal-scale", ".reveal-fade", ".reveal-card",
  ".hero-intro", ".thanks-hero", ".glance-track", ".photo-marquee", ".sprint-timeline", ".faq-a", ".sprint-visual", ".web3-visual", ".web3-ticker", ".crypto-bg", ".ai-bg", ".t-tools", ".work-hero-art", ".case-cover", ".case-next", ".legal-toc", ".legal-section", ".split-words", ".services-header", ".site-header",
].join(", ")

// Elements whose CSS transform must be kept: fade only
const FADE_ONLY = [
  ".service-art", ".studio-feature-art", ".footer-logo",
  ".showcase-strip img", ".hero-orb",
].join(", ")

function autoTagReveals() {
  const tagged = new Map() // parent -> count, for staggering
  document.querySelectorAll("main").forEach((page) => {
    page.querySelectorAll(AUTO_REVEAL_TARGETS).forEach((node) => {
      if (node.closest(AUTO_REVEAL_SKIP)) return
      const kind = node.matches(FADE_ONLY) ? "reveal-fade" : node.tagName === "IMG" ? "reveal-scale" : "reveal"
      const parent = node.parentElement
      const index = tagged.get(parent) || 0
      tagged.set(parent, index + 1)
      node.classList.add(kind)
      node.style.setProperty("--delay", `${Math.min(index * 80, 480)}ms`)
    })

    // Sections with a top divider line get it drawn in on reveal
    page.querySelectorAll("section, .service-row, .service-detail, .studio-feature, .approach").forEach((node) => {
      const style = getComputedStyle(node)
      if (style.borderTopStyle !== "none" && parseFloat(style.borderTopWidth) > 0) {
        node.classList.add("reveal-line")
      }
    })
  })
}



// ---------- AI Sprint page ----------
// Timeline line fills as you scroll; each day lights up as it passes.
const timeline = document.querySelector(".sprint-timeline")
const timelineSteps = timeline ? [...timeline.querySelectorAll(".t-step")] : []
let timelineFrame = 0

function updateTimeline() {
  timelineFrame = 0
  if (!timeline || timeline.offsetParent === null) return
  const mark = window.innerHeight * 0.6
  const box = timeline.getBoundingClientRect()
  const progress = Math.min(Math.max((mark - box.top) / box.height, 0), 1)
  timeline.style.setProperty("--progress", progress.toFixed(3))
  for (const step of timelineSteps) {
    step.classList.toggle("is-active", step.getBoundingClientRect().top < mark)
  }
}

// Numbers count up when they come into view.
function animateCount(node) {
  const to = Number(node.dataset.to)
  if (reduceMotion) { node.textContent = to; return }
  const start = performance.now()
  const duration = 1600
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1)
    node.textContent = Math.round(to * (1 - Math.pow(1 - t, 3)))
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const countObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animateCount(entry.target)
          countObserver.unobserve(entry.target)
        }
      }
    }, { threshold: 0.6 })
  : null

function resetCounters(page) {
  page.querySelectorAll(".count").forEach((node) => {
    if (!countObserver) { node.textContent = node.dataset.to; return }
    node.textContent = "0"
    countObserver.observe(node)
  })
}

// FAQ: one answer open at a time, smooth open/close.
document.querySelectorAll(".faq-item").forEach((item) => {
  const button = item.querySelector(".faq-q")
  button.addEventListener("click", () => {
    const open = !item.classList.contains("is-open")
    item.parentElement.querySelectorAll(".faq-item.is-open").forEach((other) => {
      other.classList.remove("is-open")
      other.querySelector(".faq-q").setAttribute("aria-expanded", "false")
    })
    item.classList.toggle("is-open", open)
    button.setAttribute("aria-expanded", String(open))
  })
})


// ---------- Web3 page ----------
// Hero visuals (Web3 cubes, AI Sprint sphere) tilt toward the mouse.
if (!reduceMotion) {
  document.querySelectorAll(".web3-visual, .sprint-visual").forEach((visual) => {
    visual.addEventListener("pointermove", (event) => {
      const box = visual.getBoundingClientRect()
      const x = (event.clientX - box.left) / box.width - 0.5
      const y = (event.clientY - box.top) / box.height - 0.5
      visual.style.setProperty("--ry", `${(x * 24).toFixed(1)}deg`)
      visual.style.setProperty("--rx", `${(-y * 24).toFixed(1)}deg`)
    })
    visual.addEventListener("pointerleave", () => {
      visual.style.setProperty("--rx", "0deg")
      visual.style.setProperty("--ry", "0deg")
    })
  })
}
const web3Visual = document.querySelector(".web3-visual")

// Approach line draws when the steps come into view.
const approachSteps = document.querySelector(".approach-steps")
const approachObserver = approachSteps && "IntersectionObserver" in window
  ? new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) approachSteps.classList.add("is-drawn")
    }, { threshold: 0.4 })
  : null
if (approachObserver) approachObserver.observe(approachSteps)
else approachSteps?.classList.add("is-drawn")


// ---------- Work page filters ----------
document.querySelectorAll(".work-filters button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter
    button.parentElement.querySelectorAll("button").forEach((b) => b.classList.toggle("is-active", b === button))
    document.querySelectorAll("#work-page-grid .project-card").forEach((card) => {
      const match = filter === "all" || card.dataset.tags.includes(filter)
      if (match) {
        card.hidden = false
        card.classList.remove("is-filtered-out")
        requestAnimationFrame(() => card.classList.add("is-visible"))
      } else {
        card.classList.add("is-filtered-out")
        card.hidden = true
      }
    })
    measureParallax()
  })
})

// ---------- Kebab menu ----------
const menuToggle = document.getElementById("menu-toggle")
const siteMenu = document.getElementById("site-menu")
const menuLinks = [...siteMenu.querySelectorAll("[data-page]")]
let menuOpen = false

let menuCloseTimer = 0
function setMenu(open) {
  if (open === menuOpen) return
  clearTimeout(menuCloseTimer)
  siteMenu.classList.remove("is-closing")
  if (!open) {
    siteMenu.classList.add("is-closing")
    menuCloseTimer = setTimeout(() => siteMenu.classList.remove("is-closing"), 700)
  }
  menuOpen = open
  menuToggle.classList.toggle("is-open", open)
  siteMenu.classList.toggle("is-open", open)
  document.documentElement.classList.toggle("menu-open", open)
  siteMenu.inert = !open
  siteMenu.setAttribute("aria-hidden", String(!open))
  menuToggle.setAttribute("aria-expanded", String(open))
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu")
  if (open) setTimeout(() => menuOpen && menuLinks[0].focus({ preventScroll: true }), 450)
  else if (siteMenu.contains(document.activeElement)) menuToggle.focus({ preventScroll: true })
}

// Mark the page you're on with a green dot
function updateMenuCurrent() {
  for (const link of menuLinks) {
    const target = link.dataset.page === "home" ? homePage : subPages[link.dataset.page]
    link.classList.toggle("is-current", target === currentPage)
  }
}

menuToggle.addEventListener("click", () => setMenu(!menuOpen))

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuOpen) setMenu(false)
})

// Close the menu first, then go to the link (so the two animations don't clash)
siteMenu.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]')
  if (!link) return
  event.preventDefault()
  setMenu(false)
  const hash = link.getAttribute("href")
  setTimeout(() => {
    if (window.location.hash === hash) showPage()
    else window.location.hash = hash
  }, 420)
})


// About values: wrap each title line so it can slide up from behind a mask
document.querySelectorAll(".value h3").forEach((title) => {
  const lines = title.innerHTML.split(/<br\s*\/?>/i)
  title.innerHTML = lines
    .map((line, i) => `<span class="v-line"><span style="--li:${i}">${line.trim()}</span></span>`)
    .join("")
})

// Copyright year always shows the current year
document.querySelectorAll(".js-year").forEach((node) => {
  node.textContent = new Date().getFullYear()
})


// ---------- Live liquid-glow spheres (home hero) ----------
// Replaces the old static sphere image. Two independent spheres are drawn every
// frame in a WebGL shader: organic wobbling outline, glossy fake-3D lighting,
// swirling violet/magenta/pink/red light inside, dark purple shadows, soft glow.
// Moving the cursor near one stretches it toward the cursor and ripples it like liquid.
;(() => {
  const canvas = document.querySelector(".orb-canvas")
  if (!canvas) return

  const IMG_ASPECT = 2000 / 1455 // footprint of the old image, so positions match
  // centres/radii in "image space" (x: 0..IMG_ASPECT, y: 0..1, y downward)
  const SPHERES = [
    { c: [0.423 * IMG_ASPECT, 0.652], r: 0.168, fx: 0.43, fy: 0.31, ax: 0.016, ay: 0.022, ph: 0.0 }, // violet / hot pink
    { c: [0.585 * IMG_ASPECT, 0.344], r: 0.16, fx: 0.29, fy: 0.47, ax: 0.020, ay: 0.016, ph: 2.1 }, // red / magenta
  ]

  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false })
  if (!gl) return // very old browsers: the hero simply shows no spheres

  const vert = `
    attribute vec2 aPos;
    void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

  const frag = `
    precision highp float;
    uniform vec2 uRes;
    uniform float uTime;
    uniform float uScale;
    uniform vec2 uMouse;
    uniform vec2 uHover;
    uniform vec2 uC0;
    uniform vec2 uC1;
    uniform vec2 uR;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(17.3, 9.1); a *= 0.5; }
      return v;
    }

    vec4 sphere(vec2 q, vec2 c, float R, float t, float spin, float seed, float hover, vec2 tint) {
      vec2 p = q - c;

      // magnetic stretch toward the cursor
      vec2 toM = uMouse - c;
      float lm = length(toM);
      vec2 dirM = toM / max(lm, 1e-4);
      float pull = hover * 0.42 * R * smoothstep(3.2 * R, 0.25 * R, lm);
      float side = smoothstep(-R, R, dot(p, dirM));
      p -= dirM * pull * side * side;

      // liquid ripple spreading from the cursor
      float dm = length(p - toM * 0.75);
      float ripple = hover * sin(dm * 48.0 - t * 7.0) * exp(-dm * 7.0);

      // organic, slowly deforming outline
      float a = atan(p.y, p.x);
      float n = noise(vec2(a * 1.4 + seed, t * 0.35 * spin)) - 0.5;
      float r = R * (1.0
        + 0.055 * sin(3.0 * a + t * 0.6 * spin + seed)
        + 0.035 * sin(5.0 * a - t * 0.85 + seed * 2.0)
        + 0.09 * n
        + 0.045 * ripple);
      float len = length(p);
      float d = len - r;

      // fake 3D surface for glossy lighting
      float k = clamp(len / r, 0.0, 1.0);
      float z = sqrt(max(0.0, 1.0 - k * k));
      vec3 nrm = normalize(vec3(p / r, z + 1e-4));

      // swirling internal light, rotating at this sphere's own speed
      float ang = t * 0.32 * spin;
      mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
      vec2 sp = rot * (p / R);
      vec2 flow = hover * 0.5 * vec2(sin(t * 3.1 + dm * 14.0), cos(t * 2.7 + dm * 11.0));
      float f = fbm(sp * 1.5 + nrm.xy * 0.9 + vec2(seed, t * 0.12) + flow);
      float g = fbm(sp * 2.3 - vec2(t * 0.09, seed) - flow * 0.6);

      vec3 deepViolet = vec3(0.20, 0.03, 0.52);
      vec3 electric   = vec3(0.56, 0.16, 1.00);
      vec3 magenta    = vec3(0.96, 0.07, 0.62);
      vec3 hotPink    = vec3(1.00, 0.36, 0.70);
      vec3 red        = vec3(0.95, 0.04, 0.10);
      vec3 shadow     = vec3(0.05, 0.00, 0.10);

      vec3 col = mix(deepViolet, electric, smoothstep(0.25, 0.75, f));
      col = mix(col, magenta, smoothstep(0.42, 0.78, g) * tint.x);
      col = mix(col, red, smoothstep(0.30, 0.62, f * g * 1.7) * tint.y);
      col = mix(col, hotPink, smoothstep(0.62, 0.92, g) * 0.55);
      col = mix(col, mix(magenta, red, tint.y), 0.28 * tint.y);

      // soft volumetric lighting: lit from the lower right, deep purple shadow upper left
      vec3 L = normalize(vec3(0.5, 0.62, 0.62));
      float diff = clamp(dot(nrm, L), 0.0, 1.0);
      vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
      float nh = clamp(dot(nrm, H), 0.0, 1.0);
      float fres = pow(1.0 - z, 2.4);
      vec3 lit = mix(shadow, col, 0.08 + 1.05 * diff);
      // soft glossy sheen (no hard white dot)
      lit += hotPink * pow(nh, 18.0) * 0.32;
      // glowing crescent along the lit edge, like light passing through liquid
      vec3 rimCol = mix(mix(magenta, red, tint.y * 0.8), hotPink, 0.3 + 0.3 * sin(a * 3.0 + t * 0.6 * spin));
      lit += rimCol * pow(fres, 1.3) * (0.35 + 1.35 * diff);
      lit += electric * pow(fres, 3.0) * 0.45;
      float occl = smoothstep(-0.65, 0.9, dot(p / max(len, 1e-4), normalize(vec2(0.62, 0.78))));
      lit *= mix(0.16, 1.18, occl);

      float body = 1.0 - smoothstep(-0.22 * R, 0.12 * R, d);
      float glow = exp(-max(d + 0.05 * R, 0.0) / (R * 0.42)) * 0.55 * (0.75 + 0.25 * sin(t * 0.9 * spin + seed));
      vec3 glowCol = mix(electric, magenta, 0.45 + 0.35 * sin(a * 2.0 - t * 0.5 * spin)) * 0.85;

      vec3 rgb = lit * body + glowCol * glow * (1.0 - body);
      float alpha = clamp(body + glow * (1.0 - body) * 0.85, 0.0, 1.0);
      return vec4(rgb, alpha);
    }

    void main() {
      // map the pixel into the old image's coordinate space ("contain", optionally enlarged)
      vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
      float imgA = ${IMG_ASPECT.toFixed(5)};
      float fit = min(uRes.x / imgA, uRes.y) * uScale;
      vec2 off = (uRes - vec2(fit * imgA, fit)) * 0.5;
      vec2 q = (px - off) / fit;

      vec4 s1 = sphere(q, uC1, uR.y, uTime, 0.8, 7.3, uHover.y, vec2(0.75, 1.0));  // red / magenta
      vec4 s0 = sphere(q, uC0, uR.x, uTime, 1.25, 2.1, uHover.x, vec2(1.0, 0.35)); // violet / hot pink
      vec4 col = s0 + s1 * (1.0 - s0.a);
      gl_FragColor = col;
    }`

  function compile(type, src) {
    const sh = gl.createShader(type)
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh))
    return sh
  }
  const prog = gl.createProgram()
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert))
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag))
  gl.linkProgram(prog)
  gl.useProgram(prog)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(prog, "aPos")
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  const U = {}
  for (const name of ["uRes", "uTime", "uScale", "uMouse", "uHover", "uC0", "uC1", "uR"]) U[name] = gl.getUniformLocation(prog, name)
  gl.uniform2f(U.uR, SPHERES[0].r, SPHERES[1].r)

  // size the drawing buffer to the canvas (capped pixel ratio for performance)
  let scale = 1
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const w = Math.round(canvas.clientWidth * dpr)
    const h = Math.round(canvas.clientHeight * dpr)
    if (w && h && (canvas.width !== w || canvas.height !== h)) {
      canvas.width = w
      canvas.height = h
    }
    scale = window.matchMedia("(max-width: 600px)").matches ? 1.5 : 1
  }
  new ResizeObserver(resize).observe(canvas)

  // pixel -> image space (same mapping as the shader)
  function toImageSpace(clientX, clientY) {
    const box = canvas.getBoundingClientRect()
    const fit = Math.min(box.width / IMG_ASPECT, box.height) * scale
    const offX = (box.width - fit * IMG_ASPECT) / 2
    const offY = (box.height - fit) / 2
    return [(clientX - box.left - offX) / fit, (clientY - box.top - offY) / fit]
  }

  // cursor (smoothed) and per-sphere hover strength (eases in/out)
  const target = [-9, -9]
  const mouse = [-9, -9]
  const hover = [0, 0]
  window.addEventListener("pointermove", (e) => {
    const m = toImageSpace(e.clientX, e.clientY)
    target[0] = m[0]
    target[1] = m[1]
  }, { passive: true })
  document.addEventListener("pointerleave", () => { target[0] = target[1] = -9 })

  function centre(i, t) {
    const s = SPHERES[i]
    return [s.c[0] + Math.sin(t * s.fx + s.ph) * s.ax, s.c[1] + Math.cos(t * s.fy + s.ph * 0.7) * s.ay]
  }

  // only animate while the hero is on screen and the tab is visible
  let onScreen = true
  new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting }).observe(canvas)

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const start = performance.now()
  let last = start
  let clock = 0
  function frame(now) {
    requestAnimationFrame(frame)
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    if (!onScreen || document.hidden || !canvas.clientWidth) return
    if (!reduce) clock += dt

    // ease the cursor and the hover strength so shapes stretch and relax smoothly
    mouse[0] += (target[0] - mouse[0]) * 0.14
    mouse[1] += (target[1] - mouse[1]) * 0.14
    const c0 = centre(0, clock)
    const c1 = centre(1, clock)
    ;[c0, c1].forEach((c, i) => {
      const dist = Math.hypot(target[0] - c[0], target[1] - c[1])
      const want = dist < SPHERES[i].r * 1.9 ? 1 : 0
      hover[i] += (want - hover[i]) * (want ? 0.08 : 0.04)
    })

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform2f(U.uRes, canvas.width, canvas.height)
    gl.uniform1f(U.uTime, clock)
    gl.uniform1f(U.uScale, scale)
    gl.uniform2f(U.uMouse, mouse[0], mouse[1])
    gl.uniform2f(U.uHover, hover[0], hover[1])
    gl.uniform2f(U.uC0, c0[0], c0[1])
    gl.uniform2f(U.uC1, c1[0], c1[1])
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }
  resize()
  requestAnimationFrame(frame)
})()

// ---------- Init ----------
renderProjects()
renderServices()
splitWords()
autoTagReveals()
setupReveal()

// Hide any image that fails to load instead of showing a broken icon.
document.querySelectorAll("img").forEach((img) => {
  const hide = () => (img.style.visibility = "hidden")
  if (img.complete && img.naturalWidth === 0) hide()
  else img.addEventListener("error", hide, { once: true })
})

window.addEventListener("hashchange", showPage)
window.addEventListener("scroll", onScroll, { passive: true })
window.addEventListener("resize", () => {
  measureParallax()
  onScroll()
})
// Re-measure once images have loaded and the layout has settled.
window.addEventListener("load", measureParallax)

showPage()
updateHeader()

// Home page always opens at the very top with the big logo in its starting position
function resetHomeToTop() {
  if (!landingOnHomeNow()) return
  const html = document.documentElement
  html.style.scrollBehavior = "auto"
  window.scrollTo(0, 0)
  html.style.scrollBehavior = ""
  updateHeader()
  measureParallax()
}

function landingOnHomeNow() {
  return !window.location.hash || window.location.hash === "#top"
}

resetHomeToTop()
window.addEventListener("load", resetHomeToTop)
// coming back via the browser's back/forward cache
window.addEventListener("pageshow", (event) => {
  if (event.persisted) resetHomeToTop()
})

// ---------- First load ----------
const intro = document.getElementById("intro")
const landingOnHome = !window.location.hash || window.location.hash === "#top"

// Home page, first visit: the logo writes itself in the middle of the screen,
// then grows and flies to the big header logo while the hero slides in.
async function runIntro() {
  const html = document.documentElement
  html.classList.add("intro-running")
  curtain.className = "page-curtain" // the panel is not used for this
  resetHomeToTop()

  await Promise.all([Promise.race([document.fonts.ready, wait(1500)]), wait(1950)]) // writing time

  // Fly the intro logo to the real header logo by animating its actual size and
  // position (not a scale transform), so the vector logo is redrawn crisp every frame
  const logo = intro.querySelector(".intro-logo")
  resetHomeToTop() // make sure the header logo is in its starting place before measuring
  const to = document.querySelector(".header-mark img").getBoundingClientRect()
  logo.style.transition = [
    "left 1100ms cubic-bezier(0.7, 0, 0.2, 1)",
    "top 1100ms cubic-bezier(0.7, 0, 0.2, 1)",
    "width 1100ms cubic-bezier(0.7, 0, 0.2, 1)",
  ].join(", ")
  logo.style.left = `${to.left + to.width / 2}px`
  logo.style.top = `${to.top + to.height / 2}px`
  logo.style.width = `${to.width}px`
  intro.classList.add("is-moving")

  await wait(1120)
  // hand over to the real logo (same place, same size: swap instantly), then the hero slides in
  html.classList.add("intro-handover")
  html.classList.remove("intro-running")
  html.classList.add("intro-done")
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  intro.remove()
  html.classList.remove("intro-handover")
  playEntrance()
}

if (intro && landingOnHome && !reduceMotion) {
  runIntro()
} else {
  intro?.remove()
  // Other pages / deep links: lift the curtain once fonts are ready
  Promise.all([Promise.race([document.fonts.ready, wait(1200)]), wait(1350)]).then(async () => {
    curtain.className = "page-curtain is-leaving"
    if (!reduceMotion) playEntrance()
    await wait(750)
    curtain.className = "page-curtain"
  })
}
