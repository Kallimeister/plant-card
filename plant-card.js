// Visible load hint:
console.log("✅ plant-card.js V1.0.0 loaded");

/* ========== small helpers ========== */
// Escape HTML to avoid accidental injection in labels/values.
function esc(s) {
  return String(s).replace(/[&<>"']/g, (m) => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]
  ));
}

// Detect UI language (HA locale first, fallback to browser).
function detectLang(hass) {
  const lang = (hass?.locale?.language || navigator.language || "en").toLowerCase();
  return lang.startsWith("de") ? "de" : "en";
}

/* ========== i18n strings ========== */
const STRINGS = {
  en: {
    title_default: "Plant Dashboard",
    header_moisture: "Moisture",
    header_temperature: "Temperature",
    header_light: "Light",
    header_conductivity: "Conductivity",
    header_battery: "Battery",

    header_title_label: "Title",
    header_show_header: "Show legend",
    header_icon_colors: "Icon colors by metric",
    color_section_toggle_show: "Show symbol color pickers",
    color_section_toggle_hide: "Hide symbol color pickers",
    color_moisture: "Moisture icon color",
    color_temperature: "Temperature icon color",
    color_illuminance: "Illuminance icon color",
    color_conductivity: "Conductivity icon color",
    color_battery: "Battery icon color",
    color_hint: "You can paste any valid CSS color (e.g., #5a7dbf or rgb(90,125,191)).",

    details_expand_all: "Expand all details",
    details_collapse_all: "Collapse all details",

    plant_label: "Plant",
    device_label: "Device selection",
    btn_evaluate: "Evaluate device & fill sensors",
    name_label: "Name",
    location_label: "Location / Description",

    sensor_moisture: "Moisture entity",
    sensor_temp: "Temperature entity",
    sensor_light: "Illuminance entity",
    sensor_cond: "Conductivity entity",
    sensor_batt: "Battery entity",

    min_moisture: "Min moisture (%)",
    max_moisture: "Max moisture (%)",
    min_temp: "Min temperature (°C)",
    max_temp: "Max temperature (°C)",
    min_light: "Min illuminance (lx)",
    max_light: "Max illuminance (lx)",
    min_cond: "Min conductivity (µS/cm)",
    max_cond: "Max conductivity (µS/cm)",
    min_batt: "Min battery (%)",

    image_show_global: "Show images for all plants",
    image_path_label: "Plant image path",
    image_supported: "Supported: .jpg, .jpeg, .png, .webp, .gif",
    image_toggle_one: "Show image for this plant",
    image_section_title: "Plant image",

    toggle_details_title: { expand: "Expand details", collapse: "Collapse details" },
    add_plant: "+ Add plant",
    remove_last: "- Remove last plant",
    move_up: "Move up",
    move_down: "Move down",
    move_top: "Move to top",
    move_bottom: "Move to bottom",

    thresholds: {
      moisture: "Moisture thresholds",
      temp: "Temperature thresholds",
      light: "Illuminance thresholds",
      cond: "Conductivity thresholds",
      batt: "Battery threshold"
    }
  },
  de: {
    title_default: "Pflanzenkarte",
    header_moisture: "Feuchtigkeit",
    header_temperature: "Temperatur",
    header_light: "Helligkeit",
    header_conductivity: "Leitfähigkeit",
    header_battery: "Batterie",

    header_title_label: "Titel",
    header_show_header: "Zeige Legende",
    header_icon_colors: "Symbolfarben je Messart",
    color_section_toggle_show: "Farbwahl Symbole einblenden",
    color_section_toggle_hide: "Farbwahl Symbole ausblenden",
    color_moisture: "Symbolfarbe Feuchtigkeit",
    color_temperature: "Symbolfarbe Temperatur",
    color_illuminance: "Symbolfarbe Helligkeit",
    color_conductivity: "Symbolfarbe Leitfähigkeit",
    color_battery: "Symbolfarbe Batterie",
    color_hint: "Du kannst jede gültige CSS-Farbe einfügen (z. B. #5a7dbf oder rgb(90,125,191)).",

    details_expand_all: "Alle Details ausklappen",
    details_collapse_all: "Alle Details einklappen",

    plant_label: "Pflanze",
    device_label: "Geräteauswahl",
    btn_evaluate: "Gerät auswerten & Sensoren füllen",
    name_label: "Name",
    location_label: "Standort / Beschreibung",

    sensor_moisture: "Feuchtigkeitsentität",
    sensor_temp: "Temperaturentität",
    sensor_light: "Helligkeitsentität",
    sensor_cond: "Leitfähigkeitsentität",
    sensor_batt: "Batterieentität",

    min_moisture: "Min. Feuchtigkeit (%)",
    max_moisture: "Max. Feuchtigkeit (%)",
    min_temp: "Min. Temperatur (°C)",
    max_temp: "Max. Temperatur (°C)",
    min_light: "Min. Helligkeit (lx)",
    max_light: "Max. Helligkeit (lx)",
    min_cond: "Min. Leitfähigkeit (µS/cm)",
    max_cond: "Max. Leitfähigkeit (µS/cm)",
    min_batt: "Min. Batterie (%)",

    image_show_global: "Bilder für alle Pflanzen anzeigen",
    image_path_label: "Pfad zum Pflanzenbild",
    image_supported: "Unterstützt: .jpg, .jpeg, .png, .webp, .gif",
    image_toggle_one: "Bild für diese Pflanze anzeigen",
    image_section_title: "Pflanzenbild",

    toggle_details_title: { expand: "Details ausklappen", collapse: "Details einklappen" },
    add_plant: "+ Pflanze hinzufügen",
    remove_last: "- Letzte Pflanze entfernen",
    move_up: "Nach oben",
    move_down: "Nach unten",
    move_top: "Nach ganz oben",
    move_bottom: "Nach ganz unten",

    thresholds: {
      moisture: "Grenzwerte Feuchtigkeit",
      temp: "Grenzwerte Temperatur",
      light: "Grenzwerte Helligkeit",
      cond: "Grenzwerte Leitfähigkeit",
      batt: "Grenzwert Batterie"
    }
  }
};
function t(hass, key) {
  const L = detectLang(hass);
  return STRINGS[L][key] ?? STRINGS.en[key] ?? key;
}
function tPath(hass, path, fallbackKey) {
  const L = detectLang(hass);
  const get = (obj, p) => p.split(".").reduce((o,k)=>o&&o[k], obj);
  return get(STRINGS[L], path) ?? get(STRINGS.en, path) ?? fallbackKey ?? path;
}

/* ========== Display card ========== */
class PlantCard extends HTMLElement {
  static getConfigElement() { return document.createElement("plant-card-editor"); }
  static getStubConfig(hass) {
    return {
      title: t(hass, "title_default"),
      show_header: true,
      show_images: true,
      icon_colors: {
        moisture: "#5a7dbf",
        temperature: "#5a7dbf",
        illuminance: "#5a7dbf",
        conductivity: "#5a7dbf",
        battery: "#5a7dbf",
      },
      plants: [{
        name: "Plant 1",
        location: "",
        device_id: "",
        image_path: "",
        show_image: true,

        moisture_entity: "",
        temp_entity: "",
        light_entity: "",
        conductivity_entity: "",
        battery_entity: "",

        min_moisture: 20, max_moisture: 60,
        min_temp: 15,    max_temp: 30,
        min_light: 1000, max_light: 30000,
        min_conductivity: 350, max_conductivity: 2000,
        min_battery: 10
      }]
    };
  }

  setConfig(config) { this._config = config; }
  set hass(hass) { this._hass = hass; this._safeRender(); }

  /* Safe render wrapper so a broken render won't kill the card */
  _safeRender() {
    try { this._render(); }
    catch (e) {
      console.error("❌ plant-card render error:", e);
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <ha-card header="${esc(t(this._hass,"title_default"))} (Error)">
          <div style="padding:12px;">Render error – see browser console.</div>
        </ha-card>`;
    }
  }

  /* Icon map for metrics */
  _icon(kind) {
    const map = {
      moisture: "mdi:water-percent",
      temperature: "mdi:thermometer",
      illuminance: "mdi:white-balance-sunny",
      conductivity: "mdi:leaf",
      battery: "mdi:battery"
    };
    return map[kind] || "mdi:checkbox-blank-circle-outline";
  }

  /* Number formatting in user locale */
  _fmtNumber(val, maxFrac = 1) {
    const n = Number(val);
    if (!Number.isFinite(n)) return null;
    const locale = this._hass?.locale?.language || navigator.language || "en-US";
    try {
      return new Intl.NumberFormat(locale, { maximumFractionDigits: maxFrac }).format(n);
    } catch {
      return String(n);
    }
  }

  /* Header legend with metric titles & icons */
  _headerSection() {
    const H = this._hass;
    return `
      <div class="hdr5">
        <div>${esc(t(H,"header_moisture"))}</div>
        <div>${esc(t(H,"header_temperature"))}</div>
        <div>${esc(t(H,"header_light"))}</div>
        <div>${esc(t(H,"header_conductivity"))}</div>
        <div>${esc(t(H,"header_battery"))}</div>
      </div>
      <div class="icons5" style="margin-bottom: 4px;">
        <div class="ico moisture"><ha-icon icon="${this._icon('moisture')}"></ha-icon></div>
        <div class="ico temperature"><ha-icon icon="${this._icon('temperature')}"></ha-icon></div>
        <div class="ico illuminance"><ha-icon icon="${this._icon('illuminance')}"></ha-icon></div>
        <div class="ico conductivity"><ha-icon icon="${this._icon('conductivity')}"></ha-icon></div>
        <div class="ico battery"><ha-icon icon="${this._icon('battery')}"></ha-icon></div>
      </div>
    `;
  }

  /* Open a simple lightbox (appended to <body> to survive card re-renders) */
  _openImage(url) {
    // Container
    const box = document.createElement("div");
    box.className = "pc-lightbox";
    box.addEventListener("click", () => box.remove());

    // Inline styles for the overlay to avoid Shadow DOM scoping issues
    const style = document.createElement("style");
    style.textContent = `
      .pc-lightbox {
        position: fixed; inset: 0;
        background: rgba(0,0,0,.75);
        display: flex; align-items: center; justify-content: center;
        z-index: 99999;
      }
      .pc-lightbox__img {
        max-width: 90vw; max-height: 90vh;
        border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.35);
      }
      .pc-lightbox__close {
        position: absolute; top: 12px; right: 12px;
        background: rgba(0,0,0,.6); color: #fff;
        border: 0; border-radius: 6px; padding: 6px 10px; cursor: pointer;
        font-size: 18px;
      }
    `;

    const img = document.createElement("img");
    img.className = "pc-lightbox__img";
    img.src = url;

    const close = document.createElement("button");
    close.className = "pc-lightbox__close";
    close.textContent = "×";
    close.title = "Close";
    close.addEventListener("click", (e) => { e.stopPropagation(); box.remove(); });

    box.append(style, img, close);
    document.body.appendChild(box);
  }

  /* Main renderer: layout + event delegation for clicks */
  _render() {
    if (!this._hass || !this._config) return;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });

    // Resolve colors from config (with theme fallbacks).
    const colors = {
      moisture: this._config.icon_colors?.moisture || "#5a7dbf",
      temperature: this._config.icon_colors?.temperature || "#5a7dbf",
      illuminance: this._config.icon_colors?.illuminance || "#5a7dbf",
      conductivity: this._config.icon_colors?.conductivity || "#5a7dbf",
      battery: this._config.icon_colors?.battery || "#5a7dbf",
    };

    // Show image column only if at least one visible plant has an image.
    const anyThumb = (this._config.show_images !== false) &&
      (this._config.plants || []).some(p => (p.show_image !== false) && !!p.image_path);

    const style = `
      <style>
        :host {
          --icon-moisture: var(--plant-icon-moisture, ${colors.moisture});
          --icon-temperature: var(--plant-icon-temperature, ${colors.temperature});
          --icon-illuminance: var(--plant-icon-illuminance, ${colors.illuminance});
          --icon-conductivity: var(--plant-icon-conductivity, ${colors.conductivity});
          --icon-battery: var(--plant-icon-battery, ${colors.battery});
          --thumb-size: 84px; /* stable square thumbnail height/width */
        }
        .wrap { padding:4px 12px 10px; color:var(--primary-text-color); box-sizing:border-box; }
        .plant { padding:8px 0; border-bottom:1px solid var(--divider-color,#e0e0e0); }
        .plant:last-child { border-bottom:0; }

        .title-row { display:flex; align-items:baseline; gap:8px; margin-bottom:4px; }
        .title-row .name { font-weight:600; margin:0; }
        .title-row .loc { margin-left:auto; font-size:.9em; color:var(--secondary-text-color); opacity:.9; }

        /* legend rows */
        .hdr5 { display:grid; grid-template-columns: repeat(5, minmax(0,1fr));
                gap:0 8px; text-align:center; align-items:end; font-weight:600; opacity:.85; margin-bottom:2px; }
        .hdr5 > div { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .icons5 { display:grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap:2px 8px; text-align:center; }
        .icons5 ha-icon { --mdc-icon-size:22px; }
        .icons5 .ico.moisture ha-icon { color: var(--icon-moisture); }
        .icons5 .ico.temperature ha-icon { color: var(--icon-temperature); }
        .icons5 .ico.illuminance ha-icon { color: var(--icon-illuminance); }
        .icons5 .ico.conductivity ha-icon { color: var(--icon-conductivity); }
        .icons5 .ico.battery ha-icon { color: var(--icon-battery); }

        /* layout: optional thumbnail column */
        .row2.with-thumb { display:grid; grid-template-columns: var(--thumb-size) 1fr; gap: 8px; align-items: stretch; }
        .row2.no-thumb { display:block; }

        /* fixed square preview that spans the full metric block height */
        .thumb {
          width: var(--thumb-size);
          height: var(--thumb-size);
          border-radius: 8px;
          background-size: cover;
          background-position: center;
          background-color: transparent;
          cursor: pointer;
        }
        .thumb.thumb--empty {
          background: none;
          cursor: default;
        }

        /* metrics block (icons + values) */
        .metrics { display: grid; gap: 4px; }
        .row2.with-thumb .metrics { min-height: var(--thumb-size); }
        .row2.no-thumb .metrics { min-height: auto; }

        .vals5 { display:grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap:2px 8px; text-align:center; }
        .vals5 .val { display:flex; flex-direction:column; align-items:center; gap:2px; cursor: pointer; }
        .vals5 .num { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .vals5 .unit { font-size:.85em; color: var(--secondary-text-color); opacity:.9; line-height:1; }
        .val.bad .num { color: var(--error-color,#d32f2f); font-weight:600; } /* keep V35 behavior */
        /* no special color for warn on the number itself; only the chevrons are colored */

        /* chevron indicators under the number */
        .chev { display:flex; gap:2px; align-items:center; height:16px; }
        .chev ha-icon { --mdc-icon-size:16px; }
        .chev.warn ha-icon { color: var(--warning-color, #f0ad4e); }
        .chev.severe ha-icon { color: var(--error-color, #d32f2f); }
      </style>
    `;

    // Build all plant rows
    const rows = (this._config.plants || []).map((p) => this._renderPlant(p, anyThumb)).join("");
    const showHeader = this._config.show_header !== false;
    const title = this._config.title || t(this._hass,"title_default");

    // Render DOM
    this.shadowRoot.innerHTML = `
      ${style}
      <ha-card header="${esc(title)}">
        <div class="wrap" id="wrap">
          ${showHeader ? this._headerSection() : ""}
          ${rows}
        </div>
      </ha-card>
    `;

    // Event delegation: click on a metric value -> open more-info dialog
    this.shadowRoot.getElementById("wrap")?.addEventListener("click", (ev) => {
      const target = ev.composedPath().find(el => el?.classList?.contains?.("val"));
      if (!target) return;
      const eid = target.getAttribute("data-entity");
      if (!eid) return;
      this.shadowRoot.querySelector("ha-card")?.dispatchEvent(new CustomEvent("hass-more-info", {
        bubbles: true, composed: true, detail: { entityId: eid }
      }));
    }, { passive: true });

    // Event delegation: click on thumbnail -> open lightbox
    this.shadowRoot.getElementById("wrap")?.addEventListener("click", (ev) => {
      const el = ev.composedPath().find(n => n?.classList?.contains?.("thumb"));
      if (!el || el.classList.contains("thumb--empty")) return;
      const url = el.getAttribute("data-image");
      if (!url) return;
      this._openImage(url);
    }, { passive: true });
  }

  /* Build a single plant row (metrics + optional thumbnail) */
  _renderPlant(p, anyThumb) {
    const get = (eid) => (eid && this._hass.states[eid]) ? this._hass.states[eid] : undefined;
    const s   = (eid) => get(eid)?.state ?? "—";
    const u   = (eid, fb) => get(eid)?.attributes?.unit_of_measurement ?? fb;

    // Current values
    const vMoist = s(p.moisture_entity);
    const vTemp  = s(p.temp_entity);
    const vLight = s(p.light_entity);
    const vCond  = s(p.conductivity_entity);
    const vBatt  = s(p.battery_entity);

    // Units (fallbacks)
    const uMoist = u(p.moisture_entity, "%");
    const uTemp  = u(p.temp_entity, "°C");
    const uLight = u(p.light_entity, "lx");
    const uCond  = u(p.conductivity_entity, "µS/cm");
    const uBatt  = u(p.battery_entity, "%");

    // Helper: is value outside [min,max]?
    const outOf = (val, min, max) => {
      const n = Number(val);
      if (!Number.isFinite(n)) return false;
      if (typeof min === "number" && n < min) return true;
      if (typeof max === "number" && n > max) return true;
      return false;
    };

    // Keep V35 number formatting behavior
    const fmtNum = (val, unit) => {
      const maxFrac = unit && unit.includes("°") ? 1 : 0;
      const f = this._fmtNumber(val, maxFrac);
      return f ?? null;
    };

    // Number coloring (unchanged): red when out of range
    const moistBad = outOf(vMoist, p.min_moisture, p.max_moisture);
    const tempBad  = outOf(vTemp,  p.min_temp,     p.max_temp);
    const lightBad = outOf(vLight, p.min_light,    p.max_light);
    const condBad  = outOf(vCond,  p.min_conductivity, p.max_conductivity);

    // Battery "bad" still compares to configured min_battery for number coloring
    const minBatt = (typeof p.min_battery === "number") ? p.min_battery : 10;
    const battBad = outOf(vBatt,  minBatt, null);

    // Chevron indicator logic:
    // - For moisture/temp/light/conductivity: base on span = max - min.
    //   Single chevron (yellow): from 5% before boundary (inside range) up to 10% outside.
    //   Double chevron (red): beyond 10% outside.
    // - For battery: yellow at <=20%, red at <=10% (independent of min_battery).
    const chevronsForSpan = (val, min, max) => {
      const n = Number(val);
      if (!Number.isFinite(n) || typeof min !== "number" || typeof max !== "number") return "";
      const span = Math.abs(max - min);
      if (span <= 0) return "";
      const warnInside = 0.05 * span; // 5% inside band
      const warnOutside = 0.10 * span; // 10% outside band

      if (n < min) {
        const d = min - n;
        if (d <= warnOutside) {
          // slight undershoot → single down (yellow)
          return `<div class="chev warn" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></div>`;
        }
        // strong undershoot → double down (red)
        return `<div class="chev severe" aria-hidden="true"><ha-icon icon="mdi:chevron-double-down"></ha-icon></div>`;
      }

      if (n > max) {
        const d = n - max;
        if (d <= warnOutside) {
          // slight overshoot → single up (yellow)
          return `<div class="chev warn" aria-hidden="true"><ha-icon icon="mdi:chevron-up"></ha-icon></div>`;
        }
        // strong overshoot → double up (red)
        return `<div class="chev severe" aria-hidden="true"><ha-icon icon="mdi:chevron-double-up"></ha-icon></div>`;
      }

      // Inside range but close to a boundary (within 5% band) → single towards that boundary
      if (n <= min + warnInside) {
        return `<div class="chev warn" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></div>`;
      }
      if (n >= max - warnInside) {
        return `<div class="chev warn" aria-hidden="true"><ha-icon icon="mdi:chevron-up"></ha-icon></div>`;
      }
      return "";
    };

    const chevronsForBattery = (val) => {
      const n = Number(val);
      if (!Number.isFinite(n)) return "";
      if (n <= 10) {
        return `<div class="chev severe" aria-hidden="true"><ha-icon icon="mdi:chevron-double-down"></ha-icon></div>`;
      }
      if (n <= 20) {
        return `<div class="chev warn" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></div>`;
      }
      return "";
    };

    // Build legend icon row (unchanged)
    const iconRow = `
      <div class="icons5">
        <div class="ico moisture"><ha-icon icon="${this._icon('moisture')}"></ha-icon></div>
        <div class="ico temperature"><ha-icon icon="${this._icon('temperature')}"></ha-icon></div>
        <div class="ico illuminance"><ha-icon icon="${this._icon('illuminance')}"></ha-icon></div>
        <div class="ico conductivity"><ha-icon icon="${this._icon('conductivity')}"></ha-icon></div>
        <div class="ico battery"><ha-icon icon="${this._icon('battery')}"></ha-icon></div>
      </div>`;

    // Compose a single metric cell: number (+ red when bad), unit, and chevron indicator
    const valCell = (numStr, unitStr, bad, ent, chevHTML) => `
      <div class="val ${bad ? 'bad' : ''}" data-entity="${ent ? esc(ent) : ''}">
        <div class="num">${numStr ?? "—"}</div>
        <div class="unit">${unitStr || ""}</div>
        ${chevHTML || ""}
      </div>`;


    // Chevron indicators per metric
    const chevMoist = chevronsForSpan(vMoist, p.min_moisture, p.max_moisture);
    const chevTemp  = chevronsForSpan(vTemp,  p.min_temp,     p.max_temp);
    const chevLight = chevronsForSpan(vLight, p.min_light,    p.max_light);
    const chevCond  = chevronsForSpan(vCond,  p.min_conductivity, p.max_conductivity);
    const chevBatt  = chevronsForBattery(vBatt);

    // Values row (keeps V35 number coloring; only chevrons are colored)
    const valsRow = `
      <div class="vals5">
        ${valCell(fmtNum(vMoist, uMoist), uMoist, moistBad, p.moisture_entity, chevMoist)}
        ${valCell(fmtNum(vTemp,  uTemp ), uTemp , tempBad , p.temp_entity,     chevTemp )}
        ${valCell(fmtNum(vLight, uLight), uLight, lightBad, p.light_entity,    chevLight)}
        ${valCell(fmtNum(vCond,  uCond ), uCond , condBad , p.conductivity_entity, chevCond)}
        ${valCell(fmtNum(vBatt,  uBatt ), uBatt , battBad , p.battery_entity,  chevBatt)}
      </div>`;

    // Thumbnail column (unchanged logic)
    const showGlobal = this._config.show_images !== false;
    const showPlant  = p.show_image !== false;
    const hasThumb   = showGlobal && showPlant && !!p.image_path;

    const rowClass = anyThumb ? "row2 with-thumb" : "row2 no-thumb";
    const thumbHTML = anyThumb
      ? (hasThumb
          ? `<div class="thumb" data-image="${esc(p.image_path)}" style="background-image:url('${esc(p.image_path)}')" title="Show image" role="button" tabindex="0"></div>`
          : `<div class="thumb thumb--empty"></div>`)
      : ``;

    return `
      <div class="plant">
        <div class="title-row">
          <div class="name">${esc(p.name || "Plant")}</div>
          ${p.location ? `<div class="loc">${esc(p.location)}</div>` : ``}
        </div>
        <div class="${rowClass}">
          ${thumbHTML}
          <div class="metrics">
            ${iconRow}
            ${valsRow}
          </div>
        </div>
      </div>
    `;
  }

  getCardSize(){ return Math.max(1, this._config?.plants?.length || 1); }
}
customElements.define("plant-card", PlantCard);

/* ========== Editor (kept functionally as in V35; comments only) ========== */
class PlantCardEditor extends HTMLElement {
  constructor() {
    super();
    this._expanded = {};
    this._allExpanded = true;
    this._showColorSection = false;

    // Registries cached for auto-mapping and default image paths
    this._entityRegistry = null;
    this._deviceRegistry = null;
    this._areaRegistry   = null;
  }

  setConfig(config) {
    this._config = {
      title: "Plant Dashboard",
      show_header: true,
      show_images: true,
      icon_colors: {
        moisture: "#5a7dbf",
        temperature: "#5a7dbf",
        illuminance: "#5a7dbf",
        conductivity: "#5a7dbf",
        battery: "#5a7dbf",
      },
      plants: [],
      ...config
    };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this.shadowRoot) {
      this.shadowRoot.querySelectorAll("ha-form, ha-textfield, input[type='color']")
        .forEach(el => { try { el.hass = hass; } catch(e) {} });
      return;
    }
    this._render();
  }

  /* Emit config back to HA */
  _emit(){ this.dispatchEvent(new CustomEvent("config-changed",{ detail:{ config:this._config }})); }

  /* Filename/path sanitization */
  _sanitizePathPart(s) {
    return String(s || "")
      .replace(/[\\/:*?"<>|]/g, "-")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* Build default image path from device area + name */
  _buildDefaultImagePath({ areaName, deviceName, location }) {
    const area = this._sanitizePathPart(areaName || location || "Unknown");
    const dev  = this._sanitizePathPart(deviceName || "Plant");
    const loc  = this._sanitizePathPart(location || "");
    const tail = loc ? `${dev} - ${loc}` : dev;
    return `/local/plant-pictures/${area}/${tail}`;
  }

  /* Ensure HA registries are available (for auto-map + default image path) */
  async _ensureRegistries() {
    if (!this._hass?.connection) return;
    if (!this._entityRegistry) {
      this._entityRegistry = await this._hass.connection.sendMessagePromise({ type: "config/entity_registry/list" });
    }
    if (!this._deviceRegistry) {
      this._deviceRegistry = await this._hass.connection.sendMessagePromise({ type: "config/device_registry/list" });
    }
    if (!this._areaRegistry) {
      this._areaRegistry   = await this._hass.connection.sendMessagePromise({ type: "config/area_registry/list" });
    }
  }

  /* Prefill image_path only once when currently empty */
  async _maybeFillDefaultPath(idx) {
    const plant = (this._config.plants || [])[idx];
    if (!plant || plant.image_path) return;

    let areaName = plant.location || "";
    let deviceName = plant.name || "";

    try {
      await this._ensureRegistries();
      const dev = this._deviceRegistry?.find(d => d.id === plant.device_id);
      if (dev) {
        deviceName = dev.name_by_user || dev.name || dev.model || deviceName || "Plant";
        const areaId = dev.area_id;
        if (areaId) {
          const area = this._areaRegistry?.find(a => a.area_id === areaId);
          if (area?.name) areaName = area.name;
        }
      }
    } catch (_) {}

    const path = this._buildDefaultImagePath({
      areaName,
      deviceName,
      location: plant.location || ""
    });

    const plants = [...(this._config.plants||[])];
    plants[idx] = { ...plant, image_path: path };
    this._config = { ...this._config, plants };
    this._emit();
    this._render();
  }

  /* Expand/collapse helpers */
  _toggleAll() {
    this._allExpanded = !this._allExpanded;
    (this._config.plants || []).forEach((_, i) => this._expanded[i] = this._allExpanded);
    this._render();
  }
  _toggleOne(idx) { this._expanded[idx] = !this._expanded[idx]; this._render(); }
  _toggleColorSection() { this._showColorSection = !this._showColorSection; this._render(); }

  /* Color config writer */
  _setColor(key, value) {
    const icon_colors = { ...(this._config.icon_colors || {}) , [key]: value };
    this._config = { ...this._config, icon_colors };
    this._emit();
  }

  /* Reorder plants */
  _movePlant(idx, dir) {
    const arr = [...(this._config.plants || [])];
    const j = idx + dir;
    if (j < 0 || j >= arr.length) return;
    const [item] = arr.splice(idx, 1);
    arr.splice(j, 0, item);
    this._config = { ...this._config, plants: arr };
    const expandedCopy = {};
    arr.forEach((_, i) => expandedCopy[i] = this._expanded[i] ?? true);
    this._expanded = expandedCopy;
    this._emit();
    this._render();
  }
  _movePlantToTop(idx) {
    const arr = [...(this._config.plants || [])];
    if (idx <= 0) return;
    const [item] = arr.splice(idx, 1);
    arr.unshift(item);
    this._config = { ...this._config, plants: arr };
    this._emit(); this._render();
  }
  _movePlantToBottom(idx) {
    const arr = [...(this._config.plants || [])];
    if (idx >= arr.length - 1) return;
    const [item] = arr.splice(idx, 1);
    arr.push(item);
    this._config = { ...this._config, plants: arr };
    this._emit(); this._render();
  }

  /* Numeric textfield helper (commit on blur/Enter) */
  _makeNumberField(label, value, onCommit, opts={}) {
    const tf = document.createElement("ha-textfield");
    tf.setAttribute("label", label);
    tf.type = "number";
    if (opts.step != null) tf.step = String(opts.step);
    if (opts.min != null) tf.min = String(opts.min);
    if (opts.max != null) tf.max = String(opts.max);
    tf.value = (value ?? "") === "" ? "" : String(value);
    tf.autocomplete = "off";
    tf.addEventListener("keydown", (ev)=>{ if (ev.key === "Enter") tf.blur(); });
    tf.addEventListener("blur", ()=>{
      const raw = tf.value;
      if (raw === "") { onCommit(null); return; }
      const num = Number(raw);
      if (!Number.isFinite(num)) return;
      onCommit(num);
    });
    return tf;
  }

  /* Editor renderer */
  _render() {
    if (!this._hass || !this._config) return;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });

    (this._config.plants || []).forEach((_, i) => {
      if (this._expanded[i] === undefined) this._expanded[i] = this._allExpanded;
    });

    const H = this._hass;

    this.shadowRoot.innerHTML = `
      <style>
        .wrap { padding: 10px 8px 14px; color: var(--primary-text-color); }
        .hr { height:1px; background: var(--divider-color,#ddd); margin: 10px 0; }
        .sectionLabel { font-weight: 600; margin: 8px 0 4px; opacity:.85; }
        .fields2 { display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin: 4px 0 8px; }
        .fieldLabel { font-weight:600; margin:10px 0 4px; opacity:.9; }
        .details { border: 1px dashed var(--divider-color,#ddd); border-radius: 6px; padding: 8px; margin-top: 8px; }
        .rowhead { display:flex; align-items:center; gap:8px; }
        .rowhead .spacer { flex:1; }
        .title { font-weight:700; margin:12px 0 8px; display:flex; align-items:center; gap:8px; }

        /* Inline row: v23 look (evaluate left, chevron right) */
        .btns-inline { display:flex; align-items:center; justify-content:space-between; margin-top:6px; }
        .btn-left, .btn-right { display:flex; justify-content:center; align-items:center; flex:0 0 50%; }
        .btns-inline mwc-button, .btns-inline mwc-icon-button, .btns-inline ha-icon-button { margin:0; padding:0; }

        .btns { margin-top:8px; display:flex; gap:8px; flex-wrap:wrap; }

        /* --- Editor: make outlined buttons visibly framed across themes --- */
        :host {
          --pc-btn-radius: 8px;
        }

        /* Works with mwc-button's shadow vars; no effect on icon buttons */
        #top mwc-button[outlined],
        .btns mwc-button[outlined],
        .btns-inline mwc-button[outlined] {
          /* force outline color and keep primary text color */
          --mdc-button-outline-color: var(--primary-color);
          --mdc-theme-primary: var(--primary-color);
          border-radius: var(--pc-btn-radius);
        }

        /* Small polish for raised buttons; keeps HA elevation */
        #top mwc-button[raised],
        .btns mwc-button[raised],
        .btns-inline mwc-button[raised] {
          border-radius: var(--pc-btn-radius);
        }

        /* --- Editor: force visible frames for text buttons --- */
        :host {
          --pc-btn-radius: 8px;
        }

        /* Hard border on the host element so it's always visible, regardless of theme */
        mwc-button[outlined] {
          border: 1px solid var(--primary-color) !important;
          border-radius: var(--pc-btn-radius);
          padding: 0.25rem 0.5rem; /* prevents visual clipping */
        }

        /* Keep a nice radius on raised buttons too */
        mwc-button[raised] {
          border-radius: var(--pc-btn-radius);
        }

        /* Optional: slightly separate inline buttons without moving the right chevron */
        .btns-inline mwc-button[outlined] {
          margin: 0; /* make sure we don't add extra gaps */
        }

      </style>

      <div class="wrap">
        <div id="top"></div>

        <div class="btns" style="margin:8px 0;">
          <mwc-button id="toggleColors" dense outlined>
            ${esc(this._showColorSection ? t(H,"color_section_toggle_hide") : t(H,"color_section_toggle_show"))}
          </mwc-button>
            <mwc-button id="toggleAll" dense outlined>
            ${esc(this._allExpanded ? t(H,"details_collapse_all") : t(H,"details_expand_all"))}
          </mwc-button>

        </div>

        <div id="colorSection" style="display:${this._showColorSection ? "block":"none"};"></div>

        <div id="plants"></div>

        <div class="btns">
          <mwc-button id="add" dense raised>${esc(t(H,"add_plant"))}</mwc-button>
          ${this._config.plants.length
            ? `<mwc-button id="remove" dense outlined>${esc(t(H,"remove_last"))}</mwc-button>`
            : ""}
        </div>
      </div>
      // Ensure outlined buttons also pick up MWC outline vars (theme-safe fallback)
      this.shadowRoot.querySelectorAll('mwc-button[outlined]').forEach((btn) => {
        btn.style.setProperty('--mdc-button-outline-color', 'var(--primary-color)');
        btn.style.setProperty('--mdc-theme-primary', 'var(--primary-color)');
});

    `;

/* ---------- Top form: title, show_header, show_images ---------- */
const top = this.shadowRoot.querySelector("#top");

// Create a text field for the title instead of using ha-form for live changes
const titleField = document.createElement("ha-textfield");
titleField.setAttribute("label", t(H, "header_title_label"));
titleField.value = this._config.title || t(H, "title_default");
titleField.autocomplete = "off";

// Save title only when user leaves the field
titleField.addEventListener("keydown", (ev) => {
  if (ev.key === "Enter") titleField.blur();
});
titleField.addEventListener("blur", () => {
  const val = (titleField.value || "").trim();
  this._config.title = val || t(H, "title_default");
  this._emit(); // trigger config-changed event
});

// Create toggle for show_header
const showHeaderToggle = document.createElement("ha-form");
showHeaderToggle.hass = H;
showHeaderToggle.schema = [{ name: "show_header", selector: { boolean: {} } }];
showHeaderToggle.data = { show_header: this._config.show_header !== false };
showHeaderToggle.computeLabel = () => t(H, "header_show_header");
showHeaderToggle.addEventListener("value-changed", (e) => {
  const show_header = e.detail?.value?.show_header !== false;
  this._config.show_header = show_header;
  this._emit();
});

// Create toggle for show_images
const showImagesToggle = document.createElement("ha-form");
showImagesToggle.hass = H;
showImagesToggle.schema = [{ name: "show_images", selector: { boolean: {} } }];
showImagesToggle.data = { show_images: this._config.show_images !== false };
showImagesToggle.computeLabel = () => t(H, "image_show_global");
showImagesToggle.addEventListener("value-changed", (e) => {
  const show_images = e.detail?.value?.show_images !== false;
  this._config.show_images = show_images;
  this._emit();
});

// Wrap all in a container
const topContainer = document.createElement("div");
topContainer.className = "fields2";
topContainer.append(titleField, showHeaderToggle, showImagesToggle);

top.replaceChildren(topContainer);


    /* Color pickers section */
    const cs = this.shadowRoot.querySelector("#colorSection");
    if (cs) {
      cs.innerHTML = "";
      const sectionTitle = document.createElement("div");
      sectionTitle.className = "sectionLabel";
      sectionTitle.textContent = t(H,"header_icon_colors");
      cs.appendChild(sectionTitle);

      const grid = document.createElement("div");
      grid.className = "fields2";

      const addColorRow = (labelKey, key) => {
        const text = document.createElement("ha-textfield");
        text.label = t(H,labelKey);
        text.value = this._config.icon_colors?.[key] || "#5a7dbf";
        text.addEventListener("keydown", (ev)=>{ if (ev.key === "Enter") text.blur(); });
        text.addEventListener("blur", ()=>{
          const val = text.value?.trim();
          if (!val) return;
          this._setColor(key, val);
        });

        const color = document.createElement("input");
        color.type = "color";
        const cfgColor = this._config.icon_colors?.[key] || "#5a7dbf";
        color.value = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(cfgColor) ? cfgColor : "#5a7dbf";
        color.addEventListener("input", ()=>{
          text.value = color.value;
          this._setColor(key, color.value);
        });

        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.gap = "8px";
        row.append(text, color);
        grid.append(row);
      };

      addColorRow("color_moisture","moisture");
      addColorRow("color_temperature","temperature");
      addColorRow("color_illuminance","illuminance");
      addColorRow("color_conductivity","conductivity");
      addColorRow("color_battery","battery");

      const hint = document.createElement("div");
      hint.className = "fieldLabel";
      hint.style.fontWeight = "normal";
      hint.style.opacity = ".8";
      hint.textContent = t(H,"color_hint");

      cs.appendChild(grid);
      cs.appendChild(hint);
    }

    /* Plants list (one editor block per plant) */
    const host = this.shadowRoot.querySelector("#plants");
    host.innerHTML = "";
    (this._config.plants || []).forEach((plant, idx) => host.appendChild(this._plantBlock(idx, plant)));

    // Footer buttons
    this.shadowRoot.getElementById("add")?.addEventListener("click", () => this._addPlant());
    this.shadowRoot.getElementById("remove")?.addEventListener("click", () => this._removePlant());
    this.shadowRoot.getElementById("toggleAll")?.addEventListener("click", () => this._toggleAll());
    this.shadowRoot.getElementById("toggleColors")?.addEventListener("click", () => this._toggleColorSection());
  }

  /* One plant editor block */
  _plantBlock(idx, plant) {
    const H = this._hass;

    const wrap = document.createElement("div");
    wrap.innerHTML = `<div class="hr"></div>`;

    // Header with move controls
    const head = document.createElement("div");
    head.className = "rowhead";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = `${t(H,"plant_label")} ${idx + 1}`;

    const spacer = document.createElement("div");
    spacer.className = "spacer";

    const topBtn = document.createElement("mwc-icon-button");
    topBtn.setAttribute("title", t(H,"move_top"));
    topBtn.append(Object.assign(document.createElement("ha-icon"), { icon: "mdi:chevron-double-up" }));
    topBtn.disabled = idx === 0;
    topBtn.addEventListener("click", () => this._movePlantToTop(idx));

    const upBtn = document.createElement("mwc-icon-button");
    upBtn.setAttribute("title", t(H,"move_up"));
    upBtn.append(Object.assign(document.createElement("ha-icon"), { icon: "mdi:chevron-up" }));
    upBtn.disabled = idx === 0;
    upBtn.addEventListener("click", () => this._movePlant(idx, -1));

    const downBtn = document.createElement("mwc-icon-button");
    downBtn.setAttribute("title", t(H,"move_down"));
    downBtn.append(Object.assign(document.createElement("ha-icon"), { icon: "mdi:chevron-down" }));
    downBtn.disabled = idx >= (this._config.plants.length - 1);
    downBtn.addEventListener("click", () => this._movePlant(idx, +1));

    const bottomBtn = document.createElement("mwc-icon-button");
    bottomBtn.setAttribute("title", t(H,"move_bottom"));
    bottomBtn.append(Object.assign(document.createElement("ha-icon"), { icon: "mdi:chevron-double-down" }));
    bottomBtn.disabled = idx >= (this._config.plants.length - 1);
    bottomBtn.addEventListener("click", () => this._movePlantToBottom(idx));

    head.append(title, spacer, topBtn, upBtn, downBtn, bottomBtn);
    wrap.append(head);

    // Device picker
    const devForm = document.createElement("ha-form");
    devForm.hass = H;
    devForm.schema = [{ name: "device_id", selector: { device: {} } }];
    devForm.data = { device_id: plant.device_id || "" };
    devForm.computeLabel = () => t(H,"device_label");
    devForm.addEventListener("value-changed", (e) => {
      const device_id = e.detail?.value?.device_id || "";
      const plants = [...(this._config.plants||[])];
      plants[idx] = { ...plants[idx], device_id };
      this._config = { ...this._config, plants };
      this._emit();
      this._maybeFillDefaultPath(idx); // prefill default image path if empty
    });
    wrap.append(devForm);

    // Inline row: evaluate (left) + details toggle chevron (right)
    const btnInline = document.createElement("div");
    btnInline.className = "btns-inline";

    const autoBtn = document.createElement("mwc-button");
    autoBtn.setAttribute("dense","");
    autoBtn.setAttribute("outlined","");
    autoBtn.textContent = t(H,"btn_evaluate");
    autoBtn.addEventListener("click", ()=>this._autoMapFromDevice(idx));

    const toggleBtn = document.createElement("mwc-icon-button");
    toggleBtn.setAttribute(
      "title",
      this._expanded[idx] ? t(H,"toggle_details_title").collapse : t(H,"toggle_details_title").expand
    );
    const toggleIcon = document.createElement("ha-icon");
    toggleIcon.setAttribute("icon", this._expanded[idx] ? "mdi:chevron-up" : "mdi:chevron-down");
    toggleBtn.append(toggleIcon);
    toggleBtn.addEventListener("click", () => this._toggleOne(idx));

    const leftBtnWrap = document.createElement("div");
    leftBtnWrap.className = "btn-left";
    leftBtnWrap.append(autoBtn);

    const rightBtnWrap = document.createElement("div");
    rightBtnWrap.className = "btn-right";
    rightBtnWrap.append(toggleBtn);

    btnInline.append(leftBtnWrap, rightBtnWrap);
    wrap.append(btnInline);

    // Collapsible details
    const details = document.createElement("div");
    details.className = "details";
    details.style.display = this._expanded[idx] ? "block" : "none";

    // Name + location
    const fieldsNL = document.createElement("div");
    fieldsNL.className = "fields2";

    const nameTf = document.createElement("ha-textfield");
    nameTf.setAttribute("label", t(H,"name_label"));
    nameTf.value = plant.name || `${t(H,"plant_label")} ${idx+1}`;
    nameTf.autocomplete = "off";
    nameTf.addEventListener("keydown", (ev)=>{ if (ev.key === "Enter") nameTf.blur(); });
    nameTf.addEventListener("blur", ()=>{
      const val = nameTf.value ?? "";
      const plants = [...(this._config.plants||[])];
      if (plants[idx]?.name !== val) {
        plants[idx] = { ...plants[idx], name: val };
        this._config = { ...this._config, plants };
        this._emit();
        this._maybeFillDefaultPath(idx);
      }
    });

    const locTf = document.createElement("ha-textfield");
    locTf.setAttribute("label", t(H,"location_label"));
    locTf.value = plant.location || "";
    locTf.autocomplete = "off";
    locTf.addEventListener("keydown", (ev)=>{ if (ev.key === "Enter") locTf.blur(); });
    locTf.addEventListener("blur", ()=>{
      const val = locTf.value ?? "";
      const plants = [...(this._config.plants||[])];
      if (plants[idx]?.location !== val) {
        plants[idx] = { ...plants[idx], location: val };
        this._config = { ...this._config, plants };
        this._emit();
        this._maybeFillDefaultPath(idx);
      }
    });

    fieldsNL.append(nameTf, locTf);
    details.appendChild(fieldsNL);

    // Sensor entity pickers
    const sensorForm = document.createElement("ha-form");
    sensorForm.hass = H;
    sensorForm.schema = [
      { name: "moisture_entity", selector: { entity: { domain: "sensor" } } },
      { name: "temp_entity", selector: { entity: { domain: "sensor" } } },
      { name: "light_entity", selector: { entity: { domain: "sensor" } } },
      { name: "conductivity_entity", selector: { entity: { domain: "sensor" } } },
      { name: "battery_entity", selector: { entity: { domain: "sensor" } } },
    ];
    sensorForm.data = plant;
    sensorForm.computeLabel = (schema) => {
      const map = {
        moisture_entity: t(H,"sensor_moisture"),
        temp_entity: t(H,"sensor_temp"),
        light_entity: t(H,"sensor_light"),
        conductivity_entity: t(H,"sensor_cond"),
        battery_entity: t(H,"sensor_batt"),
      };
      return map[schema.name] || schema.label || schema.name;
    };
    sensorForm.addEventListener("value-changed",(e)=>{
      const v = e.detail?.value || {};
      const plants = [...(this._config.plants||[])];
      plants[idx] = { ...plants[idx], ...v };
      this._config = { ...this._config, plants };
      this._emit();
    });
    details.appendChild(sensorForm);

    // Threshold fields
    const makePair = (sectionLabel, minLabel, maxLabel, keyMin, keyMax, optsMin, optsMax) => {
      const labelEl = document.createElement("div");
      labelEl.className = "sectionLabel";
      labelEl.textContent = sectionLabel;
      details.appendChild(labelEl);

      const row = document.createElement("div");
      row.className = "fields2";

      const minTf = this._makeNumberField(minLabel, plant[keyMin], (num)=>{
        const plants = [...(this._config.plants||[])];
        plants[idx] = { ...plants[idx], [keyMin]: num };
        this._config = { ...this._config, plants };
        this._emit();
      }, optsMin);

      const maxTf = this._makeNumberField(maxLabel, plant[keyMax], (num)=>{
        const plants = [...(this._config.plants||[])];
        plants[idx] = { ...plants[idx], [keyMax]: num };
        this._config = { ...this._config, plants };
        this._emit();
      }, optsMax);

      row.append(minTf, maxTf);
      details.appendChild(row);
    };

    makePair(
      tPath(H, "thresholds.moisture", "Moisture thresholds"),
      t(H,"min_moisture"), t(H,"max_moisture"),
      "min_moisture","max_moisture",
      { min:0, max:100, step:1 }, { min:0, max:100, step:1 }
    );
    makePair(
      tPath(H, "thresholds.temp", "Temperature thresholds"),
      t(H,"min_temp"), t(H,"max_temp"),
      "min_temp","max_temp",
      { min:-20, max:60, step:0.5 }, { min:-20, max:60, step:0.5 }
    );
    makePair(
      tPath(H, "thresholds.light", "Illuminance thresholds"),
      t(H,"min_light"), t(H,"max_light"),
      "min_light","max_light",
      { min:0, max:100000, step:10 }, { min:0, max:100000, step:10 }
    );
    makePair(
      tPath(H, "thresholds.cond", "Conductivity thresholds"),
      t(H,"min_cond"), t(H,"max_cond"),
      "min_conductivity","max_conductivity",
      { min:0, max:5000, step:10 }, { min:0, max:5000, step:10 }
    );

    // Battery – only minimum (used for red number coloring)
    const battLabel = document.createElement("div");
    battLabel.className = "sectionLabel";
    battLabel.textContent = tPath(H,"thresholds.batt","Battery threshold");
    const battRow = document.createElement("div");
    battRow.className = "fields2";
    const battMin = this._makeNumberField(t(H,"min_batt"), plant.min_battery, (num)=>{
      const plants = [...(this._config.plants||[])];
      plants[idx] = { ...plants[idx], min_battery: num };
      this._config = { ...this._config, plants };
      this._emit();
    }, { min:0, max:100, step:1 });
    const placeholder = document.createElement("div");
    battRow.append(battMin, placeholder);
    details.appendChild(battLabel);
    details.appendChild(battRow);

    // Image section: per-plant toggle + path
    const imgLabel = document.createElement("div");
    imgLabel.className = "sectionLabel";
    imgLabel.textContent = t(H,"image_section_title");
    const imgRow = document.createElement("div");
    imgRow.className = "fields2";

    const imgToggleForm = document.createElement("ha-form");
    imgToggleForm.hass = H;
    imgToggleForm.schema = [{ name: "show_image", selector: { boolean: {} } }];
    imgToggleForm.data = { show_image: plant.show_image !== false };
    imgToggleForm.computeLabel = () => t(H,"image_toggle_one");
    imgToggleForm.addEventListener("value-changed", (e) => {
      const show_image = e.detail?.value?.show_image !== false;
      const plants = [...(this._config.plants||[])];
      plants[idx] = { ...plants[idx], show_image };
      this._config = { ...this._config, plants };
      this._emit();
    });

    const pathTf = document.createElement("ha-textfield");
    pathTf.setAttribute("label", `${t(H,"image_path_label")} – ${t(H,"image_supported")}`);
    pathTf.value = plant.image_path || "";
    pathTf.autocomplete = "off";
    pathTf.addEventListener("keydown", (ev)=>{ if (ev.key === "Enter") pathTf.blur(); });
    pathTf.addEventListener("blur", ()=>{
      const val = (pathTf.value || "").trim();
      const plants = [...(this._config.plants||[])];
      plants[idx] = { ...plants[idx], image_path: val };
      this._config = { ...this._config, plants };
      this._emit();
    });

    imgRow.append(imgToggleForm, pathTf);
    details.appendChild(imgLabel);
    details.appendChild(imgRow);

    wrap.append(details);
    return wrap;
  }

  /* CRUD helpers */
  _addPlant() {
    const H = this._hass;
    const n = (this._config.plants?.length||0) + 1;
    const plant = {
      name:`${t(H,"plant_label")} ${n}`, location:"", device_id:"",
      image_path:"", show_image:true,
      moisture_entity:"", temp_entity:"", light_entity:"", conductivity_entity:"", battery_entity:"",
      min_moisture:20, max_moisture:60, min_temp:15, max_temp:30, min_light:1000, max_light:30000,
      min_conductivity:350, max_conductivity:2000, min_battery:10
    };
    this._config = { ...this._config, plants:[...(this._config.plants||[]), plant] };
    this._emit(); this._render();
  }

  _removePlant() {
    if ((this._config.plants||[]).length) {
      const plants = [...this._config.plants];
      plants.pop();
      this._config = { ...this._config, plants };
      this._emit();
      this._render();
    }
  }

  /* Auto-map entities from selected device; also sets default image_path once */
  async _autoMapFromDevice(idx) {
    const device_id = this._config.plants[idx]?.device_id;
    if (!device_id || !this._hass) return;
    try {
      await this._ensureRegistries();

      let entity_ids = this._entityRegistry.filter(e => e.device_id === device_id).map(e => e.entity_id);
      if (!entity_ids.length) {
        entity_ids = Object.keys(this._hass.states).filter(
          (id) => this._hass.states[id]?.attributes?.device_id === device_id
        );
      }
      const states = entity_ids.map(id => this._hass.states[id]).filter(Boolean);

      const byDC   = (...dc) => states.find(s => dc.includes(String(s.attributes.device_class||"").toLowerCase()));
      const byUnit = (...u)  => states.find(s => u.includes(String(s.attributes.unit_of_measurement||"").toLowerCase()));
      const byName = (...n)  => states.find(s => {
        const id = s.entity_id.toLowerCase();
        const name = String(s.attributes.friendly_name||"").toLowerCase();
        return n.some(x => id.includes(x) || name.includes(x));
      });

      let moisture = (byDC("moisture","humidity","water") || byUnit("%") || byName("moist","soil","boden","feucht"))?.entity_id;
      let temp     = (byDC("temperature") || byUnit("°c","c") || byName("temp","temperatur"))?.entity_id;
      let light    = (byDC("illuminance","light") || byUnit("lx") || byName("illu","lux","light","hellig","helligkeit","illum"))?.entity_id;
      let cond     = (byDC("conductivity") || byUnit("µs/cm","us/cm") || byName("cond","leit","ec","conduct"))?.entity_id;
      let batt     = (byDC("battery") || byName("batt","akku","battery"))?.entity_id;

      const device = this._deviceRegistry.find(d => d.id === device_id);
      const areaId = device?.area_id;
      const areaByDevice = this._areaRegistry.find(a => a.area_id === areaId);
      let areaName = areaByDevice?.name || "";
      if (!areaName) {
        const erWithArea = this._entityRegistry.find(er => er.device_id === device_id && er.area_id);
        if (erWithArea) {
          const areaByEntity = this._areaRegistry.find(a => a.area_id === erWithArea.area_id);
          areaName = areaByEntity?.name || "";
        }
      }
      const deviceName = device?.name_by_user || device?.name || device?.model || "";

      const plants = [...(this._config.plants||[])];
      const prev = plants[idx];

      plants[idx] = {
        ...prev,
        name: prev.name || deviceName || `Plant ${idx+1}`,
        location: prev.location || areaName || "",
        moisture_entity: moisture || prev.moisture_entity || "",
        temp_entity:     temp     || prev.temp_entity     || "",
        light_entity:    light    || prev.light_entity    || "",
        conductivity_entity: cond || prev.conductivity_entity || "",
        battery_entity:  batt     || prev.battery_entity  || "",
      };

      if (!prev.image_path) {
        plants[idx].image_path = this._buildDefaultImagePath({
          areaName: plants[idx].location || areaName,
          deviceName: plants[idx].name || deviceName || `Plant ${idx+1}`,
          location: plants[idx].location || ""
        });
      }

      this._config = { ...this._config, plants };
      this._emit();
      this._render();
    } catch (e) {
      console.error("Auto-mapping failed:", e);
    }
  }
}
customElements.define("plant-card-editor", PlantCardEditor);

/* ========== Card registration (English always + local language) ========== */
(function registerCard() {
  // Always register English
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "plant-card",
    name: "Plant Dashboard",
    description: "One card for multiple plants: pick a device to auto-fill entities, set thresholds, optional thumbnails.",
    preview: true
  });

  // Register localized name/description (German) when environment is German
  const isDE = (navigator.language || "").toLowerCase().startsWith("de");
  if (isDE) {
    window.customCards.push({
      type: "plant-card",
      name: "Pflanzenkarte",
      description: "Eine Karte für mehrere Pflanzen: Gerät wählen, Entitäten füllen, Grenzwerte setzen, optionale Vorschaubilder.",
      preview: true
    });
  }
})();
