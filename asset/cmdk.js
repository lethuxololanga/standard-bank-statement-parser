// Shared ⌘K command palette — vanilla JS, framework-agnostic (used on every page).
// Destinations are the same three routes everywhere; palette opens via click or Cmd/Ctrl+K.

(function () {
    const DESTINATIONS = [
        { label: "Home",                      hint: "Overview",   href: "/index.html" },
        { label: "Standard Bank Converter",    hint: "MyMoBiz",    href: "/standardbank.html" },
        { label: "GoTyme Converter",           hint: "Bank App",   href: "/gotyme.html" },
    ];

    function buildPalette() {
        const overlay = document.createElement("div");
        overlay.className = "cmdk-overlay";
        overlay.setAttribute("aria-hidden", "true");

        const dialog = document.createElement("div");
        dialog.className = "cmdk-dialog";
        dialog.setAttribute("role", "dialog");
        dialog.setAttribute("aria-modal", "true");
        dialog.setAttribute("aria-label", "Jump to page");

        dialog.innerHTML = `
            <div class="cmdk-input-row">
                <i class="ph ph-magnifying-glass"></i>
                <input class="cmdk-input" type="text" placeholder="Jump to a converter…" autocomplete="off" />
                <kbd class="cmdk-kbd">esc</kbd>
            </div>
            <div class="cmdk-results" role="listbox"></div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        const input = dialog.querySelector(".cmdk-input");
        const results = dialog.querySelector(".cmdk-results");
        let activeIndex = 0;

        function render(filter) {
            const q = (filter || "").toLowerCase();
            const items = DESTINATIONS.filter(d => d.label.toLowerCase().includes(q));
            results.innerHTML = items.map((d, i) => `
                <a class="cmdk-item${i === activeIndex ? " is-active" : ""}" href="${d.href}" role="option" data-idx="${i}">
                    <span>${d.label}</span>
                    <span class="cmdk-item-hint">${d.hint}</span>
                </a>
            `).join("") || `<div class="cmdk-empty">No matches</div>`;
            return items;
        }

        let currentItems = render("");

        function open() {
            overlay.classList.add("is-open");
            overlay.setAttribute("aria-hidden", "false");
            input.value = "";
            activeIndex = 0;
            currentItems = render("");
            document.body.style.overflow = "hidden";
            setTimeout(() => input.focus(), 0);
        }

        function close() {
            overlay.classList.remove("is-open");
            overlay.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        }

        input.addEventListener("input", () => {
            activeIndex = 0;
            currentItems = render(input.value);
        });

        dialog.addEventListener("keydown", e => {
            if (e.key === "Escape") { close(); return; }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                activeIndex = Math.min(activeIndex + 1, currentItems.length - 1);
                currentItems = render(input.value);
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                activeIndex = Math.max(activeIndex - 1, 0);
                currentItems = render(input.value);
            }
            if (e.key === "Enter" && currentItems[activeIndex]) {
                window.location.href = currentItems[activeIndex].href;
            }
        });

        overlay.addEventListener("click", e => { if (e.target === overlay) close(); });

        return { open, close };
    }

    document.addEventListener("DOMContentLoaded", () => {
        const palette = buildPalette();

        document.querySelectorAll("[data-cmdk-trigger]").forEach(btn => {
            btn.addEventListener("click", palette.open);
        });

        document.addEventListener("keydown", e => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                palette.open();
            }
        });
    });
})();
