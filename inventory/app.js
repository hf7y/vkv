// === Configuration ===
// Replace this with your deployed Apps Script endpoint
const API_URL = "https://script.google.com/macros/s/AKfycbyP3Oc-XvBGUts_8W7z4MYAlO6_DDRuPo29Rz-BYm86TbQAW9vJjpdAhobZbhqJDboMBg/exec";

// === Utility Functions ===

/**
 * Extract object ID from URL hash.
 * Example: #id=shelf-a → "shelf-a"
 */
function getIdFromHash() {
  const hash = window.location.hash.slice(1); // removes "#"
  const params = new URLSearchParams(hash);
  return params.get("id");
}

/**
 * Optional helper: set hash without reloading
 */
function setHashToId(id) {
  window.location.hash = `id=${id}`;
}

/**
 * Show loading or error messages
 */
function showMessage(text) {
  const status = document.getElementById("status-message");
  if (status) {
    status.innerHTML = `<p>${text}</p>`;
  } else {
    console.warn("Element #status-message not found.");
  }
}

/**
 * Fetch data from the Apps Script API
 */
async function fetchObjectData(id) {
  const response = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`);
  if (!response.ok) throw new Error("Failed to load object data");
  return await response.json(); // expected shape: { data, parentId, childObjects }
}

// === Rendering ===

/**
 * Populate the page with the object and its children
 */
function renderObjectPage({ data, parentId, childObjects }) {
  const container = document.getElementById("object-details");
  const childrenSection = document.getElementById("child-list");
  const backLink = document.getElementById("back-link");

  // Clear content
  container.innerHTML = "";
  childrenSection.innerHTML = "";
  backLink.innerHTML = "";

  // Show main object data
  const title = document.createElement("h2");
  title.textContent = data.Label || "Untitled";
  container.appendChild(title);

  const info = document.createElement("p");
  info.innerHTML = `
    <strong>ID:</strong> ${data.ID}<br>
    <strong>Category:</strong> ${data.Category || "—"}<br>
    <strong>Description:</strong> ${data.Description || "—"}<br>
    ${data["Prefilled URL"] ? `<a href="${data["Prefilled URL"]}" target="_blank">Update</a><br>` : ""}
    ${data.Photo ? `<a href="${data.Photo}" target="_blank">View Photo</a><br>` : ""}
  `;
  container.appendChild(info);

  // Optional back link
  if (parentId) {
    backLink.innerHTML = `<a href="#id=${parentId}">← Back to ${parentId}</a>`;
  } else {
    backLink.innerHTML = `<a href="map.html">← Back to Inventory Map</a>`;
  }

  // List child objects
  if (childObjects && childObjects.length > 0) {
    childObjects.forEach((child) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#id=${child.ID}`;
      link.textContent = child.Label || child.ID;
      li.appendChild(link);
      childrenSection.appendChild(li);
    });
  }
}

// === Main Controller ===

/**
 * Called on initial load + any hash change
 */
async function loadCurrentObject() {
  const id = getIdFromHash();
  if (!id) {
    showMessage("No object ID found. Please select from the map.");
    return;
  }

  try {
    showMessage("Loading...");
    const objectData = await fetchObjectData(id);
    renderObjectPage(objectData);
    showMessage(""); // clear message after render
  } catch (err) {
    console.error(err);
    showMessage("Error loading object: " + err.message);
  }
}

// === Boot ===

window.addEventListener("DOMContentLoaded", loadCurrentObject);
window.addEventListener("hashchange", loadCurrentObject);
