# Projekt Anforderungen
Nachfolgend sind die grundlegenden Anforderungen für das Weblab-Projekt aufgeführt.

## Allgemeines
* Verwendung von AI (Agents) ist erlaubt
* **Sie** (nicht AI) sollten ca. 60h in die Arbeit investieren
* Es ist ein strukturiertes und systematisches Entwicklungsvorgehen anzuwenden.


## Funktionale Anforderungen
> Diese Anforderungen verstehen sich als **Mindestanforderungen**
* Die Applikation muss das Erstellen, Anzeigen, Ändern und Löschen einer selbständig definierten Resource ermöglichen.
* Die Daten müssen persistent in einer Datenbank abgelegt werden.
* Die Daten müssen in mindestens zwei inhaltlich unterschiedlichen Darstellungsformen präsentiert werden.

## Nicht funktionale Anforderungen
* Die Applikation soll neben der Desktop-Ansicht, auch für die Mobile/Tablet-Ansicht optimiert sein.
* Die Funktionalitäten sollen mittels sinnvollen automatisierten **Unit/Integration/E2E-Tests** überprüft werden.
* [Lighthouse-Score](https://developer.chrome.com/docs/lighthouse?hl=de) von mindestens 90 (Durchschnitt aller Analysen) für Mobile sowie Desktop.
* Das **Prod-Bundle** der Applikation soll reproduzierbar gestartet werden können.
  * Option 1: Deployed auf einer öffentlichen URL
  * Option 2: via Docker-Compose mit einem Command (`docker compose up`) ausführbar
* Code-Lesbarkeit & Erweiterbarkeit
* Sinnvolle & durchdachte Strukturierung der gesamten Applikation

## Optionale Ideen
* Automatisiertes Deployment 
* API-First-Ansatz
* Eigene Design Library / Component Library
* Login / Authentifizierung 
* Rollen und Berechtigungen
* ...