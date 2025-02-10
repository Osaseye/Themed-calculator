let display = document.getElementById("display");
    let currentInput = "";
    let themeIndex = 0;
    const themes = ["theme-1", "theme-2", "theme-3"];

    function loadTheme() {
      const storedThemeIndex = localStorage.getItem("themeIndex");
      if (storedThemeIndex !== null) {
        themeIndex = parseInt(storedThemeIndex, 10);
        document.body.classList.remove(...themes);
        document.body.classList.add(themes[themeIndex]);
      }
    }
    loadTheme();

    function appendNumber(num) {
      if (num === '.') {
        const tokens = currentInput.split(/[\+\-\*\/]/);
        const lastToken = tokens[tokens.length - 1];
        if (lastToken.includes('.')) {
          return; // Already has a decimal
        }
        // If lastToken is empty (e.g., starting with '.' after an operator), prepend a 0.
        if (lastToken.trim() === "") {
          currentInput += "0";
        }
      }
      currentInput += num;
      updateDisplay(currentInput);
    }

    // Append operator: prevent multiple operators in a row.
    function appendOperator(op) {
      // Remove trailing spaces
      currentInput = currentInput.trim();
      // If the last character is already an operator, replace it
      if (/[+\-*\/]$/.test(currentInput)) {
        currentInput = currentInput.slice(0, -1);
      }
      currentInput += " " + op + " ";
      updateDisplay(currentInput);
    }

    // Delete function: removes the last number or operator.
    function deleteLast() {
      if (currentInput.endsWith(" ")) {
        // Likely an operator token " op " was just added, remove the last 3 characters.
        currentInput = currentInput.slice(0, -3);
      } else {
        currentInput = currentInput.slice(0, -1);
      }
      updateDisplay(currentInput || "0");
    }

    // Reset the calculator
    function resetCalculator() {
      currentInput = "";
      updateDisplay("0");
    }

    // Update display text
    function updateDisplay(text) {
      display.innerText = text;
    }

    // Safely evaluate the expression
    function calculateResult() {
      // Basic sanitization: allow only digits, operators, decimals, and whitespace.
      if (!/^[\d+\-*/.\s]+$/.test(currentInput)) {
        updateDisplay("Invalid Expression");
        currentInput = "";
        return;
      }
      try {
        // Use Function constructor as a safer alternative to eval (still be cautious in production)
        const result = Function('"use strict";return (' + currentInput + ')')();
        currentInput = result.toString();
        updateDisplay(currentInput);
      } catch (error) {
        updateDisplay("Error: " + error.message);
        currentInput = "";
      }
    }

    // Theme toggle with persistence
    function toggleTheme() {
      document.body.classList.remove(themes[themeIndex]);
      themeIndex = (themeIndex + 1) % themes.length;
      document.body.classList.add(themes[themeIndex]);
      localStorage.setItem("themeIndex", themeIndex);
    }
// Keyboard support
document.addEventListener("keydown", function(e) {
      // If focus is on a button or the theme toggle, let the default behavior occur.
      const tag = document.activeElement.tagName.toLowerCase();
      if (tag === "button" || document.activeElement.classList.contains("toggle-switch")) return;

      if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
      } else if (e.key === '.') {
        appendNumber(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        appendOperator(e.key);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        calculateResult();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        deleteLast();
      } else if (e.key === 'Escape') {
        resetCalculator();
      }
    });
    // Append number ensuring only one decimal per operand and no multiple zeros.
function appendNumber(num) {
  // Prevent multiple zeros without a number or operator before
  if (num === '0' && currentInput === '0') {
    return; // Prevent entering multiple zeros
  }

  // If appending a decimal, ensure the current number (after last operator) doesn't already contain one.
  if (num === '.') {
    const tokens = currentInput.split(/[\+\-\*\/]/);
    const lastToken = tokens[tokens.length - 1];
    if (lastToken.includes('.')) {
      return; // Already has a decimal
    }
    // If lastToken is empty (e.g., starting with '.' after an operator), prepend a 0.
    if (lastToken.trim() === "") {
      currentInput += "0";
    }
  }

  currentInput += num;
  updateDisplay(currentInput);
}
