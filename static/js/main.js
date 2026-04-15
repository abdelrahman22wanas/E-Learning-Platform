(function () {
    var root = document.documentElement;
    root.classList.add("js-enabled");

    var menuButton = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-nav]");

    if (menuButton && nav) {
        menuButton.addEventListener("click", function () {
            var expanded = menuButton.getAttribute("aria-expanded") === "true";
            menuButton.setAttribute("aria-expanded", String(!expanded));
            nav.classList.toggle("is-open");
        });
    }

    var revealNodes = document.querySelectorAll(".reveal");
    if (!revealNodes.length) {
        // Continue to process progress bars even if no reveal blocks exist.
    }

    var progressBars = document.querySelectorAll(".progress[data-progress]");
    progressBars.forEach(function (bar) {
        var raw = Number(bar.getAttribute("data-progress"));
        if (Number.isNaN(raw)) {
            bar.style.width = "0%";
            return;
        }
        var bounded = Math.max(0, Math.min(100, raw));
        bar.style.width = bounded + "%";
    });

    if (!revealNodes.length) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        revealNodes.forEach(function (node) {
            node.classList.add("is-visible");
        });
        return;
    }

    var observer = new IntersectionObserver(
        function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -24px 0px",
        }
    );

    revealNodes.forEach(function (node) {
        observer.observe(node);
    });
})();
