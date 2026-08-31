# Einführung und Ziele

Das Ziel ist es ein Todo App zu erstellen welche es multiplen Usern erlaubt Todos zu erstellen, zu modifizieren sowie miteinander zu teilen.

Der Fokus besteht darauf, das ganze funktionell aufzusetzen um ein Gefühl für die ganzen Technologien zu bekommen die es braucht um so eine Applikation aufzusetzen. Weniger Augenmerk wird auf das Design gelegt um den Arbeitsumfang im Rahmen zu halten.

Die Applikation soll nach Abschluss live auf einer Domain verfügbar sein und produktiv verwendet werden können.

## Funktionale Anforderungen

* Die Applikation muss das Erstellen, Anzeigen, Ändern und Löschen sowohl von Nutzern als auch Todos ermöglichen.
* Zugriffsberechtigungen müssen sicher stellen dass Nutzer nur die freigegebenen Todos sehen können.
* Die Daten müssen persistent in einer Datenbank abgelegt werden.
* Die Todos müssen als Liste als auch als Raster dargestellt werden können

## Nicht funktionale Anforderungen

* Die Applikation soll neben der Desktop-Ansicht, auch für die Mobile/Tablet-Ansicht optimiert sein.
* Die Funktionalitäten sollen mittels sinnvollen automatisierten **Unit/Integration/E2E-Tests** überprüft werden.
* [Lighthouse-Score](https://developer.chrome.com/docs/lighthouse?hl=de) von mindestens 90 (Durchschnitt aller Analysen) für Mobile sowie Desktop.
* Das **Prod-Bundle** der Applikation soll reproduzierbar gestartet werden können.
  * Option 1: Deployed auf einer öffentlichen URL
  * Option 2: via Docker-Compose mit einem Command (`docker compose up`) ausführbar
* Code-Lesbarkeit & Erweiterbarkeit
* Sinnvolle & durchdachte Strukturierung der gesamten Applikation

# Randbedingungen

* Sowohl frontend als auch backend müssen in Typescript verfasst werden.
* Das Projekt wird in **Einzelarbeit** erarbeitet.
* Es wird keine AI hinzugezogen um den Lerneffekt nicht zu behindern.
* Der Arbeitsaufwand muss 60h betragen.
* Alle erstellten Artefakte sollen im Github-Repository abgegeben werden

# Kontextabgrenzung

Es wird aus Zeitgründen kein eigenes Design System entwickelt werden und der Fokus wird nicht auf das Design gelegt um den Zeitrahmen nicht zu sprengen.

# Angedachter Technologie Stack

Folgende mittel sind geplant um das ganze umzusetzen, natürlich kann sich dass auch noch ändern wenn bei der design Phase weitere Erkenntnisse gewonnen werden.

Struktur technisch ist ein Monolith angedacht, da die Applikation klein genug ist dass die Skalierbarkeit keine Probleme bereiten sollte und so die Komplexität eingeschränkt werden kann.

**Frontend:**

* TS
* angular.js
* angular/material für die Komponenten

**Backend:**

* TS
* node.js
* express
* sqlite

# User stories

## Todo erstellen

Ich als Nutzer will ein Todo erstellen können um mich an Dinge erinnern zu können.

*Priorität:* Muss  
*Akzeptanz Kriterien:* 

* Todo wird erstellt
* Todo persistiert (browser reload / app restart)
* Nutzer wird korrekt assoziert
* Todo sichtbar in overview / Liste

## Todos als Raster anzeigen

Ich als Nutzer will eine übersichtliche Darstellung aller Todos auf die ich zugreifen kann als Raster damit ich sehe was zu tun ist.

*Priorität:* Muss  
*Akzeptanz Kriterien:* 

* Alle Todos wo der Nutzer mindestens Leserechte hat sind sichtbar
* Die Todos sind übersichtlich als Raster / grid oder ähnlichem dargestellt

## Todos als Liste anzeigen

Ich als Nutzer will schnell viele Todos überblicken können in dem ich eine Liste mit den todo Titeln benutze.

*Priorität:* Muss  
*Akzeptanz Kriterien:* 

* Alle Todos wo der Nutzer mindestens Leserechte hat sind sichtbar
* Die Todos sind übersichtlich als Raster / grid oder ähnlichem dargestellt

## Todo modifizieren

Ich als Nutzer will ein Todo modifizieren können da ich mich vertippt habe.

*Priorität:* Muss  
*Akzeptanz Kriterien:* 

* Todo wird modifiziert
* Änderung persistiert (browser reload / app restart)
* Änderung sichtbar in overview / Liste

## Todo löschen

Ich als Nutzer will ein Todo löschen können da ich es nicht mehr benötige.

*Priorität:* Muss  
*Akzeptanz Kriterien:* 

* Todo wird gelöscht
* Änderung persistiert (browser reload / app restart)
* Änderung sichtbar in overview / Liste

## Nutzer erstellen

Ich als Admin will ein Nutzer erstellen können damit diese das System benutzen können.

*Priorität:* Muss  
*Akzeptanz Kriterien:* 

* Nutzer wird erstellt
* Nutzer persistiert (app restart)

## Nutzer auflisten

Ich als Admin will ein überblick auf die existierenden Nutzern haben um diese zu bearbeiten.

*Priorität:* Muss  
*Akzeptanz Kriterien:* 

* Nutzer werden aufgelistet

## Nutzer modifizieren

Ich als Admin will ein Nutzer editieren können da dieser seine email addresse geändert hat.

*Priorität:* Muss  
*Akzeptanz Kriterien:* 

* Nutzer wird modifiziert
* Änderung persistiert (app restart)
* Änderung direkt sichtbar in Liste

## Nutzer löschen

Ich als Admin will ein Nutzer und alle dessen verfassten Todos löschen können da er nicht mehr benötigt wird.

*Priorität:* Muss  
*Akzeptanz Kriterien:* 

* Nutzer wird gelöscht
* Alle Todos verfasst vom gelöschten Nutzer werden ebenfalls gelöscht
* Änderungen persistieren (app restart)

## Logout / Login

Ich als Nutzer will mich ein- und ausloggen können damit ich die Applikation nutzen kann.

*Priorität:* Muss  
*Akzeptanz Kriterien:* 

* Nutzer kann sich einloggen und ausloggen
* ausloggen bedeutet dass keine session mehr aktiv ist, selbst wenn ein token client seitig extrahiert wurde
