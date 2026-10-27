/* Comportements du site statique CFDC (remplace le JavaScript de Next.js, qui exige son serveur).
   1. Apparition des blocs au defilement  2. Menu mobile  3. Horaires en direct  4. Formulaire de contact */
(function () {
  "use strict";

  // 1. Apparition au defilement : les blocs .reveal sont invisibles jusqu'a l'ajout de data-visible
  var blocs = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) { e.target.setAttribute("data-visible", ""); obs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    blocs.forEach(function (b) { obs.observe(b); });
  } else {
    blocs.forEach(function (b) { b.setAttribute("data-visible", ""); });
  }

  // 2. Menu mobile : construit a partir des liens du menu principal
  var bouton = document.querySelector('button[aria-controls="menu-mobile"]');
  var navPrincipale = document.querySelector('header nav[aria-label="Navigation du site"]');
  if (bouton && navPrincipale) {
    var menu = document.createElement("nav");
    menu.id = "menu-mobile";
    menu.setAttribute("aria-label", "Navigation du site");
    menu.hidden = true;
    menu.style.cssText = "border-top:1px solid var(--border);background:var(--background);padding:0 1rem 1rem";
    navPrincipale.querySelectorAll("a").forEach(function (lien) {
      var a = document.createElement("a");
      a.href = lien.getAttribute("href");
      a.textContent = lien.textContent;
      a.style.cssText = "display:block;padding:.75rem 0;border-bottom:1px solid var(--border);font-weight:500";
      if (lien.getAttribute("aria-current") === "page") { a.setAttribute("aria-current", "page"); a.style.color = "var(--primary)"; }
      menu.appendChild(a);
    });
    bouton.closest("header").appendChild(menu);
    bouton.addEventListener("click", function () {
      var ouvrir = menu.hidden;
      menu.hidden = !ouvrir;
      bouton.setAttribute("aria-expanded", String(ouvrir));
      bouton.setAttribute("aria-label", ouvrir ? "Fermer le menu" : "Ouvrir le menu");
    });
  }

  // 3. Horaires : statut ouvert/ferme a l'heure du Benin (UTC+1), jour courant en evidence
  var HORAIRES = [null, ["08:00", "19:00"], ["08:00", "19:00"], ["08:00", "19:00"], ["08:00", "19:00"], ["08:00", "19:00"], ["08:00", "12:00"]];
  var JOURS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  var statut = document.querySelector("p[aria-live=polite]");
  if (statut && statut.nextElementSibling && statut.nextElementSibling.tagName === "DL") {
    var minutes = function (h) { var p = h.split(":"); return +p[0] * 60 + +p[1]; };
    var maj = function () {
      var d = new Date(Date.now() + 3600000);
      var jour = d.getUTCDay(), min = d.getUTCHours() * 60 + d.getUTCMinutes(), h = HORAIRES[jour];
      var ouvert = h && min >= minutes(h[0]) && min < minutes(h[1]);
      var reste = ouvert ? minutes(h[1]) - min : 0;
      var texte = !ouvert ? "Fermé actuellement" : reste <= 60 ? "Ouvert · ferme dans " + reste + " min" : "Ouvert · jusqu'à " + h[1].replace(":", "H");
      var pastille = statut.querySelector("span");
      statut.textContent = "";
      if (pastille) { pastille.style.background = ouvert ? "#10b981" : ""; statut.appendChild(pastille); }
      statut.appendChild(document.createTextNode(texte));
      statut.nextElementSibling.querySelectorAll("div").forEach(function (ligne) {
        var actif = ligne.firstElementChild && ligne.firstElementChild.textContent === JOURS[jour];
        ligne.style.fontWeight = actif ? "600" : "";
        ligne.style.color = actif ? "var(--primary)" : "";
      });
    };
    maj();
    setInterval(maj, 60000);
  }

  // 4. Formulaires : l'envoi exige le serveur de l'application, absent de la version statique
  document.querySelectorAll("form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".message-statique") || document.createElement("p");
      msg.className = "message-statique";
      msg.setAttribute("role", "status");
      msg.style.cssText = "margin-top:1rem;padding:1rem;border-radius:.75rem;background:var(--muted);font-size:.9rem";
      // Coordonnees du cabinet : memes valeurs que CONTACT dans src/lib/constants.ts
      msg.innerHTML = "L'envoi en ligne n'est pas disponible sur cette version du site. Écrivez-nous à " +
        '<a href="mailto:cabinetcfdc@gmail.com" style="font-weight:600;text-decoration:underline">cabinetcfdc@gmail.com</a>' +
        ' ou appelez le <a href="tel:+2290161616342" style="font-weight:600;text-decoration:underline">+229 01 61 61 63 42</a>' +
        ' / <a href="tel:+2290194600226" style="font-weight:600;text-decoration:underline">+229 01 94 60 02 26</a>.';
      form.appendChild(msg);
    });
  });
})();
