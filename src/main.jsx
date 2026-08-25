import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ScrollStack, { ScrollStackItem } from "./components/ScrollStack/ScrollStack.jsx";
import AccordionGallery from "./components/AccordionGallery/AccordionGallery.jsx";
import { LogoLoop } from "./components/LogoLoop/LogoLoop.jsx";
import DocSlider from "./components/DocSlider/DocSlider.jsx";

import "./index.css";

/* Each island reads its data from a <script type="application/json"> sibling,
   so the HTML pages stay the source of truth for copy. */
function dataFor(el) {
  const tag = el.querySelector('script[type="application/json"]');
  if (!tag) return null;
  try {
    return JSON.parse(tag.textContent);
  } catch (e) {
    console.error("[island] bad JSON payload", el.dataset.react, e);
    return null;
  }
}

const ISLANDS = {
  /* ---- Our Patient-centred Process ---- */
  scrollstack(el, data) {
    const steps = (data && data.steps) || [];
    return (
      <ScrollStack
        useWindowScroll
        className="pca-scrollstack"
        itemDistance={90}
        itemStackDistance={26}
        baseScale={0.88}
        stackPosition="22%"
      >
        {steps.map((s, i) => (
          <ScrollStackItem key={i} itemClassName="pca-ss-card">
            <span className="pca-ss-num">{String(i + 1).padStart(2, "0")}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    );
  },

  /* ---- Latest Wellness Insights / Resources ---- */
  accordiongallery(el, data) {
    /* AccordionGallery reads item.label / item.link / item.image */
    const items = ((data && data.items) || []).map((p) => ({
      image: p.image,
      label: p.title,
      link: p.href,
      alt: p.title,
    }));
    return (
      <AccordionGallery
        items={items}
        height={440}
        accentColor="#F27E33"
        overlayColor="#1E4035"
        textColor="#FFFAEE"
        radius={20}
        grayscale={false}
        trigger="hover"
      />
    );
  },

  /* ---- hero rotating credibility strip ---- */
  logoloop(el, data) {
    const logos = ((data && data.items) || []).map((t) => ({
      node: <span className="pca-loop-item">{t}</span>,
      title: t,
      ariaLabel: t,
    }));
    return (
      <LogoLoop
        logos={logos}
        speed={70}
        direction="left"
        logoHeight={26}
        gap={44}
        pauseOnHover
        fadeOut
        fadeOutColor="#FFFAEE"
        ariaLabel="Why patients choose Pain Clinic Australia"
      />
    );
  },

  /* ---- doctor slider ---- */
  carousel(el, data) {
    return <DocSlider items={(data && data.items) || []} autoplayDelay={5000} />;
  },
};

function mountAll() {
  document.querySelectorAll("[data-react]").forEach((el) => {
    const kind = (el.dataset.react || "").toLowerCase();
    const make = ISLANDS[kind];
    if (!make) {
      console.warn("[island] unknown component:", kind);
      return;
    }
    const data = dataFor(el);
    const host = document.createElement("div");
    host.className = "pca-island-root";
    el.replaceChildren(host);
    try {
      createRoot(host).render(<StrictMode>{make(el, data)}</StrictMode>);
      el.setAttribute("data-react-mounted", "true");
    } catch (e) {
      console.error("[island] failed to mount", kind, e);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountAll);
} else {
  mountAll();
}
