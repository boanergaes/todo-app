export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) return "No Due Date";
  return date.toLocaleDateString();
};

export const clearAllChildren = (el) => {
  while (el.firstChild) el.removeChild(el.firstChild);
};

export const invalidInputAnimate = (el) => {
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 500);
};

export const declareTaskUi = (checkbox, descEl) => {
  if (checkbox.checked) {
    descEl.style.textDecoration = "line-through";
    descEl.style.opacity = 0.6;
  } else {
    descEl.style.textDecoration = "none";
    descEl.style.opacity = 1;
  }
};

// export function formatDate(dateStr) {
//   const date = new Date(dateStr);
//   return date.toLocaleDateString();
// }

// export function invalidInputAnimate() {
//   alert("Invalid input!");
// }

// Next IDs
export let nextProjId = 1;
export let nextTaskId = 1;
export let nextSubTaskId = 1;
