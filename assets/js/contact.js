document.addEventListener("DOMContentLoaded", function () {
  const serviceSelect = document.getElementById("service");
  const contactForm = document.getElementById("contactForm");
  const submitButton = contactForm.querySelector("button[type='submit']");
  const formMessage = document.getElementById("formMessage");
  let allowSubmission = true;
  let resetTimeout;

  // Inject modal HTML if not already present
  if (!document.getElementById("customModal")) {
    const modalHTML = `
      <div id="customModal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center;">
        <div style="background:white; padding:2rem; border-radius:12px; max-width:500px; width:90%; text-align:center;">
          <p style="font-size:1.1rem; margin-bottom:1.5rem;">
            Do you have planned dates, times, images of related event, and detailed content?
          </p>
          <div>
            <label><input type="radio" name="event-info" value="yes" id="radioYes" /> Yes</label>
            <label style="margin-left:2rem;"><input type="radio" name="event-info" value="no" id="radioNo" /> No</label>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  const modal = document.getElementById("customModal");
  const radioYes = document.getElementById("radioYes");
  const radioNo = document.getElementById("radioNo");

  serviceSelect.addEventListener("change", function () {
    const selected = serviceSelect.value;
    if (selected.includes("Semi-Dynamic Website Development")) {
      modal.style.display = "flex";
    } else {
      allowSubmission = true;
      submitButton.disabled = false;
      formMessage.style.display = "none";
      if (resetTimeout) clearTimeout(resetTimeout);
    }
  });

  function handleChoice(choice) {
    modal.style.display = "none";

    if (choice === "yes") {
      allowSubmission = true;
      submitButton.disabled = false;
      formMessage.style.display = "none";
    } else if (choice === "no") {
      allowSubmission = false;
      submitButton.disabled = true;
      formMessage.textContent =
        "Please prepare the necessary images, dates, and event details. Then return and fill this form again. Thank you!";
      formMessage.className = "form-message error";
      formMessage.style.display = "block";

      // Optional timeout: re-enable form after 60 seconds
      resetTimeout = setTimeout(() => {
        allowSubmission = true;
        submitButton.disabled = false;
        formMessage.style.display = "none";
        serviceSelect.value = ""; // 👈 Reset dropdown
      }, 15000); // 15,000ms = 15 seconds
    }

    // Reset radio selection
    radioYes.checked = false;
    radioNo.checked = false;
  }

  radioYes.addEventListener("change", () => handleChoice("yes"));
  radioNo.addEventListener("change", () => handleChoice("no"));

  contactForm.addEventListener("submit", function (e) {
    if (!allowSubmission) {
      e.preventDefault();
    }
  });
});
