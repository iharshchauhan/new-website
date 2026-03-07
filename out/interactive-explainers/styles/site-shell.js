(function () {
  var marker = "/interactive-explainers/";
  var path = window.location.pathname || "";
  var markerIndex = path.indexOf(marker);

  if (markerIndex === -1) return;

  var basePath = path.slice(0, markerIndex);
  var homeHref = basePath + "/";
  var logbookHref = basePath + "/logbook/";
  var aboutHref = basePath + "/about/";
  var playbookHref = basePath + "/projects/interactive-explainers-framework/";

  var referrer = document.referrer;
  if (referrer) {
    try {
      var refUrl = new URL(referrer);
      if (refUrl.origin === window.location.origin) {
        var refPath = refUrl.pathname || "";
        if (refPath.indexOf(marker) === -1) {
          var source = refPath.indexOf("/projects/interactive-explainers-framework") >= 0 ? "playbook" : "home";
          sessionStorage.setItem("interactiveExplainersBackTarget", source);
        }
      }
    } catch (_error) {
      // no-op
    }
  }

  var backTarget = sessionStorage.getItem("interactiveExplainersBackTarget");
  var backToPlaybook = backTarget === "playbook";
  var backHref = backToPlaybook ? playbookHref : homeHref;
  var backLabel = backToPlaybook ? "Back to Playbook" : "Back to Home";

  var shell = document.createElement("div");
  shell.className = "ie-shell";
  shell.innerHTML =
    '<div class="ie-shell__inner">' +
    '<nav class="ie-shell__nav" aria-label="Site">' +
    '<a href="' + homeHref + '">Home</a>' +
    '<a href="' + logbookHref + '">Logbook</a>' +
    '<a href="' + aboutHref + '">About</a>' +
    "</nav>" +
    '<a class="ie-shell__back" href="' + backHref + '">' + backLabel + "</a>" +
    "</div>";

  var body = document.body;
  if (!body) return;
  body.insertBefore(shell, body.firstChild);
})();
