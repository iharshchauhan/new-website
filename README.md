# Personal Website


Welcome to my personal website! <br> This website was built with a lot of hard work, a dash of creativity, and of course, a healthy amount of caffeine-fueled coding sessions. 
<br>

<br>
You might be wondering, what's so special about this website?

Well, this website is not just about content. <br> It's also a showcase of my personality and interests. You'll find pages dedicated to my hobbies, my thoughts on various topics (which might change every five minutes because, you know, indecisiveness is my middle name), and even some funny anecdotes from my life. 

<br>
<br><br><br>
Cheers, <br>
Harsh

## Mobile capture to review drafts

You can trigger `.github/workflows/capture-review.yml` from your phone to create a new review markdown file in `content/writing` and open a draft PR automatically.

Supported providers:

- `provider=gemini` using `GEMINI_API_KEY`
- `provider=grok` using `GROK_API_KEY`
- `provider=groq` using `GROQ_API_KEY`
- `summary_text` to skip model API calls

The capture script loads API keys from `.env` or `.env.local`. See `.env.example` and `docs/mobile-capture-reviews.md`.
