/**
 * Lightweight regex-based syntax highlighter for code blocks.
 * Returns an array of { text, className } tokens.
 */

type Token = { text: string; className?: string };

const COMMENT_RE = /(#.*$|\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
const STRING_RE = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g;
const KEYWORD_RE = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|class|import|from|export|default|try|catch|finally|throw|async|await|yield|of|in|true|false|null|undefined|nil|None|True|False|def|self|print|fmt|package|func|defer|type|struct|interface|map|go|select|chan|var|public|static|void|int|String|throws|Exception|HttpClient|HttpRequest|HttpResponse|POST|GET|Header|URI|BodyPublishers|newBuilder|ofString)\b/g;
const NUMBER_RE = /\b(\d+(?:\.\d+)?)\b/g;
const BUILTIN_RE = /\b(console|document|window|process|require|module|fetch|requests|json|time|fmt|io|http|bytes|encoding|net|math|os|strings|errors|sync|context|strconv|path|filepath|log|sort|regexp|unsafe|syscall)\b/g;
const PROPERTY_RE = /(?<=\.)(\w+)(?=\s*[=(])/g;
const DECORATOR_RE = /(@\w+)/g;
const TYPE_RE = /\b([A-Z]\w+)\b/g;
const OPERATOR_RE = /(=>|===|!==|==|!=|<=|>=|&&|\|\||\.\.\.)/g;
const URL_RE = /(https?:\/\/[^\s"']+)/g;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function wrap(text: string, className?: string): string {
  if (!className) return escapeHtml(text);
  return `<span class="${className}">${escapeHtml(text)}</span>`;
}

const LANG_STYLES: Record<string, string> = {
  bash: "text-white/50",
  python: "text-[#e6db74]",
  javascript: "text-[#f8d847]",
  json: "text-[#e06c75]",
  java: "text-[#9876aa]",
  go: "text-[#56b6c2]",
  text: "text-white/40",
};

/**
 * Apply syntax highlighting to a code string.
 * Returns HTML with span elements for styling.
 */
export function highlightCode(code: string, language?: string): string {
  if (!language || language === "text") return escapeHtml(code);

  // For bash/curl, highlight comments, strings, and the command keyword
  if (language === "bash") {
    return highlightBash(code);
  }

  // For JSON, highlight keys, strings, numbers, booleans
  if (language === "json") {
    return highlightJson(code);
  }

  // For programming languages, highlight keywords, strings, comments
  return highlightGeneric(code, language);
}

function highlightBash(code: string): string {
  const lines = code.split("\n");
  return lines
    .map((line) => {
      // Comment lines
      if (line.trimStart().startsWith("#")) {
        return `<span class="text-[#6a9955]">${escapeHtml(line)}</span>`;
      }

      let result = escapeHtml(line);

      // Highlight command keywords at the start
      result = result.replace(
        /^(curl|wget|pip|npm|yarn|go|java|node|python|import|const|echo|cd|mkdir|rm|cp|mv|ls|cat|grep|sed|awk)\b/,
        `<span class="text-[#569cd6]">$1</span>`,
      );

      // Highlight flags
      result = result.replace(/(\s)(-[A-Za-z]+)/g, `$1<span class="text-[#9cdcfe]">$2</span>`);

      // Highlight strings (quoted values)
      result = result.replace(
        /(&quot;[^&]*?&quot;|&#x27;[^&]*?&#x27;|"[^"]*?"|'[^']*?')/g,
        `<span class="text-[#ce9178]">$1</span>`,
      );

      // Highlight URLs
      result = result.replace(
        /(https?:\/\/[^\s&lt;]+)/g,
        `<span class="text-[#4ec9b0]">$1</span>`,
      );

      return result;
    })
    .join("\n");
}

function highlightJson(code: string): string {
  let result = escapeHtml(code);

  // JSON keys (before colon)
  result = result.replace(
    /(&quot;)(\w+)(&quot;)(\s*:)/g,
    `<span class="text-[#9cdcfe]">$1$2$3</span>$4`,
  );

  // String values
  result = result.replace(
    /(:\s*)(&quot;)((?:[^&]|&(?!quot;))*)(&quot;)/g,
    `$1<span class="text-[#ce9178]">$2$3$4</span>`,
  );

  // Numbers
  result = result.replace(
    /(:\s*)(\d+(?:\.\d+)?)/g,
    `$1<span class="text-[#b5cea8]">$2</span>`,
  );

  // Booleans and null
  result = result.replace(
    /\b(true|false|null)\b/g,
    `<span class="text-[#569cd6]">$1</span>`,
  );

  return result;
}

function highlightGeneric(code: string, language: string): string {
  // Tokenize the code to avoid double-highlighting
  const tokens: Token[] = [];
  let remaining = code;
  let pos = 0;

  // First pass: extract comments and strings as anchors
  const anchors: Array<{ start: number; end: number; type: "comment" | "string"; text: string }> = [];

  // Single-line comments
  const commentPattern = language === "go" ? /\/\/.*$/gm : language === "java" ? /\/\/.*$/gm : /#.*$/gm;
  let match;
  while ((match = commentPattern.exec(code)) !== null) {
    anchors.push({ start: match.index, end: match.index + match[0].length, type: "comment", text: match[0] });
  }

  // Multi-line comments
  const multiCommentPattern = language === "java" || language === "go" ? /\/\*[\s\S]*?\*\//g : null;
  if (multiCommentPattern) {
    while ((match = multiCommentPattern.exec(code)) !== null) {
      anchors.push({ start: match.index, end: match.index + match[0].length, type: "comment", text: match[0] });
    }
  }

  // Strings
  const stringPattern = /(?<![\\])("|')(?:(?!\1).)*?\1/g;
  while ((match = stringPattern.exec(code)) !== null) {
    // Check if this overlaps with an existing anchor
    const overlaps = anchors.some((a) => match!.index < a.end && match!.index + match![0].length > a.start);
    if (!overlaps) {
      anchors.push({ start: match.index, end: match.index + match[0].length, type: "string", text: match[0] });
    }
  }

  // Template literals for JS/Node
  if (language === "javascript") {
    const templatePattern = /`(?:[^`\\]|\\.)*`/g;
    while ((match = templatePattern.exec(code)) !== null) {
      const overlaps = anchors.some((a) => match!.index < a.end && match!.index + match![0].length > a.start);
      if (!overlaps) {
        anchors.push({ start: match.index, end: match.index + match[0].length, type: "string", text: match[0] });
      }
    }
  }

  // Sort anchors by start position
  anchors.sort((a, b) => a.start - b.start);

  // Build output by processing non-anchor regions for keywords
  let html = "";
  let lastEnd = 0;

  for (const anchor of anchors) {
    // Process text before this anchor
    if (anchor.start > lastEnd) {
      html += highlightKeywords(code.slice(lastEnd, anchor.start), language);
    }
    // Add the anchor as-is (comment or string)
    const className = anchor.type === "comment" ? "text-[#6a9955]" : "text-[#ce9178]";
    html += `<span class="${className}">${escapeHtml(anchor.text)}</span>`;
    lastEnd = anchor.end;
  }

  // Process remaining text
  if (lastEnd < code.length) {
    html += highlightKeywords(code.slice(lastEnd), language);
  }

  return html;
}

function highlightKeywords(text: string, language: string): string {
  let result = escapeHtml(text);

  // Keywords
  const keywords = getKeywords(language);
  if (keywords.length > 0) {
    const kwRe = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
    result = result.replace(kwRe, `<span class="text-[#c678dd]">$1</span>`);
  }

  // Types (PascalCase words)
  result = result.replace(
    /\b([A-Z]\w+)\b/g,
    `<span class="text-[#e5c07b]">$1</span>`,
  );

  // Numbers
  result = result.replace(
    /\b(\d+(?:\.\d+)?)\b/g,
    `<span class="text-[#d19a66]">$1</span>`,
  );

  // Built-in functions / common objects
  const builtins = getBuiltins(language);
  if (builtins.length > 0) {
    const biRe = new RegExp(`\\b(${builtins.join("|")})\\b`, "g");
    result = result.replace(biRe, `<span class="text-[#61afef]">$1</span>`);
  }

  return result;
}

function getKeywords(language: string): string[] {
  switch (language) {
    case "python":
      return ["import", "from", "def", "class", "return", "if", "else", "elif", "for", "while", "True", "False", "None", "and", "or", "not", "in", "is", "with", "as", "try", "except", "finally", "raise", "pass", "break", "continue", "lambda", "yield", "global", "nonlocal", "assert", "del", "print"];
    case "javascript":
      return ["const", "let", "var", "function", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "new", "this", "class", "import", "from", "export", "default", "try", "catch", "finally", "throw", "async", "await", "yield", "of", "in", "true", "false", "null", "undefined", "typeof", "instanceof"];
    case "java":
      return ["import", "public", "private", "protected", "static", "final", "void", "class", "interface", "extends", "implements", "new", "this", "super", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "try", "catch", "finally", "throw", "throws", "true", "false", "null", "instanceof", "abstract"];
    case "go":
      return ["package", "import", "func", "return", "if", "else", "for", "range", "switch", "case", "default", "break", "continue", "go", "defer", "select", "chan", "map", "struct", "interface", "type", "const", "var", "true", "false", "nil", "make", "new", "append", "len", "cap", "panic", "recover"];
    default:
      return [];
  }
}

function getBuiltins(language: string): string[] {
  switch (language) {
    case "python":
      return ["print", "len", "range", "str", "int", "float", "list", "dict", "set", "tuple", "type", "isinstance", "hasattr", "getattr", "setattr", "open", "input", "format", "enumerate", "zip", "map", "filter", "sorted", "reversed", "any", "all", "min", "max", "sum", "abs", "round", "time", "json", "requests"];
    case "javascript":
      return ["console", "document", "window", "fetch", "JSON", "Promise", "Array", "Object", "String", "Number", "Boolean", "Math", "Date", "RegExp", "Error", "setTimeout", "setInterval", "clearTimeout", "clearInterval", "parseInt", "parseFloat", "isNaN", "encodeURI", "decodeURI"];
    case "java":
      return ["System", "String", "Integer", "Double", "Boolean", "ArrayList", "HashMap", "List", "Map", "Set", "Collections", "Arrays", "HttpClient", "HttpRequest", "HttpResponse", "URI", "Duration", "Thread"];
    case "go":
      return ["fmt", "strings", "strconv", "json", "http", "io", "bytes", "time", "os", "net", "log", "errors", "sync", "context", "math", "path", "filepath", "sort", "regexp", "unsafe", "syscall", "Make", "New", "Append", "Len", "Println", "Sprintf", "Errorf", "NewRequest"];
    default:
      return [];
  }
}
