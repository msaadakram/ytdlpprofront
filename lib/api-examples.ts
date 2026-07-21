import type { Snippet } from "@/components/api/CodeTabs";

/**
 * Code snippets for the DownForge API documentation.
 *
 * Single source of truth shared by the public `/api` page and the
 * in-dashboard "How to use your API key" guide. The `apiKey` parameter lets
 * callers substitute a real key for the placeholder when needed.
 */

export const API_BASE_URL = "https://api.downforge.me/api";

export interface ExampleVars {
  /** Shown verbatim in snippets. Defaults to the placeholder. */
  apiKey?: string;
  url?: string;
  formatId?: string;
  jobId?: string;
  platform?: string;
}

const DEFAULTS: Required<ExampleVars> = {
  apiKey: "df_live_YOUR_API_KEY",
  url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
  formatId: "137",
  jobId: "550e8400-e29b-41d4-a716-446655440000",
  platform: "youtube",
};

function vars(overrides?: ExampleVars): Required<ExampleVars> {
  return { ...DEFAULTS, ...(overrides || {}) };
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Snippet builders — one function per (endpoint × language)                  */
/* ────────────────────────────────────────────────────────────────────────── */

function authCurl(v: Required<ExampleVars>): string {
  return `curl -X POST ${API_BASE_URL}/${v.platform}/info \\
  -H "Authorization: Bearer ${v.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "${v.url}"}'`;
}

function authPython(v: Required<ExampleVars>): string {
  return `import requests

BASE_URL = "${API_BASE_URL}"
API_KEY = "${v.apiKey}"

resp = requests.post(
    f"{BASE_URL}/${v.platform}/info",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={"url": "${v.url}"},
)
print(resp.json())`;
}

function authNode(v: Required<ExampleVars>): string {
  return `const BASE_URL = "${API_BASE_URL}";
const API_KEY = "${v.apiKey}";

const res = await fetch(\`\${BASE_URL}/${v.platform}/info\`, {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ url: "${v.url}" }),
});
const data = await res.json();
console.log(data);`;
}

function authJavascript(v: Required<ExampleVars>): string {
  return `// Browser (fetch is built-in)
const res = await fetch("${API_BASE_URL}/${v.platform}/info", {
  method: "POST",
  headers: {
    Authorization: "Bearer ${v.apiKey}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ url: "${v.url}" }),
});
const data = await res.json();
console.log(data);`;
}

function authJava(v: Required<ExampleVars>): string {
  return `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

HttpClient client = HttpClient.newHttpClient();
String body = "{\\"url\\": \\"${v.url}\\"}";

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${API_BASE_URL}/${v.platform}/info"))
    .header("Authorization", "Bearer ${v.apiKey}")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();

HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`;
}

function authGo(v: Required<ExampleVars>): string {
  return `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    payload, _ := json.Marshal(map[string]string{
        "url": "${v.url}",
    })
    req, _ := http.NewRequest("POST",
        "${API_BASE_URL}/${v.platform}/info", bytes.NewBuffer(payload))
    req.Header.Set("Authorization", "Bearer ${v.apiKey}")
    req.Header.Set("Content-Type", "application/json")

    resp, err := http.DefaultClient.Do(req)
    if err != nil { panic(err) }
    defer resp.Body.Close()
    // decode body...
    fmt.Println(resp.Status)
}`;
}

/* ─── Per-endpoint helpers ─── */

function infoSnippets(v: Required<ExampleVars>): Record<Languages, string> {
  return {
    curl: `curl -X POST ${API_BASE_URL}/${v.platform}/info \\
  -H "Authorization: Bearer ${v.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "${v.url}"}'`,
    python: `import requests

resp = requests.post(
    "${API_BASE_URL}/${v.platform}/info",
    headers={"Authorization": "Bearer ${v.apiKey}"},
    json={"url": "${v.url}"},
)
print(resp.json())`,
    node: `const res = await fetch("${API_BASE_URL}/${v.platform}/info", {
  method: "POST",
  headers: {
    Authorization: "Bearer ${v.apiKey}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ url: "${v.url}" }),
});
const data = await res.json();
console.log(data);`,
    javascript: `const res = await fetch("${API_BASE_URL}/${v.platform}/info", {
  method: "POST",
  headers: {
    Authorization: "Bearer ${v.apiKey}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ url: "${v.url}" }),
});
const data = await res.json();`,
    java: `HttpClient client = HttpClient.newHttpClient();
String body = "{\\"url\\": \\"${v.url}\\"}";

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${API_BASE_URL}/${v.platform}/info"))
    .header("Authorization", "Bearer ${v.apiKey}")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();

HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
    go: `payload, _ := json.Marshal(map[string]string{
    "url": "${v.url}",
})
req, _ := http.NewRequest("POST",
    "${API_BASE_URL}/${v.platform}/info", bytes.NewBuffer(payload))
req.Header.Set("Authorization", "Bearer ${v.apiKey}")
req.Header.Set("Content-Type", "application/json")

resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()`,
  };
}

function downloadSnippets(v: Required<ExampleVars>): Record<Languages, string> {
  return {
    curl: `curl -X POST ${API_BASE_URL}/${v.platform}/download \\
  -H "Authorization: Bearer ${v.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "${v.url}", "format_id": "${v.formatId}"}'`,
    python: `resp = requests.post(
    "${API_BASE_URL}/${v.platform}/download",
    headers={"Authorization": "Bearer ${v.apiKey}"},
    json={"url": "${v.url}", "format_id": "${v.formatId}"},
)
print(resp.json())  # -> {"success": true, "data": {"job_id": "...", "status": "queued"}}`,
    node: `const res = await fetch("${API_BASE_URL}/${v.platform}/download", {
  method: "POST",
  headers: {
    Authorization: "Bearer ${v.apiKey}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ url: "${v.url}", format_id: "${v.formatId}" }),
});
const { data } = await res.json();
console.log(data.job_id); // use this to poll for status`,
    javascript: `const res = await fetch("${API_BASE_URL}/${v.platform}/download", {
  method: "POST",
  headers: {
    Authorization: "Bearer ${v.apiKey}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ url: "${v.url}", format_id: "${v.formatId}" }),
});
const { data } = await res.json();
console.log(data.job_id);`,
    java: `String body = "{\\"url\\": \\"${v.url}\\", \\"format_id\\": \\"${v.formatId}\\"}";

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${API_BASE_URL}/${v.platform}/download"))
    .header("Authorization", "Bearer ${v.apiKey}")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();

HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());`,
    go: `payload, _ := json.Marshal(map[string]string{
    "url":       "${v.url}",
    "format_id": "${v.formatId}",
})
req, _ := http.NewRequest("POST",
    "${API_BASE_URL}/${v.platform}/download", bytes.NewBuffer(payload))
req.Header.Set("Authorization", "Bearer ${v.apiKey}")
req.Header.Set("Content-Type", "application/json")

resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()`,
  };
}

function jobStatusSnippets(v: Required<ExampleVars>): Record<Languages, string> {
  return {
    curl: `curl ${API_BASE_URL}/job/${v.jobId} \\
  -H "Authorization: Bearer ${v.apiKey}"`,
    python: `resp = requests.get(
    "${API_BASE_URL}/job/${v.jobId}",
    headers={"Authorization": "Bearer ${v.apiKey}"},
)
print(resp.json())
# -> {"success": true, "data": {"status": "downloading", "progress": 45.2, ...}}`,
    node: `const res = await fetch("${API_BASE_URL}/job/${v.jobId}", {
  headers: { Authorization: \`Bearer ${v.apiKey}\` },
});
const { data } = await res.json();
console.log(data.status, data.progress);`,
    javascript: `const res = await fetch("${API_BASE_URL}/job/${v.jobId}", {
  headers: { Authorization: "Bearer ${v.apiKey}" },
});
const { data } = await res.json();
console.log(data.status, data.progress);`,
    java: `HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${API_BASE_URL}/job/${v.jobId}"))
    .header("Authorization", "Bearer ${v.apiKey}")
    .GET()
    .build();

HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());`,
    go: `req, _ := http.NewRequest("GET", "${API_BASE_URL}/job/${v.jobId}", nil)
req.Header.Set("Authorization", "Bearer ${v.apiKey}")

resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()`,
  };
}

function jobResultSnippets(v: Required<ExampleVars>): Record<Languages, string> {
  return {
    curl: `curl ${API_BASE_URL}/job/${v.jobId}/result \\
  -H "Authorization: Bearer ${v.apiKey}"`,
    python: `resp = requests.get(
    "${API_BASE_URL}/job/${v.jobId}/result",
    headers={"Authorization": "Bearer ${v.apiKey}"},
)
data = resp.json()["data"]
print(data["download_url"])  # ready to fetch the file`,
    node: `const res = await fetch("${API_BASE_URL}/job/${v.jobId}/result", {
  headers: { Authorization: \`Bearer ${v.apiKey}\` },
});
const { data } = await res.json();
console.log(data.download_url); // download the file from here`,
    javascript: `const res = await fetch("${API_BASE_URL}/job/${v.jobId}/result", {
  headers: { Authorization: "Bearer ${v.apiKey}" },
});
const { data } = await res.json();
console.log(data.download_url);`,
    java: `HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${API_BASE_URL}/job/${v.jobId}/result"))
    .header("Authorization", "Bearer ${v.apiKey}")
    .GET()
    .build();

HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());`,
    go: `req, _ := http.NewRequest("GET", "${API_BASE_URL}/job/${v.jobId}/result", nil)
req.Header.Set("Authorization", "Bearer ${v.apiKey}")

resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()`,
  };
}

/* ─── Quick Start: end-to-end flow ─── */

function quickStartCurl(v: Required<ExampleVars>): string {
  return `# 1. Get available formats
curl -X POST ${API_BASE_URL}/${v.platform}/info \\
  -H "Authorization: Bearer ${v.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "${v.url}"}'

# 2. Start the download (returns job_id)
curl -X POST ${API_BASE_URL}/${v.platform}/download \\
  -H "Authorization: Bearer ${v.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "${v.url}", "format_id": "${v.formatId}"}'

# 3. Poll until status is "completed"
curl ${API_BASE_URL}/job/${v.jobId} \\
  -H "Authorization: Bearer ${v.apiKey}"

# 4. Fetch the result (download_url is ready)
curl ${API_BASE_URL}/job/${v.jobId}/result \\
  -H "Authorization: Bearer ${v.apiKey}"`;
}

function quickStartPython(v: Required<ExampleVars>): string {
  return `import time
import requests

BASE_URL = "${API_BASE_URL}"
HEADERS = {"Authorization": "Bearer ${v.apiKey}", "Content-Type": "application/json"}
VIDEO_URL = "${v.url}"

# 1. Get available formats
info = requests.post(f"{BASE_URL}/${v.platform}/info",
                     headers=HEADERS, json={"url": VIDEO_URL}).json()
format_id = info["data"]["best_format"]["format_id"]

# 2. Start the download
job = requests.post(f"{BASE_URL}/${v.platform}/download",
                    headers=HEADERS,
                    json={"url": VIDEO_URL, "format_id": format_id}).json()
job_id = job["data"]["job_id"]

# 3. Poll until complete
while True:
    status = requests.get(f"{BASE_URL}/job/{job_id}", headers=HEADERS).json()["data"]
    print(f"{status['status']} {status.get('progress', 0)}%")
    if status["status"] in ("completed", "failed"):
        break
    time.sleep(2)

# 4. Fetch the result
result = requests.get(f"{BASE_URL}/job/{job_id}/result", headers=HEADERS).json()
print(result["data"]["download_url"])`;
}

function quickStartNode(v: Required<ExampleVars>): string {
  return `const BASE_URL = "${API_BASE_URL}";
const API_KEY = "${v.apiKey}";
const HEADERS = { Authorization: \`Bearer \${API_KEY}\`, "Content-Type": "application/json" };
const VIDEO_URL = "${v.url}";

// 1. Get available formats
const info = await fetch(\`\${BASE_URL}/${v.platform}/info\`, {
  method: "POST", headers: HEADERS, body: JSON.stringify({ url: VIDEO_URL }),
}).then((r) => r.json());
const formatId = info.data.best_format.format_id;

// 2. Start the download
const job = await fetch(\`\${BASE_URL}/${v.platform}/download\`, {
  method: "POST", headers: HEADERS,
  body: JSON.stringify({ url: VIDEO_URL, format_id: formatId }),
}).then((r) => r.json());
const jobId = job.data.job_id;

// 3. Poll until complete
const poll = async () => {
  const status = await fetch(\`\${BASE_URL}/job/\${jobId}\`, { headers: HEADERS })
    .then((r) => r.json());
  console.log(\`\${status.data.status} \${status.data.progress ?? 0}%\`);
  if (["completed", "failed"].includes(status.data.status)) return status;
  await new Promise((r) => setTimeout(r, 2000));
  return poll();
};
await poll();

// 4. Fetch the result
const result = await fetch(\`\${BASE_URL}/job/\${jobId}/result\`, { headers: HEADERS })
  .then((r) => r.json());
console.log(result.data.download_url);`;
}

function quickStartJavascript(v: Required<ExampleVars>): string {
  return `const BASE_URL = "${API_BASE_URL}";
const API_KEY = "${v.apiKey}";
const VIDEO_URL = "${v.url}";

async function run() {
  // 1. Get formats
  const info = await fetch(\`\${BASE_URL}/${v.platform}/info\`, {
    method: "POST",
    headers: { Authorization: \`Bearer \${API_KEY}\`, "Content-Type": "application/json" },
    body: JSON.stringify({ url: VIDEO_URL }),
  }).then((r) => r.json());

  // 2. Start download
  const job = await fetch(\`\${BASE_URL}/${v.platform}/download\`, {
    method: "POST",
    headers: { Authorization: \`Bearer \${API_KEY}\`, "Content-Type": "application/json" },
    body: JSON.stringify({ url: VIDEO_URL, format_id: "${v.formatId}" }),
  }).then((r) => r.json());
  const jobId = job.data.job_id;

  // 3. Poll
  const poll = async () => {
    const s = await fetch(\`\${BASE_URL}/job/\${jobId}\`, {
      headers: { Authorization: \`Bearer \${API_KEY}\` },
    }).then((r) => r.json());
    if (s.data.status === "completed") return s;
    await new Promise((r) => setTimeout(r, 2000));
    return poll();
  };
  await poll();

  // 4. Get the download URL
  const result = await fetch(\`\${BASE_URL}/job/\${jobId}/result\`, {
    headers: { Authorization: \`Bearer \${API_KEY}\` },
  }).then((r) => r.json());
  console.log(result.data.download_url);
}
run();`;
}

function quickStartJava(v: Required<ExampleVars>): string {
  return `import java.net.URI;
import java.net.http.*;
import java.time.Duration;

public class DownForgeExample {
  static final String BASE_URL = "${API_BASE_URL}";
  static final String API_KEY = "${v.apiKey}";
  static final HttpClient client = HttpClient.newBuilder()
      .connectTimeout(Duration.ofSeconds(10)).build();

  public static void main(String[] args) throws Exception {
    // 1. Get available formats
    String info = post("/${v.platform}/info",
        "{\\"url\\": \\"${v.url}\\"}");
    System.out.println(info);

    // 2. Start the download
    String job = post("/${v.platform}/download",
        "{\\"url\\": \\"${v.url}\\", \\"format_id\\": \\"${v.formatId}\\"}");
    System.out.println(job);

    // 3. Poll until complete
    String status;
    do {
      Thread.sleep(2000);
      status = get("/job/${v.jobId}");
      System.out.println(status);
    } while (!status.contains("\\"status\\": \\"completed\\"")
          && !status.contains("\\"status\\": \\"failed\\""));

    // 4. Fetch the result
    System.out.println(get("/job/${v.jobId}/result"));
  }

  static String post(String path, String body) throws Exception {
    HttpRequest req = HttpRequest.newBuilder()
        .uri(URI.create(BASE_URL + path))
        .header("Authorization", "Bearer " + API_KEY)
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(body))
        .build();
    return client.send(req, HttpResponse.BodyHandlers.ofString()).body();
  }

  static String get(String path) throws Exception {
    HttpRequest req = HttpRequest.newBuilder()
        .uri(URI.create(BASE_URL + path))
        .header("Authorization", "Bearer " + API_KEY)
        .GET().build();
    return client.send(req, HttpResponse.BodyHandlers.ofString()).body();
  }
}`;
}

function quickStartGo(v: Required<ExampleVars>): string {
  return `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "time"
)

const (
    baseURL = "${API_BASE_URL}"
    apiKey  = "${v.apiKey}"
    video   = "${v.url}"
)

func main() {
    // 1. Get formats
    info := do("POST", "/${v.platform}/info",
        fmt.Sprintf(\`{"url": %q}\`, video))
    fmt.Println(info)

    // 2. Start the download
    job := do("POST", "/${v.platform}/download",
        fmt.Sprintf(\`{"url": %q, "format_id": "${v.formatId}"}\`, video))
    fmt.Println(job)

    // 3. Poll until complete
    for {
        time.Sleep(2 * time.Second)
        status := do("GET", "/job/${v.jobId}", "")
        fmt.Println(status)
        // break on completed/failed — parse status as you like
        break
    }

    // 4. Fetch the result
    fmt.Println(do("GET", "/job/${v.jobId}/result", ""))
}

func do(method, path, body string) string {
    var bodyReader io.Reader
    if body != "" {
        bodyReader = bytes.NewBufferString(body)
    }
    req, _ := http.NewRequest(method, baseURL+path, bodyReader)
    req.Header.Set("Authorization", "Bearer "+apiKey)
    if body != "" {
        req.Header.Set("Content-Type", "application/json")
    }
    resp, _ := http.DefaultClient.Do(req)
    defer resp.Body.Close()
    b, _ := io.ReadAll(resp.Body)
    return string(b)
}`;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Public snippet registry                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

export type Languages = "curl" | "python" | "node" | "javascript" | "java" | "go";

interface LanguageMeta {
  id: Languages;
  label: string;
  filename?: string;
  language: string; // badge text when no filename
}

export const LANGUAGE_META: LanguageMeta[] = [
  { id: "curl", label: "cURL", language: "bash" },
  { id: "python", label: "Python", filename: "example.py", language: "python" },
  { id: "node", label: "Node.js", filename: "example.mjs", language: "javascript" },
  { id: "javascript", label: "JavaScript", filename: "example.js", language: "javascript" },
  { id: "java", label: "Java", filename: "Example.java", language: "java" },
  { id: "go", label: "Go", filename: "main.go", language: "go" },
];

function toSnippets(map: Record<Languages, string>): Snippet[] {
  return LANGUAGE_META.map((meta) => ({
    id: meta.id,
    label: meta.label,
    filename: meta.filename,
    language: meta.language,
    code: map[meta.id],
  }));
}

/* ─── Builders used by the page / dashboard ─── */

/** Authentication-only snippets — single header example per language. */
export function buildAuthSnippets(overrides?: ExampleVars): Snippet[] {
  const v = vars(overrides);
  return toSnippets({
    curl: authCurl(v),
    python: authPython(v),
    node: authNode(v),
    javascript: authJavascript(v),
    java: authJava(v),
    go: authGo(v),
  });
}

/** End-to-end Quick Start covering info → download → poll → result. */
export function buildQuickStartSnippets(overrides?: ExampleVars): Snippet[] {
  const v = vars(overrides);
  return toSnippets({
    curl: quickStartCurl(v),
    python: quickStartPython(v),
    node: quickStartNode(v),
    javascript: quickStartJavascript(v),
    java: quickStartJava(v),
    go: quickStartGo(v),
  });
}

export type EndpointKind = "info" | "download" | "status" | "result";

/** Per-endpoint request snippets. */
export function buildEndpointSnippets(kind: EndpointKind, overrides?: ExampleVars): Snippet[] {
  const v = vars(overrides);
  switch (kind) {
    case "info":
      return toSnippets(infoSnippets(v));
    case "download":
      return toSnippets(downloadSnippets(v));
    case "status":
      return toSnippets(jobStatusSnippets(v));
    case "result":
      return toSnippets(jobResultSnippets(v));
  }
}
