const output = document.getElementById("terminal-output");
const input = document.getElementById("terminal-input");
const terminal = document.querySelector(".terminal");
const screen = document.querySelector(".terminal__body");

const sections = {
  experience: ["Canadian Tire - DevOps and Java Developer"],
  education: [
    "University of Illinois Urbana Champaign - Master's Degree - Computer Science",
    "University of Victoria - Bachelor's Degree - Computer Science",
    "W.L. Seaton High School - Double Dogwood - French Immersion - Valedictorian"
  ],
  interests: ["ZigTensor"],
  social: ["X"]
};

const themes = {
  magenta: "Magenta dark",
  green: "Classic matrix",
  amber: "Amber phosphor",
  ice: "Ice terminal"
};

const helpLines = [
  "Available commands:",
  "man, help        Show this command list",
  "whoami           Print profile owner",
  "ls               List sections",
  "show <section>   Show a section (experience, education, interests, social)",
  "theme <name>     Change theme (magenta, green, amber, ice)",
  "clear            Clear terminal output"
];

function printLine(text, className = "") {
  const line = document.createElement("p");
  line.className = `line ${className}`.trim();
  line.textContent = text;
  output.appendChild(line);
  scrollToBottom();
}

function printCommand(cmd) {
  const line = document.createElement("p");
  line.className = "line line--command";
  line.textContent = cmd;
  output.appendChild(line);
  scrollToBottom();
}

function printSection(name, items) {
  const block = document.createElement("section");
  block.className = "output-block";

  const title = document.createElement("h2");
  title.textContent = name;
  block.appendChild(title);

  const list = document.createElement("ul");
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
  block.appendChild(list);

  output.appendChild(block);
  scrollToBottom();
}

function scrollToBottom() {
  screen.scrollTop = screen.scrollHeight;
}

function normalizeSectionName(value) {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function resolveSection(name) {
  const clean = normalizeSectionName(name);
  const aliases = {
    experience: "experience",
    exp: "experience",
    education: "education",
    school: "education",
    interests: "interests",
    interest: "interests",
    social: "social",
    socials: "social"
  };
  return aliases[clean] || "";
}

function setTheme(themeName) {
  document.body.dataset.theme = themeName;
}

function getInputValue() {
  return input.textContent.replace(/\u00a0/g, " ").trim();
}

function clearInput() {
  input.textContent = "";
}

function runCommand(raw) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return;
  }

  printCommand(trimmed);

  const [command, ...rest] = trimmed.split(/\s+/);
  const cmd = command.toLowerCase();
  const arg = rest.join(" ");

  if (cmd === "man" || cmd === "help") {
    helpLines.forEach((line) => printLine(line, "line--muted"));
    return;
  }

  if (cmd === "whoami") {
    printLine("Ben Miller");
    return;
  }

  if (cmd === "ls") {
    printLine(Object.keys(sections).join("  "));
    return;
  }

  if (cmd === "clear") {
    output.textContent = "";
    return;
  }

  if (cmd === "theme") {
    const theme = arg.toLowerCase();
    if (!theme) {
      printLine(`themes: ${Object.keys(themes).join(", ")}`, "line--muted");
      return;
    }
    if (!themes[theme]) {
      printLine(`Unknown theme: ${theme}`, "line--error");
      return;
    }
    setTheme(theme);
    printLine(`Theme set to ${themes[theme]}.`);
    return;
  }

  if (cmd === "show") {
    const key = resolveSection(arg);
    if (!key || !sections[key]) {
      printLine(`Unknown section: ${arg || "(empty)"}`, "line--error");
      return;
    }
    printSection(key, sections[key]);
    return;
  }

  const direct = resolveSection(cmd);
  if (direct && sections[direct]) {
    printSection(direct, sections[direct]);
    return;
  }

  printLine(`Command not found: ${trimmed}`, "line--error");
  printLine("Type 'man' to see available commands.", "line--muted");
}

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function boot() {
  await sleep(180);
  printLine("prior-user@resume:~$ man", "line--history");
  for (const line of helpLines) {
    await sleep(80);
    printLine(line, "line--muted");
  }
  await sleep(110);
  printLine("Tip: type a section name directly, e.g. 'experience'.", "line--muted");
}

input.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }
  event.preventDefault();
  runCommand(getInputValue());
  clearInput();
});

terminal.addEventListener("click", () => {
  input.focus();
});

window.addEventListener("load", () => {
  input.focus();
  boot();
});
