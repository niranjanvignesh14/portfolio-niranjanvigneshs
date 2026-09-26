/* Pulls public repositories live from the GitHub API and renders them
   into #projects-list. No build step, no auth — add a new public repo
   on GitHub and it shows up here on the next page load. */

(function () {
  var GITHUB_USER = "niranjanvignesh14";
  // Repo names to leave out of the grid (e.g. this portfolio's own repo).
  var HIDE_REPOS = ["portfolio-niranjanvigneshs-repo", GITHUB_USER + ".github.io"];

  var container = document.getElementById("projects-list");
  if (!container) return;

  fetch("https://api.github.com/users/" + GITHUB_USER + "/repos?sort=updated&per_page=100")
    .then(function (res) {
      if (!res.ok) throw new Error("GitHub API returned " + res.status);
      return res.json();
    })
    .then(function (repos) {
      var visible = repos
        .filter(function (r) { return !r.fork; })
        .filter(function (r) { return HIDE_REPOS.indexOf(r.name) === -1; })
        .sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); });

      if (visible.length === 0) {
        container.innerHTML = '<p class="projects-status">No public repositories yet — new ones will appear here automatically.</p>';
        return;
      }

      container.innerHTML = "";
      visible.forEach(function (repo) {
        var card = document.createElement("a");
        card.className = "project-card";
        card.href = repo.html_url;
        card.target = "_blank";
        card.rel = "noopener";

        var name = document.createElement("h4");
        name.textContent = repo.name;

        var desc = document.createElement("p");
        desc.className = "project-desc";
        desc.textContent = repo.description || "No description yet.";

        var meta = document.createElement("div");
        meta.className = "project-meta";

        if (repo.language) {
          var lang = document.createElement("span");
          lang.textContent = repo.language;
          meta.appendChild(lang);
        }
        if (repo.stargazers_count > 0) {
          var stars = document.createElement("span");
          stars.textContent = "★ " + repo.stargazers_count;
          meta.appendChild(stars);
        }
        var updated = document.createElement("span");
        var d = new Date(repo.pushed_at);
        updated.textContent = "Updated " + d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
        meta.appendChild(updated);

        card.appendChild(name);
        card.appendChild(desc);
        card.appendChild(meta);
        container.appendChild(card);
      });
    })
    .catch(function (err) {
      container.innerHTML = '<p class="projects-status">Couldn\'t load repositories right now. <a href="https://github.com/' + GITHUB_USER + '" target="_blank" rel="noopener">View them directly on GitHub</a>.</p>';
      console.error(err);
    });
})();
