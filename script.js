const display = document.getElementById('display');
    let current = '';
    let resetTimeout = null;

    function updateDisplay(value) {
      display.textContent = value;
    }

    function showError() {
      display.classList.add('error');
      updateDisplay('Error');
      if (resetTimeout) clearTimeout(resetTimeout);
      resetTimeout = setTimeout(() => {
        display.classList.remove('error');
        current = '';
        updateDisplay('0');
      }, 1500);
    }

    function calculate() {
      try {
        let result = Function(`"use strict"; return (${current})`)();
        if (!isFinite(result)) throw Error();
        result = parseFloat(result.toFixed(10));
        current = result.toString();
        updateDisplay(current);
      } catch {
        showError();
      }
    }

    function handleInput(value) {
      if (display.textContent === 'Error') return;
      if (value === '.' && current.split(/[^0-9.]/).pop().includes('.')) return;
      current += value;
      updateDisplay(current);
    }

    function handleKey(e) {
      const key = e.key;
      if (/^[0-9]$/.test(key) || ['+', '-', '*', '/', '.'].includes(key)) {
        handleInput(key);
      } else if (key === 'Enter') {
        calculate();
      } else if (key === 'Backspace') {
        current = current.slice(0, -1);
        updateDisplay(current || '0');
      } else if (key === 'Escape') {
        current = '';
        updateDisplay('0');
      }
    }

    document.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.value;
        const key = btn.dataset.key;

        if (val !== undefined) {
          if (val === '=') calculate();
          else handleInput(val);
        } else if (key === 'Enter') calculate();
        else if (key === 'Backspace') {
          current = current.slice(0, -1);
          updateDisplay(current || '0');
        } else if (key === 'Escape') {
          current = '';
          updateDisplay('0');
        }
      });
    });

    document.addEventListener('keydown', handleKey);
