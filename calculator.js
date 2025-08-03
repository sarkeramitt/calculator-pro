class Calculator {
  constructor() {
    this.display = document.getElementById("display")
    this.historyDisplay = document.getElementById("history")
    this.currentInput = "0"
    this.previousInput = ""
    this.operator = null
    this.waitingForOperand = false
    this.memory = 0
    this.history = []
    this.isScientificMode = false
    this.isAgeCalculatorMode = false
    this.isHistoryMode = false

    this.setupEventListeners()
    this.updateDisplay()
  }

  setupEventListeners() {
    // Number buttons
    document.querySelectorAll(".btn-number").forEach((btn) => {
      btn.addEventListener("click", () => this.inputNumber(btn.textContent))
    })

    // Operator buttons
    document.querySelectorAll(".btn-operator").forEach((btn) => {
      btn.addEventListener("click", () => this.inputOperator(btn.dataset.operator))
    })

    // Function buttons
    document.querySelectorAll(".btn-function").forEach((btn) => {
      btn.addEventListener("click", () => this.inputFunction(btn.dataset.function))
    })

    // Special buttons
    document.getElementById("equals").addEventListener("click", () => this.calculate())
    document.getElementById("clear").addEventListener("click", () => this.clear())
    document.getElementById("clearEntry").addEventListener("click", () => this.clearEntry())
    document.getElementById("backspace").addEventListener("click", () => this.backspace())
    document.getElementById("decimal").addEventListener("click", () => this.inputDecimal())
    document.getElementById("plusMinus").addEventListener("click", () => this.toggleSign())

    // Memory buttons
    document.getElementById("memoryAdd").addEventListener("click", () => this.memoryAdd())
    document.getElementById("memorySubtract").addEventListener("click", () => this.memorySubtract())
    document.getElementById("memoryRecall").addEventListener("click", () => this.memoryRecall())
    document.getElementById("memoryClear").addEventListener("click", () => this.memoryClear())

    // Mode toggles
    document.getElementById("scientificToggle").addEventListener("click", () => this.toggleScientificMode())
    document.getElementById("ageCalculatorToggle").addEventListener("click", () => this.toggleAgeCalculator())
    document.getElementById("historyToggle").addEventListener("click", () => this.toggleHistory())

    // Age calculator
    document.getElementById("calculateAge").addEventListener("click", () => this.calculateAge())

    // Keyboard support
    document.addEventListener("keydown", (e) => this.handleKeyboard(e))

    // Add button click animations
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.classList.add("clicked")
        setTimeout(() => btn.classList.remove("clicked"), 150)
      })
    })
  }

  inputNumber(num) {
    if (this.waitingForOperand) {
      this.currentInput = num
      this.waitingForOperand = false
    } else {
      this.currentInput = this.currentInput === "0" ? num : this.currentInput + num
    }
    this.updateDisplay()
  }

  inputOperator(nextOperator) {
    const inputValue = Number.parseFloat(this.currentInput)

    if (this.previousInput === "") {
      this.previousInput = inputValue
    } else if (this.operator) {
      const currentValue = this.previousInput || 0
      const newValue = this.performCalculation(this.operator, currentValue, inputValue)

      this.currentInput = String(newValue)
      this.previousInput = newValue
    }

    this.waitingForOperand = true
    this.operator = nextOperator
    this.updateDisplay()
  }

  inputFunction(func) {
    const inputValue = Number.parseFloat(this.currentInput)
    let result

    switch (func) {
      case "sqrt":
        result = Math.sqrt(inputValue)
        break
      case "square":
        result = inputValue * inputValue
        break
      case "cube":
        result = inputValue * inputValue * inputValue
        break
      case "reciprocal":
        result = 1 / inputValue
        break
      case "sin":
        result = Math.sin(this.toRadians(inputValue))
        break
      case "cos":
        result = Math.cos(this.toRadians(inputValue))
        break
      case "tan":
        result = Math.tan(this.toRadians(inputValue))
        break
      case "log":
        result = Math.log10(inputValue)
        break
      case "ln":
        result = Math.log(inputValue)
        break
      case "exp":
        result = Math.exp(inputValue)
        break
      case "factorial":
        result = this.factorial(inputValue)
        break
      case "pi":
        result = Math.PI
        break
      case "e":
        result = Math.E
        break
      default:
        return
    }

    this.addToHistory(`${func}(${inputValue}) = ${result}`)
    this.currentInput = String(result)
    this.waitingForOperand = true
    this.updateDisplay()
  }

  calculate() {
    const inputValue = Number.parseFloat(this.currentInput)

    if (this.previousInput !== "" && this.operator) {
      const newValue = this.performCalculation(this.operator, this.previousInput, inputValue)

      // Add to history with proper formatting
      this.addToHistory(`${this.previousInput} ${this.operator} ${inputValue} = ${newValue}`)

      this.currentInput = String(newValue)
      this.previousInput = ""
      this.operator = null
      this.waitingForOperand = true
    }

    this.updateDisplay()
  }

  performCalculation(operator, firstOperand, secondOperand) {
    switch (operator) {
      case "+":
        return firstOperand + secondOperand
      case "-":
        return firstOperand - secondOperand
      case "*":
        return firstOperand * secondOperand
      case "/":
        return firstOperand / secondOperand
      case "^":
        return Math.pow(firstOperand, secondOperand)
      case "%":
        return firstOperand % secondOperand
      default:
        return secondOperand
    }
  }

  inputDecimal() {
    if (this.waitingForOperand) {
      this.currentInput = "0."
      this.waitingForOperand = false
    } else if (this.currentInput.indexOf(".") === -1) {
      this.currentInput += "."
    }
    this.updateDisplay()
  }

  toggleSign() {
    if (this.currentInput !== "0") {
      this.currentInput = this.currentInput.charAt(0) === "-" ? this.currentInput.slice(1) : "-" + this.currentInput
    }
    this.updateDisplay()
  }

  clear() {
    this.currentInput = "0"
    this.previousInput = ""
    this.operator = null
    this.waitingForOperand = false
    this.updateDisplay()
  }

  clearEntry() {
    this.currentInput = "0"
    this.updateDisplay()
  }

  backspace() {
    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1)
    } else {
      this.currentInput = "0"
    }
    this.updateDisplay()
  }

  // Memory functions
  memoryAdd() {
    this.memory += Number.parseFloat(this.currentInput)
    this.showMemoryIndicator()
  }

  memorySubtract() {
    this.memory -= Number.parseFloat(this.currentInput)
    this.showMemoryIndicator()
  }

  memoryRecall() {
    this.currentInput = String(this.memory)
    this.waitingForOperand = true
    this.updateDisplay()
  }

  memoryClear() {
    this.memory = 0
    this.hideMemoryIndicator()
  }

  showMemoryIndicator() {
    document.getElementById("memoryIndicator").style.display = "block"
  }

  hideMemoryIndicator() {
    document.getElementById("memoryIndicator").style.display = "none"
  }

  // Utility functions
  toRadians(degrees) {
    return degrees * (Math.PI / 180)
  }

  factorial(n) {
    if (n < 0) return Number.NaN
    if (n === 0 || n === 1) return 1
    let result = 1
    for (let i = 2; i <= n; i++) {
      result *= i
    }
    return result
  }

  // Mode toggles
  toggleScientificMode() {
    // If scientific mode is currently active, turn it off
    if (this.isScientificMode) {
      this.isScientificMode = false
      document.getElementById("scientificPanel").style.display = "none"
      document.getElementById("scientificToggle").classList.remove("active")
      return
    }

    // Reset other modes first
    this.resetAllModes()

    // Then activate scientific mode
    this.isScientificMode = true
    const scientificPanel = document.getElementById("scientificPanel")
    const toggle = document.getElementById("scientificToggle")

    scientificPanel.style.display = "grid"
    toggle.classList.add("active")
  }

  toggleAgeCalculator() {
    // Reset other modes
    this.resetAllModes()

    this.isAgeCalculatorMode = !this.isAgeCalculatorMode
    const agePanel = document.getElementById("ageCalculatorPanel")
    const calculatorContainer = document.querySelector(".calculator-container")
    const toggle = document.getElementById("ageCalculatorToggle")

    if (this.isAgeCalculatorMode) {
      agePanel.style.display = "grid"
      calculatorContainer.classList.add("age-mode")
      toggle.classList.add("active")
    } else {
      agePanel.style.display = "none"
      calculatorContainer.classList.remove("age-mode")
      toggle.classList.remove("active")
    }
  }

  toggleHistory() {
    // Reset other modes
    this.resetAllModes()

    this.isHistoryMode = !this.isHistoryMode
    const historyPanel = document.getElementById("historyPanel")
    const toggle = document.getElementById("historyToggle")

    if (this.isHistoryMode) {
      historyPanel.style.display = "block"
      toggle.classList.add("active")
      this.updateHistoryDisplay()
    } else {
      historyPanel.style.display = "none"
      toggle.classList.remove("active")
    }
  }

  resetAllModes() {
    // Reset scientific mode
    if (this.isScientificMode) {
      this.isScientificMode = false
      document.getElementById("scientificPanel").style.display = "none"
      document.getElementById("scientificToggle").classList.remove("active")
    }

    // Reset age calculator mode
    if (this.isAgeCalculatorMode) {
      this.isAgeCalculatorMode = false
      document.getElementById("ageCalculatorPanel").style.display = "none"
      document.querySelector(".calculator-container").classList.remove("age-mode")
      document.getElementById("ageCalculatorToggle").classList.remove("active")
    }

    // Reset history mode
    if (this.isHistoryMode) {
      this.isHistoryMode = false
      document.getElementById("historyPanel").style.display = "none"
      document.getElementById("historyToggle").classList.remove("active")
    }
  }

  // Age Calculator
  calculateAge() {
    const birthDate = new Date(document.getElementById("birthDate").value)
    const currentDate = new Date()

    if (!birthDate || birthDate > currentDate) {
      document.getElementById("ageResult").innerHTML = '<p class="error">Please enter a valid birth date</p>'
      return
    }

    const ageInMs = currentDate - birthDate
    const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24))
    const ageInYears = Math.floor(ageInDays / 365.25)
    const ageInMonths = Math.floor(ageInDays / 30.44)
    const ageInWeeks = Math.floor(ageInDays / 7)
    const ageInHours = Math.floor(ageInMs / (1000 * 60 * 60))
    const ageInMinutes = Math.floor(ageInMs / (1000 * 60))

    // Calculate exact years, months, days
    let years = currentDate.getFullYear() - birthDate.getFullYear()
    let months = currentDate.getMonth() - birthDate.getMonth()
    let days = currentDate.getDate() - birthDate.getDate()

    if (days < 0) {
      months--
      days += new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()
    }
    if (months < 0) {
      years--
      months += 12
    }

    // Next birthday
    const nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate())
    if (nextBirthday < currentDate) {
      nextBirthday.setFullYear(currentDate.getFullYear() + 1)
    }
    const daysToNextBirthday = Math.ceil((nextBirthday - currentDate) / (1000 * 60 * 60 * 24))

    document.getElementById("ageResult").innerHTML = `
      <div class="age-result">
        <h3>🎂 Your Age Details</h3>
        <div class="age-grid">
          <div class="age-item">
            <span class="age-number">${years}</span>
            <span class="age-label">Years</span>
          </div>
          <div class="age-item">
            <span class="age-number">${months}</span>
            <span class="age-label">Months</span>
          </div>
          <div class="age-item">
            <span class="age-number">${days}</span>
            <span class="age-label">Days</span>
          </div>
        </div>
        
        <div class="age-stats">
          <p><strong>Total Days:</strong> ${ageInDays.toLocaleString()}</p>
          <p><strong>Total Weeks:</strong> ${ageInWeeks.toLocaleString()}</p>
          <p><strong>Total Months:</strong> ${ageInMonths.toLocaleString()}</p>
          <p><strong>Total Hours:</strong> ${ageInHours.toLocaleString()}</p>
          <p><strong>Total Minutes:</strong> ${ageInMinutes.toLocaleString()}</p>
        </div>
        
        <div class="next-birthday">
          <p><strong>🎉 Days until next birthday:</strong> ${daysToNextBirthday}</p>
        </div>
      </div>
    `
  }

  // History functions
  addToHistory(calculation) {
    this.history.unshift(calculation)
    if (this.history.length > 50) {
      this.history.pop()
    }

    // If history is currently visible, update it
    if (this.isHistoryMode) {
      this.updateHistoryDisplay()
    }
  }

  updateHistoryDisplay() {
    const historyList = document.getElementById("historyList")
    if (this.history.length === 0) {
      historyList.innerHTML =
        '<div class="history-item" style="text-align: center; color: rgba(255,255,255,0.6);">No calculations yet</div>'
    } else {
      historyList.innerHTML = this.history.map((item) => `<div class="history-item">${item}</div>`).join("")
    }
  }

  clearHistory() {
    this.history = []
    this.updateHistoryDisplay()
  }

  // Keyboard support
  handleKeyboard(e) {
    if (this.isAgeCalculatorMode) return

    const key = e.key

    if (key >= "0" && key <= "9") {
      this.inputNumber(key)
    } else if (key === ".") {
      this.inputDecimal()
    } else if (key === "+" || key === "-" || key === "*" || key === "/") {
      this.inputOperator(key)
    } else if (key === "Enter" || key === "=") {
      e.preventDefault()
      this.calculate()
    } else if (key === "Escape") {
      this.clear()
    } else if (key === "Backspace") {
      this.backspace()
    }
  }

  updateDisplay() {
    this.display.textContent = this.formatNumber(this.currentInput)

    // Update history display
    if (this.operator && this.previousInput !== "") {
      this.historyDisplay.textContent = `${this.formatNumber(this.previousInput)} ${this.operator}`
    } else {
      this.historyDisplay.textContent = ""
    }
  }

  formatNumber(num) {
    const number = Number.parseFloat(num)
    if (isNaN(number)) return "0"

    // Handle very large or very small numbers
    if (Math.abs(number) > 1e15 || (Math.abs(number) < 1e-6 && number !== 0)) {
      return number.toExponential(6)
    }

    // Format with appropriate decimal places
    return number.toString()
  }
}

// Initialize calculator when page loads
window.addEventListener("load", () => {
  new Calculator()
})
