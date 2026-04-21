document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("quarto-sidebar");
  if (!sidebar) return;

  const navContainer = sidebar.querySelector(".sidebar-menu-container");
  if (!navContainer) return;

  let expanded = false;

  const btn = document.createElement("button");
  btn.id = "sidebar-toggle-all";
  btn.textContent = "▼ Alle ausklappen";
  btn.style.cssText = [
    "display:block",
    "width:calc(100% - 24px)",
    "margin:12px 12px 6px",
    "padding:5px 10px",
    "font-size:0.78em",
    "cursor:pointer",
    "border:1px solid rgba(128,128,128,0.3)",
    "border-radius:4px",
    "background:transparent",
    "color:inherit",
    "opacity:0.65",
    "text-align:center",
  ].join(";");

  btn.addEventListener("mouseenter", () => { btn.style.opacity = "1"; });
  btn.addEventListener("mouseleave", () => { btn.style.opacity = "0.65"; });

  btn.addEventListener("click", function () {
    expanded = !expanded;
    sidebar.querySelectorAll(".collapse").forEach(function (el) {
      el.classList.toggle("show", expanded);
      const id = el.id;
      if (id) {
        const trigger = sidebar.querySelector('[data-bs-target="#' + id + '"]');
        if (trigger) trigger.setAttribute("aria-expanded", String(expanded));
      }
    });
    btn.textContent = expanded ? "▲ Alle einklappen" : "▼ Alle ausklappen";
  });

  // Place button at the bottom of the sidebar nav container
  navContainer.appendChild(btn);
});
