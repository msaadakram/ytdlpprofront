/**
 * Lightweight regex-based syntax highlighter for code blocks.
 * Returns HTML with span elements for styling.
 *
 * Uses a tokenization approach: the code is split into segments first,
 * then HTML-escaped, then wrapped in spans. This avoids the problem of
 * sequential regex replacements matching parts of already-inserted HTML tags.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function wrap(text: string, className: string): string {
  return `<span class="${className}">${text}</span>`;
}

type Segment = { text: string; className?: string };

/**
 * Split text into segments based on a list of regex patterns.
 * Patterns are applied in order; earlier matches take priority.
 */
function tokenize(text: string, patterns: Array<{ regex: RegExp; className: string }>): Segment[] {
  const segments: Segment[] = [];
  let pos = 0;

  while (pos < text.length) {
    let matched = false;
    for (const { regex, className } of patterns) {
      regex.lastIndex = pos;
      const m = regex.exec(text);
      if (m && m.index === pos) {
        segments.push({ text: m[0], className });
        pos = m.index + m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      segments.push({ text: text[pos] });
      pos++;
    }
  }

  return segments;
}

/**
 * Merge adjacent segments with the same className for cleaner output.
 */
function mergeSegments(segments: Segment[]): Segment[] {
  const result: Segment[] = [];
  for (const seg of segments) {
    const last = result[result.length - 1];
    if (last && last.className === seg.className) {
      last.text += seg.text;
    } else {
      result.push({ ...seg });
    }
  }
  return result;
}

/**
 * Convert segments to HTML.
 */
function segmentsToHtml(segments: Segment[]): string {
  return mergeSegments(segments)
    .map((seg) => {
      const escaped = escapeHtml(seg.text);
      return seg.className ? wrap(escaped, seg.className) : escaped;
    })
    .join("");
}

/**
 * Highlight bash/shell code.
 */
function highlightBash(code: string): string {
  const lines = code.split("\n");
  return lines
    .map((line) => {
      if (line.trimStart().startsWith("#")) {
        return wrap(escapeHtml(line), "text-[#6a9955]");
      }

      const patterns: Array<{ regex: RegExp; className: string }> = [
        // Comments at end of line
        { regex: /(#.*$)/, className: "text-[#6a9955]" },
        // Strings (double, single, backtick)
        { regex: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/, className: "text-[#ce9178]" },
        // URLs
        { regex: /(https?:\/\/[^\s'"<]+)/, className: "text-[#4ec9b0]" },
        // Command keywords at start
        { regex: /^(curl|wget|pip|npm|yarn|go|java|node|python|echo|cd|mkdir|rm|cp|mv|ls|cat|grep|sed|awk)\b/, className: "text-[#569cd6]" },
        // Flags
        { regex: /(-[A-Za-z]+)/, className: "text-[#9cdcfe]" },
      ];

      const segments = tokenize(line, patterns);
      return segmentsToHtml(segments);
    })
    .join("\n");
}

/**
 * Highlight JSON code.
 */
function highlightJson(code: string): string {
  const patterns: Array<{ regex: RegExp; className: string }> = [
    // Comments
    { regex: /(\/\/.*$|\/\*[\s\S]*?\*\/)/, className: "text-[#6a9955]" },
    // Keys (before colon)
    { regex: /("(?:\\.|[^"\\])*"\s*:)/, className: "text-[#9cdcfe]" },
    // String values
    { regex: /("(?:\\.|[^"\\])*")/, className: "text-[#ce9178]" },
    // Numbers
    { regex: /(\b\d+(?:\.\d+)?\b)/, className: "text-[#b5cea8]" },
    // Booleans and null
    { regex: /\b(true|false|null)\b/, className: "text-[#569cd6]" },
  ];

  const segments = tokenize(code, patterns);
  return segmentsToHtml(segments);
}

/**
 * Highlight generic programming language code.
 */
function highlightGeneric(code: string, language: string): string {
  const keywords = getKeywords(language);
  const builtins = getBuiltins(language);

  const patterns: Array<{ regex: RegExp; className: string }> = [
    // Multi-line comments
    { regex: /\/\*[\s\S]*?\*\//, className: "text-[#6a9955]" },
    // Single-line comments
    { regex: /(\/\/.*$)/, className: "text-[#6a9955]" },
    // Python-style comments
    { regex: /(#.*$)/, className: "text-[#6a9955]" },
    // Template literals (JS)
    { regex: /(`(?:[^`\\]|\\.)*`)/, className: "text-[#ce9178]" },
    // Strings (double, single)
    { regex: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/, className: "text-[#ce9178]" },
    // Keywords
    ...(keywords.length > 0
      ? [{ regex: new RegExp(`\\b(${keywords.join("|")})\\b`), className: "text-[#c678dd]" }]
      : []),
    // Types (PascalCase)
    { regex: /\b([A-Z]\w+)\b/, className: "text-[#e5c07b]" },
    // Built-ins
    ...(builtins.length > 0
      ? [{ regex: new RegExp(`\\b(${builtins.join("|")})\\b`), className: "text-[#61afef]" }]
      : []),
    // Numbers
    { regex: /\b(\d+(?:\.\d+)?)\b/, className: "text-[#d19a66]" },
  ];

  const segments = tokenize(code, patterns);
  return segmentsToHtml(segments);
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

/**
 * Apply syntax highlighting to a code string.
 * Returns HTML with span elements for styling.
 */
export function highlightCode(code: string, language?: string): string {
  if (!language || language === "text") return escapeHtml(code);

  if (language === "bash") {
    return highlightBash(code);
  }

  if (language === "json") {
    return highlightJson(code);
  }

  return highlightGeneric(code, language);
}
