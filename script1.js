// Helper object for degree-based trigonometric functions
const deg = {
    sin: (d) => Math.sin(d * Math.PI / 180),
    cos: (d) => Math.cos(d * Math.PI / 180),
    tan: (d) => Math.tan(d * Math.PI / 180),
};

// Map of common currency codes to their symbols for better UX
const currencySymbols = {
    'USD': '$', 'EUR': '€', 'JPY': '¥', 'GBP': '£', 'AUD': 'A$', 'CAD': 'C$',
    'CHF': 'Fr', 'CNY': '¥', 'SEK': 'kr', 'NZD': 'NZ$', 'MXN': 'Mex$',
    'SGD': 'S$', 'HKD': 'HK$', 'NOK': 'kr', 'KRW': '₩', 'TRY': '₺',
    'RUB': '₽', 'INR': '₹', 'BRL': 'R$', 'ZAR': 'R', 'AED': 'د.إ',
    'AFN': '؋', 'ALL': 'L', 'AMD': '֏', 'ANG': 'ƒ', 'AOA': 'Kz',
    'ARS': '$', 'AWG': 'ƒ', 'AZN': '₼', 'BAM': 'KM', 'BBD': '$',
    'BDT': '৳', 'BGN': 'лв', 'BHD': '.د.ب', 'BIF': 'FBu', 'BMD': '$',
    'BND': '$', 'BOB': 'Bs.', 'BSD': '$', 'BTN': 'Nu.', 'BWP': 'P',
    'BYN': 'Br', 'BZD': 'BZ$', 'CDF': 'FC', 'CLP': '$', 'COP': '$',
    'CRC': '₡', 'CUP': '₱', 'CVE': '$', 'CZK': 'Kč', 'DJF': 'Fdj',
    'DKK': 'kr', 'DOP': 'RD$', 'DZD': 'د.ج', 'EGP': '£', 'ERN': 'Nfk',
    'ETB': 'Br', 'FJD': '$', 'FKP': '£', 'FOK': 'kr', 'GEL': '₾',
    'GGP': '£', 'GHS': '₵', 'GIP': '£', 'GMD': 'D', 'GNF': 'FG',
    'GTQ': 'Q', 'GYD': '$', 'HNL': 'L', 'HUF': 'Ft', 'IDR': 'Rp',
    'ILS': '₪', 'IMP': '£', 'IQD': 'ع.د', 'IRR': '﷼', 'ISK': 'kr',
    'JEP': '£', 'JMD': 'J$', 'JOD': 'JD', 'KES': 'KSh', 'KGS': 'с',
    'KHR': '៛', 'KID': '$', 'KMF': 'CF', 'KWD': 'K.D.', 'KYD': '$',
    'KZT': '₸', 'LAK': '₭', 'LBP': '£', 'LKR': 'Rs', 'LRD': '$',
    'LSL': 'L', 'LYD': 'LD', 'MAD': 'MAD', 'MDL': 'L', 'MGA': 'Ar',
    'MKD': 'ден', 'MMK': 'K', 'MNT': '₮', 'MOP': 'MOP$', 'MRU': 'UM',
    'MUR': '₨', 'MVR': 'Rf', 'MWK': 'MK', 'MYR': 'RM', 'MZN': 'MT',
    'NAD': '$', 'NGN': '₦', 'NIO': 'C$', 'NPR': '₨', 'OMR': '﷼',
    'PAB': 'B/.', 'PEN': 'S/.', 'PGK': 'K', 'PHP': '₱', 'PKR': '₨',
    'PLN': 'zł', 'PYG': '₲', 'QAR': '﷼', 'RON': 'lei', 'RSD': 'Дин.',
    'RWF': 'R₣', 'SAR': '﷼', 'SBD': '$', 'SCR': '₨', 'SDG': 'ج.س.',
    'SHP': '£', 'SLL': 'Le', 'SOS': 'S', 'SRD': '$', 'SSP': '£',
    'STN': 'Db', 'SYP': '£', 'SZL': 'L', 'THB': '฿', 'TJS': 'SM',
    'TMT': 'T', 'TND': 'د.ت', 'TOP': 'T$', 'TTD': 'TT$', 'TVD': '$',
    'TWD': 'NT$', 'TZS': 'TSh', 'UAH': '₴', 'UGX': 'USh', 'UYU': '$U',
    'UZS': 'soʻm', 'VES': 'Bs.', 'VND': '₫', 'VUV': 'VT', 'WST': 'T',
    'XAF': 'FCFA', 'XCD': '$', 'XDR': 'SDR', 'XOF': 'CFA', 'XPF': '₣',
    'YER': '﷼', 'ZMW': 'ZK'
};

class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement, historyElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.historyElement = historyElement;
        this.isResultDisplayed = false; // Flag to check if the display is showing a result
        this.clearAll();
    }

    // clearAll resets the entire calculator state, including history.
    // This is used on startup.
    clearAll() {
        this.currentOperand = '0'; // Represents the full expression string
        this.history = [];
        this.isResultDisplayed = false;
        this.updateDisplay();
        this.updateHistoryDisplay();
    }

    // clearCurrent resets the current entry without clearing the history.
    // This is what the 'C' button will now do.
    clearCurrent() {
        this.currentOperand = '0';
        this.previousOperandTextElement.innerText = '';
        this.isResultDisplayed = false;
        this.updateDisplay();
    }

    delete() {
        // Don't delete from a result or an error message
        if (this.isResultDisplayed) return;
        // Slice the last character off the expression, or reset to '0' if empty
        this.currentOperand = this.currentOperand.slice(0, -1) || '0';
        this.updateDisplay();
    }

    // A single method to append numbers, operators, or parentheses
    append(char) {
        // If a result is on screen, an operator continues the calculation,
        // but a number/function starts a new one.
        if (this.isResultDisplayed) {
            this.isResultDisplayed = false;
            this.previousOperandTextElement.innerText = '';
            // If the new character is not an operator, start a fresh calculation
            if (!['+', '-', '*', '×', '÷', '^'].includes(char)) {
                this.currentOperand = '';
            }
        }

        // Handle scientific functions by adding the function name and an opening parenthesis
        if (['√', 'log', 'sin', 'cos', 'tan'].includes(char)) {
            const functionName = char === '√' ? 'sqrt' : char;
            if (this.currentOperand === '0' || this.currentOperand === 'Error') {
                this.currentOperand = `${functionName}(`;
            } else {
                this.currentOperand += `${functionName}(`;
            }
            this.updateDisplay();
            return;
        }

        // Handle constants like π
        if (char === 'π') {
            if (this.currentOperand === '0' || this.currentOperand === 'Error') {
                this.currentOperand = char;
            } else {
                const lastChar = this.currentOperand.slice(-1);
                // Automatically add multiplication if π follows a number, another π, or a closing parenthesis
                if (!isNaN(parseInt(lastChar)) || lastChar === '.' || lastChar === 'π' || lastChar === ')') {
                    this.currentOperand += `*${char}`;
                } else {
                    this.currentOperand += char;
                }
            }
            this.updateDisplay();
            return;
        }

        // Replace initial '0' or 'Error'
        if (this.currentOperand === '0' || this.currentOperand === 'Error') {
            this.currentOperand = char;
        } else {
            this.currentOperand += char;
        }
        this.updateDisplay();
    }

    // Evaluates the entire expression string
    evaluate(expression) {
        try {
            // Replace user-facing operators and functions with JS Math equivalents
            let sanitized = expression
                .replace(/÷/g, '/')
                .replace(/[×*]/g, '*') // Handle both '×' and '*' for multiplication
                .replace(/\^/g, '**') // Power
                .replace(/π/g, 'Math.PI')      // Pi constant
                .replace(/sqrt/g, 'Math.sqrt') // Square Root
                .replace(/log/g, 'Math.log10') // Log base 10
                .replace(/sin/g, 'deg.sin')    // Degree-based Sine
                .replace(/cos/g, 'deg.cos')    // Degree-based Cosine
                .replace(/tan/g, 'deg.tan');   // Degree-based Tangent

            // Validate to ensure no unsafe characters are in the expression
            // This regex now allows 'Math.' for our functions
            // The character set is a whitelist of everything allowed in the sanitized expression.
            const validationRegex = /[^0-9+\-*/().\sMathdegsincolqrtPI]/;
            if (validationRegex.test(sanitized)) {
                return "Error";
            }

            // Use new Function for safer evaluation than eval()
            const result = new Function('deg', `return ${sanitized}`)(deg);

            // Handle invalid math like 1/0
            if (isNaN(result) || !isFinite(result)) {
                return "Error";
            }

            // Round to avoid floating point inaccuracies
            return parseFloat(result.toPrecision(12));
        } catch (e) {
            return "Error"; // Catches syntax errors
        }
    }

    handleEquals() {
        const expression = this.currentOperand;
        const result = this.evaluate(expression);

        this.previousOperandTextElement.innerText = `${expression} =`;

        if (result !== "Error") {
            this.currentOperand = result.toString();
            this.history.push(`${expression} = ${result}`);
            this.updateHistoryDisplay();
        } else {
            this.currentOperand = "Error";
        }

        this.isResultDisplayed = true;
        this.updateDisplay();
    }

    // AI Feature: Parses natural language queries into math expressions
    parseNaturalLanguage(query) {
        if (!query) return;

        const processedQuery = query
            .toLowerCase()
            .replace(/what is/g, '')
            .replace(/plus/g, '+')
            .replace(/add/g, '+')
            .replace(/minus/g, '-')
            .replace(/subtract/g, '-')
            .replace(/times/g, '*')
            .replace(/multiplied by/g, '*')
            .replace(/divided by/g, '÷')
            .replace(/power of/g, '^')
            .replace(/square root of/g, 'sqrt')
            .replace(/sine of/g, 'sin')
            .replace(/cosine of/g, 'cos')
            .replace(/tangent of/g, 'tan')
            .replace(/\s+/g, '') // Remove all whitespace
            .trim();

        this.currentOperand = processedQuery || '0';
        this.isResultDisplayed = false;
        this.previousOperandTextElement.innerText = `AI: "${query}"`;
        this.updateDisplay();
    }

    updateDisplay() {
        // The main display now shows the full expression or the result
        this.currentOperandTextElement.innerText = this.currentOperand;
    }

    updateHistoryDisplay() {
        this.historyElement.innerHTML = ''; // Clear existing history
        // Add each history item to the list
        // Iterate backwards to show the most recent history at the top
        this.history.slice().reverse().forEach(item => {
            const li = document.createElement('li');
            const [expression] = item.split(' =');
            li.innerText = item;
            li.dataset.expression = expression.trim(); // Store the expression for recall
            li.title = "Click to recall this expression"; // Add a helpful tooltip
            this.historyElement.appendChild(li);
        });
    }
}

class CurrencyConverter {
    constructor(amountInput, fromSelect, toSelect, resultDisplay, convertButton) {
        this.amountInput = amountInput;
        this.fromSelect = fromSelect;
        this.toSelect = toSelect;
        this.resultDisplay = resultDisplay;
        this.convertButton = convertButton;
        this.rates = {};

        this.fetchRates();
        this.convertButton.addEventListener('click', () => this.convert());
    }

    async fetchRates() {
        try {
            // Using a free, no-key-required API for exchange rates
            const response = await fetch('https://open.er-api.com/v6/latest/USD');
            if (!response.ok) throw new Error('Network response was not ok.');
            
            const data = await response.json();
            this.rates = data.rates;
            this.populateSelectors();
            this.convert(); // Perform an initial conversion on load
        } catch (error) {
            console.error('Failed to fetch currency rates:', error);
            this.resultDisplay.innerText = 'Error: Could not load rates.';
        }
    }

    populateSelectors() {
        const currencies = Object.keys(this.rates);
        currencies.forEach(currency => {
            const symbol = currencySymbols[currency] || '';
            const displayText = symbol ? `${symbol} ${currency}` : currency;

            const option1 = document.createElement('option');
            option1.value = currency;
            option1.innerText = displayText;
            this.fromSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = currency;
            option2.innerText = displayText;
            this.toSelect.appendChild(option2);
        });

        // Set default values for a common conversion
        this.fromSelect.value = 'USD';
        this.toSelect.value = 'INR';
        this.convert(); // Perform an initial conversion on load
    }

    convert() {
        const amount = parseFloat(this.amountInput.value);
        const fromCurrency = this.fromSelect.value;
        const toCurrency = this.toSelect.value;

        if (isNaN(amount) || !fromCurrency || !toCurrency || !this.rates[fromCurrency]) {
            this.resultDisplay.innerText = 'Invalid input.';
            return;
        }

        // The formula for conversion: (amount / rate_from_USD) * rate_to_USD
        const result = (amount / this.rates[fromCurrency]) * this.rates[toCurrency];

        const fromText = currencySymbols[fromCurrency] ? `${fromCurrency} (${currencySymbols[fromCurrency]})` : fromCurrency;
        const toText = currencySymbols[toCurrency] ? `${toCurrency} (${currencySymbols[toCurrency]})` : toCurrency;

        this.resultDisplay.innerText = `${amount.toLocaleString()} ${fromText} = ${result.toLocaleString(undefined, {maximumFractionDigits: 2})} ${toText}`;
    }
}

class InterestCalculator {
    constructor(principalInput, rateInput, timeInput, resultDisplay, calculateButton) {
        this.principalInput = principalInput;
        this.rateInput = rateInput;
        this.timeInput = timeInput;
        this.resultDisplay = resultDisplay;
        this.calculateButton = calculateButton;

        this.calculateButton.addEventListener('click', () => this.calculate());
    }

    calculate() {
        const principal = parseFloat(this.principalInput.value);
        const rate = parseFloat(this.rateInput.value);
        const time = parseFloat(this.timeInput.value);

        if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal < 0 || rate < 0 || time < 0) {
            this.resultDisplay.innerText = 'Please enter valid positive numbers.';
            return;
        }

        // Simple Interest Formula: I = P * (R/100) * T
        const interest = principal * (rate / 100) * time;
        const totalAmount = principal + interest;

        this.resultDisplay.innerHTML = `
            Interest: ${interest.toLocaleString(undefined, {maximumFractionDigits: 2})}<br>
            Total: ${totalAmount.toLocaleString(undefined, {maximumFractionDigits: 2})}
        `;
    }
}

const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const historyElement = document.querySelector('#history-list');
const calculatorGrid = document.querySelector('.calculator-grid');
const aiInputField = document.querySelector('#ai-input');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement, historyElement);

// --- Initialize Interest Calculator ---
const principalInput = document.querySelector('#principal-input');
const rateInput = document.querySelector('#rate-input');
const timeInput = document.querySelector('#time-input');
const interestResultDisplay = document.querySelector('#interest-result');
const calculateInterestButton = document.querySelector('#calculate-interest-button');
new InterestCalculator(principalInput, rateInput, timeInput, interestResultDisplay, calculateInterestButton);

// --- Initialize Currency Converter ---
const amountInput = document.querySelector('#amount-input');
const fromSelect = document.querySelector('#from-currency-select');
const toSelect = document.querySelector('#to-currency-select');
const resultDisplay = document.querySelector('#conversion-result');
const convertButton = document.querySelector('#convert-button');
new CurrencyConverter(amountInput, fromSelect, toSelect, resultDisplay, convertButton);

calculatorGrid.addEventListener('click', event => {
    // Use event delegation to handle all button clicks with one listener
    if (!event.target.matches('button')) return;

    const button = event.target;
    const { dataset } = button;

    // Consolidated logic for appending characters
    if ('number' in dataset || 'operator' in dataset || 'parenthesis' in dataset || 'function' in dataset || 'constant' in dataset) {
        calculator.append(button.innerText);
    } else if ('equals' in dataset) {
        calculator.handleEquals();
    } else if ('allClear' in dataset) {
        calculator.clearCurrent();
    } else if ('delete' in dataset) {
        calculator.delete();
    }
});

// --- Accessibility Improvement: Keyboard Support (Updated) ---
window.addEventListener('keydown', e => {
    const activeEl = document.activeElement;
    // Don't interfere if the user is typing in any input or select field.
    // This prevents calculator functions from firing while editing interest or currency values.
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'SELECT')) {
        return;
    }

    e.preventDefault(); // Prevent default browser actions for calculator keys
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        calculator.append(e.key);
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        const operation = e.key === '/' ? '÷' : e.key;
        calculator.append(operation);
    } else if (['(', ')'].includes(e.key)) {
        calculator.append(e.key);
    } else if (e.key === '=' || e.key === 'Enter') {
        calculator.handleEquals();
    } else if (e.key === 'Backspace') {
        calculator.delete();
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        calculator.clearCurrent();
    }
});

// --- AI Input Event Listener ---
aiInputField.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        calculator.parseNaturalLanguage(aiInputField.value);
        aiInputField.value = ''; // Clear input after processing
    }
});

// --- Vibe Enhancement: Clickable History ---
historyElement.addEventListener('click', e => {
    if (e.target.tagName === 'LI' && e.target.dataset.expression) {
        calculator.currentOperand = e.target.dataset.expression;
        calculator.isResultDisplayed = false;
        calculator.previousOperandTextElement.innerText = '';
        calculator.updateDisplay();
    }
});
