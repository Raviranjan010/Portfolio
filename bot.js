const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = fileUploadWrapper.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");
const budgetCalculator = document.querySelector("#budget-calculator");
const calculatorModal = document.querySelector("#calculator-modal");
const closeModal = document.querySelector(".close-modal");
const calculateBtn = document.querySelector("#calculate-btn");

// Store chat history and financial context
const chatHistory = [];
const userFinancialContext = {
  income: null,
  expenses: null,
  savings: null,
  budgetGoals: null,
  lastTopics: [],
};

// Financial knowledge base - responses organized by topic
const financialKnowledgeBase = {
  greeting: [
    "Hello! I'm BudgetBot, your financial assistant. How can I help with your budget today?",
    "Welcome back! Ready to continue working on your financial goals?",
    "Hi there! I'm here to help with budgeting, saving, or any financial questions you might have."
  ],
  
  budgeting: [
    "Creating a budget starts with tracking your income and expenses. Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
    "To improve your budget, look for expenses you can reduce like subscriptions, dining out, or impulse purchases. Even small savings add up over time!",
    "Zero-based budgeting means giving every dollar a job - allocate all your income to expenses, savings, and debt payments until you reach zero.",
    "Envelope budgeting involves allocating cash to different spending categories. Once an envelope is empty, you stop spending in that category until next month."
  ],
  
  saving: [
    "Start an emergency fund with 3-6 months of essential expenses. Keep it in a high-yield savings account for easy access.",
    "Automating your savings is one of the most effective strategies. Set up automatic transfers to your savings account on payday.",
    "Try the 24-hour rule for non-essential purchases: wait 24 hours before buying to reduce impulse spending.",
    "Consider saving in tax-advantaged accounts like a 401(k) or IRA for retirement, or a 529 plan for education expenses."
  ],
  
  debt: [
    "There are two popular debt repayment strategies: the snowball method (paying smallest debts first) and the avalanche method (focusing on highest interest rates first).",
    "Consider consolidating high-interest debt to a lower interest option, like a personal loan or 0% APR balance transfer credit card.",
    "Always pay more than the minimum payment on credit cards. Even a small additional amount can significantly reduce the time to pay off debt.",
    "Create a debt payoff plan with specific goals and timeline. Visualizing your progress can help you stay motivated."
  ],
  
  investing: [
    "For beginners, index funds or ETFs offer diversification with lower fees than actively managed funds.",
    "Dollar-cost averaging (investing fixed amounts regularly) can help reduce the impact of market volatility.",
    "Consider your risk tolerance and time horizon when choosing investments. Generally, younger investors can take more risk.",
    "Retirement accounts like 401(k)s and IRAs offer tax advantages that can significantly boost your long-term returns."
  ],
  
  taxes: [
    "Keep track of tax-deductible expenses throughout the year, like charitable donations, medical expenses, or business expenses if self-employed.",
    "Consider tax-efficient investing strategies, like holding tax-efficient investments in taxable accounts and less tax-efficient investments in tax-advantaged accounts.",
    "If you're self-employed, remember to make quarterly estimated tax payments to avoid penalties.",
    "Tax credits (like the Child Tax Credit or Education credits) directly reduce your tax bill, while deductions only reduce your taxable income."
  ],
  
  housing: [
    "The 28/36 rule suggests spending no more than 28% of gross income on housing and no more than 36% on total debt.",
    "Consider all costs of homeownership beyond the mortgage: property taxes, insurance, maintenance, and utilities.",
    "Refinancing your mortgage can save money if you can secure a rate at least 0.5-1% lower than your current rate.",
    "Renting offers flexibility and fewer maintenance responsibilities, while buying builds equity but requires more upfront costs."
  ],
  
  credit: [
    "Your credit score is influenced by payment history (35%), amounts owed (30%), length of credit history (15%), new credit (10%), and credit mix (10%).",
    "Check your credit reports regularly for errors. You can get free reports annually from annualcreditreport.com.",
    "Keep credit card utilization below 30% of your limit to maintain a good credit score.",
    "Having a mix of credit types (revolving credit like cards and installment loans) can positively impact your credit score."
  ],
  
  retirement: [
    "Start saving for retirement as early as possible to benefit from compound interest. Even small amounts add up over time.",
    "Try to contribute enough to your employer's retirement plan to get the full match - it's essentially free money.",
    "Consider diversifying retirement savings between traditional (tax-deferred) and Roth (tax-free growth) accounts for tax flexibility in retirement.",
    "The 4% rule suggests withdrawing 4% of your retirement savings in the first year, then adjusting for inflation in subsequent years."
  ],
  
  insurance: [
    "Review your insurance coverage annually to ensure it still meets your needs as your life circumstances change.",
    "Consider term life insurance if you have dependents. It provides maximum coverage for the lowest cost.",
    "High-deductible health plans paired with Health Savings Accounts (HSAs) offer tax advantages for medical expenses.",
    "Disability insurance is important protection for your income if you're unable to work due to illness or injury."
  ],
  
  education: [
    "Compare the expected return on investment when choosing education options. Consider future earnings potential versus total cost.",
    "Explore all financial aid options: scholarships, grants, work-study, and federal loans before considering private loans.",
    "529 plans offer tax-advantaged savings for education expenses, and many states provide additional tax benefits.",
    "Student loan repayment plans like income-driven repayment can help make federal student loans more manageable."
  ],
  
  children: [
    "Start saving for your child's education early with a 529 plan or Coverdell Education Savings Account.",
    "Consider custodial accounts (UGMA/UTMA) for non-education savings for minors, but be aware the money becomes theirs at age of majority.",
    "Teaching kids about money early helps them develop healthy financial habits. Consider age-appropriate allowances and savings goals.",
    "Balance saving for your child's future with your own retirement savings - remember, there are loans for college but not for retirement."
  ],
  
  business: [
    "Separate personal and business finances with dedicated business accounts and credit cards.",
    "Track business expenses meticulously for tax purposes and cash flow management.",
    "Consider the tax implications of different business structures (sole proprietorship, LLC, S-Corp, etc.).",
    "Build an emergency fund for your business to cover 3-6 months of operating expenses."
  ],
  
  fallback: [
    "I'd be happy to help with that financial question. Could you provide more details so I can give you a more specific answer?",
    "That's an interesting financial question. To give you the best advice, could you share a bit more about your situation?",
    "I want to provide the most relevant financial guidance. Could you elaborate on what you're trying to achieve?"
  ]
};

// Initialize input height
const initialInputHeight = messageInput.scrollHeight;

// Create message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// Determine most relevant financial topic from user message
const determineFinancialTopic = (message) => {
  const topics = {
    budgeting: ["budget", "spending", "expense", "track", "money", "plan", "50/30/20", "allocate"],
    saving: ["save", "emergency fund", "savings", "piggybank", "put away", "high-yield"],
    debt: ["debt", "loan", "credit card", "mortgage", "interest", "repayment", "consolidate"],
    investing: ["invest", "stock", "bond", "ETF", "mutual fund", "return", "risk", "diversify"],
    taxes: ["tax", "deduction", "credit", "refund", "IRS", "filing", "write-off"],
    housing: ["house", "apartment", "rent", "mortgage", "down payment", "property"],
    credit: ["credit score", "FICO", "credit report", "utilization", "credit history"],
    retirement: ["retire", "401k", "IRA", "pension", "social security", "compound interest"],
    insurance: ["insure", "policy", "premium", "coverage", "deductible", "claim"],
    education: ["college", "university", "student loan", "scholarship", "education", "degree", "tuition"],
    children: ["kid", "child", "baby", "family", "allowance", "529 plan"],
    business: ["business", "entrepreneur", "startup", "self-employed", "freelance", "company"]
  };
  
  const messageLower = message.toLowerCase();
  let matchedTopic = "fallback";
  let highestMatchCount = 0;
  
  // Find topic with most keyword matches
  for (const [topic, keywords] of Object.entries(topics)) {
    const matchCount = keywords.filter(keyword => messageLower.includes(keyword.toLowerCase())).length;
    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      matchedTopic = topic;
    }
  }
  
  // If greeting is detected, use that instead
  const greetings = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"];
  if (greetings.some(greeting => messageLower.includes(greeting)) && messageLower.length < 20) {
    return "greeting";
  }
  
  return highestMatchCount > 0 ? matchedTopic : "fallback";
};

// Generate bot response based on message content
const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");
  const userMessage = userData.message.trim();
  
  try {
    // Determine relevant financial topic
    const topic = determineFinancialTopic(userMessage);
    
    // Update user's financial context
    userFinancialContext.lastTopics.push(topic);
    if (userFinancialContext.lastTopics.length > 3) {
      userFinancialContext.lastTopics.shift();
    }
    
    // Get a random response from the topic
    // Get a random response from the topic
    const responses = financialKnowledgeBase[topic];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Extract financial details from message if present
    if (userMessage.includes("income") && /\d/.test(userMessage)) {
      const incomeMatch = userMessage.match(/\$?\s?(\d{1,3}(,\d{3})*(\.\d+)?|\d+(\.\d+)?)\s?(k|thousand|mil|million)?/i);
      if (incomeMatch) {
        let amount = parseFloat(incomeMatch[1].replace(/,/g, ''));
        if (incomeMatch[5]) {
          if (incomeMatch[5].toLowerCase() === 'k' || incomeMatch[5].toLowerCase() === 'thousand') {
            amount *= 1000;
          } else if (incomeMatch[5].toLowerCase() === 'mil' || incomeMatch[5].toLowerCase() === 'million') {
            amount *= 1000000;
          }
        }
        userFinancialContext.income = amount;
      }
    }
    
    if (userMessage.includes("spend") || userMessage.includes("expense")) {
      const expenseMatch = userMessage.match(/\$?\s?(\d{1,3}(,\d{3})*(\.\d+)?|\d+(\.\d+)?)\s?(k|thousand|mil|million)?/i);
      if (expenseMatch) {
        let amount = parseFloat(expenseMatch[1].replace(/,/g, ''));
        if (expenseMatch[5]) {
          if (expenseMatch[5].toLowerCase() === 'k' || expenseMatch[5].toLowerCase() === 'thousand') {
            amount *= 1000;
          } else if (expenseMatch[5].toLowerCase() === 'mil' || expenseMatch[5].toLowerCase() === 'million') {
            amount *= 1000000;
          }
        }
        userFinancialContext.expenses = amount;
      }
    }
    
    // Personalize response if we have user context
    let botResponse = randomResponse;
    
    if (userFinancialContext.income && topic === "budgeting") {
      const needs = userFinancialContext.income * 0.5;
      const wants = userFinancialContext.income * 0.3;
      const savings = userFinancialContext.income * 0.2;
      
      botResponse = `Based on your monthly income of $${userFinancialContext.income.toLocaleString()}, I'd recommend: 
      <ul>
        <li>$${needs.toLocaleString()} for needs (housing, food, utilities)</li>
        <li>$${wants.toLocaleString()} for wants (entertainment, dining out)</li>
        <li>$${savings.toLocaleString()} for savings and debt repayment</li>
      </ul>
      Remember, this is a starting point - you can adjust based on your specific situation.`;
    }
    
    if (userFinancialContext.income && userFinancialContext.expenses && topic === "saving") {
      const savingPotential = userFinancialContext.income - userFinancialContext.expenses;
      if (savingPotential > 0) {
        botResponse = `Great! With income of $${userFinancialContext.income.toLocaleString()} and expenses of $${userFinancialContext.expenses.toLocaleString()}, you have about $${savingPotential.toLocaleString()} available for saving each month.
        
        I'd recommend first building an emergency fund of $${(userFinancialContext.expenses * 3).toLocaleString()} to $${(userFinancialContext.expenses * 6).toLocaleString()} (3-6 months of expenses), then consider retirement accounts or other investment options.`;
      } else {
        botResponse = `I notice your expenses ($${userFinancialContext.expenses.toLocaleString()}) exceed your income ($${userFinancialContext.income.toLocaleString()}). Before focusing on saving, let's look at reducing expenses or increasing income to create a positive cash flow.
        
        Start by categorizing your expenses to find areas where you can cut back.`;
      }
    }
    
    // Display the response
    messageElement.innerHTML = botResponse;
    
    // Record interaction in chat history for context
    chatHistory.push({
      role: "user",
      message: userMessage
    });
    
    chatHistory.push({
      role: "bot",
      message: botResponse,
      topic: topic
    });
    
    // If we have context but user is asking about unrelated topic, suggest related advice
    if (chatHistory.length > 4 && userFinancialContext.lastTopics.filter(t => t === topic).length === 1) {
      setTimeout(() => {
        // Create follow-up message with related advice
        const relatedTopic = userFinancialContext.lastTopics[0];
        const relatedResponses = financialKnowledgeBase[relatedTopic];
        const relatedResponse = relatedResponses[Math.floor(Math.random() * relatedResponses.length)];
        
        const followUpContent = `<span class="bot-avatar material-symbols-rounded">account_balance</span>
          <div class="message-text">
            Since we were discussing ${relatedTopic} earlier, you might also find this helpful: 
            <br><br>
            ${relatedResponse}
          </div>`;
          
        const followUpDiv = createMessageElement(followUpContent, "bot-message");
        chatBody.appendChild(followUpDiv);
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
        
        chatHistory.push({
          role: "bot",
          message: relatedResponse,
          topic: relatedTopic
        });
      }, 5000);
    }
    
  } catch (error) {
    // Handle errors gracefully
    console.error(error);
    messageElement.innerHTML = "I apologize, but I'm having trouble connecting to my financial database. Please try again in a moment.";
    messageElement.style.color = "#ff6b6b";
  } finally {
    // Clean up and scroll to bottom
    incomingMessageDiv.classList.remove("thinking");
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }
};

// Handle outgoing user messages
const handleOutgoingMessage = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  
  if (!userData.message) return;
  
  messageInput.value = "";
  messageInput.dispatchEvent(new Event("input"));
  fileUploadWrapper.classList.remove("file-uploaded");

  // Create and display user message
  const messageContent = `<div class="message-text"></div>
                          ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;

  const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
  outgoingMessageDiv.querySelector(".message-text").innerText = userData.message;
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  // Create bot response with thinking indicator
  setTimeout(() => {
    const messageContent = `<span class="bot-avatar material-symbols-rounded">account_balance</span>
          <div class="message-text">
            <div class="thinking-indicator">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>`;

    const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    generateBotResponse(incomingMessageDiv);
  }, 600);
};

// Initialize user data
const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null,
  },
};

// Budget calculator functionality
const calculateBudget = () => {
  const income = parseFloat(document.getElementById('income').value);
  const expenses = parseFloat(document.getElementById('expenses').value);
  
  if (isNaN(income)) {
    alert('Please enter a valid income amount');
    return;
  }
  
  // Update values in UI
  document.getElementById('needs-value').textContent = `$${(income * 0.5).toFixed(2)}`;
  document.getElementById('wants-value').textContent = `$${(income * 0.3).toFixed(2)}`;
  document.getElementById('savings-value').textContent = `$${(income * 0.2).toFixed(2)}`;
  
  const remaining = isNaN(expenses) ? income : income - expenses;
  document.getElementById('remaining-value').textContent = `$${remaining.toFixed(2)}`;
  
  // Update financial context
  userFinancialContext.income = income;
  if (!isNaN(expenses)) {
    userFinancialContext.expenses = expenses;
  }
};

// Adjust input field height dynamically
messageInput.addEventListener("input", () => {
  messageInput.style.height = `${initialInputHeight}px`;
  messageInput.style.height = `${messageInput.scrollHeight}px`;
  document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "24px";
});

// Handle Enter key press for sending messages
messageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (e.key === "Enter" && !e.shiftKey && userMessage && window.innerWidth > 768) {
    e.preventDefault();
    handleOutgoingMessage(e);
  }
});

// Handle file input change and preview the selected file
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    fileInput.value = "";
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");
    const base64String = e.target.result.split(",")[1];

    // Store file data in userData
    userData.file = {
      data: base64String,
      mime_type: file.type,
    };
  };

  reader.readAsDataURL(file);
});

// Cancel file upload
fileCancelButton.addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-uploaded");
});

// Initialize emoji picker
const picker = new EmojiMart.Picker({
  theme: "light",
  skinTonePosition: "none",
  previewPosition: "none",
  onEmojiSelect: (emoji) => {
    const { selectionStart: start, selectionEnd: end } = messageInput;
    messageInput.setRangeText(emoji.native, start, end, "end");
    messageInput.focus();
  },
  onClickOutside: (e) => {
    if (e.target.id === "emoji-picker") {
      document.body.classList.toggle("show-emoji-picker");
    } else {
      document.body.classList.remove("show-emoji-picker");
    }
  },
});

// Add emoji picker to the document
document.querySelector(".chat-form").appendChild(picker);

// Modal controls
budgetCalculator.addEventListener("click", () => {
  calculatorModal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  calculatorModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === calculatorModal) {
    calculatorModal.style.display = "none";
  }
});

// Calculate budget when button is clicked
calculateBtn.addEventListener("click", calculateBudget);

// Add event listeners
document.querySelector("#emoji-picker").addEventListener("click", () => {
  document.body.classList.toggle("show-emoji-picker");
});

sendMessage.addEventListener("click", (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));