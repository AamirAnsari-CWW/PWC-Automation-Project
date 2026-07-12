const escapeRegExp = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const replaceEditableText = (html, texts) => {
  return Object.entries(texts || {}).reduce((nextHtml, [fieldId, value]) => {
    if (value === undefined || value === null) {
      return nextHtml;
    }

    const fieldPattern = escapeRegExp(fieldId);
    const textPattern = new RegExp(`(\\.call\\(text_reveal, \\[${fieldPattern},\\s*\")([^\"]*)(\")`, "g");

    return nextHtml.replace(textPattern, (_match, prefix, _currentValue, suffix) => {
      return `${prefix}${value}${suffix}`;
    });
  }, html);
};

module.exports = {
  replaceEditableText,
};
