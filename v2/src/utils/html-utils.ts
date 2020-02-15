function createElementFromHtml(html) {
  const template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result.
  template.innerHTML = html;
  return template.content.firstChild;
}
