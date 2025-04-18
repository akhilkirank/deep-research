<div align="center">
<h1>Deep Research</h1>

![GitHub deployments](https://img.shields.io/github/deployments/u14app/gemini-next-chat/Production)
![GitHub Release](https://img.shields.io/github/v/release/u14app/deep-research)
![Docker Image Size](https://img.shields.io/docker/image-size/xiangfa/deep-research/latest)
![Docker Pulls](https://img.shields.io/docker/pulls/xiangfa/deep-research)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Gemini](https://img.shields.io/badge/Gemini-8E75B2?style=flat&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Next](https://img.shields.io/badge/Next.js-111111?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-111111?style=flat&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

</div>

**Lightning-Fast Deep Research Report**

Deep Research is a cutting-edge project built with Next.js 15, leveraging the power of AI models to generate in-depth research reports in approximately 2 minutes. Utilizing advanced "Thinking" and "Flash" models with internet access, Deep Research provides rapid and insightful analysis on a wide range of topics. Your privacy is paramount – all data can be processed and stored locally.

### Quick Start - API

Get a complete research report with a single API call:

```bash
# Replace with your actual deployment URL and access password
curl -X POST https://your-deployment-url.com/api/research/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-access-password" \
  -d '{"query":"History of cars"}'
```

See the [API Documentation](#-api-documentation) section for more details.

## ✨ Features

- **Rapid Deep Research:** Generates comprehensive research reports in about 2 minutes, significantly accelerating your research process.
- **Multi-platform Support:** Supports rapid deployment to Vercel, Cloudflare and other platforms.
- **Powered by AI:** Utilizes the advanced AI models for accurate and insightful analysis.
- **Support for Multi-LLM:** Supports a variety of mainstream large language models, including Gemini, OpenAI, Anthropic, Deepseek, Grok, OpenAI Compatible, OpenRouter, Ollama, etc.
- **Support Web Search:** Supports search engines such as Searxng, Tavily, Firecrawl, Exa, Bocha, etc., allowing LLMs that do not support search to use the web search function more conveniently.
- **Thinking & Networking Models:** Employs sophisticated "Thinking" and "Networking" models to balance depth and speed, ensuring high-quality results quickly. Support switching research models.
- **Artifact** Supports editing of research content, with two editing modes: WYSIWYM and Markdown. It is possible to adjust the reading level, article length and full text translation.
- **Research History:** Support preservation of research history, you can review previous research results at any time and conduct in-depth research again.
- **Local & Server API Support:** Offers flexibility with both local and server-side API calling options to suit your needs.
- **RESTful API:** Provides a comprehensive API for programmatic access to all research functionality.
- **Highly Customizable:** Extensive settings system allows customization of search behavior, LLM parameters, and prompt templates.
- **Privacy-Focused:** Your data remains private and secure, as all data is stored locally on your browser.
- **Support Multi-Key payload:** Support Multi-Key payload to improve API response efficiency.
- **Multi-language Support**: English、简体中文.
- **Built with Modern Technologies:** Developed using Next.js 15 and Shadcn UI, ensuring a modern, performant, and visually appealing user experience.
- **MIT Licensed:** Open-source and freely available for personal and commercial use under the MIT License.

## 🎯 Roadmap

- [x] Support preservation of research history
- [x] Support editing final report and search results
- [x] Support for other LLM models
- [x] RESTful API for programmatic access
- [ ] Support file upload and local knowledge base

## 🚀 Getting Started

### Use Gemini

1. Get [Gemini API Key](https://aistudio.google.com/app/apikey)
2. One-click deployment of the project, you can choose to deploy to Vercel or Cloudflare

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fu14app%2Fdeep-research&project-name=deep-research&repository-name=deep-research)

   Currently the project supports deployment to Cloudflare, but you need to follow [How to deploy to Cloudflare Pages](./docs/How-to-deploy-to-Cloudflare-Pages.md) to do it.

3. Start using

### Use Other LLM

1. Deploy the project to Vercel or Cloudflare
2. Set the LLM API key
3. Set the LLM API base URL (optional)
4. Start using

## ⌨️ Development

Follow these steps to get Deep Research up and running on your local browser.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.18.0 or later recommended)
- [pnpm](https://pnpm.io/) or [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/u14app/deep-research.git
   cd deep-research
   ```

2. **Install dependencies:**

   ```bash
   pnpm install  # or npm install or yarn install
   ```

3. **Set up Environment Variables:**

   You need to modify the file `env.tpl` to `.env`, or create a `.env` file and write the variables to this file.

4. **Run the development server:**

   ```bash
   pnpm dev  # or npm run dev or yarn dev
   ```

   Open your browser and visit [http://localhost:3000](http://localhost:3000) to access Deep Research.

### Custom Model List

The project allow custom model list, but **only works in proxy mode**. Please add an environment variable named `NEXT_PUBLIC_MODEL_LIST` in the `.env` file or environment variables page.

Custom model lists use `,` to separate multiple models. If you want to disable a model, use the `-` symbol followed by the model name, i.e. `-existing-model-name`. To only allow the specified model to be available, use `-all,+new-model-name`.

## 🚢 Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fu14app%2Fdeep-research&project-name=deep-research&repository-name=deep-research)

### Cloudflare

Currently the project supports deployment to Cloudflare, but you need to follow [How to deploy to Cloudflare Pages](./docs/How-to-deploy-to-Cloudflare-Pages.md) to do it.

### Docker

> The Docker version needs to be 20 or above, otherwise it will prompt that the image cannot be found.

> ⚠️ Note: Most of the time, the docker version will lag behind the latest version by 1 to 2 days, so the "update exists" prompt will continue to appear after deployment, which is normal.

```bash
docker pull xiangfa/deep-research:latest
docker run -d --name deep-research -p 3333:3000 xiangfa/deep-research
```

You can also specify additional environment variables:

```bash
docker run -d --name deep-research \
   -p 3333:3000 \
   -e ACCESS_PASSWORD=your-password \
   -e GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy... \
   xiangfa/deep-research
```

or build your own docker image:

```bash
docker build -t deep-research .
docker run -d --name deep-research -p 3333:3000 deep-research
```

If you need to specify other environment variables, please add `-e key=value` to the above command to specify it.

Deploy using `docker-compose.yml`:

```bash
version: '3.9'
services:
   deep-research:
      image: xiangfa/deep-research
      container_name: deep-research
      environment:
         - ACCESS_PASSWORD=your-password
         - GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...
      ports:
         - 3333:3000
```

or build your own docker compose:

```bash
docker compose -f docker-compose.yml build
```

### Static Deployment

You can also build a static page version directly, and then upload all files in the `out` directory to any website service that supports static pages, such as Github Page, Cloudflare, Vercel, etc..

```bash
pnpm build:export
```

## ⚙️ Configuration

As mentioned in the "Getting Started" section, Deep Research utilizes the following environment variables for server-side API configurations:

Please refer to the file `env.tpl` for all available environment variables.

**Important Notes on Environment Variables:**

- **Privacy Reminder:** These environment variables are primarily used for **server-side API calls**. When using the **local API mode**, no API keys or server-side configurations are needed, further enhancing your privacy.

- **Multi-key Support:** Supports multiple keys, each key is separated by `,`, i.e. `key1,key2,key3`.

- **Security Setting:** By setting `ACCESS_PASSWORD`, you can better protect the security of the server API.

- **Make variables effective:** After adding or modifying this environment variable, please redeploy the project for the changes to take effect.

## 🛡️ Privacy

Deep Research is designed with your privacy in mind. **All research data and generated reports are stored locally on your machine.** We do not collect or transmit any of your research data to external servers (unless you are explicitly using server-side API calls, in which case data is sent to Google's Gemini API through your configured proxy if any). Your privacy is our priority.

## 📝 License

Deep Research is released under the [MIT License](LICENSE). This license allows for free use, modification, and distribution for both commercial and non-commercial purposes.

## 📖 API Documentation

Deep Research provides a comprehensive API for programmatic access to all research functionality. You can find the API documentation at `/api/docs` when running the application.

### Setting Up the API

1. **Deploy Deep Research**:

   - Follow the deployment instructions above to deploy Deep Research to your preferred platform (Vercel, Cloudflare, Docker, etc.)
   - Alternatively, run it locally using `pnpm dev` or `npm run dev`

2. **Configure API Authentication**:

   - Set the `ACCESS_PASSWORD` environment variable to secure your API
   - This password will be used as the API key for authentication

3. **Configure AI Providers**:
   - Set up the necessary API keys for the AI providers you want to use (Google Gemini, OpenAI, etc.)
   - Set up the necessary API keys for search providers (Tavily, etc.)

### Using the API

The simplest way to use the API is with the all-in-one query endpoint:

```bash
curl -X POST https://your-deployment-url.com/api/research/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-access-password" \
  -d '{"query":"History of cars"}'
```

#### Example Request:

```json
{
  "query": "History of cars",
  "language": "en-US",
  "provider": "google",
  "searchProvider": "tavily",
  "maxIterations": 2
}
```

#### Example Response:

```json
{
  "query": "History of cars",
  "report": "# History of Cars\n\n## Introduction\n\nThe automobile has transformed human civilization...",
  "metadata": {
    "initialQueries": [...],
    "learnings": [...],
    "iterations": 2,
    "language": "en-US",
    "provider": "google",
    "searchProvider": "tavily"
  }
}
```

### JavaScript Example

```javascript
async function performResearch(query) {
  const response = await fetch(
    "https://your-deployment-url.com/api/research/query",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer your-access-password",
      },
      body: JSON.stringify({
        query: query,
        provider: "google", // Default: Google Gemini
        searchProvider: "tavily", // Default: Tavily for web search
      }),
    }
  );

  // Check if request was successful
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const result = await response.json();
  return result.report;
}

// Example usage
performResearch("History of artificial intelligence")
  .then((report) => console.log(report))
  .catch((error) => console.error("Error:", error));
```

### Python Example

```python
import requests

def perform_research(query):
    url = "https://your-deployment-url.com/api/research/query"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer your-access-password"
    }
    data = {
        "query": query,
        "provider": "google",  # Default: Google Gemini
        "searchProvider": "tavily"  # Default: Tavily for web search
    }

    response = requests.post(url, json=data, headers=headers)
    response.raise_for_status()  # Raise exception for HTTP errors

    result = response.json()
    return result["report"]

# Example usage
try:
    report = perform_research("History of artificial intelligence")
    print(report)
except Exception as e:
    print(f"Error: {e}")
```

For more detailed examples, see the [examples directory](examples/).

For more details, see the [API Documentation](src/app/api/research/README.md).

## � Customizing Settings

Deep Research provides an extensive settings system that allows you to customize various aspects of the application:

- **Search Settings**: Control search depth, result count, and domain filtering
- **LLM Settings**: Adjust model parameters like temperature, token limits, and safety settings
- **Prompt Templates**: Customize the instructions given to the LLM for different types of research
- **API Settings**: Configure API behavior, schemas, and response formats
- **Application Settings**: Modify general application behavior and defaults

All settings are organized in the `src/settings` directory. See the [Settings Documentation](src/settings/README.md) for detailed information on how to customize the application to your needs.

## �🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React framework for building performant web applications.
- [Shadcn UI](https://ui.shadcn.com/) - Beautifully designed components that helped streamline the UI development.
- [Google Gemini](https://ai.google.dev/gemini-api) - Powering the intelligent research capabilities of Deep Research.
- [Deep Research](https://github.com/dzhng/deep-research) - Thanks to the project `dzhng/deep-research` for inspiration.

## 🤝 Contributing

We welcome contributions to Deep Research! If you have ideas for improvements, bug fixes, or new features, please feel free to:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Submit a pull request.

For major changes, please open an issue first to discuss your proposed changes.

## ✉️ Contact

If you have any questions, suggestions, or feedback, please create a new [issue](https://github.com/u14app/deep-research/issues).
