---
title: "Recipe Rescuer - A Vibe-Coded AI Cooking Assistant"
date: "2026-01-14"
description: "Behind the scenes of a lightweight AI cooking assistant: prompt design, test cases, and product lessons."
order: 1
---
# Recipe Rescuer - A Vibe-Coded AI Cooking Assistant

Over the past year I have spent a lot of time thinking about how product managers can move from understanding AI systems conceptually to actually building small applications with them.

The fastest way to understand modern AI systems is not through documentation or tutorials. It is through building.

Recipe Rescuer started as a small experiment in what many people now call "vibe coding". Instead of designing a complex architecture upfront, I focused on quickly building a working AI product using modern tools and iterating based on real behavior.

The goal was simple.

Take the ingredients a person already has in their kitchen and generate a realistic recipe that fits dietary preferences, available tools, and time constraints.

The interesting part was not the recipe generation itself. The real learning came from designing prompts, shaping model behavior, testing edge cases, and understanding how product constraints influence AI output.

## Product idea

Most cooking assistants assume that users will search for recipes and then buy ingredients.

In reality, many home cooks face the opposite problem. They open the refrigerator, see a random combination of ingredients, and try to figure out what meal they can make quickly.

Recipe Rescuer flips the traditional recipe search model.

Instead of searching for recipes, the user simply describes what they already have available.

The system then generates a single realistic recipe that fits those constraints.

From a product perspective the core user input is intentionally simple.

| Input                | Example                              |
| -------------------- | ------------------------------------ |
| Ingredients          | eggs, spinach, onion, tomato, cheese |
| Diet preference      | vegetarian or vegan                  |
| Maximum cooking time | 20 minutes                           |
| Available tools      | stovetop, oven, microwave            |

The system processes this information and returns a structured recipe that can be rendered directly in the user interface.

## Why I built it

I approached this project primarily as a product learning exercise.

Many discussions around AI product development remain abstract. Teams talk about prompt engineering, guardrails, and evaluation frameworks, but the real challenges only become clear when a working system is built.

Recipe Rescuer became a small sandbox for exploring several important product questions.

How do system prompts influence model behavior?

How should user inputs be structured before being sent to a model?

What types of constraints can be enforced through prompts and which ones require application logic?

How should test cases be designed to reveal model failures?

Answering these questions required building a real product rather than analyzing theory.

## Application architecture

The architecture for the first version of Recipe Rescuer was intentionally lightweight. The goal was to minimize infrastructure complexity so I could focus on model behavior and product design.

```
User Interface
      |
      v
Frontend Form
      |
      v
Supabase Edge Function
      |
      v
LLM Inference (Gemini)
      |
      v
Structured Recipe Response
      |
      v
Recipe Card UI
```

The frontend collects user inputs and sends them to a serverless function. That function constructs a structured prompt and sends it to a large language model through an API. The model generates a recipe which is returned to the frontend and rendered in a simple recipe card interface.

The architecture deliberately avoids unnecessary complexity. There is no database, retrieval system, or agent orchestration. The system relies primarily on prompt design and input structuring.

## Technology stack

The first version of the system was built with a minimal modern stack focused on rapid iteration rather than infrastructure complexity.

| Layer          | Technology                                                  |
| -------------- | ----------------------------------------------------------- |
| Frontend       | Gemini AI Studio                                            |
| Backend        | Supabase Edge Functions                                     |
| Hosting        | Vercel                                                      |
| Model          | Google Gemini 3                                             |
| Fallback model | Groq-hosted LLM (fallback when Gemini is overloaded); Llama |
| API gateway    | V0 by Vercel                                                |

I deployed the application on Vercel because it provides a fast path from prototype to production with very little operational overhead. For a small AI product like this, the ability to push updates quickly and test prompt changes in a live environment is more valuable than building a complex infrastructure setup early on.

For model experimentation I used Gemini through Gemini AI Studio. This environment made it easy to test prompts, compare outputs, and refine system instructions before integrating them into the backend function. In practice this became an important part of the development workflow. Instead of modifying prompts blindly inside the application code, I could iterate in the AI Studio interface and only update the production prompt once the behavior looked stable.

During testing I also added a fallback model through Groq. If Gemini becomes temporarily unavailable or overloaded, the backend can route the request to the Groq inference endpoint. This improves reliability for a small consumer facing application where users expect an immediate response. The model output format remains the same so the frontend does not need to know which provider generated the recipe.

## Context engineering

One of the most important design decisions involved how the user inputs were translated into a prompt.

Sending raw user text directly to the model produced inconsistent results. Sometimes the model ignored constraints or misunderstood the user request.

Instead I structured the inputs into a consistent message format before sending them to the model.

A typical request looked like this.

```
Ingredients: eggs, spinach, onion, tomato, cheese, bread
Diet: Vegetarian
Max time: 20 minutes
Tools: Stovetop, Oven

Task:
Propose exactly 1 recipe that fits these constraints.
```

This approach creates a predictable prompt structure that helps the model understand the request more clearly.

I often describe this step as **context engineering** rather than prompt engineering because the main goal is to organize information in a way that models can interpret reliably.

## System prompt design

The system prompt defined the behavioral rules for the model.

The prompt described the model's role as a home cooking assistant and established several constraints.

The recipe must rely primarily on ingredients provided by the user. Only a small set of pantry staples such as salt, pepper, oil, and milk could be added. The output format needed to follow a strict structure so the frontend could render it consistently.

This structured format included the recipe name, estimated cooking time, ingredient list, preparation steps, and short notes.

By explicitly defining the output layout, the application could display the result without complicated parsing logic.

## Designing test cases

Building AI systems requires testing behavior across many scenarios.



Some test cases simulate kitchens with plenty of ingredients while others intentionally stress the system with minimal inputs.

Examples include situations where the user only has two ingredients, dietary restrictions that remove key ingredients, unrealistic cooking time constraints, and ambiguous inputs that require clarification.

Testing these scenarios helped reveal how the model behaved when constraints conflicted with reality.

## Early model behavior

The first prompt versions produced several problems.

The model frequently introduced new ingredients that were not present in the user's list. It sometimes ignored time constraints and suggested recipes that required forty minutes or longer. In other cases the formatting rules were ignored and the output contained markdown or additional sections.

These issues made the responses harder to trust and difficult to render in the user interface.

Solving these problems required several rounds of prompt iteration.

## Prompt iteration process

The iteration process followed a simple loop.

I defined a test case, executed the prompt, observed the output, and adjusted the prompt design.

Early versions of the prompt included long instructions and strict prohibitions such as "never add ingredients". Surprisingly these longer prompts did not produce better results.



This combination dramatically improved consistency.

The model began producing realistic recipes that respected ingredient constraints, followed the expected format, and stayed within the requested cooking time.

## Example output

A typical successful output looked like this.

```
Recipe: Cheesy Tomato and Spinach Egg Skillet
Estimated time: 20 minutes
Ingredients:
- eggs
- spinach
- onion
- tomato
- cheese
- bread
- salt
- black pepper
Steps:
1. Dice the onion and tomato.
2. Cook onion and tomato in a pan until soft.
3. Add spinach and cook until wilted.
4. Crack eggs into the pan and season.
5. Cover and cook until eggs set.
6. Sprinkle cheese and serve with toasted bread.
Notes:
- Use tomato juices to prevent sticking.
- Add a splash of water if the pan becomes dry.
```

The result satisfies the product goals. The recipe uses available ingredients, respects time constraints, and follows the exact structure required by the user interface.

## Product lessons

From a product management perspective this small project reinforced several important lessons.

First, prompts should be treated as specifications rather than magic instructions. A well designed prompt clearly describes the role of the model, the constraints it must follow, and the format of its output.

Second, prompt engineering is rarely a one step process. Reliable behavior emerges through iteration and testing.

Third, shorter prompts with concrete examples often outperform long instructions filled with abstract language.

Finally, some constraints should be enforced by the product itself rather than relying entirely on prompts. Input validation, guardrails, and post processing logic remain important parts of production AI systems.

## Why small projects like this matter

Recipe Rescuer is intentionally simple. It does not use complex architectures such as retrieval pipelines or agent systems.

However, the project highlights something important about modern AI development.

Building even a small AI application quickly exposes the real challenges of working with large language models. Prompt design, evaluation, product constraints, and user experience all interact in subtle ways.

For product managers, building projects like this provides a deeper understanding of how AI systems behave in practice.

That understanding is far more valuable than reading about AI systems in isolation.

It comes from building, observing, and iterating on real products.

