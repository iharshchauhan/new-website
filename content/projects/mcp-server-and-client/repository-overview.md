---
title: "Repository Overview"
date: "2026-03-02"
description: "Top-level guide and learning path for building MCP servers and clients."
---
# 🤖 Building MCP Servers and Clients — by Harsh Chauhan

> A hands-on collection of MCP (Model Context Protocol) servers built from scratch — designed for AI Product Management students and developers who want to give Claude real-world superpowers.

---

## 🧠 What is MCP?

**Model Context Protocol (MCP)** is an open standard that lets you connect AI models like Claude to external tools, data sources, and services.

Think of it like this:

```text
Claude (Brain) + MCP Server (Hands) = Claude that can actually DO things
```

Instead of Claude just *talking* about running a command, creating a file, or fetching data — with an MCP server, it can actually **do it**.

---

## 📂 Repository Structure

```text
Building_MCP_Server/
│
├── README.md                          ← You are here
│
├── Theory of MCP/                     ← Start here! Understand MCP first
│   ├── README.md                      ← Folder overview
│   └── MCP_Comprehensive_Summary.md   ← Full theory document
│
├── First MCP Terminal Server/         ← Project 1: Build your first server
│   ├── README.md                      ← Full step-by-step guide
│   └── main.py                        ← Server code
│
└── MCP Client (React & Electron)/     ← Project 2: Build a web & desktop client
    └── README.md                      ← Client overview
```

---

## 🗂️ Contents

| # | Folder | What's Inside | Type |
| :--- | :--- | :--- | :--- |
| 1 | [Theory of MCP](./Theory%20of%20MCP/) | Comprehensive theory: what MCP is, why it exists, how it works | 📖 Reading |
| 2 | [First MCP Terminal Server](./First%20MCP%20Terminal%20Server/) | Build a server that lets Claude run real terminal commands | 🛠️ Project |
| 3 | [MCP Client (React & Electron)](./MCP%20Client%20(React%20&%20Electron)/) | A modern web and desktop interface for interacting with any MCP server | 🛠️ Project |
| 4 | More coming soon... | — | 🔜 |

---

## 🚀 Recommended Learning Path

If you're new to MCP, follow this order:

1. **Start with theory** → Read [`Theory of MCP/`](./Theory%20of%20MCP/) to understand the *why* and *what* behind MCP
2. **Build your first server** → Follow [`First MCP Terminal Server/`](./First%20MCP%20Terminal%20Server/) to get hands-on

---

## 🛠️ Common Requirements

Before diving into any project, make sure you have:

- [Claude Desktop](https://claude.ai/download) installed
- [Python 3.10+](https://python.org) installed
- [VS Code](https://code.visualstudio.com) (recommended editor)
- `uv` package manager (instructions in each project)

---

## 👨‍🏫 About This Repository

This repository is built as part of an **AI Product Management course** by [Harsh Chauhan](https://github.com/harshchauhan). Each resource is designed to be beginner-friendly with:

- Plain English explanations
- Mac & Windows commands
- Mermaid diagrams for visual learners
- Common error fixes

---

*⭐ Star this repo if you find it helpful!*

