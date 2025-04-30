// DOM Elements
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendButton = document.querySelector("#send-message");
const suggestionChips = document.querySelector(".suggestion-chips");

// Indian Financial Knowledge Base
const DESI_FINANCIAL_TIPS = {
  greetings: [
    "Namaste! I'm your Indian Money Mitra. How can I help with your finances today? 🙏",
    "Hello! I give simple money advice for Indian families. Ask me anything!",
    "Aapka swagat hai! Let's discuss your savings and investments."
  ],
  
  budgeting: {
    basic: [
      "50/30/20 rule for Indians: 50% for roti-kapda-makaan, 30% for family needs, 20% savings+investment",
      "Track expenses with apps like KhataBook or Walnut - especially helpful for cash expenses",
      "Middle-class families should aim to save at least ₹5,000 monthly, even if starting small"
    ],
    family: [
      "Joint family? Allocate household contributions based on earning members' incomes",
      "For weddings/festivals: Start saving 1-2 years in advance in a separate RD"
    ]
  },
  
  saving: {
    emergency: [
      "Build emergency fund of 6 months' expenses - keep in liquid funds or savings account",
      "Chit funds can be risky. Better options: Post Office RD (7% interest) or bank FDs"
    ],
    goals: [
      "For children's education: Start SIP in equity funds when child is born",
      "Dream home downpayment? Open a separate Sukanya Samriddhi Account for tax-free growth"
    ]
  },
  
  tax: {
    saving: [
      "Use 80C deductions fully: PPF, ELSS, life insurance premiums, home loan principal",
      "New tax regime vs old - calculate which saves you more based on your investments"
    ],
    filing: [
      "Don't forget Form 16 from employer and interest certificates from banks",
      "File before July 31st to avoid penalty - use ClearTax for easy filing"
    ]
  },
  
  investment: {
    safe: [
      "Safe options: PPF (7.1%), Senior Citizen Savings Scheme (8.2%), Post Office MIS (7.4%)",
      "For retirees: Monthly Income Schemes provide regular cash flow"
    ],
    growth: [
      "Young earners: Start SIP of ₹5,000/month in Nifty 50 index fund for long-term growth",
      "Real estate? Consider REITs instead of physical property for easier investing"
    ]
  },
  
  loans: {
    management: [
      "Home loan tip: Make partial prepayments whenever you get bonuses to reduce tenure",
      "Credit card debt? Transfer to personal loan at lower interest immediately"
    ],
    advice: [
      "Gold loans better than personal loans for emergencies - lower interest rates",
      "Education loans have tax benefits under Section 80E - don't prepay too quickly"
    ]
  }
};

// Common Indian Financial Questions
const INDIAN_SUGGESTIONS = [
  "How to save tax in India?",
  "Best FD interest rates?",
  "PPF vs mutual funds?",
  "How much emergency fund?",
  "Saving for child's education",
  "Home loan tips",
  "Best SIP for beginners",
  "Gold investment options"
];

// Generate Indian-relevant suggestions
function showIndianSuggestions() {
  suggestionChips.innerHTML = "";
  INDIAN_SUGGESTIONS.forEach(question => {
    const chip = document.createElement("button");
    chip.classList.add("suggestion-chip");
    chip.textContent = question;
    chip.addEventListener("click", () => {
      messageInput.value = question;
      handleUserMessage();
    });
    suggestionChips.appendChild(chip);
  });
}

// Handle user messages with Indian context
function handleUserMessage() {
  const message = messageInput.value.trim().toLowerCase();
  
  if (!message) return;
  
  // Clear input
  messageInput.value = "";
  
  // Display user message
  displayMessage(message, "user");
  
  // Generate bot response after short delay
  setTimeout(() => {
    let response = getIndianFinancialResponse(message);
    displayMessage(response, "bot");
  }, 800);
}

// Get culturally relevant financial advice
function getIndianFinancialResponse(message) {
  // Check greetings
  if (["hi", "hello", "namaste", "namaskar"].some(g => message.includes(g))) {
    return randomResponse(DESI_FINANCIAL_TIPS.greetings);
  }
  
  // Budgeting queries
  if (message.includes("budget") || message.includes("kharcha")) {
    if (message.includes("family") || message.includes("ghar")) {
      return randomResponse(DESI_FINANCIAL_TIPS.budgeting.family);
    }
    return randomResponse(DESI_FINANCIAL_TIPS.budgeting.basic);
  }
  
  // Saving queries
  if (message.includes("save") || message.includes("bachat")) {
    if (message.includes("emergency") || message.includes("jaroorat")) {
      return randomResponse(DESI_FINANCIAL_TIPS.saving.emergency);
    }
    return randomResponse(DESI_FINANCIAL_TIPS.saving.goals);
  }
  
  // Tax queries
  if (message.includes("tax") || message.includes("80c")) {
    if (message.includes("file") || message.includes("itr")) {
      return randomResponse(DESI_FINANCIAL_TIPS.tax.filing);
    }
    return randomResponse(DESI_FINANCIAL_TIPS.tax.saving);
  }
  
  // Investment queries
  if (message.includes("invest") || message.includes("nivesh")) {
    if (message.includes("safe") || message.includes("risk")) {
      return randomResponse(DESI_FINANCIAL_TIPS.investment.safe);
    }
    return randomResponse(DESI_FINANCIAL_TIPS.investment.growth);
  }
  
  // Loan queries
  if (message.includes("loan") || message.includes("karza")) {
    return randomResponse(DESI_FINANCIAL_TIPS.loans.management);
  }
  
  // Default response
  return "Mujhe maaf kijiye, main aapke sawaal ko poora samajh nahi paya. Kya aap apna sawaal doosre shabdon mein puch sakte hain? Ya niche diye options mein se koi sawaal chuniye.";
}

// Helper function to get random response from array
function randomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

// Display message in chat
function displayMessage(content, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", `${sender}-message`);
  
  if (sender === "bot") {
    messageDiv.innerHTML = `
      <div class="bot-avatar">💰</div>
      <div class="message-text">${content}</div>
    `;
  } else {
    messageDiv.innerHTML = `
      <div class="message-text">${content}</div>
    `;
  }
  
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Event Listeners
sendButton.addEventListener("click", handleUserMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleUserMessage();
});

// Initialize
showIndianSuggestions();
displayMessage(DESI_FINANCIAL_TIPS.greetings[0], "bot");
