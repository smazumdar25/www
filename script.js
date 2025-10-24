'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
if (modalCloseBtn && overlay) {
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}




// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    // Remove 'active' class from all buttons
    navLinks.forEach(nav => nav.classList.remove("active"));
    // Add 'active' to clicked button
    link.classList.add("active");

    // Get target page from button text
    const targetPage = link.textContent.trim().toLowerCase();

    // Show/hide pages based on button
    pages.forEach(page => {
      if (page.dataset.page.toLowerCase() === targetPage) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    });

    // Optional: scroll to top
    window.scrollTo(0, 0);
  });
});
/** -----------------------------
 * IEEE Publications Enhancements
 * ----------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  const bookCover = document.getElementById("book-6g-cover");
  if (!bookCover) return;

  const scidir = "https://www.sciencedirect.com/science/article/abs/pii/B9780443274343000179";

  try {
    const proxy = "https://r.jina.ai/http/" + scidir.replace(/^https?:\/\//, "");
    const res = await fetch(proxy, { cache: "no-store" });
    const text = await res.text();
    const match = text.match(/https?:\/\/\S+\.(?:jpg|png)(?=[^\w-]|$)/ig);
    const cover = (match || []).find(u => /cov|cover|image\/1-s2\.0/i.test(u)) || (match || [])[0];

    if (cover) {
      bookCover.src = cover;
      bookCover.alt = "Book cover (auto-fetched): Human-Centric Integration of 6G-Enabled Technologies for Modern Society";
    } else {
      bookCover.src = "https://via.placeholder.com/120x170?text=Cover+unavailable";
    }
  } catch (err) {
    bookCover.src = "https://via.placeholder.com/120x170?text=Cover+unavailable";
  }
});
const filterButtons = document.querySelectorAll("[data-filter]");
const publicationItems = document.querySelectorAll(".pub-list li");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Update active button
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    publicationItems.forEach(item => {
      if (filter === "all" || item.dataset.type === filter) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});

// Handle Contact Form Submission (rectified)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return; // Safe-guard if form isn't on the page

  // (Optional) improve accessibility for live updates
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");

  // Grab the submit button inside the form (works even if you change its classes)
  const submitBtn = form.querySelector('button[type="submit"], [data-form-btn]');

  // Simple client-side validation helper
  const isValid = () =>
    form.fullname?.value?.trim() &&
    form.email?.value?.trim() &&
    form.message?.value?.trim();

  const setStatus = (text, css = "") => {
    status.className = `form-status ${css}`.trim(); // works with CSS you add
    status.textContent = text;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Basic validation feedback
    if (!isValid()) {
      setStatus("❗ Please fill out all fields.", "error show");
      return;
    }

    // Compose payload
    const data = {
      fullname: form.fullname.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    // UI: loading state
    setStatus("⏳ Sending...", "loading show");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-disabled", "true");
    }

    // Abort if it hangs too long (e.g., network hiccups)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbxejQ_fRiPJ6XD8bNem8l-ToDuSkNkYnXQNpM36HrsMZBVNzxt_fq209LLY_ZyRBzt7yQ/exec",
        {
          method: "POST",
          mode: "no-cors", // with GAS default, response will be "opaque"
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      /**
       * NOTE on no-cors:
       * - The response will be "opaque" and unreadable even on success.
       * - If the network request itself doesn't throw, we optimistically show success.
       * To get verifiable success/failure, configure CORS on your Apps Script web app and remove `mode: "no-cors"`.
       */
      const wasOpaque = res && res.type === "opaque";
      if (wasOpaque || (res && res.ok)) {
        setStatus("✅ Message sent successfully!", "success show");
        form.reset();
        // auto-hide after a moment
        setTimeout(() => status.classList.remove("show"), 3000);
      } else {
        // Rare path if `no-cors` is removed and we get a non-2xx response
        setStatus("❌ Failed to send. Please try again.", "error show");
      }
    } catch (err) {
      // Handles AbortError, network errors, etc.
      console.error(err);
      setStatus("❌ Failed to send. Please check your connection and try again.", "error show");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.setAttribute("aria-disabled", "false");
      }
    }
  });
});