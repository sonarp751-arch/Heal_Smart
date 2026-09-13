export let currentPortal = 'pharma'; // 'pharma' | 'patient'
export let currentPage = '';
export const chatHistory = [];

export function setCurrentPortal(portal) {
  currentPortal = portal;
}

export function setCurrentPage(page) {
  currentPage = page;
}
