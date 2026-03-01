---
title: "Source Walkthrough: autonomous-agent.js"
date: "2026-03-02"
description: "Annotated source snapshot of the main runtime and package metadata."
---

# Source Walkthrough: autonomous-agent.js

## package.json

```json{
  "name": "autonomous-agent",
  "version": "1.0.0",
  "description": "A framework for running autonomous AI agents that process tasks from a queue",
  "main": "src/autonomous-agent.js",
  "type": "module",
  "exports": {
    ".": "./src/autonomous-agent.js"
  },
  "files": [
    "src",
    "docs",
    "README.md"
  ],
  "scripts": {
    "test": "node --test test/*.test.js",
    "example": "node examples/basic-usage.js"
  },
  "bin": {
    "autonomous-agent": "./bin/cli.js"
  },
  "keywords": [
    "autonomous",
    "agent",
    "ai",
    "llm",
    "claude",
    "automation",
    "task-processing",
    "queue"
  ],
  "author": "Sam Zoloth",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/szoloth/autonomous-agent"
  },
  "bugs": {
    "url": "https://github.com/szoloth/autonomous-agent/issues"
  },
  "homepage": "https://github.com/szoloth/autonomous-agent#readme",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## src/autonomous-agent.js

```js/**
 * autonomous-agent.js
 *
 * A framework for running autonomous AI agents that process tasks from a queue.
 * Handles research vs. implementation classification, process management,
 * lock files, and result tracking.
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { EventEmitter } from 'events';

// Research patterns - tasks matching these are run in research mode (read-only)
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
  /\bpros and cons\b/i,
  /\bshould (we|i) use\b/i,
];

/**
 * Expand ~ to home directory
 */
function expandPath(p) {
  if (p.startsWith('~')) {
    return path.join(process.env.HOME, p.slice(1));
  }
  return p;
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  const expanded = expandPath(dir);
  if (!fs.existsSync(expanded)) {
    fs.mkdirSync(expanded, { recursive: true });
  }
  return expanded;
}

/**
 * Check if a task is research-only based on title and description
 */
function isResearchTask(title, description = '') {
  const text = `${title} ${description}`;
  return RESEARCH_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Generate a safe project name from task title
 */
function generateProjectName(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 40);
}

/**
 * Main AutonomousAgent class
 */
export class AutonomousAgent extends EventEmitter {
  /**
   * Create a new autonomous agent
   * @param {Object} config - Agent configuration
   */
  constructor(config) {
    super();

    this.config = {
      // Task sources
      sources: config.sources || [],

      // Output directories
      projectsDir: ensureDir(config.projectsDir || '~/autonomous-projects'),
      logsDir: ensureDir(config.logsDir || '~/autonomous-logs'),

      // Lock configuration
      lockFile: expandPath(config.lockFile || '~/.autonomous-agent.lock'),
      staleLockAge: config.staleLockAge || 45 * 60 * 1000, // 45 minutes

      // LLM configuration
      llm: {
        command: config.llm?.command || 'claude',
        args: config.llm?.args || ['-p', '{{prompt}}'],
        env: config.llm?.env || {},
        timeout: config.llm?.timeout || 30 * 60 * 1000, // 30 minutes
        prompts: config.llm?.prompts || {},
      },

      // Priority configuration
      priority: {
        field: config.priority?.field || 'priority',
        default: config.priority?.default || 2,
        scorer: config.priority?.scorer || null,
      },

      // Callbacks
      onStart: config.onStart || null,
      onComplete: config.onComplete || null,
      onError: config.onError || null,
    };

    this._logFile = null;
  }

  /**
   * Log a message to console and log file
   */
  log(message) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${message}`;
    console.log(line);

    if (this._logFile) {
      fs.appendFileSync(this._logFile, line + '\n');
    }

    this.emit('log', { timestamp, message });
  }

  /**
   * Try to acquire the lock
   * @returns {boolean} True if lock acquired
   */
  acquireLock() {
    const { lockFile, staleLockAge } = this.config;

    if (fs.existsSync(lockFile)) {
      try {
        const lockData = JSON.parse(fs.readFileSync(lockFile, 'utf-8'));
        const lockAge = Date.now() - new Date(lockData.acquired).getTime();

        if (lockAge < staleLockAge) {
          this.log(`Lock held by PID ${lockData.pid} since ${lockData.acquired}`);
          return false;
        }

        this.log('Stale lock detected, overriding');
      } catch (err) {
        this.log(`Invalid lock file, overriding: ${err.message}`);
      }
    }

    fs.writeFileSync(lockFile, JSON.stringify({
      pid: process.pid,
      acquired: new Date().toISOString(),
    }));

    return true;
  }

  /**
   * Release the lock
   */
  releaseLock() {
    const { lockFile } = this.config;
    if (fs.existsSync(lockFile)) {
      fs.unlinkSync(lockFile);
    }
  }

  /**
   * Fetch tasks from all configured sources
   * @returns {Promise<Array>} Array of tasks
   */
  async fetchTasks() {
    const allTasks = [];

    for (const source of this.config.sources) {
      try {
        let tasks = [];

        switch (source.type) {
          case 'filesystem':
            tasks = this._fetchFilesystemTasks(source);
            break;
          case 'api':
            tasks = await this._fetchApiTasks(source);
            break;
          case 'custom':
            tasks = await source.fetch();
            break;
          default:
            this.log(`Unknown source type: ${source.type}`);
        }

        // Apply filter if specified
        if (source.filter) {
          tasks = tasks.filter(task => {
            for (const [key, value] of Object.entries(source.filter)) {
              if (task[key] !== value && !task.labels?.includes(value)) {
                return false;
              }
            }
            return true;
          });
        }

        // Tag with source
        tasks = tasks.map(task => ({ ...task, _source: source }));

        allTasks.push(...tasks);
      } catch (err) {
        this.log(`Error fetching from source: ${err.message}`);
      }
    }

    return allTasks;
  }

  /**
   * Fetch tasks from filesystem
   */
  _fetchFilesystemTasks(source) {
    const dir = expandPath(source.path);
    if (!fs.existsSync(dir)) return [];

    const tasks = [];
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        const task = JSON.parse(content);
        task._file = path.join(dir, file);
        tasks.push(task);
      } catch (err) {
        // Skip invalid files
      }
    }

    return tasks;
  }

  /**
   * Fetch tasks from API
   */
  async _fetchApiTasks(source) {
    const response = await fetch(source.url, {
      headers: source.headers || {},
    });
    return response.json();
  }

  /**
   * Select the highest priority task
   * @param {Array} tasks - Array of tasks
   * @returns {Object|null} Selected task or null
   */
  selectTask(tasks) {
    if (tasks.length === 0) return null;
    if (tasks.length === 1) return tasks[0];

    const { priority } = this.config;

    // Sort by custom scorer if provided
    if (priority.scorer) {
      tasks.sort((a, b) => priority.scorer(b) - priority.scorer(a));
      return tasks[0];
    }

    // Sort by priority field
    tasks.sort((a, b) => {
      const aPriority = a[priority.field] ?? priority.default;
      const bPriority = b[priority.field] ?? priority.default;
      return aPriority - bPriority;
    });

    return tasks[0];
  }

  /**
   * Build the prompt for a task
   * @param {Object} task - The task to build prompt for
   * @returns {Object} { prompt, isResearch }
   */
  buildPrompt(task) {
    const isResearch = isResearchTask(task.title, task.description);
    const { prompts } = this.config.llm;

    let prompt;

    if (isResearch && prompts.research) {
      prompt = typeof prompts.research === 'function'
        ? prompts.research(task)
        : prompts.research;
    } else if (!isResearch && prompts.implementation) {
      prompt = typeof prompts.implementation === 'function'
        ? prompts.implementation(task)
        : prompts.implementation;
    } else {
      // Default prompts
      prompt = isResearch
        ? this._defaultResearchPrompt(task)
        : this._defaultImplementationPrompt(task);
    }

    return { prompt, isResearch };
  }

  _defaultResearchPrompt(task) {
    const projectDir = path.join(this.config.projectsDir, generateProjectName(task.title));

    return `You are researching a topic. Your job is to gather information and provide a recommendation - NOT to implement or install anything.

## Task: ${task.id || 'N/A'}
${task.title}

## Description
${task.description || 'Research the topic based on the title.'}

## CRITICAL INSTRUCTIONS
1. DO NOT install any software, packages, or dependencies
2. DO NOT launch any servers or applications
3. DO NOT create working implementations
4. DO NOT run any code that modifies the system

## What You Should Do
1. Use web search to research the topic thoroughly
2. Read documentation, reviews, and comparisons online
3. Analyze pros/cons, tradeoffs, and use cases
4. Create a RECOMMENDATION.md in ${projectDir} with:
   - Summary of what the tool/approach is
   - Key features and capabilities
   - Pros and cons
   - Comparison to alternatives (if relevant)
   - Your recommendation: should the user adopt this? Why or why not?
   - Next steps if they decide to proceed

Focus on gathering actionable insights. DO NOT implement anything.`;
  }

  _defaultImplementationPrompt(task) {
    const projectDir = path.join(this.config.projectsDir, generateProjectName(task.title));

    return `You are implementing a task. Work autonomously to create a working implementation.

## Task: ${task.id || 'N/A'}
${task.title}

## Description
${task.description || 'Interpret the title and build something useful.'}

## Acceptance Criteria
${task.acceptance || 'Create a working implementation that satisfies the title.'}

## Instructions
1. Create a complete, working implementation in ${projectDir}
2. Keep it simple and functional - this is a prototype/experiment
3. Include a README.md explaining what was built and how to use it
4. If it's a web app, make it self-contained
5. If it's a CLI tool, make it executable with clear usage instructions
6. Test that it works before finishing

Focus on getting something working quickly. Start implementing now.`;
  }

  /**
   * Execute a task using the LLM
   * @param {Object} task - The task to execute
   * @returns {Promise<Object>} Execution result
   */
  async executeTask(task) {
    const { llm, projectsDir, logsDir } = this.config;
    const projectName = generateProjectName(task.title);
    const projectDir = path.join(projectsDir, projectName);
    const logFile = path.join(logsDir, `${projectName}-${Date.now()}.log`);

    // Create project directory
    ensureDir(projectDir);

    // Build prompt
    const { prompt, isResearch } = this.buildPrompt(task);

    this.log(`Executing task: ${task.title}`);
    this.log(`Type: ${isResearch ? 'RESEARCH' : 'IMPLEMENTATION'}`);
    this.log(`Project dir: ${projectDir}`);

    // Save task info
    fs.writeFileSync(path.join(projectDir, 'TASK.md'), `# ${task.title}

## Task ID
${task.id || 'N/A'}

## Description
${task.description || '(none)'}

## Type
${isResearch ? 'Research' : 'Implementation'}

## Started
${new Date().toISOString()}
`);

    // Build command arguments
    const args = llm.args.map(arg =>
      arg.replace('{{prompt}}', prompt)
    );

    return new Promise((resolve) => {
      const startTime = Date.now();

      const proc = spawn(llm.command, args, {
        cwd: projectDir,
        env: { ...process.env, ...llm.env },
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: true,
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Timeout handler
      const timeout = setTimeout(() => {
        this.log(`Timeout reached, killing process group`);
        try {
          process.kill(-proc.pid, 'SIGTERM');
        } catch (e) {
          proc.kill('SIGTERM');
        }
      }, llm.timeout);

      proc.on('close', (code) => {
        clearTimeout(timeout);
        const duration = Math.round((Date.now() - startTime) / 1000);

        // Save log
        fs.writeFileSync(logFile, `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`);

        const result = {
          success: code === 0,
          code,
          duration,
          projectDir,
          logFile,
          stdout: stdout.substring(0, 2000),
          stderr: stderr.substring(0, 1000),
          isResearch,
        };

        this.log(`Completed with code ${code} in ${duration}s`);
        resolve(result);
      });

      proc.on('error', (err) => {
        clearTimeout(timeout);
        const duration = Math.round((Date.now() - startTime) / 1000);

        this.log(`Process error: ${err.message}`);

        resolve({
          success: false,
          error: err.message,
          duration,
          projectDir,
          logFile,
          isResearch,
        });
      });
    });
  }

  /**
   * Update task status after execution
   * @param {Object} task - The task
   * @param {Object} result - Execution result
   */
  async updateTask(task, result) {
    // If task came from filesystem, update the file
    if (task._file && fs.existsSync(task._file)) {
      try {
        const data = JSON.parse(fs.readFileSync(task._file, 'utf-8'));

        data.status = result.success ? 'completed' : 'open';
        data.lastProcessed = new Date().toISOString();
        data.processingResult = {
          success: result.success,
          duration: result.duration,
          projectDir: result.projectDir,
          logFile: result.logFile,
        };

        fs.writeFileSync(task._file, JSON.stringify(data, null, 2));
      } catch (err) {
        this.log(`Failed to update task file: ${err.message}`);
      }
    }

    // Emit event for custom handling
    this.emit('taskCompleted', { task, result });

    // Call callback if provided
    if (this.config.onComplete) {
      await this.config.onComplete(task, result);
    }
  }

  /**
   * Run the agent once
   * @returns {Promise<Object>} Run result
   */
  async runOnce() {
    const date = new Date().toISOString().split('T')[0];
    this._logFile = path.join(this.config.logsDir, `agent-${date}.log`);

    this.log('=== Autonomous Agent Starting ===');

    if (!this.acquireLock()) {
      this.log('Could not acquire lock, exiting');
      return { status: 'locked' };
    }

    try {
      // Fetch tasks
      const tasks = await this.fetchTasks();
      this.log(`Found ${tasks.length} task(s)`);

      if (tasks.length === 0) {
        this.log('No tasks to process');
        return { status: 'no_tasks' };
      }

      // Select task
      const task = this.selectTask(tasks);
      if (!task) {
        this.log('No suitable task selected');
        return { status: 'no_selection' };
      }

      this.log(`Selected: ${task.id || 'N/A'} - ${task.title}`);

      // Callback
      if (this.config.onStart) {
        await this.config.onStart(task);
      }

      // Execute
      const result = await this.executeTask(task);

      // Update task
      await this.updateTask(task, result);

      return {
        status: result.success ? 'success' : 'failed',
        task,
        result,
      };

    } catch (err) {
      this.log(`Fatal error: ${err.message}`);

      if (this.config.onError) {
        await this.config.onError(err);
      }

      return { status: 'error', error: err.message };

    } finally {
      this.releaseLock();
      this.log('=== Autonomous Agent Complete ===');
    }
  }

  /**
   * Run as daemon with interval
   * @param {Object} options - Daemon options
   */
  async runDaemon(options = {}) {
    const interval = options.interval || 30 * 60 * 1000;

    this.log(`Starting daemon mode (interval: ${interval / 1000}s)`);

    const run = async () => {
      await this.runOnce();
    };

    // Initial run
    await run();

    // Schedule subsequent runs
    setInterval(run, interval);
  }

  /**
   * Get current status
   */
  async getStatus() {
    const { lockFile, projectsDir, logsDir } = this.config;

    const status = {
      locked: fs.existsSync(lockFile),
      lockInfo: null,
      pendingTasks: 0,
      recentRuns: [],
    };

    // Lock info
    if (status.locked) {
      try {
        status.lockInfo = JSON.parse(fs.readFileSync(lockFile, 'utf-8'));
      } catch (err) {
        // Invalid lock file
      }
    }

    // Pending tasks
    const tasks = await this.fetchTasks();
    status.pendingTasks = tasks.length;

    // Recent runs (from log files)
    if (fs.existsSync(logsDir)) {
      const logs = fs.readdirSync(logsDir)
        .filter(f => f.startsWith('agent-'))
        .sort()
        .reverse()
        .slice(0, 5);

      status.recentRuns = logs.map(f => ({
        date: f.replace('agent-', '').replace('.log', ''),
        file: path.join(logsDir, f),
      }));
    }

    return status;
  }
}

// Export helpers
export { isResearchTask, generateProjectName, RESEARCH_PATTERNS };
```
