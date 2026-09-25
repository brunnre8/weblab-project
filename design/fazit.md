# Fazit & Reflexion

## Was ist gut gelaufen?

Die Entwicklung des backends lief (relativ gsehen) gut. Ich konnte mich zügig mit express anfreunden.  
Nach einigen Startschwierigkeiten mit vitest war auch da dann das Testen ok.

Da ich sqlite schon kannte, war die Wahl der DB Technologie zweckmässig.

Ich wusste so ca. wie ich das ganze Strukturieren sollte mit den Controllern / Services etc.

## Wo lagen die Herausforderungen?

Eh... man kann es zusammenfassen mit folgendem Zitat:

> vergib ihnen, denn sie wissen nicht, was sie tun

Ich bin kein Frontend Entwickler und hab viele der Technologien (angular, allgemein CSS / html layouts, docker) nicht im Griff, respektive musste vieles Nachschlagen und recherchieren.  
Das Problem da war primär dass viele Seiten im Internet den einfachen 2-Zeiler zeigen, statt das sauber zu strukturieren.

Ein Beispiel dafür, ist wie man die Resourcen vom backend lädt... wenn ich die httpResource so wie meistens gezeigt direkt in den component stecke habe ich keine Isolierung in Services.  
Generell war ich verwirrt wie ich jetzt umgehen soll mit Resourcen, signals und Observables und mir war nicht so klar wie man dies in "richtigen" Projekten macht. Die Literatur die ich dazu gefunden habe hat zwar etwas geholfen, aber die Recherche hat mich aber auch extrem viel Zeit gekostet.

Ich HTML / CSS meistens konsumiert, aber selten selber schreiben müssen. Durch die Anforderung dass die Applikation auf Handy und Tablet responsive laufen muss hatte ich häufig Probleme dass dies auch entsprechend geschieht. (weder flexbox noch CSS grids kannte ich vorher im Detail).

Da ich die Struktur nicht vorherein geplant hatte, musste ich öfters mal den code umschreiben wenn ich später beim layout gemerkt habe dass es nicht so wie angedacht funktioniert (Beispiel: Tabelle für die Nutzer wird zu breit wenn ich da den delete Knopf in die rows packe). Diverse payloads vom backend musste ich auch anpassen als ich merkte dass das frontend wissen muss als welchen Nutzer er eingeloggt ist.

Das frontend ist leider nicht stark getestet, primär weil ich gegen Ende keine Zeit mehr hatte, respektive Probleme hatte wie ich das ganze machen muss. Der Test harness Aufbau für Modals hat mich ein paar Stunden gekostet, weil ich den Error nicht verstanden habe.

## Was würden Sie das nächste Mal anders resp. besser machen?

Ich würde weniger Zeit darauf verwenden (verschwenden?) mich mit den ganzen OpenID / OAuth specs auseinander zu setzen. Auch wenn ich viel dabei gelernt habe, war es am Schluss nicht produktiv, im Sinne von dass es jetzt im finalen Produkt ersichtlich wäre.

Zudem hätte etwas mehr Vorwissen zu den benutzten Frameworks nicht geschadet. Die Grundzüge von angular sind relativ schnell verstanden, aber beim tatsächlichen Umsetzen hatte ich häufig Schwierigkeiten wie man dass in einer grösseren Applikation Strukturiert.
