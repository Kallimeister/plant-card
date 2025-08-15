# Plant Card

A custom Lovelace card for Home Assistant to monitor and manage multiple plants in one dashboard card. Easily link devices, auto-fill sensor entities, set thresholds for each metric, and optionally display plant images with a lightbox preview.

---

## Features

- Manage multiple plants in a single card
- Device selection with automatic entity mapping
- Adjustable thresholds for:
  - Moisture
  - Temperature
  - Illuminance
  - Conductivity
  - Battery
- Optional plant images with click-to-enlarge lightbox
- Per-plant toggle for image visibility
- Automatic default image path generation based on device, location, and area
- Click on values to open entity **more-info**
- Configurable icon colors
- Compact, responsive design for desktop and mobile
- Fully localizable (English and German included)

<p align="center">
  <img src="www/Screenshot Card.png" width="900" alt="Plant Card – Dashboard" />
  <img src="www/Screenshot Editor eingeklappt de.png" width="900" alt="Plant Card – Editor (collapsed)" />
  <img src="www/Screenshot Editor ausgeklappt de.png" width="900" alt="Plant Card – Editor (expanded)" />
</p>

---

## Installation

### HACS (Recommended)
_Not yet on HACS. Manual install for now._

### Manual installation
1. Download the latest `plant-card.js` from Releases.
2. Place it in your Home Assistant `www` folder:
   ~~~
   config/www/plant-card.js
   ~~~
3. Add the resource in Home Assistant:
   - Settings → Dashboards → Resources → **Add Resource**
   - URL: `/local/plant-card.js`
   - Resource type: **JavaScript Module**
4. Refresh the browser cache (hard reload) and, if using the Companion App, clear the app cache.

---

## Usage

Add a card of type `custom:plant-card` and configure via the built-in editor, or use YAML.

### Example YAML
~~~yaml
type: custom:plant-card
title: My Plants
show_header: true
show_images: true
icon_colors:
  moisture: "#5a7dbf"
  temperature: "#f28c38"
  illuminance: "#ffd93b"
  conductivity: "#5bbf5a"
  battery: "#999999"
plants:
  - name: Monstera
    location: Living Room
    device_id: abc123
    image_path: /local/plant-pictures/Living Room/Monstera - Living Room.jpg
    show_image: true
    moisture_entity: sensor.monstera_moisture
    temp_entity: sensor.monstera_temp
    light_entity: sensor.monstera_light
    conductivity_entity: sensor.monstera_conductivity
    battery_entity: sensor.monstera_battery
    min_moisture: 20
    max_moisture: 60
    min_temp: 15
    max_temp: 30
    min_light: 1000
    max_light: 30000
    min_conductivity: 350
    max_conductivity: 2000
    min_battery: 10
~~~

---

## Image Paths

- Put images in `config/www/plant-pictures/...` so they are available under `/local/plant-pictures/...`.
- If `image_path` is empty, the editor will prefill a default:
  ~~~
  /local/plant-pictures/[Area]/[Device Name] - [Location]
  ~~~
  Once saved, the path is not auto-changed again.

---

## Localization

The card follows your Home Assistant language automatically.

- **English** (default)
- **Deutsch** (German)

---

## Development

1. Clone the repository:
   ~~~bash
   git clone https://github.com/Kallimeister/plant-card.git
   cd plant-card
   ~~~
2. Edit `plant-card.js`.
3. Bump the internal version string (for cache busting).
4. Zip files for distribution if needed.

---

## Troubleshooting

- **Card not found / configuration error**  
  Check the **Resources** entry (URL `/local/plant-card.js`, type **JavaScript Module**). Verify file permissions and clear the browser/app cache.

- **Images not showing in Companion App**  
  Ensure images live under `config/www/plant-pictures/...` and access them via `/local/...`. Clear the Companion App cache (App Configuration → Troubleshooting → Reset Frontend cache).

- **Editor input updates on each keystroke**  
  This card debounces common inputs, but if you still see issues, use the YAML editor or finish text input and click outside the field to commit.

---

## Contributing

PRs and issues are welcome! Please include:
- A short description of the change
- Repro steps for bugs
- Screenshots (Dashboard + Editor) if UI changes are involved

---

## License

MIT © Kallimeister
---
> This project has been co-authored with the assistance of OpenAI’s ChatGPT for drafting code and documentation. All code has been reviewed and adapted by the repository owner.


---

# Plant Card (Deutsch)

Eine benutzerdefinierte Lovelace-Karte für Home Assistant, um mehrere Pflanzen in einer einzigen Karte zu überwachen und zu verwalten. Geräte verknüpfen, Sensoren automatisch zuordnen, Grenzwerte je Messwert festlegen und optional Pflanzenbilder mit Lightbox-Vorschau anzeigen.

---

## Funktionen

- Mehrere Pflanzen in einer Karte verwalten
- Geräteauswahl mit automatischer Entitätenzuordnung
- Einstellbare Grenzwerte für:
  - Feuchtigkeit
  - Temperatur
  - Helligkeit (Illuminance)
  - Leitfähigkeit
  - Batterie
- Optionale Pflanzenbilder mit Klick-Zoom (Lightbox)
- Pro Pflanze Bildanzeige ein-/ausschaltbar
- Automatische Standard-Bildpfade basierend auf Bereich, Gerät und Standort
- Klick auf Werte öffnet die **Detailansicht (more-info)** der Entität
- Konfigurierbare Symbolfarben
- Kompaktes, responsives Design für Desktop & Mobil
- Voll lokalisiert (Englisch und Deutsch enthalten)

---

## Installation

### HACS (empfohlen)
_Nochnicht in HACS. Aktuell manuelle Installation._

### Manuelle Installation
1. Lade die aktuelle `plant-card.js` aus den Releases.
2. Lege die Datei in deinen `www`-Ordner:
   ~~~
   config/www/plant-card.js
   ~~~
3. Ressource in Home Assistant hinzufügen:
   - Einstellungen → Dashboards → Ressourcen → **Ressource hinzufügen**
   - URL: `/local/plant-card.js`
   - Typ: **JavaScript Module**
4. Browser-Cache aktualisieren (Hard-Reload) und ggf. App-Cache der Companion App leeren.

---

## Verwendung

Füge eine Karte vom Typ `custom:plant-card` hinzu und konfiguriere sie im Editor oder per YAML.

### YAML-Beispiel
~~~yaml
type: custom:plant-card
title: Meine Pflanzen
show_header: true
show_images: true
icon_colors:
  moisture: "#5a7dbf"
  temperature: "#f28c38"
  illuminance: "#ffd93b"
  conductivity: "#5bbf5a"
  battery: "#999999"
plants:
  - name: Monstera
    location: Wohnzimmer
    device_id: abc123
    image_path: /local/plant-pictures/Wohnzimmer/Monstera - Wohnzimmer.jpg
    show_image: true
    moisture_entity: sensor.monstera_moisture
    temp_entity: sensor.monstera_temp
    light_entity: sensor.monstera_light
    conductivity_entity: sensor.monstera_conductivity
    battery_entity: sensor.monstera_battery
    min_moisture: 20
    max_moisture: 60
    min_temp: 15
    max_temp: 30
    min_light: 1000
    max_light: 30000
    min_conductivity: 350
    max_conductivity: 2000
    min_battery: 10
~~~

---

## Bildpfade

- Lege Bilder unter `config/www/plant-pictures/...` ab, dann sind sie unter `/local/plant-pictures/...` erreichbar.
- Ist `image_path` leer, füllt der Editor automatisch vor:
  ~~~
  /local/plant-pictures/[Bereich]/[Gerätename] - [Standort]
  ~~~
  Nach dem Speichern wird dieser Pfad nicht mehr automatisch verändert.

---

## Lokalisierung

Die Karte nutzt automatisch die in Home Assistant eingestellte Sprache.

- **Englisch** (Standard)
- **Deutsch**

---

## Entwicklung

1. Repository klonen:
   ~~~bash
   git clone https://github.com/Kallimeister/plant-card.git
   cd plant-card
   ~~~
2. `plant-card.js` anpassen.
3. Versionsstring im Code erhöhen (Cache-Busting).
4. Bei Bedarf Dateien zippen und veröffentlichen.

---

## Fehlerbehebung

- **Karte/Configuration error wird angezeigt**  
  Ressourcen-Eintrag prüfen (URL `/local/plant-card.js`, Typ **JavaScript Module**). Dateirechte checken und Cache leeren.

- **Bilder erscheinen nicht in der Companion App**  
  Bilder müssen unter `config/www/plant-pictures/...` liegen (Zugriff über `/local/...`). App-Cache leeren (App-Konfiguration → Troubleshooting → Reset Frontend cache).

- **Editor übernimmt Texteingaben nur Zeichenweise**  
  Der Editor committed Eingaben beim Verlassen des Feldes. Alternativ YAML-Editor nutzen oder nach der Eingabe kurz außerhalb klicken.

---

## Beitrag & Support

Pull Requests und Issues sind willkommen. Bitte mit:
- Kurzer Änderungsbeschreibung
- Repro-Schritten bei Bugs
- Screenshots (Dashboard + Editor), falls UI betroffen

---

## Lizenz

MIT © Kallimeister
---
> Dieses Projekt wurde bei Code und Dokumentation mit Unterstützung von OpenAI ChatGPT erstellt. Der Code wurde vom Repository-Inhaber geprüft und angepasst.
