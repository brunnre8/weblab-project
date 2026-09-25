# Einführung und Ziele

Das Projekt ist eine Todo Applikation welche es multiplen Usern erlaubt Todos zu erstellen und zu modifizieren.  
Für Administratoren ist ein user management interface erreichbar.

## Funktionale Anforderungen

* Die Applikation muss das Erstellen, Anzeigen, Ändern und Löschen sowohl von Nutzern als auch Todos ermöglichen.
* Zugriffsberechtigungen müssen sicher stellen dass Nutzer nur die freigegebenen Todos sehen können.
* Die Daten müssen persistent in einer Datenbank abgelegt werden.

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

Es wird aus Zeitgründen kein eigenes Design System entwickelt und der Fokus wird nicht auf das Design gelegt um den Zeitrahmen nicht zu sprengen.

# Lösungsstrategie

## Organisation
Die Applikation ist monolithisch organisiert, frontend und backend befinden sich in einem Repo da dies den Unterhalt für die relativ kleine Software vereinfacht.  

Frontend und Backend befinden sich in entsprechend benannten Verzeichnissen. Sie sind isoliert und teilen keinen Code. Dies soll es erlauben in Zukunft die monolithische Struktur zu ändern sollte dies notwendig werden.

## Frontend

**Techstack:**

* TS
* angular
* angular/material für die Komponenten
* caddy als reverse proxy / file host

Organisiert in high level features (todos, users, ...) sowie models für die unterliegende Datenstruktur.

Features bestehen aus Services, sowie Logik Komponenten.

Logik Komponenten benutzen services um Daten zu laden und stellen diese mit "dumb" components dar. Sie benutzen häufig die [material components](https://material.angular.dev/).

Komponenten in den "dumb" Verzeichnissen dürfen keine Daten selber laden und dürfen nicht auf services zugreifen.

Ein interceptor leitet den Nutzer auf die Anmeldeseite um sobald vom backend ein 401 status code empfangen wird.

## Backend

**Techstack:**

* TS
* node
* express
* sqlite

Organisiert in high level features (todo, users, middleware...) welche code teilen dürfen.

Es gibt zwei "user facing" features, "todos" und "users".

Generell ist der Aufbau für beide features

```
[user] -> [controller] -> [service] -> [store]
```

* controller: Handhabung aller HTTP Aspekte aber enthält geringe Applikations-Logik
* services: Validierung / Applikations-Logik. Benutzen die relevanten stores
* store: Persistenter Speicher für die jeweiligen Entitäten.

Authentifizierung / Autorisierung ist mit middleware gelöst.

Momentan sind alle stores innerhalb einer Klasse implementiert (`SqliteStore`), allerdings lässt die code Struktur via interfaces auch andere Implementierungen zu.

# Laufzeitsicht

## Authentifizierung

Die Authentifizierung ist intern der Applikation geregelt und beruht auf direkten Authentifizierungs-token welche in cookies (http-only und secure) abgelegt werden.

Der server validiert das token bei jedem request, heisst ein logout macht ein token ohne Zeitverzögerung ungültig.

Login:
```
[user] -- email + pw ---------------> [backend]
       <-- http only access cookie --
       --------- cookie ------------>
```

Logout:
```
[user] ------ cookie ---------------> [backend, invalidiert token]
       <-- löscht access cookie -----
```

Tokens bleiben für einen Monat gültig, danach muss der Nutzer neu einloggen.

Um die Handhabung zu vereinfachen ist die Logik im backend via middleware zentralisiert, der ganze `/api/` Pfad ist nur von eingeloggten Nutzern zugreifbar. Ebenso ist `/users/` nur von Nutzern mit der Rolle "admin" verfügbar.

Im Frontend wird mit einem Interceptor auf dem http client automatisch auf die login Seite umgeleitet wenn ein 401 Status empfangen wird. Das cookie selber ist *nicht* mittels JS lesbar und kann nicht durch XSS oder ähnliche Verfahren exfiltriert werden.

## CSRF Schutz

Der CSRF Schutz ist gewährleistet in dem die `sec-fetch-site` und `sec-fetch-mode` headers überprüft werden, welche alle modernen browser setzen.

Ein ähnlicher Ansatz ist in der [go standard library](https://pkg.go.dev/net/http@go1.27.1#CrossOriginProtection) zu finden.

# Architekturentscheidungen

## Auth

Es wurden diverse Technologien für die Umsetzung der Authentifizierung in Betracht gezogen, unter anderem Open ID Connect oder auch die Benutzung von JWTs.

Open ID Connect ist allerdings ziemlich kompliziert und schwierig zum implementieren da ein discovery endpoint + der ganze OAuth2 stack aufgesetzt werden müssen.

Keiner der Entwickler hatte Erfahrungen mit den (langen und vielseitigen) Spezifikationen und der Ansatz wurde aus folgenden Gründen verworfen:

**Kein delegierter login**:

Der client code muss sich gegenüber dem backend autorisieren. Die specs sind aber primär auf den delegierten Fluss ausgelegt wo mit einem dritt-Server kommuniziert wird.

**JS Zugriff**:

Es ist sicherer wenn der access token nie für javascript code verfügbar ist um bei allfälligen XSS Attacken robuster zu sein. Dies spricht ebenfalls gegen die OIDC Protokolle (der token müsste vom frontend in local storage abgelegt werden). Deshalb wurde hier mittels cookie-prefixen forciert dass der cookie die http only und secure flags gesetzt hat.

Dieses Sicherheitsfeature wird teilweise vom code deaktiviert basierend auf environment variables (TODO_INSECURE_COOKIES) wenn kein https möglich ist, die http only flag bleibt aber gesetzt.

**Token invalidierung**:

Wenn ein Nutzer sich ausloggt, muss das token direkt invalidert werden, heisst das backend muss dieses bei jedem request validieren, nur die JWT Signatur prüfen erfüllt die Anforderungen nicht.

**JWT vs Zufalls-token**:

Wenn das backend sowieso jeden request überprüfen muss, hat ein JWT keinen Mehrwert gegenüber einem einfachen zufällig generiertem string. Die User Informationen werden serverseitig abgerufen.

## DB

Als storage backend wurde sqlite verwendet, da der Author damit am vertrautesten war. Zudem hat node mittlerweile direkten support, heisst es muss nicht noch eine externe DB aufgesetzt und unterhalten werden.

Eine Schwäche ist allerdings dass die sqlite API in node noch synchronisiert ist, heisst es blockiert den event loop.  
Eine async Implementierung wird momentan diskutiert und wird mit hoher Wahrscheinlichkeit Einzug finden werden, wonach der code angepasst werden könnte.

Sqlite ist allerdings schnell und für die zu erwartenden Nutzerzahlen sollte die Wahl keine Probleme bereiten.  
Da wenig spezialisiertes SQL geschrieben wurde (keine extensions etc) dürfte die Portierung zu postgres oder ähnlichem relativ simpel sein, sollte sich dies als eine falsche Annahme herausstellen.

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

## Nutzer deaktivieren

Ich als Admin will ein Nutzer deaktivieren können weil Missbrauch vermutet wird.

*Priorität:* Soll  
*Akzeptanz Kriterien:* 

* Nutzer kann nicht einloggen
* Alle Todos verfasst vom deaktivierten Nutzer bleiben erhalten
* Änderungen persistieren (app restart)

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
