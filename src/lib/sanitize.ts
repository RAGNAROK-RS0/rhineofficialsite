export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim();
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizeHtml(html: string): string {
  const allowedTags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const temp = document.createElement('div');
  temp.textContent = html;
  
  const scripts = temp.querySelectorAll('script, style, iframe, object, embed');
  scripts.forEach(el => el.remove());
  
  return temp.innerHTML;
}

export function validateInput(input: string, maxLength = 500): boolean {
  return input.length > 0 && input.length <= maxLength;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}