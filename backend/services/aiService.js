import 'dotenv/config'

const SYSTEM_PROMPT = `You are Sam Fitness, the elite AI assistant and digital concierge for Sam Fitness Gym.
Your role is to guide users, answer questions, provide fitness/nutrition advice, and assist with any general knowledge or conversation.

Here is what you know about Sam Fitness Gym:
- Location: Bandra West, Mumbai, India (opposite Bandra Reclamation).
- Contact: Phone: +91 98765 43210, Email: info@Sam Fitness.in.
- Facilities/Amenities: 24/7 member access. Fully equipped weight floor, high-end cardio zone, swimming pool, luxury locker rooms, steam room, sauna, juice bar, and recovery lounge.
- Gym Access: 24/7 for members. Staffed hours: 6 AM to 10 PM daily.

Membership Tiers & Pricing:
1. Starter Tier (Monthly): ₹2,499/month. Core gym weight floor and cardio access, locker rooms. No classes or pool.
2. Pro Tier (Monthly/Annual): ₹4,499/month. Access to all Starter facilities plus unlimited group classes (Yoga, Zumba, HIIT, Spin, etc.) and steam & sauna. (Annual subscription gets 15% discount).
3. Elite Tier (Monthly/Annual): ₹7,499/month. Unlimited access to all facilities, classes, steam/sauna, swimming pool, premium recovery lounge, 2 personal trainer sessions per month, and custom sports nutrition consulting. (Annual gets 15% discount).

Classes Offered:
- Yoga: Flexibility, core strength, and mindfulness. Instructed by Maya Reddy.
- Zumba: High-energy dance fitness.
- HIIT: High-Intensity Interval Training for maximum calorie burn. Instructed by Dev Malhotra.
- Powerlifting: Barbell strength training and compound movements. Instructed by Aryan Kapoor.
- Pilates: Core alignment, mobility, and posture correction. Instructed by Priya Sharma.
- Bachata Dance: Fun social dance-cardio.
- Boxing: Cardio conditioning and bag work.
- Spin: High-energy group indoor cycling.

Our Team of Trainers:
- Aryan Kapoor: Master of Strength, Powerlifting, and Olympic weightlifting. Focus on barbell form and heavy lifting.
- Maya Reddy: Vinyasa Yoga and mobility specialist. Focuses on mind-body wellness and flexibility.
- Dev Malhotra: Cardio, metabolic HIIT conditioning, and fast weight-loss program lead.
- Priya Sharma: Pilates instructor and certified sports nutritionist. Focus on posture recovery and meal planning.

Interaction Guidelines:
- You should answer gym-specific questions accurately using the parameters above.
- You can answer ANY question (general knowledge, coding, writing, mathematics, nutrition recipes, workout planning, etc.). Do not limit yourself only to gym questions.
- Switch between general queries and gym-specific assistant tasks seamlessly.
- Always be professional, positive, encouraging, and clear.
- Use clean Markdown styling (such as bolding, lists, code blocks, or headings) to format responses. Avoid long, unformatted blocks of text.
- If the user asks about booking a class or joining, guide them to contact the front desk or use the membership section.
`

/**
 * Normalizes message format from client to OpenAI schema
 */
function formatMessages(messages) {
  // Ensure the list starts with system prompt, followed by user/assistant messages
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    }))
  ]
}

/**
 * Unified Stream Generator for OpenAI, Gemini (via compatibility layer), or Mock
 */
export async function* streamChatCompletion(messages) {
  const provider = (process.env.AI_PROVIDER || '').toLowerCase()
  const openAIKey = process.env.OPENAI_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY

  // Determine active provider
  let activeProvider = 'mock'
  let apiKey = ''
  let apiUrl = ''
  let modelName = ''

  if (provider === 'openai' && openAIKey) {
    activeProvider = 'openai'
    apiKey = openAIKey
    apiUrl = 'https://api.openai.com/v1/chat/completions'
    modelName = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  } else if (provider === 'gemini' && geminiKey) {
    activeProvider = 'gemini'
    apiKey = geminiKey
    apiUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
    modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  } else if (openAIKey) {
    activeProvider = 'openai'
    apiKey = openAIKey
    apiUrl = 'https://api.openai.com/v1/chat/completions'
    modelName = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  } else if (geminiKey) {
    activeProvider = 'gemini'
    apiKey = geminiKey
    apiUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
    modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  }

  console.log(`[AI SERVICE] Routing completion request to provider: ${activeProvider.toUpperCase()}`)

  if (activeProvider === 'mock') {
    yield* streamMockResponse(messages)
    return
  }

  // Build headers & payload for the standard OpenAI-compatible completions API
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }

  const payload = {
    model: modelName,
    messages: formatMessages(messages),
    stream: true,
    temperature: 0.7
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`[AI SERVICE] ${activeProvider} API Error:`, errorText)
    throw new Error(`${activeProvider.toUpperCase()} API connection failed: ${response.statusText} (${response.status})`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // Retain incomplete line

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        if (trimmed === 'data: [DONE]') continue

        if (trimmed.startsWith('data: ')) {
          try {
            const dataJson = JSON.parse(trimmed.slice(6))
            const chunkText = dataJson.choices?.[0]?.delta?.content || ''
            if (chunkText) {
              yield chunkText
            }
          } catch {
            // Ignore parse errors on fragmented lines
          }
        }
      }
    }
  } catch (err) {
    console.error('[AI SERVICE] Stream reading error:', err)
    throw err
  } finally {
    reader.releaseLock()
  }
}

/**
 * Fallback Mock Streaming response when no API keys are set.
 */
async function* streamMockResponse(messages) {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || ''
  const lower = lastUserMsg.toLowerCase()

  let responseText

  // Friendly introductory disclaimer
  const disclaimer = `> [!NOTE]
> **API Preview Mode**: Sam Fitness AI Assistant is running in fallback mock mode. Configure \`GEMINI_API_KEY\` or \`OPENAI_API_KEY\` in your \`backend/.env\` to enable real Gemini/GPT LLM capabilities.

`

  if (lower.includes('membership') || lower.includes('tier') || lower.includes('price') || lower.includes('cost')) {
    responseText = `${disclaimer}At **Sam Fitness Gym**, we offer three luxury tiers structured to fit your health and workout goals:

1. **Starter Tier** (₹2,499/month): Provides full access to the general gym floor, including heavy strength areas, cardio equipment, and pristine locker rooms.
2. **Pro Tier** (₹4,499/month): Our most popular option! Includes all Starter amenities plus unlimited access to all group exercise classes (Yoga, HIIT, Zumba, Spin) and the steam room & sauna. Get **15% off** on annual plans!
3. **Elite Tier** (₹7,499/month): The ultimate fitness experience. Enjoy 2 personal training sessions per month, customized sports nutrition planning, access to the swimming pool, recovery lounge, and all classes.

Would you like recommendation on which package fits your fitness targets? Just let me know!`
  } else if (lower.includes('class') || lower.includes('zumba') || lower.includes('yoga') || lower.includes('pilates') || lower.includes('hiit')) {
    responseText = `${disclaimer}We run a diverse schedule of group classes at Sam Fitness Gym tailored to all fitness levels. Here is a list of our core classes:

*   **Yoga (Vinyasa Flow & Core Mobility)**: Instructed by **Maya Reddy**. Perfect for flexibility and recovery.
*   **HIIT (High-Intensity Interval Training)**: Led by **Dev Malhotra**. High-octane cardio conditioning for fat loss.
*   **Powerlifting**: Led by **Aryan Kapoor**. Learn squat, bench press, and deadlift form safely.
*   **Pilates & Core Rehab**: Taught by **Priya Sharma**. Emphasizes core stability and posture alignment.
*   **Other classes**: Zumba, Box-fit, Bachata Dance, and Group Spin.

Classes run daily from **6 AM to 10 PM**. Which one fits your schedule?`
  } else if (lower.includes('trainer') || lower.includes('coach') || lower.includes('aryan') || lower.includes('maya')) {
    responseText = `${disclaimer}Meet the elite personal trainers at Sam Fitness Gym who are ready to guide you:

*   **Aryan Kapoor** (Strength Coach): Master of compound lifts, powerlifting, and athletic strength.
*   **Maya Reddy** (Mindfulness & Yoga): Specialized in posture alignment, core control, and breathwork.
*   **Dev Malhotra** (Conditioning Coach): Master of body recomposition, HIIT, and metabolic endurance training.
*   **Priya Sharma** (Pilates & Nutritionist): Expert in injury rehabilitation, spinal health, and custom macro coaching.

All personal training packages include regular assessments and meal plans. Let me know if you would like me to coordinate an introductory consultation!`
  } else if (lower.includes('hello') || lower.includes('hi ') || lower.includes('hey')) {
    responseText = `${disclaimer}Hello! Welcome to **Sam Fitness Gym**. I am your AI digital concierge. 

How can I help you today? I can answer questions about our memberships, elite trainers, group schedules, or provide customized health tips!`
  } else {
    responseText = `${disclaimer}Thanks for asking! I am the **Sam Fitness Gym AI Assistant**. 

Since we are running in **API Preview Mode**, I can only answer general gym queries directly. Once you add your \`GEMINI_API_KEY\` or \`OPENAI_API_KEY\` to the backend \`.env\` file and set \`AI_PROVIDER=gemini\` or \`openai\`, I will act like ChatGPT/Gemini and answer *any* open-ended question (like programming, history, nutrition recipes, or custom exercises)!

In the meantime, feel free to ask me about:
* Sam Fitness **pricing and membership tiers**
* Available **fitness classes** and schedules
* Our elite **personal trainers**`
  }

  // Stream the response string in words/chunks to emulate writing latency
  const chunks = responseText.split(/(\s+)/)
  for (const chunk of chunks) {
    yield chunk
    // Small realistic typing latency
    await new Promise(resolve => setTimeout(resolve, 15))
  }
}

/**
 * Returns configuration details (safe, no API keys exposed)
 */
export function getAIConfig() {
  const provider = (process.env.AI_PROVIDER || '').toLowerCase()
  const openAIKey = !!process.env.OPENAI_API_KEY
  const geminiKey = !!process.env.GEMINI_API_KEY

  let activeProvider = 'mock'
  if (provider === 'openai' && openAIKey) activeProvider = 'openai'
  else if (provider === 'gemini' && geminiKey) activeProvider = 'gemini'
  else if (openAIKey) activeProvider = 'openai'
  else if (geminiKey) activeProvider = 'gemini'

  return {
    provider: activeProvider,
    mode: activeProvider === 'mock' ? 'Preview (Mock)' : 'Live LLM',
    model: activeProvider === 'openai' 
      ? (process.env.OPENAI_MODEL || 'gpt-4o-mini') 
      : activeProvider === 'gemini' 
      ? (process.env.GEMINI_MODEL || 'gemini-1.5-flash') 
      : 'mock-concierge'
  }
}
