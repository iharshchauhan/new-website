---
title: "Building MCP Server and Client"
date: "2026-03-02"
description: "Hands-on MCP projects covering theory, a terminal server, and a React plus Electron client stack."
coverImage: "https://www.k2view.com/hubfs/Frame%20238551.png"
category: "Proof of work"
tags: ["MCP", "AI Tools", "Developer Platform"]
---

# Building MCP Server and Client

**MCP servers** have been picking up fast lately, with more people building and expanding the ecosystem. But when it comes to MCP clients, it's still a pretty niche space. So far, only a handful of MCP clients exist. So, with this post, I just wanted to make it easier for anyone looking to get started with building MCP Client.

We will cover,

- What is MCP Client
- How to build MCP Client
- Connect MCP Client to Local, Pre-built, Remote MCP Server

But before that:
## What is MCP Client?
MCP Client is a protocol client that maintains one to one connection with MCP Server. It is basically a piece that runs inside the MCP host app, such as Claude Desktop or any custom LLM-powered tool and allows the host to access external data or remote services through connected MCP servers. Any program that speaks the Model Context Protocol language and hooks up to MCP Servers can function as an MCP Client. It's beautifully simple when you break it down

**LLM + Transport Layer + Protocol Implementation = MCP Client**

<img width="1336" height="354" alt="image" src="https://github.com/user-attachments/assets/61e7585e-5009-4c17-8afe-e37dc2014cdc" />


## Some popular MCP Clients are:

- Claude Desktop App
- Cursor
- Windsurf
- Goose
-VS Code Editor, and [there is few more.](https://modelcontextprotocol.io/clients#feature-support-matrix)

While the previous diagram covered the high-level MCP client flow, the one below takes a closer look at how the MCP client and MCP server communicate step by step during a session.

To make it even clearer, here is a breakdown of the steps involved.

1. Capture the user query
2. Establishes connections to MCP servers
3. Discovers server tools via the tools/list endpoint
4. Forwards user queries and available tools to LLM
5. Processes LLM responses to identify tool calls
6. Executes tools using the server's tools/call endpoint
7. Returns tool results to the LLM for continued conversation

<img width="1536" height="587" alt="image" src="https://github.com/user-attachments/assets/d0a9d47f-3b61-4e86-97e1-18396aa570f7" />

Now that we have a basic idea of what an MCP client is, let us build one step by step. Once we put it into practice, the concepts will make a lot more sense and feel less abstract.


