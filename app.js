
// =====================================
// SAFE HAVEN - S.T.A.Y
// Support | Trust | Acceptance | You Matter
// =====================================

let trustedContacts = [];
let feedbackEntries = [];

let currentLatitude = null;
let currentLongitude = null;


// 1. PAGE NAVIGATION

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const page = document.getElementById(pageId);

  if (page) {
    page.classList.add("active");
  }

  document.querySelectorAll(".bottom-nav button")
    .forEach(button => button.classList.remove("selected"));

  const pages = ["home", "contacts", "location", "safety", "help"];
  const index = pages.indexOf(pageId);

  if (index !== -1) {
    document.querySelectorAll(".bottom-nav button")[index]
      ?.classList.add("selected");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}


// 2. SOS EMERGENCY BUTTON

function activateSOS() {
  document.getElementById("sosModal")?.classList.add("show");
}

function closeSOS() {
  document.getElementById("sosModal")?.classList.remove("show");
}


// 3. LOGIN DEMONSTRATION

function showLogin() {
  document.getElementById("loginModal")?.classList.add("show");
}

function closeLogin() {
  document.getElementById("loginModal")?.classList.remove("show");
}


// 4. ADD TRUSTED CONTACTS

function addContact() {
  const name = document.getElementById("contactName").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();

  if (!name || !phone) {
    alert("Please enter both name and phone number.");
    return;
  }

  if (!/^\+?[0-9\s()-]{7,20}$/.test(phone)) {
    alert("Please enter a valid phone number.");
    return;
  }

  trustedContacts.push({ name, phone });

  document.getElementById("contactName").value = "";
  document.getElementById("contactPhone").value = "";

  displayContacts();

  alert(name + " has been added!");
}


// 5. DISPLAY TRUSTED CONTACTS

function displayContacts() {
  const list = document.getElementById("contactList");

  if (!list) return;

  list.replaceChildren();

  if (trustedContacts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No trusted contacts added yet.";
    list.appendChild(empty);
    return;
  }

  trustedContacts.forEach((contact, index) => {
    const item = document.createElement("div");
    item.className = "contact-item";

    const title = document.createElement("strong");
    title.textContent = "♙ " + contact.name;

    const number = document.createElement("small");
    number.textContent = contact.phone;

    const actions = document.createElement("div");
    actions.className = "contact-actions";

    const call = document.createElement("a");
    call.textContent = "Call";
    call.href = "tel:" + contact.phone;

    const message = document.createElement("a");
    message.textContent = "Message";
    message.href = "sms:" + contact.phone;

    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.className = "delete-btn";

    remove.addEventListener("click", () => {
      trustedContacts.splice(index, 1);
      displayContacts();
    });

    actions.append(call, message, remove);
    item.append(title, number, actions);
    list.appendChild(item);
  });
}


// 6. GET CURRENT LOCATION

function getLocation() {
  const status = document.getElementById("locationStatus");
  const details = document.getElementById("locationDetails");

  if (!navigator.geolocation) {
    alert("Location services are not supported.");
    return;
  }

  if (status) status.textContent = "Getting your location...";

  navigator.geolocation.getCurrentPosition(
    position => {
      currentLatitude = position.coords.latitude;
      currentLongitude = position.coords.longitude;

      if (status) status.textContent = "✓ Location ready";
      if (details) details.textContent =
        "Your location has been obtained.";

      const mapLink = createLocationLink();

      const map = document.getElementById("mapLink");

      if (map) {
        map.href = mapLink;
        map.textContent = "View location on map";
      }
    },

    error => {
      if (status) status.textContent = "Location unavailable";

      if (details) {
        details.textContent =
          "Please allow location permission and try again.";
      }

      alert("Unable to access location. Check your permissions.");
    },

    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  );
}


// 7. CREATE MAP LINK

function createLocationLink() {
  if (currentLatitude === null || currentLongitude === null) {
    return "";
  }

  return "https://www.google.com/maps?q=" +
    currentLatitude + "," + currentLongitude;
}


// 8. SHARE LOCATION

async function shareLocation() {
  if (currentLatitude === null) {
    alert("Please get your location first.");
    getLocation();
    return;
  }

  const link = createLocationLink();

  const message =
    "Safe Haven location update. Please check on me: " + link;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Safe Haven Location",
        text: message
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        alert("Unable to share. Please try again.");
      }
    }
  } else {
    try {
      await navigator.clipboard.writeText(message);
      alert("Location link copied. Send it to a trusted contact.");
    } catch (error) {
      prompt("Copy this location link:", message);
    }
  }
}


// 9. FEEDBACK SYSTEM

function submitFeedback() {
  const name = document.getElementById("feedbackName").value.trim();
  const comment = document.getElementById("feedbackText").value.trim();

  if (!name || !comment) {
    alert("Please enter your name and feedback.");
    return;
  }

  feedbackEntries.unshift({ name, comment });

  document.getElementById("feedbackName").value = "";
  document.getElementById("feedbackText").value = "";

  displayFeedback();

  alert("Thank you for your feedback!");
}


// 10. DISPLAY COMMENTS

function displayFeedback() {
  const list = document.getElementById("feedbackList");

  if (!list) return;

  list.replaceChildren();

  if (feedbackEntries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No comments yet.";
    list.appendChild(empty);
    return;
  }

  feedbackEntries.forEach(entry => {
    const card = document.createElement("div");
    card.className = "tip-card";

    const heading = document.createElement("h3");
    heading.textContent = "✦ " + entry.name;

    const comment = document.createElement("p");
    comment.textContent = entry.comment;

    card.append(heading, comment);
    list.appendChild(card);
  });
}


// 11. INITIALIZE APPLICATION

document.addEventListener("DOMContentLoaded", () => {
  displayContacts();
  displayFeedback();

  console.log("Safe Haven S.T.A.Y is ready!");
});
          
