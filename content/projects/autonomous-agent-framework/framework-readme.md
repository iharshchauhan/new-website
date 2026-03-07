---
title: "Framework Outline"
date: "2026-03-02"
description: "Complete framework documentation for the autonomous agent loop, configuration, and operations."
---
# Autonomous Agent Framework

A production-ready framework for running autonomous AI agents that process tasks from a queue. Originally built for processing issues from a personal task tracker, now extracted as a reusable pattern.

## What This Does

- **Queue-based task processing**: Agents pick tasks from a configurable queue (filesystem, database, API)
- **Research vs. Implementation classification**: Automatically determines if a task requires research (read-only) or implementation (write operations)
- **Priority-based selection**: Uses configurable priority logic to pick the highest-impact task
- **Concurrent safety**: Lock files with stale detection prevent multiple agents from running
- **Headless execution**: Runs Claude (or other LLMs) as a subprocess with full process tree management
- **Result tracking**: Updates task status, adds comments, and logs all output

## The Pattern

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AUTONOMOUS AGENT LOOP                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. Acquire Lock                                                     │
│     └─→ Check for stale locks (45min timeout)                       │
│     └─→ Write PID + timestamp to lock file                          │
│                                                                      │
│  2. Scan Task Sources                                                │
│     └─→ Query all configured sources (filesystem, API, etc.)        │
│     └─→ Filter to actionable tasks (open, labeled 'automate')       │
│                                                                      │
│  3. Classify & Prioritize                                            │
│     └─→ Research vs. Implementation detection (14 patterns)         │
│     └─→ Priority scoring (explicit priority + graph analysis)       │
│     └─→ Select highest-impact task                                  │
│                                                                      │
│  4. Execute Task                                                     │
│     └─→ Create project directory                                    │
│     └─→ Build appropriate prompt (research vs. implementation)      │
│     └─→ Spawn headless LLM subprocess                               │
│     └─→ Stream output to log file                                   │
│     └─→ Handle timeout (30min default)                              │
│                                                                      │
│  5. Process Results                                                  │
│     └─→ Update task status (completed/returned to queue)            │
│     └─→ Add execution log as comment                                │
│     └─→ Close task if successful                                    │
│                                                                      │
│  6. Release Lock                                                     │
│     └─→ Remove lock file                                            │
│     └─→ Log completion                                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Innovations

### 1. Research vs. Implementation Classification

Tasks that start with "explore", "research", "evaluate" etc. get a different prompt that explicitly forbids installations and implementations. This prevents runaway agents from installing random software during research tasks.

```javascript
const RESEARCH_PATTERNS = [
  /^explore\b/i,
  /^research\b/i,
  /^evaluate\b/i,
  /^investigate\b/i,
  /^analyze\b/i,
  /^compare\b/i,
  /^assess\b/i,
  /^review\b/i,
  /^study\b/i,
  /^understand\b/i,
  /^learn about\b/i,
  /^look into\b/i,
  /^check out\b/i,
  /\bfeasibility\b/i,
];
```

### 2. Process Tree Management

When spawning a subprocess (like `claude -p`), you need to manage the entire process tree, not just the parent process. This framework uses `spawn({detached: true})` and `process.kill(-pid)` to ensure clean termination on timeout.

```javascript
const agent = spawn('claude', ['-p', prompt], {
  detached: true,  // Create new process group
  // ...
});

// On timeout, kill entire process group
process.kill(-agent.pid, 'SIGTERM');
```

### 3. Stale Lock Detection

Lock files can become stale if a process crashes. The framework detects locks older than 45 minutes and overrides them, logging the event.

```javascript
function acquireLock() {
  if (fs.existsSync(LOCK_FILE)) {
    const lockData = JSON.parse(fs.readFileSync(LOCK_FILE));
    const lockAge = Date.now() - new Date(lockData.acquired).getTime();

    if (lockAge < 45 * 60 * 1000) {
      // Lock is fresh, another agent is running
      return false;
    }
    // Stale lock, safe to override
    log('Stale lock detected, overriding');
  }
  // Acquire lock
  fs.writeFileSync(LOCK_FILE, JSON.stringify({
    pid: process.pid,
    acquired: new Date().toISOString()
  }));
  return true;
}
```

## Installation

```bash
npm install autonomous-agent
```

Or clone this repo and use directly.

## Quick Start

```javascript
import { AutonomousAgent } from 'autonomous-agent';

const agent = new AutonomousAgent({
  // Task sources to scan
  sources: [
    { type: 'filesystem', path: '~/.tasks/', filter: { label: 'automate' } },
  ],

  // Output directories
  projectsDir: '~/projects/',
  logsDir: '~/logs/',

  // LLM configuration
  llm: {
    command: 'claude',
    args: ['-p', '{{prompt}}', '--dangerously-skip-permissions'],
    timeout: 30 * 60 * 1000,  // 30 minutes
  },

  // Lock configuration
  lockFile: '~/.agent.lock',
  staleLockAge: 45 * 60 * 1000,  // 45 minutes
});

// Run once
await agent.runOnce();

// Or run as daemon (for launchd/cron)
await agent.runDaemon({ interval: 30 * 60 * 1000 });
```

## Configuration Options

### Sources

The agent can pull tasks from multiple sources:

```javascript
sources: [
  // Filesystem (JSON files)
  {
    type: 'filesystem',
    path: '~/.tasks/',
    filter: { label: 'automate', status: 'open' },
  },

  // HTTP API
  {
    type: 'api',
    url: 'https://api.example.com/tasks',
    headers: { Authorization: 'Bearer {{API_TOKEN}}' },
    filter: { label: 'automate' },
  },

  // Custom source
  {
    type: 'custom',
    fetch: async () => {
      // Return array of tasks
      return [{ id: '1', title: 'Task', description: '...' }];
    },
  },
]
```

### Priority Selection

Configure how tasks are prioritized:

```javascript
priority: {
  // Explicit priority field (P0 > P1 > P2 > etc.)
  field: 'priority',
  default: 2,

  // Custom scoring function
  scorer: (task) => {
    let score = 0;
    if (task.labels.includes('urgent')) score += 10;
    if (task.dependents.length > 2) score += 5;
    return score;
  },
}
```

### LLM Configuration

Configure the LLM subprocess:

```javascript
llm: {
  // Command and arguments
  command: 'claude',
  args: ['-p', '{{prompt}}'],

  // Environment variables
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  },

  // Timeout
  timeout: 30 * 60 * 1000,

  // Custom prompt builders
  prompts: {
    research: (task) => `Research task: ${task.title}\n...`,
    implementation: (task) => `Implement: ${task.title}\n...`,
  },
}
```

## Running as a Daemon

### macOS (launchd)

Create `~/Library/LaunchAgents/com.autonomous-agent.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.autonomous-agent</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/path/to/agent.js</string>
    </array>
    <key>StartInterval</key>
    <integer>1800</integer>
    <key>TimeoutSeconds</key>
    <integer>2700</integer>
    <key>StandardOutPath</key>
    <string>/tmp/autonomous-agent.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/autonomous-agent.log</string>
</dict>
</plist>
```

Load with: `launchctl load ~/Library/LaunchAgents/com.autonomous-agent.plist`

### Linux (systemd)

Create `/etc/systemd/user/autonomous-agent.timer`:

```ini
[Unit]
Description=Autonomous Agent Timer

[Timer]
OnBootSec=5min
OnUnitActiveSec=30min

[Install]
WantedBy=timers.target
```

### Kubernetes (CronJob)

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: autonomous-agent
spec:
  schedule: "*/30 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: agent
            image: your-image
            command: ["node", "/app/agent.js"]
          restartPolicy: OnFailure
```

## Monitoring

### CLI Status

```bash
autonomous-agent --status
# Shows: pending tasks, current lock status, recent runs
```

### Log Files

All executions are logged to the configured logs directory:

```
~/logs/
├── agent-2024-01-28.log          # Daily agent log
├── claude-task-name-1706...log   # Individual execution logs
```

### Metrics (Prometheus)

The agent exposes metrics for monitoring:

```javascript
const agent = new AutonomousAgent({
  // ...
  metrics: {
    enabled: true,
    port: 9090,
  },
});
```

Available metrics:
- `autonomous_agent_tasks_processed_total`
- `autonomous_agent_task_duration_seconds`
- `autonomous_agent_task_success_total`
- `autonomous_agent_lock_wait_seconds`

## Best Practices

### 1. Use Research Mode for Discovery

Don't let the agent install software or make changes during research tasks. The research/implementation classification prevents runaway installations.

### 2. Set Appropriate Timeouts

The default 30-minute timeout is reasonable for most tasks. Increase for complex implementations, decrease for quick tasks.

### 3. Review Output Before Production

Run in a sandbox or review mode before giving the agent production access. Use `--dry-run` to see what would happen without executing.

### 4. Implement Notification

Send notifications on completion so you can review results:

```javascript
const agent = new AutonomousAgent({
  // ...
  onComplete: async (task, result) => {
    await sendSlackNotification(`Task ${task.title} completed: ${result.status}`);
  },
});
```

### 5. Version Control Output

Have the agent commit its work to git so you can review and revert if needed.

## The Origin Story

This framework was extracted from a personal automation system I built to process ideas and side projects. The original system (called "bd-automate") would:

1. Scan my personal issue tracker for tasks labeled "automate"
2. Pick the highest priority task using graph analysis
3. Run headless Claude to implement or research it
4. Update the issue with results and close it

After running this for six months and processing 50+ tasks autonomously, I extracted the patterns into this reusable framework.

The key insight: **autonomous agents need structure**. The research/implementation distinction, process management, and lock file handling aren't optional—they're what makes the difference between a useful tool and a runaway process.

## Case Study

**"How I Built an AI Agent That Ships Code While I Sleep"**

See `docs/case-study.md` for a detailed writeup of the original system, including:
- 6 months of usage data
- Types of tasks that work well (and don't work well) for autonomous processing
- Lessons learned about prompt design for autonomous agents
- Integration patterns with existing workflows

## Contributing

Contributions welcome. Please open an issue first to discuss proposed changes.

## License

MIT

