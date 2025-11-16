# AI/ML Requirements (With Claude + ChatGPT Integration)

## Document Overview

This document outlines the **HYBRID AI/ML architecture** for Spark Investment AI platform using **Claude API (Anthropic)** and **ChatGPT API (OpenAI)** combined with selective custom models.

**Approach**: Leverage world-class LLMs for language tasks, build custom models only for specialized financial calculations

**Priority Level**: High
**Security Classification**: Confidential
**Last Updated**: 2025-11-13
**Version**: 2.0 (LLM-Integrated)

---

## Table of Contents

1. [Hybrid Architecture Overview](#hybrid-architecture-overview)
2. [LLM-Powered Features](#llm-powered-features)
3. [Custom Models (Still Required)](#custom-models-still-required)
4. [LLM Integration Specifications](#llm-integration-specifications)
5. [Prompt Engineering Guidelines](#prompt-engineering-guidelines)
6. [Custom Model Specifications](#custom-model-specifications)
7. [Infrastructure & Deployment](#infrastructure--deployment)
8. [Monitoring & Cost Management](#monitoring--cost-management)
9. [Security & Compliance](#security--compliance)

---

## Hybrid Architecture Overview

### 🎯 Core Decision

**Use LLMs (Claude + ChatGPT) for: 62.5% of AI features**
- Portfolio health analysis and insights
- Investment recommendations (with rule-based pre-filtering)
- Market sentiment analysis
- AI chatbot and user queries
- Report generation

**Use Custom ML Models for: 37.5% of AI features**
- Price prediction (time series forecasting)
- Risk assessment (quantitative calculations)
- Auto-invest optimization (reinforcement learning)

### Technology Stack

**LLM APIs:**
```yaml
Primary LLM: Claude 3.5 Sonnet (Anthropic)
  - Use for: Portfolio analysis, recommendations, complex reasoning
  - Strengths: Better reasoning, longer context (200K tokens), JSON mode
  - Cost: $3 per million input tokens, $15 per million output tokens
  - Context window: 200,000 tokens

Secondary LLM: GPT-4 Turbo (OpenAI)
  - Use for: Social media sentiment, casual chat, reports
  - Strengths: Good general performance, familiar API
  - Cost: $10 per million input tokens, $30 per million output tokens
  - Context window: 128,000 tokens

Fallback: GPT-3.5 Turbo
  - Use for: Simple tasks when cost matters
  - Cost: $0.50 per million input tokens, $1.50 per million output tokens
```

**Custom ML Stack:**
```yaml
Time Series: TensorFlow + Keras (LSTM)
Optimization: Stable-Baselines3 (Reinforcement Learning)
Risk Models: NumPy + SciPy (Monte Carlo)
Deployment: FastAPI + Docker
Monitoring: Prometheus + Grafana
```

**Data & Caching:**
```yaml
Database: PostgreSQL 15+
Cache: Redis 7+ (for LLM responses and predictions)
Queue: Celery + Redis (for async processing)
Storage: S3-compatible (for model artifacts)
```

---

## LLM-Powered Features

### 1. Portfolio Health Analysis 🤖 Claude

**Implementation**: 100% LLM (no custom model needed)

```python
async def analyze_portfolio_health(portfolio_data, user_profile):
    """
    Analyze portfolio using Claude API with structured prompt.

    Returns health score (0-100) with detailed insights and recommendations.
    """

    prompt = f"""
You are an expert investment portfolio analyzer for Indian retail investors.

TASK: Analyze the portfolio and provide comprehensive health assessment.

PORTFOLIO DATA:
{json.dumps(portfolio_data, indent=2)}

USER PROFILE:
- Age: {user_profile['age']}
- Risk Profile: {user_profile['risk_profile']}
- Investment Horizon: {user_profile['investment_horizon']} years
- Financial Goals: {', '.join(user_profile['goals'])}

MARKET CONTEXT:
- Nifty 50: {market_data['nifty_current']} ({market_data['nifty_change']})
- Market Sentiment: {market_data['sentiment']}
- VIX: {market_data['vix']}

ANALYZE THE FOLLOWING ASPECTS:

1. Diversification
   - Sector concentration (flag if any sector > 30%)
   - Asset class allocation
   - Number of holdings (too many/too few?)
   - Geographic diversification

2. Risk Assessment
   - Portfolio beta and volatility
   - Downside risk
   - Alignment with user's risk profile
   - Hedging effectiveness

3. Performance
   - Returns vs. benchmarks (Nifty 50, Sensex)
   - Risk-adjusted returns (Sharpe ratio)
   - Consistency of returns

4. Cost Efficiency
   - Expense ratios for mutual funds
   - Transaction costs

5. Alignment with Goals
   - Progress toward financial goals
   - Time horizon appropriateness

OUTPUT FORMAT (strict JSON):
{{
  "health_score": <integer 0-100>,
  "category": "<Excellent|Good|Average|Poor|Critical>",
  "components": {{
    "diversification_score": <integer 0-100>,
    "risk_management_score": <integer 0-100>,
    "performance_score": <integer 0-100>,
    "cost_efficiency_score": <integer 0-100>,
    "goal_alignment_score": <integer 0-100>
  }},
  "strengths": [
    "<specific strength with numbers>",
    "<another strength>"
  ],
  "weaknesses": [
    "<specific weakness with numbers>",
    "<another weakness>"
  ],
  "recommendations": [
    {{
      "type": "<rebalance|diversify|risk_reduction|cost_optimization>",
      "priority": "<high|medium|low>",
      "action": "<specific actionable recommendation>",
      "expected_impact": "<quantified benefit>",
      "timeline": "<immediate|short_term|long_term>"
    }}
  ],
  "alerts": [
    "<critical issue requiring immediate attention>"
  ],
  "summary": "<2-3 sentence executive summary>"
}}

IMPORTANT GUIDELINES:
- Be specific with numbers and percentages
- Consider SEBI guidelines and regulations
- Flag concentrated positions (>15% in single stock)
- Recommend rebalancing if sectors deviate >10% from ideal
- Consider tax implications for Indian investors
- Reference appropriate benchmarks (Nifty 50, BSE Sensex, etc.)
- Be encouraging but honest about weaknesses
- Prioritize actionable recommendations

Provide ONLY the JSON response, no additional text.
"""

    # Call Claude API
    response = await anthropic_client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4096,
        temperature=0.3,  # Lower for consistency
        messages=[{"role": "user", "content": prompt}]
    )

    # Parse JSON response
    analysis = json.loads(response.content[0].text)

    # Cache result for 1 hour
    await cache_llm_response(
        key=f"portfolio_health:{portfolio_data['id']}",
        value=analysis,
        ttl=3600
    )

    # Track usage
    track_llm_usage(
        user_id=user_profile['user_id'],
        model="claude-3.5-sonnet",
        tokens_input=response.usage.input_tokens,
        tokens_output=response.usage.output_tokens,
        cost=calculate_cost(response.usage)
    )

    return analysis
```

**API Endpoint:**
```http
POST /api/ai/portfolio/health
Authorization: Bearer <token>
Content-Type: application/json

{
  "portfolio_id": "uuid"
}

Response: 200 OK
{
  "health_score": 78,
  "category": "Good",
  "components": {
    "diversification_score": 85,
    "risk_management_score": 72,
    "performance_score": 80,
    "cost_efficiency_score": 75,
    "goal_alignment_score": 82
  },
  "strengths": [
    "Well diversified across 8 sectors with no sector exceeding 20%",
    "Strong performance with 18.5% returns vs Nifty 50's 14.2% over 1 year"
  ],
  "weaknesses": [
    "IT sector concentration at 28% is above recommended 25% limit",
    "High portfolio beta of 1.4 may not align with moderate risk profile"
  ],
  "recommendations": [
    {
      "type": "rebalance",
      "priority": "high",
      "action": "Reduce IT sector exposure by 8% (sell ₹40,000 worth) and increase defensive sectors like FMCG or Pharma",
      "expected_impact": "Reduce portfolio volatility by ~12% while maintaining returns",
      "timeline": "immediate"
    }
  ],
  "summary": "Your portfolio shows good diversification and strong performance, but IT sector is overweighted at 28%. Consider rebalancing to reduce risk."
}
```

**Benefits of LLM Approach:**
- ✅ No training data needed - works immediately
- ✅ Natural language explanations users can understand
- ✅ Adapts to edge cases without retraining
- ✅ Easy to update criteria (just modify prompt)
- ✅ Considers multiple factors holistically
- ✅ Can reference current market context

**Cost per Request:** ₹2-5 (~$0.03-0.06)

---

### 2. Investment Recommendations 🤖 Claude + Rule-Based Filtering

**Implementation**: Hybrid (simple rule-based filtering + Claude analysis)

```python
async def generate_investment_recommendations(user_profile, portfolio, filters=None):
    """
    Generate personalized stock/mutual fund recommendations.

    Step 1: Rule-based pre-filtering (no ML needed)
    Step 2: Claude analyzes and ranks filtered options
    """

    # STEP 1: Pre-filter using simple rules
    all_securities = await db.get_all_securities()

    filtered = []
    for security in all_securities:
        # Basic fundamental filters
        if (
            security['market_cap'] >= 5000  # Min 5000 Cr market cap
            and security['pe_ratio'] > 0 and security['pe_ratio'] < 50
            and security['roe'] > 12  # Return on equity > 12%
            and security['debt_to_equity'] < 1.5
            and security['avg_volume'] > 100000  # Liquidity filter
        ):
            # Check if already in portfolio (avoid duplicates)
            if security['symbol'] not in portfolio['symbols']:
                filtered.append(security)

    # Apply user-specific filters
    if filters:
        if 'sectors' in filters:
            filtered = [s for s in filtered if s['sector'] in filters['sectors']]
        if 'max_price' in filters:
            filtered = [s for s in filtered if s['current_price'] <= filters['max_price']]

    # Limit to top 50 by market cap for Claude analysis
    filtered = sorted(filtered, key=lambda x: x['market_cap'], reverse=True)[:50]

    # STEP 2: Send to Claude for intelligent ranking
    prompt = f"""
You are an expert Indian stock market analyst. Recommend the top 5 stocks for this investor from the pre-filtered list.

USER PROFILE:
- Age: {user_profile['age']}
- Risk Tolerance: {user_profile['risk_tolerance']}
- Investment Horizon: {user_profile['time_horizon']} months
- Monthly Investment Amount: ₹{user_profile['monthly_investment']:,}
- Financial Goals: {', '.join(user_profile['goals'])}

CURRENT PORTFOLIO:
- Total Value: ₹{portfolio['total_value']:,}
- Holdings: {len(portfolio['holdings'])} stocks
- Sector Exposure: {json.dumps(portfolio['sector_breakdown'])}
- Current Risk Level: {portfolio['risk_score']}/100

AVAILABLE STOCKS (pre-filtered for quality):
{json.dumps(filtered, indent=2)}

CURRENT MARKET CONDITIONS:
- Nifty 50: {market['nifty_current']} ({market['nifty_change']})
- Market Sentiment: {market['sentiment']}
- India VIX: {market['vix']}

TASK: Select and rank the top 5 stocks that:
1. Complement the existing portfolio (diversification)
2. Match the user's risk profile
3. Align with investment horizon
4. Have good growth potential
5. Minimize sector concentration

For each recommendation provide:

OUTPUT FORMAT (strict JSON):
{{
  "recommendations": [
    {{
      "rank": 1,
      "security_id": "<isin>",
      "symbol": "<symbol>",
      "name": "<company name>",
      "recommendation_score": <float 0-10>,
      "recommendation_type": "<STRONG_BUY|BUY|ACCUMULATE>",
      "suggested_allocation_percent": <float>,
      "suggested_amount": <rupees>,
      "reasoning": [
        "<specific reason with data>",
        "<another reason>",
        "<third reason>"
      ],
      "risk_level": "<low|medium|high>",
      "time_horizon": "<short_term|medium_term|long_term>",
      "expected_return_1y": <percentage>,
      "key_strengths": ["<strength1>", "<strength2>"],
      "key_risks": ["<risk1>", "<risk2>"],
      "sector": "<sector>",
      "correlation_with_portfolio": "<low|medium|high>"
    }}
  ],
  "portfolio_impact": {{
    "new_sector_allocation": {{<sector breakdown after adding>}},
    "expected_portfolio_return": <percentage>,
    "expected_risk_change": "<increase|decrease|neutral>",
    "diversification_improvement": <percentage>
  }},
  "overall_strategy": "<2-3 sentence summary of recommendation strategy>"
}}

IMPORTANT:
- Ensure total allocation across 5 stocks doesn't exceed 100%
- Avoid concentration (no single stock > 15% allocation)
- Consider correlation with existing holdings
- Be realistic with return expectations (Indian market averages 12-15% annually)
- Prioritize quality and safety over high returns for conservative investors
- Consider tax implications (LTCG, STCG)

Provide ONLY the JSON response.
"""

    response = await anthropic_client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=6144,
        temperature=0.4,  # Slightly higher for creativity
        messages=[{"role": "user", "content": prompt}]
    )

    recommendations = json.loads(response.content[0].text)

    # Add real-time data to recommendations
    for rec in recommendations['recommendations']:
        security = await db.get_security(rec['security_id'])
        rec['current_price'] = security['current_price']
        rec['day_change'] = security['day_change']
        rec['52week_high'] = security['52week_high']
        rec['52week_low'] = security['52week_low']

    # Cache for 1 hour
    await cache_llm_response(
        key=f"recommendations:{user_profile['user_id']}:{hash(str(filters))}",
        value=recommendations,
        ttl=3600
    )

    return recommendations
```

**API Endpoint:**
```http
POST /api/ai/recommendations/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "filters": {
    "risk_level": ["low", "medium"],
    "sectors": ["technology", "healthcare", "fmcg"],
    "max_price": 5000,
    "min_market_cap": 5000
  },
  "limit": 5
}

Response: 200 OK
{
  "recommendations": [
    {
      "rank": 1,
      "symbol": "TCS",
      "name": "Tata Consultancy Services Ltd",
      "recommendation_score": 8.7,
      "recommendation_type": "BUY",
      "suggested_allocation_percent": 12.0,
      "suggested_amount": 60000,
      "reasoning": [
        "Strong fundamentals with PE of 28.5 below IT sector average of 32",
        "Consistent revenue growth of 15% YoY with healthy margins",
        "Low correlation (0.3) with your existing FMCG-heavy portfolio provides diversification",
        "Defensive IT stock suitable for moderate risk profile"
      ],
      "risk_level": "medium",
      "expected_return_1y": 18.5,
      "key_strengths": [
        "Market leader in IT services with 51% profit margin",
        "Strong order book of $11.2 billion"
      ],
      "key_risks": [
        "Exposure to global economic slowdown",
        "Currency fluctuation risk"
      ],
      "current_price": 3456.50,
      "day_change": "+1.2%"
    }
  ],
  "portfolio_impact": {
    "new_sector_allocation": {
      "IT": 25,
      "FMCG": 20,
      "Finance": 18,
      "Healthcare": 15,
      "Others": 22
    },
    "expected_portfolio_return": 16.2,
    "expected_risk_change": "neutral",
    "diversification_improvement": 8.5
  },
  "overall_strategy": "Focus on quality large-cap stocks with strong fundamentals to balance your existing FMCG exposure. Gradual allocation over 3 months recommended."
}
```

**Benefits:**
- ✅ Pre-filtering reduces LLM input size (saves cost)
- ✅ Contextual recommendations considering full user profile
- ✅ Natural language explanations of "why"
- ✅ Adapts to changing market conditions
- ✅ No need for user behavior training data

**Cost per Request:** ₹5-10 (~$0.06-0.12)

---

### 3. Market Sentiment Analysis 🤖 Claude + GPT-4

**Implementation**: Dual LLM (Claude for financial news, GPT-4 for social media)

```python
async def analyze_market_sentiment(entity, entity_type="stock", sources=None):
    """
    Analyze sentiment from multiple sources using appropriate LLMs.

    Args:
        entity: Stock symbol, sector name, or "market"
        entity_type: "stock", "sector", or "market"
        sources: List of sources to analyze (default: all)
    """

    if sources is None:
        sources = ["news", "social", "regulatory"]

    results = {}

    # NEWS SENTIMENT - Use Claude (better at financial analysis)
    if "news" in sources:
        news_articles = await fetch_news(entity, limit=20, days=7)

        news_prompt = f"""
Analyze sentiment of these recent financial news articles about {entity}.

ARTICLES:
{format_articles(news_articles)}

For each article and overall, provide:

OUTPUT (strict JSON):
{{
  "articles": [
    {{
      "title": "<article title>",
      "source": "<source name>",
      "published_at": "<datetime>",
      "sentiment_score": <float -1 to +1>,
      "sentiment_label": "<very_negative|negative|neutral|positive|very_positive>",
      "confidence": <float 0-1>,
      "key_topics": [
        {{"topic": "<topic>", "sentiment": <score>}}
      ],
      "impact_assessment": "<high|medium|low>",
      "summary": "<one sentence summary>"
    }}
  ],
  "aggregate": {{
    "overall_sentiment": <float -1 to +1>,
    "sentiment_label": "<label>",
    "confidence": <float 0-1>,
    "sentiment_trend": "<improving|stable|declining>",
    "total_articles": <count>,
    "sentiment_distribution": {{
      "very_positive": <count>,
      "positive": <count>,
      "neutral": <count>,
      "negative": <count>,
      "very_negative": <count>
    }},
    "key_themes": [
      {{"theme": "<theme>", "mentions": <count>, "sentiment": <score>}}
    ],
    "market_moving_news": [
      "<brief description of important news>"
    ]
  }},
  "interpretation": "<2-3 sentence interpretation for investors>"
}}

Consider:
- Corporate earnings and guidance
- Regulatory changes
- Management commentary
- Analyst opinions
- Market conditions
- Sector trends

Provide ONLY the JSON response.
"""

        news_response = await anthropic_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4096,
            temperature=0.2,
            messages=[{"role": "user", "content": news_prompt}]
        )

        results['news'] = json.loads(news_response.content[0].text)

    # SOCIAL MEDIA SENTIMENT - Use GPT-4 (good at informal text)
    if "social" in sources:
        social_posts = await fetch_social_media(entity, platforms=["twitter", "reddit"], limit=100)

        social_prompt = f"""
Analyze sentiment of social media discussions about {entity}.

POSTS (from Twitter and Reddit):
{format_social_posts(social_posts)}

Provide sentiment analysis:

OUTPUT (strict JSON):
{{
  "aggregate_sentiment": <float -1 to +1>,
  "sentiment_label": "<very_negative|negative|neutral|positive|very_positive>",
  "confidence": <float 0-1>,
  "total_posts": <count>,
  "sentiment_distribution": {{
    "positive": <count>,
    "neutral": <count>,
    "negative": <count>
  }},
  "trending_topics": [
    {{"topic": "<topic>", "mentions": <count>, "sentiment": <score>}}
  ],
  "investor_mood": "<fearful|cautious|neutral|optimistic|euphoric>",
  "notable_opinions": [
    "<interesting opinion or discussion point>"
  ],
  "reliability_score": <float 0-1>
}}

Note: Social media sentiment can be noisy. Weight your analysis accordingly.

Provide ONLY the JSON response.
"""

        social_response = await openai_client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": social_prompt}],
            temperature=0.2,
            response_format={"type": "json_object"}
        )

        results['social'] = json.loads(social_response.choices[0].message.content)

    # REGULATORY FILINGS - Use Claude
    if "regulatory" in sources:
        filings = await fetch_regulatory_filings(entity, days=30)

        if filings:
            regulatory_prompt = f"""
Analyze these recent regulatory filings for {entity}:

FILINGS:
{format_filings(filings)}

Assess impact and sentiment:

OUTPUT (JSON):
{{
  "filings_analyzed": <count>,
  "overall_sentiment": <float -1 to +1>,
  "material_developments": [
    {{"filing_type": "<type>", "impact": "<positive|negative|neutral>", "summary": "<summary>"}}
  ],
  "compliance_status": "<good|concerning|critical>",
  "investor_implications": "<brief analysis>"
}}

Provide ONLY the JSON response.
"""

            regulatory_response = await anthropic_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2048,
                temperature=0.2,
                messages=[{"role": "user", "content": regulatory_prompt}]
            )

            results['regulatory'] = json.loads(regulatory_response.content[0].text)

    # AGGREGATE ALL SOURCES
    aggregate = {
        "entity": entity,
        "entity_type": entity_type,
        "analysis_timestamp": datetime.now().isoformat(),
        "overall_sentiment": calculate_weighted_sentiment(results),
        "sentiment_by_source": {
            source: data.get('overall_sentiment') or data.get('aggregate_sentiment')
            for source, data in results.items()
        },
        "confidence": calculate_aggregate_confidence(results),
        "recommendation": generate_sentiment_recommendation(results),
        "sources_analyzed": list(results.keys())
    }

    # Cache for 1 hour
    await cache_llm_response(
        key=f"sentiment:{entity}:{':'.join(sources)}",
        value={"results": results, "aggregate": aggregate},
        ttl=3600
    )

    return {"results": results, "aggregate": aggregate}
```

**API Endpoint:**
```http
GET /api/ai/sentiment/aggregate?entity=TCS&sources=news,social&period=7d

Response: 200 OK
{
  "entity": "TCS",
  "entity_type": "stock",
  "overall_sentiment": 0.68,
  "sentiment_label": "positive",
  "confidence": 0.85,
  "sentiment_by_source": {
    "news": 0.72,
    "social": 0.65
  },
  "sentiment_trend": "improving",
  "recommendation": "Positive sentiment across news and social media. Recent earnings beat and strong order book driving optimism. Consider for accumulation.",
  "analysis_timestamp": "2025-11-13T10:30:00Z"
}
```

**Benefits:**
- ✅ Works on any text immediately (no training needed)
- ✅ Handles new events and topics without retraining
- ✅ Nuanced analysis with reasoning
- ✅ Multi-language support built-in
- ✅ Can detect subtle sentiment shifts

**Cost per Request:** ₹3-8 (~$0.04-0.10) depending on number of articles

---

### 4. AI Investment Chatbot 🤖 Claude

**Implementation**: Conversational AI using Claude with context management

```python
async def handle_investment_chat(user_id, message, conversation_history=None):
    """
    Handle natural language investment queries with context.

    Examples:
    - "Should I invest in tech stocks right now?"
    - "Explain what is a mutual fund SIP?"
    - "Why is my portfolio health score 67?"
    - "How can I reduce risk in my portfolio?"
    """

    # Get user context
    user_profile = await db.get_user_profile(user_id)
    portfolio = await db.get_portfolio(user_id)
    goals = await db.get_goals(user_id)

    # Load conversation history (last 10 messages)
    if conversation_history is None:
        conversation_history = await db.get_conversation_history(user_id, limit=10)

    # System prompt (defines behavior)
    system_prompt = """
You are Spark AI, an knowledgeable investment advisor assistant for Indian retail investors.

YOUR ROLE:
- Provide educational information about investing
- Explain portfolio metrics and recommendations
- Help users understand market concepts
- Guide users on using the Spark Investment platform
- Answer questions about their portfolio and investments

IMPORTANT CONSTRAINTS:
- You are NOT SEBI registered - include disclaimer when giving investment opinions
- Provide information and education, NOT personalized investment advice
- Encourage users to do their own research and consult registered advisors for major decisions
- Never guarantee returns or promise specific outcomes
- Be transparent about risks
- Use simple language for beginners, technical details when appropriate

TONE:
- Friendly and approachable
- Patient and educational
- Encouraging but realistic
- Professional but not stuffy

INDIAN MARKET CONTEXT:
- Reference Indian exchanges (NSE, BSE)
- Use INR currency (₹)
- Consider Indian tax implications (LTCG, STCG, etc.)
- Reference Indian regulations (SEBI, RBI)
- Use Indian examples and companies

RESPONSE GUIDELINES:
- Keep responses concise (2-4 paragraphs unless detailed explanation needed)
- Use bullet points for lists
- Include relevant numbers and data when available
- Provide actionable insights
- Ask clarifying questions if user intent is unclear
"""

    # User context for personalization
    context_message = f"""
USER CONTEXT (use this to personalize responses):

Profile:
- Age: {user_profile['age']}
- Risk Profile: {user_profile['risk_profile']}
- Investment Experience: {user_profile['experience_level']}

Portfolio:
- Total Value: ₹{portfolio['total_value']:,}
- Number of Holdings: {len(portfolio['holdings'])}
- Current Health Score: {portfolio['health_score']}/100
- Top Sectors: {', '.join(portfolio['top_sectors'][:3])}
- Overall Returns: {portfolio['total_returns_percent']}%

Active Goals:
{format_goals(goals)}

Recent Activity:
- Last investment: {portfolio['last_investment_date']}
- Last transaction: {portfolio['last_transaction']}

Current Market:
- Nifty 50: {market['nifty_current']} ({market['nifty_change']})
- Market Mood: {market['sentiment']}

Use this context to provide relevant, personalized responses.
"""

    # Build messages for Claude
    messages = []

    # Add conversation history
    for msg in conversation_history:
        messages.append({
            "role": msg['role'],  # 'user' or 'assistant'
            "content": msg['content']
        })

    # Add current user message
    messages.append({
        "role": "user",
        "content": message
    })

    # Call Claude API
    response = await anthropic_client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2048,
        temperature=0.7,  # Higher for natural conversation
        system=system_prompt + "\n\n" + context_message,
        messages=messages
    )

    assistant_message = response.content[0].text

    # Save conversation to database
    await db.save_chat_message(
        user_id=user_id,
        role="user",
        content=message,
        timestamp=datetime.now()
    )
    await db.save_chat_message(
        user_id=user_id,
        role="assistant",
        content=assistant_message,
        timestamp=datetime.now()
    )

    # Track usage
    track_llm_usage(
        user_id=user_id,
        model="claude-3.5-sonnet",
        feature="chatbot",
        tokens_input=response.usage.input_tokens,
        tokens_output=response.usage.output_tokens
    )

    return {
        "message": assistant_message,
        "conversation_id": conversation_history[0]['conversation_id'] if conversation_history else generate_conversation_id(),
        "timestamp": datetime.now().isoformat(),
        "model": "claude-3.5-sonnet"
    }
```

**API Endpoint:**
```http
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Why is my portfolio health score only 67? What should I do to improve it?",
  "conversation_id": "uuid" // optional, for continuing conversation
}

Response: 200 OK
{
  "message": "Your portfolio health score of 67 is in the 'Average' range. Here's why and what you can do:\n\n**Main Issues:**\n• **IT sector concentration (32%)** - This is above the recommended 25% limit, increasing your risk if the IT sector faces headwinds\n• **High portfolio beta (1.35)** - Your portfolio is 35% more volatile than the market, which may not align with your moderate risk profile\n• **Limited defensive holdings** - Only 8% in stable sectors like FMCG and Healthcare\n\n**Improvement Actions:**\n1. **Rebalance IT exposure** - Consider selling ₹45,000 worth of IT stocks to bring it down to 25%\n2. **Add defensive sectors** - Invest the proceeds in FMCG (15%) and Healthcare (12%) to reduce volatility\n3. **This could improve your score to 78-82** and reduce risk by ~15%\n\n*Note: This is educational information. For personalized investment advice, consult a SEBI-registered advisor.*\n\nWould you like me to suggest specific stocks for diversification?",
  "conversation_id": "conv_12345",
  "timestamp": "2025-11-13T10:30:00Z"
}
```

**Streaming Response (for better UX):**
```python
async def stream_chat_response(user_id, message):
    """Stream response token by token for real-time feel"""

    # Use streaming API
    async with anthropic_client.messages.stream(
        model="claude-3.5-sonnet-20241022",
        max_tokens=2048,
        system=system_prompt,
        messages=messages
    ) as stream:
        async for text in stream.text_stream:
            yield {
                "type": "content_block_delta",
                "delta": {"text": text}
            }

# Frontend can display tokens as they arrive for better UX
```

**Benefits:**
- ✅ Natural conversation (not rigid Q&A)
- ✅ Context-aware (knows user's portfolio, goals, profile)
- ✅ Educational and helpful
- ✅ SEBI-compliant disclaimers built-in
- ✅ Can handle follow-up questions

**Cost per Message:** ₹0.50-2 (~$0.006-0.024)

---

### 5. Automated Report Generation 🤖 Claude

**Implementation**: LLM-generated quarterly/annual reports

```python
async def generate_portfolio_report(user_id, report_type="quarterly", format="pdf"):
    """
    Generate comprehensive investment report.

    Types: quarterly, annual, goal_progress, tax_summary
    Formats: pdf, markdown, html
    """

    # Gather data
    portfolio_data = await get_comprehensive_portfolio_data(user_id, period=report_type)
    transactions = await db.get_transactions(user_id, period=report_type)
    goals = await db.get_goals_with_progress(user_id)
    market_context = await get_market_summary(period=report_type)

    prompt = f"""
Generate a comprehensive {report_type} investment portfolio report.

PORTFOLIO DATA:
{json.dumps(portfolio_data, indent=2)}

TRANSACTIONS ({len(transactions)} this period):
{format_transactions_summary(transactions)}

FINANCIAL GOALS:
{format_goals(goals)}

MARKET CONTEXT (period):
{json.dumps(market_context, indent=2)}

REPORT STRUCTURE:

# Quarterly Portfolio Report
## Period: {portfolio_data['period_start']} to {portfolio_data['period_end']}

### Executive Summary
[2-3 paragraphs highlighting key performance, major changes, and overall assessment]

### Performance Highlights
- Overall return: [Calculate and explain]
- Best performing holdings: [Top 3 with returns]
- Underperformers: [Bottom 3 with analysis]
- Vs. Benchmark (Nifty 50): [Comparison]
- Risk-adjusted returns: [Sharpe ratio analysis]

### Asset Allocation
[Current allocation breakdown with commentary on any changes]
- Equity: X%
- Debt: Y%
- Cash: Z%

[Pie chart description]

### Sector Exposure
[Detailed sector breakdown with analysis]
[Recommendations for rebalancing if needed]

### Top Holdings Analysis
[Analysis of top 5 holdings - 2-3 sentences each]
1. [Name]: [Performance] - [Brief analysis]

### Transactions Summary
- Total investments: ₹[Amount]
- Number of transactions: [Count]
- Largest transaction: [Details]
- Dividend income: ₹[Amount]

### Goals Progress
[For each goal, show progress and assessment]
Goal: [Name]
- Target: ₹[Amount] by [Date]
- Current: ₹[Amount] ([X]% complete)
- On track: [Yes/No]
- Recommendation: [Action needed]

### Risk Assessment
- Portfolio volatility: [Analysis]
- Risk score: [X/100]
- Maximum drawdown: [Analysis]
- Recommendations: [If any]

### Market Outlook
[2-3 paragraphs on market conditions and implications for portfolio]

### Recommendations for Next Quarter
1. [Specific recommendation]
2. [Specific recommendation]
3. [Specific recommendation]

### Tax Summary (if applicable)
- Realized LTCG: ₹[Amount]
- Realized STCG: ₹[Amount]
- Dividend income: ₹[Amount]
- Estimated tax liability: ₹[Amount]

---
*Report generated by Spark AI on {datetime.now()}*
*This report is for informational purposes only and does not constitute investment advice.*

GUIDELINES:
- Use professional but accessible language
- Include specific numbers and percentages
- Be balanced (highlight both successes and areas for improvement)
- Provide actionable recommendations
- Use Indian market context and terminology
- Format with clear headings and bullet points
- Include appropriate disclaimers

Provide the complete report in Markdown format.
"""

    response = await anthropic_client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=8192,  # Large output for detailed report
        temperature=0.5,
        messages=[{"role": "user", "content": prompt}]
    )

    report_markdown = response.content[0].text

    # Convert to requested format
    if format == "pdf":
        report_output = await convert_markdown_to_pdf(report_markdown, include_charts=True)
    elif format == "html":
        report_output = markdown_to_html(report_markdown)
    else:
        report_output = report_markdown

    # Save report
    report_id = await db.save_report(
        user_id=user_id,
        report_type=report_type,
        content=report_output,
        format=format,
        generated_at=datetime.now()
    )

    return {
        "report_id": report_id,
        "format": format,
        "generated_at": datetime.now().isoformat(),
        "download_url": f"/api/reports/{report_id}/download"
    }
```

**API Endpoint:**
```http
POST /api/ai/reports/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "report_type": "quarterly",
  "format": "pdf"
}

Response: 200 OK
{
  "report_id": "rpt_12345",
  "format": "pdf",
  "generated_at": "2025-11-13T10:30:00Z",
  "download_url": "/api/reports/rpt_12345/download"
}
```

**Benefits:**
- ✅ Professional reports in minutes (vs hours manually)
- ✅ Consistent format and quality
- ✅ Comprehensive analysis with insights
- ✅ Automated scheduling (generate quarterly automatically)

**Cost per Report:** ₹8-15 (~$0.10-0.18)

---

## Custom Models (Still Required)

While LLMs handle language and reasoning tasks excellently, we still need custom models for:

### 1. Price Prediction 📊 LSTM + Attention

**Why LLMs Cannot Replace:**
- ❌ Not designed for time series forecasting
- ❌ Cannot learn numerical patterns in OHLCV data
- ❌ No training on price movement sequences
- ❌ Cannot generate reliable confidence intervals

**Model Architecture:**
```python
class StockPriceLSTM(nn.Module):
    def __init__(self, input_dim=50, hidden_dim=128, num_layers=3, dropout=0.2):
        super().__init__()

        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            dropout=dropout,
            batch_first=True,
            bidirectional=True
        )

        # Attention mechanism
        self.attention = nn.MultiheadAttention(
            embed_dim=hidden_dim * 2,  # Bidirectional
            num_heads=8,
            dropout=dropout
        )

        # Prediction head
        self.fc1 = nn.Linear(hidden_dim * 2, 64)
        self.fc2 = nn.Linear(64, 32)
        self.fc3 = nn.Linear(32, 3)  # price, lower_bound, upper_bound

        self.dropout = nn.Dropout(dropout)
        self.relu = nn.ReLU()

    def forward(self, x):
        # LSTM processing
        lstm_out, _ = self.lstm(x)

        # Attention
        attn_out, _ = self.attention(lstm_out, lstm_out, lstm_out)

        # Take last time step
        last_hidden = attn_out[:, -1, :]

        # Prediction
        x = self.dropout(self.relu(self.fc1(last_hidden)))
        x = self.dropout(self.relu(self.fc2(x)))
        x = self.fc3(x)

        return x  # [predicted_price, lower_ci, upper_ci]
```

**Training Data:**
```yaml
Historical Data Required:
  - 10+ years of daily OHLCV data
  - All NSE/BSE listed stocks (3000+ securities)
  - Corporate actions (splits, bonuses, dividends)
  - Index data (Nifty 50, Sensex, sector indices)

Features (50+ per timestep):
  Price Features:
    - Open, High, Low, Close, Volume
    - Adjusted close
  Technical Indicators:
    - SMA (20, 50, 200)
    - EMA (12, 26)
    - RSI (14)
    - MACD
    - Bollinger Bands
    - ATR
    - ADX
  Market Features:
    - Nifty 50 returns
    - Sector index returns
    - India VIX
    - FII/DII activity
  External:
    - Sentiment score (from LLM)
    - News volume

Lookback Window: 60 days
Prediction Horizons: 1-day, 5-day, 1-month

Update Frequency: Daily (retrain weekly)
```

**Hybrid Approach (Best of Both Worlds):**
```python
async def predict_price_hybrid(symbol, horizon="1d"):
    """
    Combine LSTM prediction with Claude explanation.
    """

    # Step 1: Get numerical prediction from LSTM
    price_data = await get_price_history(symbol, lookback=60)
    technical_indicators = calculate_indicators(price_data)
    sentiment = await get_sentiment_score(symbol)  # From LLM sentiment analysis

    # Prepare features
    features = prepare_features(price_data, technical_indicators, sentiment)

    # LSTM prediction
    with torch.no_grad():
        prediction = lstm_model(features)

    numerical_prediction = {
        "current_price": price_data['close'][-1],
        "predicted_price": prediction[0].item(),
        "confidence_interval": {
            "lower": prediction[1].item(),
            "upper": prediction[2].item()
        },
        "confidence": calculate_confidence(prediction),
        "direction": "up" if prediction[0] > price_data['close'][-1] else "down",
        "change_percent": ((prediction[0] - price_data['close'][-1]) / price_data['close'][-1]) * 100
    }

    # Step 2: Get contextual explanation from Claude
    explanation_prompt = f"""
You are explaining a stock price prediction to an investor.

PREDICTION:
- Stock: {symbol}
- Current Price: ₹{numerical_prediction['current_price']:.2f}
- Predicted Price ({horizon}): ₹{numerical_prediction['predicted_price']:.2f}
- Change: {numerical_prediction['change_percent']:+.2f}%
- Direction: {numerical_prediction['direction'].upper()}
- Confidence: {numerical_prediction['confidence']:.1%}

TECHNICAL CONTEXT:
- RSI: {technical_indicators['rsi'][-1]:.1f}
- MACD: {technical_indicators['macd'][-1]:.2f}
- Price vs 50-day SMA: {technical_indicators['vs_sma50']:.1f}%
- Volume Trend: {technical_indicators['volume_trend']}

MARKET CONTEXT:
- Recent Sentiment: {sentiment['label']} ({sentiment['score']:.2f})
- Nifty 50 Trend: {market['nifty_trend']}

Provide a brief explanation (3-4 sentences):
1. Interpret this prediction in simple terms
2. Key factors supporting this prediction
3. Key risks that could affect accuracy
4. What investors should watch for

Be balanced and realistic. Include standard disclaimer about prediction uncertainty.

Output plain text (not JSON).
"""

    explanation_response = await anthropic_client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=512,
        temperature=0.5,
        messages=[{"role": "user", "content": explanation_prompt}]
    )

    explanation = explanation_response.content[0].text

    return {
        "prediction": numerical_prediction,
        "explanation": explanation,
        "technical_indicators": {
            "rsi": technical_indicators['rsi'][-1],
            "macd": technical_indicators['macd'][-1],
            "trend": technical_indicators['trend']
        },
        "sentiment": sentiment,
        "model": "hybrid_lstm_claude",
        "generated_at": datetime.now().isoformat(),
        "disclaimer": "Predictions are probabilistic estimates, not guarantees. Past performance does not indicate future results."
    }
```

**API Endpoint:**
```http
POST /api/ml/predictions/price
Authorization: Bearer <token>
Content-Type: application/json

{
  "security_id": "INE467B01029",
  "symbol": "TCS",
  "horizons": ["1d", "5d", "1m"]
}

Response: 200 OK
{
  "symbol": "TCS",
  "current_price": 3456.50,
  "predictions": {
    "1d": {
      "price": 3478.20,
      "confidence_interval": [3445.00, 3511.40],
      "confidence": 0.72,
      "change_percent": +0.63
    },
    "5d": {
      "price": 3512.80,
      "confidence_interval": [3398.50, 3627.10],
      "confidence": 0.65,
      "change_percent": +1.63
    },
    "1m": {
      "price": 3598.30,
      "confidence_interval": [3290.00, 3906.60],
      "confidence": 0.58,
      "change_percent": +4.10
    }
  },
  "explanation": "The model predicts a modest upward trend for TCS with 1-day target of ₹3,478 (+0.6%). This is supported by improving RSI (62) and positive MACD crossover, along with positive sentiment from recent earnings. However, high market volatility (VIX at 18) increases uncertainty. Watch for IT sector trends and global macroeconomic news that could impact accuracy.",
  "technical_signals": {
    "rsi": {"value": 62, "signal": "slightly_overbought"},
    "macd": {"value": 12.5, "signal": "bullish_crossover"},
    "trend": "upward"
  },
  "confidence_level": "medium"
}
```

**Infrastructure:**
```yaml
Training:
  - GPU: 1x NVIDIA T4 or A10
  - Training Time: 2 hours (weekly)
  - Framework: PyTorch

Serving:
  - Instances: 2-3 CPU instances
  - Latency: <200ms
  - Cache: Redis (predictions cached for 1 hour)

Cost: ~₹40,000/month
```

---

### 2. Risk Assessment (Quantitative) 📊 Monte Carlo + ML

**Why LLMs Cannot Replace:**
- ❌ Requires precise statistical calculations
- ❌ Monte Carlo simulations (10,000+ scenarios)
- ❌ Probability distributions (VaR, CVaR)
- ❌ Mathematical optimization

**Implementation:**
```python
import numpy as np
from scipy.stats import norm
from scipy.optimize import minimize

class PortfolioRiskAssessor:
    def __init__(self, portfolio, market_data):
        self.portfolio = portfolio
        self.market_data = market_data
        self.num_simulations = 10000

    def calculate_value_at_risk(self, confidence=0.95, time_horizon=252):
        """
        Calculate Value at Risk using historical simulation.
        """
        # Get historical returns
        returns = self.calculate_portfolio_returns()

        # Calculate VaR
        var = np.percentile(returns, (1 - confidence) * 100)

        # Convert to monetary value
        portfolio_value = self.portfolio['total_value']
        var_amount = portfolio_value * var

        return {
            "var_95": var_amount,
            "var_percent": var * 100,
            "confidence": confidence
        }

    def calculate_conditional_var(self, confidence=0.95):
        """
        Calculate Expected Shortfall (CVaR) - average loss beyond VaR.
        """
        returns = self.calculate_portfolio_returns()
        var_threshold = np.percentile(returns, (1 - confidence) * 100)

        # Expected loss beyond VaR
        tail_losses = returns[returns <= var_threshold]
        cvar = np.mean(tail_losses)

        portfolio_value = self.portfolio['total_value']
        cvar_amount = portfolio_value * cvar

        return {
            "cvar_95": cvar_amount,
            "cvar_percent": cvar * 100
        }

    def monte_carlo_simulation(self, time_horizon=252):
        """
        Run Monte Carlo simulation for portfolio scenarios.
        """
        # Get expected returns and covariance matrix
        expected_returns = self.calculate_expected_returns()
        cov_matrix = self.calculate_covariance_matrix()

        # Portfolio weights
        weights = np.array([h['weight'] for h in self.portfolio['holdings']])

        # Simulate returns
        simulated_returns = np.random.multivariate_normal(
            mean=expected_returns * time_horizon,
            cov=cov_matrix * time_horizon,
            size=self.num_simulations
        )

        # Calculate portfolio returns for each simulation
        portfolio_returns = simulated_returns @ weights

        # Calculate ending values
        initial_value = self.portfolio['total_value']
        ending_values = initial_value * (1 + portfolio_returns)

        # Calculate statistics
        results = {
            "simulations": self.num_simulations,
            "time_horizon_days": time_horizon,
            "initial_value": initial_value,
            "expected_final_value": np.mean(ending_values),
            "median_final_value": np.median(ending_values),
            "percentiles": {
                "5th": np.percentile(ending_values, 5),
                "25th": np.percentile(ending_values, 25),
                "75th": np.percentile(ending_values, 75),
                "95th": np.percentile(ending_values, 95)
            },
            "probability_of_loss": np.sum(ending_values < initial_value) / self.num_simulations,
            "max_gain": np.max(ending_values) - initial_value,
            "max_loss": np.min(ending_values) - initial_value,
            "expected_return": (np.mean(ending_values) - initial_value) / initial_value,
            "volatility": np.std(portfolio_returns),
            "sharpe_ratio": self.calculate_sharpe_ratio(portfolio_returns)
        }

        return results

    def stress_test(self, scenarios):
        """
        Test portfolio performance under extreme scenarios.
        """
        results = []

        for scenario in scenarios:
            # Apply scenario (e.g., 2020 COVID crash, 2008 financial crisis)
            scenario_returns = self.apply_scenario(scenario)

            portfolio_impact = self.calculate_portfolio_impact(scenario_returns)

            results.append({
                "scenario": scenario['name'],
                "probability": scenario.get('probability', 'Unknown'),
                "portfolio_impact_percent": portfolio_impact,
                "portfolio_impact_amount": self.portfolio['total_value'] * portfolio_impact,
                "recovery_time_estimate": scenario.get('recovery_time', 'Unknown')
            })

        return results

async def assess_portfolio_risk_hybrid(portfolio_id):
    """
    Hybrid approach: Quantitative risk calculation + Claude explanation.
    """

    # Step 1: Calculate precise risk metrics
    portfolio = await db.get_portfolio(portfolio_id)
    market_data = await get_market_data()

    assessor = PortfolioRiskAssessor(portfolio, market_data)

    risk_metrics = {
        "var": assessor.calculate_value_at_risk(confidence=0.95),
        "cvar": assessor.calculate_conditional_var(confidence=0.95),
        "monte_carlo": assessor.monte_carlo_simulation(time_horizon=252),
        "stress_tests": assessor.stress_test([
            {"name": "2020_covid_crash", "returns": get_covid_crash_returns(), "recovery_time": "6-9 months"},
            {"name": "2008_financial_crisis", "returns": get_2008_crisis_returns(), "recovery_time": "18-24 months"},
            {"name": "10_percent_market_correction", "probability": 0.15, "recovery_time": "3-6 months"}
        ])
    }

    # Step 2: Get LLM explanation
    explanation_prompt = f"""
Explain these portfolio risk metrics to a retail investor in simple terms.

PORTFOLIO:
- Total Value: ₹{portfolio['total_value']:,}
- Risk Profile: {portfolio['risk_profile']}
- Investment Horizon: {portfolio['investment_horizon']} years

RISK METRICS:
- Value at Risk (95%): ₹{abs(risk_metrics['var']['var_95']):,.0f} ({risk_metrics['var']['var_percent']:.1f}%)
  [Meaning: 95% confident losses won't exceed this amount in a year]

- Conditional VaR (95%): ₹{abs(risk_metrics['cvar']['cvar_95']):,.0f} ({risk_metrics['cvar']['cvar_percent']:.1f}%)
  [Meaning: Average loss in the worst 5% of scenarios]

- Probability of Loss (1-year): {risk_metrics['monte_carlo']['probability_of_loss']:.1%}

- Expected Return (1-year): {risk_metrics['monte_carlo']['expected_return']:.1%}

- Volatility: {risk_metrics['monte_carlo']['volatility']:.1%}

- Sharpe Ratio: {risk_metrics['monte_carlo']['sharpe_ratio']:.2f}

STRESS TEST RESULTS:
{format_stress_tests(risk_metrics['stress_tests'])}

Provide:
1. **Plain English Explanation** (2-3 sentences explaining what these numbers mean)
2. **Risk Assessment** (Is this risk level appropriate for a {portfolio['risk_profile']} investor?)
3. **Key Risks** (What are the main risks this portfolio faces?)
4. **Recommendations** (2-3 specific actions to reduce risk if needed)

Keep it concise and actionable. Use simple analogies if helpful.

Output in this JSON format:
{{
  "plain_english": "<explanation>",
  "risk_assessment": "<assessment>",
  "risk_rating": "<low|medium|high|very_high>",
  "key_risks": ["<risk1>", "<risk2>", "<risk3>"],
  "recommendations": [
    {{"action": "<action>", "expected_impact": "<impact>"}}
  ]
}}
"""

    explanation_response = await anthropic_client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1536,
        temperature=0.4,
        messages=[{"role": "user", "content": explanation_prompt}]
    )

    explanation = json.loads(explanation_response.content[0].text)

    return {
        "metrics": risk_metrics,
        "explanation": explanation,
        "model": "hybrid_montecarlo_claude",
        "generated_at": datetime.now().isoformat()
    }
```

**API Response:**
```http
POST /api/ml/risk/assess
Authorization: Bearer <token>
Content-Type: application/json

{
  "portfolio_id": "uuid"
}

Response: 200 OK
{
  "metrics": {
    "var_95": -42500,
    "cvar_95": -61200,
    "probability_of_loss_1y": 0.28,
    "expected_return_1y": 0.142,
    "volatility": 0.185,
    "sharpe_ratio": 0.77
  },
  "explanation": {
    "plain_english": "Based on historical patterns, there's a 95% chance your losses won't exceed ₹42,500 (8.5%) in the next year. In the worst 5% of scenarios, average loss would be ₹61,200 (12.2%). Overall, you have a 28% chance of losing money over the year, but expected return is positive at 14.2%.",
    "risk_assessment": "This risk level is MODERATE-HIGH and slightly above what's typically recommended for a moderate risk investor. Your portfolio volatility of 18.5% is higher than the market average of 15%.",
    "risk_rating": "medium_high",
    "key_risks": [
      "High IT sector concentration (32%) creates single-sector dependency",
      "Portfolio beta of 1.35 means you'll experience 35% more volatility than the market",
      "Limited defensive holdings mean portfolio is vulnerable in market downturns"
    ],
    "recommendations": [
      {
        "action": "Reduce IT sector exposure from 32% to 25% by selling ₹35,000 worth",
        "expected_impact": "Reduce portfolio volatility by ~12% and VaR by ~8%"
      },
      {
        "action": "Add defensive sectors (FMCG, Pharma, Utilities) totaling 20% of portfolio",
        "expected_impact": "Improve downside protection by ~15% in market corrections"
      },
      {
        "action": "Consider adding 10-15% debt allocation for stability",
        "expected_impact": "Reduce overall portfolio volatility by ~20%"
      }
    ]
  }
}
```

**Infrastructure:**
```yaml
Computation:
  - CPU instances (no GPU needed)
  - 4 vCPUs, 16GB RAM per instance
  - Parallel processing for simulations

Latency:
  - Calculation: ~2-3 seconds
  - With caching: <100ms

Cost: ~₹20,000/month
```

---

### 3. Auto-Invest Strategy Optimization 🤖 Reinforcement Learning

**Why LLMs Cannot Replace:**
- ❌ Requires learning from trial and error
- ❌ Mathematical optimization problem
- ❌ Real-time decision making based on state
- ❌ Needs to balance multiple objectives (return, risk, diversification, cost)

**Model Architecture:**
```python
from stable_baselines3 import PPO
from gym import Env, spaces
import numpy as np

class InvestmentEnvironment(Env):
    """
    Custom Gym environment for auto-invest strategy optimization.
    """

    def __init__(self, user_constraints, market_data):
        super().__init__()

        self.user_constraints = user_constraints
        self.market_data = market_data

        # State space: portfolio + market + user context
        self.observation_space = spaces.Box(
            low=-np.inf,
            high=np.inf,
            shape=(100,),  # 100 features
            dtype=np.float32
        )

        # Action space: allocation changes for each security
        max_securities = 20
        self.action_space = spaces.Box(
            low=-1.0,  # Max sell
            high=1.0,   # Max buy
            shape=(max_securities,),
            dtype=np.float32
        )

    def reset(self):
        """Reset to initial portfolio state."""
        self.current_step = 0
        self.portfolio = self.initialize_portfolio()
        return self.get_state()

    def step(self, action):
        """
        Execute action (rebalance portfolio) and return new state, reward.
        """
        # Apply action (buy/sell)
        self.portfolio = self.apply_action(action)

        # Calculate reward
        reward = self.calculate_reward()

        # Check if episode done
        done = self.current_step >= self.max_steps

        # Get new state
        state = self.get_state()

        self.current_step += 1

        return state, reward, done, {}

    def calculate_reward(self):
        """
        Reward function balancing multiple objectives.
        """
        # Portfolio return
        returns = self.calculate_portfolio_returns()

        # Risk (volatility)
        risk = self.calculate_portfolio_risk()

        # Diversification (Herfindahl index)
        diversification = self.calculate_diversification_score()

        # Transaction costs
        transaction_costs = self.calculate_transaction_costs()

        # Alignment with target allocation
        deviation = self.calculate_deviation_from_target()

        # Weighted reward
        reward = (
            0.4 * returns               # 40% weight on returns
            - 0.2 * risk                # 20% penalty for risk
            + 0.2 * diversification     # 20% reward for diversification
            - 0.1 * transaction_costs   # 10% penalty for costs
            - 0.1 * deviation           # 10% penalty for deviation
        )

        return reward

# Training the RL agent
def train_auto_invest_agent():
    """
    Train reinforcement learning agent for auto-invest optimization.
    """

    env = InvestmentEnvironment(
        user_constraints=default_constraints,
        market_data=historical_market_data
    )

    # PPO (Proximal Policy Optimization) agent
    model = PPO(
        policy="MlpPolicy",
        env=env,
        learning_rate=3e-4,
        n_steps=2048,
        batch_size=64,
        n_epochs=10,
        gamma=0.99,
        gae_lambda=0.95,
        clip_range=0.2,
        verbose=1,
        tensorboard_log="./ppo_autoinvest_tensorboard/"
    )

    # Train for 1 million timesteps
    model.learn(total_timesteps=1_000_000)

    # Save model
    model.save("auto_invest_ppo_v1")

    return model

# Using the trained agent
async def optimize_auto_invest_strategy_hybrid(strategy_id):
    """
    Hybrid: RL optimization + Claude explanation.
    """

    # Get strategy and portfolio
    strategy = await db.get_auto_invest_strategy(strategy_id)
    portfolio = await db.get_portfolio(strategy['user_id'])
    market_state = await get_current_market_state()

    # Step 1: RL agent optimizes allocation
    env = InvestmentEnvironment(strategy['constraints'], market_state)
    state = env.get_state_from_portfolio(portfolio)

    # Load trained model
    rl_agent = PPO.load("auto_invest_ppo_v1")

    # Get optimal action
    action, _states = rl_agent.predict(state, deterministic=True)

    # Convert action to allocation
    optimal_allocation = env.action_to_allocation(action)

    # Calculate expected performance
    expected_performance = await backtest_allocation(optimal_allocation, days=252)

    # Step 2: Claude explains the strategy
    explanation_prompt = f"""
Explain this auto-invest strategy to the user in simple terms.

RECOMMENDED ALLOCATION:
{format_allocation(optimal_allocation)}

EXPECTED PERFORMANCE (1-year):
- Annual Return: {expected_performance['annual_return']:.1f}%
- Volatility: {expected_performance['volatility']:.1f}%
- Sharpe Ratio: {expected_performance['sharpe_ratio']:.2f}
- Max Drawdown: {expected_performance['max_drawdown']:.1f}%

USER'S GOALS:
{format_goals(strategy['goals'])}

USER CONSTRAINTS:
- Risk Tolerance: {strategy['risk_tolerance']}
- Investment Horizon: {strategy['time_horizon']} years
- Monthly Investment: ₹{strategy['monthly_amount']:,}

CURRENT PORTFOLIO:
{format_portfolio_summary(portfolio)}

Provide:
1. **Strategy Summary** (2-3 sentences explaining the allocation strategy)
2. **Why This Works** (Explain how it aligns with goals and constraints)
3. **Expected Outcomes** (What to expect in terms of returns and risk)
4. **Rebalancing Plan** (When and how rebalancing will happen)
5. **Risks to Consider** (2-3 key risks)

Be encouraging but realistic. Output JSON:
{{
  "strategy_summary": "<summary>",
  "rationale": "<explanation>",
  "expected_outcomes": "<outcomes>",
  "rebalancing_plan": "<plan>",
  "risks": ["<risk1>", "<risk2>", "<risk3>"]
}}
"""

    explanation_response = await anthropic_client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1536,
        temperature=0.5,
        messages=[{"role": "user", "content": explanation_prompt}]
    )

    explanation = json.loads(explanation_response.content[0].text)

    return {
        "optimal_allocation": optimal_allocation,
        "expected_performance": expected_performance,
        "rebalancing_schedule": {
            "frequency": "monthly",
            "next_rebalance": calculate_next_rebalance_date(),
            "estimated_cost": estimate_rebalancing_cost(optimal_allocation, portfolio)
        },
        "explanation": explanation,
        "model": "hybrid_rl_claude",
        "confidence": 0.82
    }
```

**Infrastructure:**
```yaml
Training:
  - GPU: 1x NVIDIA T4 (for faster training)
  - Training Time: 24-48 hours
  - Framework: Stable-Baselines3 (PyTorch)
  - Update Frequency: Monthly with new data

Serving:
  - CPU instances for inference
  - Latency: <1 second

Cost: ~₹50,000/month
```

---

## LLM Integration Specifications

### API Configuration

**Anthropic Claude:**
```python
import anthropic

# Initialize client
anthropic_client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

# Standard configuration
CLAUDE_CONFIG = {
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 4096,  # Adjust based on use case
    "temperature": 0.3,  # Lower for consistency, higher for creativity
}

# Cost tracking
CLAUDE_PRICING = {
    "input_tokens": 3.00 / 1_000_000,   # $3 per million
    "output_tokens": 15.00 / 1_000_000,  # $15 per million
}

def calculate_claude_cost(usage):
    input_cost = usage.input_tokens * CLAUDE_PRICING['input_tokens']
    output_cost = usage.output_tokens * CLAUDE_PRICING['output_tokens']
    return (input_cost + output_cost) * INR_PER_USD  # Convert to INR
```

**OpenAI GPT:**
```python
from openai import OpenAI

# Initialize client
openai_client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

# Standard configuration
GPT_CONFIG = {
    "model": "gpt-4-turbo",
    "temperature": 0.3,
    "max_tokens": 4096,
}

# Cost tracking
GPT_PRICING = {
    "gpt-4-turbo": {
        "input_tokens": 10.00 / 1_000_000,
        "output_tokens": 30.00 / 1_000_000,
    },
    "gpt-3.5-turbo": {
        "input_tokens": 0.50 / 1_000_000,
        "output_tokens": 1.50 / 1_000_000,
    }
}
```

### Response Caching Strategy

```python
import hashlib
import json
from redis import Redis

redis_client = Redis(
    host='localhost',
    port=6379,
    db=0,
    decode_responses=True
)

async def get_cached_llm_response(prompt, model, cache_key_suffix="", ttl=3600):
    """
    Cache LLM responses to reduce costs and improve latency.

    Args:
        prompt: The prompt to send to LLM
        model: Model name (claude/gpt)
        cache_key_suffix: Additional context for cache key
        ttl: Time to live in seconds (default 1 hour)
    """

    # Generate cache key
    prompt_hash = hashlib.sha256(
        f"{model}:{prompt}:{cache_key_suffix}".encode()
    ).hexdigest()

    cache_key = f"llm:cache:{model}:{prompt_hash}"

    # Try cache first
    cached = redis_client.get(cache_key)
    if cached:
        logger.info(f"LLM cache HIT for {cache_key[:20]}...")
        return json.loads(cached), True  # (response, from_cache)

    # Cache miss - call LLM
    logger.info(f"LLM cache MISS for {cache_key[:20]}...")
    return None, False

async def set_llm_cache(prompt, model, response, cache_key_suffix="", ttl=3600):
    """Store LLM response in cache."""
    prompt_hash = hashlib.sha256(
        f"{model}:{prompt}:{cache_key_suffix}".encode()
    ).hexdigest()

    cache_key = f"llm:cache:{model}:{prompt_hash}"

    redis_client.setex(
        cache_key,
        ttl,
        json.dumps(response)
    )

# Usage example
async def analyze_portfolio_with_cache(portfolio_data):
    prompt = generate_portfolio_prompt(portfolio_data)

    # Check cache
    cached_response, from_cache = await get_cached_llm_response(
        prompt=prompt,
        model="claude",
        cache_key_suffix=f"portfolio_{portfolio_data['id']}",
        ttl=3600  # 1 hour
    )

    if from_cache:
        return cached_response

    # Call Claude API
    response = await anthropic_client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )

    parsed_response = json.loads(response.content[0].text)

    # Cache the response
    await set_llm_cache(
        prompt=prompt,
        model="claude",
        response=parsed_response,
        cache_key_suffix=f"portfolio_{portfolio_data['id']}",
        ttl=3600
    )

    return parsed_response
```

**Caching Strategy:**
```yaml
Portfolio Health Analysis:
  TTL: 1 hour
  Invalidate on: Portfolio changes

Investment Recommendations:
  TTL: 1 hour
  Invalidate on: Filter changes, portfolio changes

Sentiment Analysis:
  TTL: 1 hour
  Invalidate on: New articles published

Chatbot Responses:
  TTL: None (don't cache - personalized conversations)

Reports:
  TTL: 24 hours
  Invalidate on: Portfolio changes

Price Predictions:
  TTL: 1 hour
  Invalidate on: Model updates

Risk Assessment:
  TTL: 12 hours
  Invalidate on: Portfolio changes
```

---

## Prompt Engineering Guidelines

### 1. Structured Prompts for Consistency

```python
# GOOD: Structured with clear sections
PORTFOLIO_ANALYSIS_TEMPLATE = """
You are an expert investment portfolio analyst for Indian retail investors.

TASK: {task_description}

INPUT DATA:
{input_data_json}

OUTPUT FORMAT:
{expected_output_format}

CONSTRAINTS:
{constraints_list}

IMPORTANT GUIDELINES:
{guidelines_list}

Provide ONLY the requested output format, no additional text.
"""

# BAD: Vague and unstructured
bad_prompt = "Analyze this portfolio and tell me if it's good"
```

### 2. Few-Shot Learning

```python
def build_prompt_with_examples(task, input_data):
    """
    Include examples to improve output quality.
    """

    prompt = f"""
{task_description}

EXAMPLE 1:
Input: {example1_input}
Output: {example1_output}

EXAMPLE 2:
Input: {example2_input}
Output: {example2_output}

NOW YOUR TURN:
Input: {input_data}
Output:
"""
    return prompt
```

### 3. Output Format Enforcement

```python
# Use JSON mode for structured output
response = await anthropic_client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=2048,
    messages=[{"role": "user", "content": prompt}],
    # Note: Claude doesn't have explicit JSON mode, but responds well to JSON format requests
)

# For GPT-4:
response = await openai_client.chat.completions.create(
    model="gpt-4-turbo",
    messages=[{"role": "user", "content": prompt}],
    response_format={"type": "json_object"}  # Enforces JSON
)
```

### 4. Prompt Versioning & A/B Testing

```python
class PromptTemplate:
    def __init__(self, feature, version, template, description=""):
        self.feature = feature
        self.version = version
        self.template = template
        self.description = description
        self.created_at = datetime.now()

    def render(self, **kwargs):
        """Render template with provided data."""
        return self.template.format(**kwargs)

# Store prompts in database
await db.save_prompt_template(
    feature="portfolio_analysis",
    version="v2.1",
    template=PORTFOLIO_ANALYSIS_TEMPLATE,
    description="Added risk assessment section"
)

# A/B testing
async def get_prompt_for_user(feature, user_id):
    """
    Return appropriate prompt version based on A/B test assignment.
    """
    # Check if user is in A/B test
    test_group = await get_ab_test_group(user_id, feature)

    if test_group == "A":
        return await db.get_prompt_template(feature, version="v2.0")
    elif test_group == "B":
        return await db.get_prompt_template(feature, version="v2.1")
    else:
        # Default to latest stable
        return await db.get_prompt_template(feature, version="latest")

# Track performance
await track_prompt_performance(
    prompt_version="v2.1",
    feature="portfolio_analysis",
    user_satisfaction=4.5,  # From user feedback
    response_time=1.2,  # seconds
    user_id=user_id
)
```

---

## Cost Summary

### Monthly Cost Estimate (10,000 Active Users)

**LLM API Costs:**
```yaml
Claude API:
  Portfolio Analysis: 100,000 requests/month
    - Avg tokens: 2000 input + 1500 output
    - Cost: 100K × (2000×$3 + 1500×$15) / 1M = $2,550
    - INR: ₹2,12,900

  Recommendations: 50,000 requests/month
    - Avg tokens: 3000 input + 2000 output
    - Cost: 50K × (3000×$3 + 2000×$15) / 1M = $1,950
    - INR: ₹1,62,750

  Sentiment Analysis: 100,000 requests/month
    - Avg tokens: 1500 input + 800 output
    - Cost: 100K × (1500×$3 + 800×$15) / 1M = $1,650
    - INR: ₹1,37,775

  Chatbot: 200,000 messages/month
    - Avg tokens: 800 input + 400 output
    - Cost: 200K × (800×$3 + 400×$15) / 1M = $1,680
    - INR: ₹1,40,280

  Claude Total: ₹6,53,705/month

GPT-4 API:
  Social Sentiment: 100,000 requests/month
    - Avg tokens: 1000 input + 500 output
    - Cost: 100K × (1000×$10 + 500×$30) / 1M = $2,500
    - INR: ₹2,08,750

  GPT Total: ₹2,08,750/month

With 70% Cache Hit Rate:
  Claude: ₹6,53,705 × 0.3 = ₹1,96,112
  GPT: ₹2,08,750 × 0.3 = ₹62,625

LLM Total: ₹2,58,737/month
```

**Custom Models:**
```yaml
Price Prediction (LSTM):
  GPU Training: ₹25,000/month
  CPU Serving: ₹15,000/month
  Total: ₹40,000/month

Risk Assessment (Monte Carlo):
  CPU Compute: ₹20,000/month

Auto-Invest (RL):
  GPU Training: ₹30,000/month
  CPU Serving: ₹10,000/month
  Total: ₹40,000/month

Custom Models Total: ₹1,00,000/month
```

**Infrastructure:**
```yaml
Redis Cache: ₹20,000/month
PostgreSQL: ₹30,000/month
Monitoring: ₹10,000/month
CDN/S3: ₹15,000/month

Infrastructure Total: ₹75,000/month
```

**GRAND TOTAL: ₹4,33,737/month (~₹52 lakhs/year)**

**Comparison with Full Custom ML:**
- Full Custom: ₹6,26,500/month (₹75 lakhs/year)
- Hybrid Approach: ₹4,33,737/month (₹52 lakhs/year)
- **Savings: ₹1,92,763/month (₹23 lakhs/year) - 31% cost reduction**

---

## Implementation Timeline

### Phase 1: LLM Integration (Month 1) ✅

**Week 1-2: Setup & Infrastructure**
- Set up Anthropic API account
- Set up OpenAI API account
- Implement API wrapper services
- Set up Redis caching layer
- Implement rate limiting and monitoring

**Week 3-4: Core Features**
- Portfolio health analysis (Claude)
- Investment recommendations (Claude + filtering)
- AI chatbot (Claude)
- Basic sentiment analysis (Claude + GPT-4)

**Deliverables:**
- Working portfolio insights with caching
- Recommendation engine with explanations
- AI assistant chat with conversation history
- Sentiment dashboard

### Phase 2: Custom Models (Month 2) ✅

**Week 1-2: Price Prediction**
- Collect and preprocess historical price data
- Train LSTM model
- Deploy model server
- Integrate with Claude for explanations

**Week 3-4: Risk & Optimization**
- Implement Monte Carlo risk model
- Build basic auto-invest RL agent
- Integrate with Claude for explanations

**Deliverables:**
- Price predictions with confidence intervals
- Risk assessment with plain-English explanations
- Auto-invest strategy optimizer (basic version)

### Phase 3: Polish & Production (Month 3) ✅

**Week 1-2: Optimization**
- Prompt engineering refinement
- Response caching optimization
- A/B testing framework for prompts
- Performance tuning

**Week 3-4: Production Ready**
- Load testing (simulate 10,000 users)
- Security audit (prompt injection prevention)
- Cost optimization
- Comprehensive monitoring dashboards
- Documentation

**Deliverables:**
- Production-ready system
- Complete documentation
- Monitoring and alerting
- Cost optimization implemented

---

## Conclusion

### ✅ Hybrid Approach Benefits

**Using Claude + ChatGPT APIs for language/reasoning tasks and custom models for numerical/statistical tasks provides:**

1. **⏱️ 60% Faster Time to Market**
   - 2-3 months vs 6-8 months
   - No need to train most models from scratch
   - Focus on integration, not research

2. **💰 31% Cost Reduction**
   - ₹4.3L/month vs ₹6.3L/month
   - Smaller team required
   - Less infrastructure needed

3. **👥 Smaller Team**
   - 3-4 people vs 6-8 people
   - 1-2 Backend Engineers
   - 1 ML Engineer (for custom models)
   - 1 Prompt Engineer

4. **🚀 Better Quality**
   - World-class LLMs (Claude, GPT-4)
   - Natural language explanations
   - Better reasoning capabilities
   - Regular updates from Anthropic/OpenAI

5. **🔧 Easier Maintenance**
   - Prompt updates vs model retraining
   - Instant improvements
   - No complex MLOps for LLM features

### ⚠️ Trade-offs to Consider

1. **API Dependency**
   - Mitigate with fallbacks and caching
   - Monitor API uptime carefully

2. **Variable Costs**
   - Scales with usage
   - Mitigate with aggressive caching (70% hit rate)

3. **Prompt Engineering Skill**
   - Hire or train prompt engineers
   - Build prompt versioning system

### 🎯 Recommendation

**Proceed with Hybrid Approach:**
- Use Claude + ChatGPT for all language/reasoning tasks (62.5% of features)
- Build custom models only for specialized numerical tasks (37.5% of features)
- Implement aggressive caching (target 70% cache hit rate)
- Start with Phase 1 (LLM integration) for fastest MVP

---

**Document Version**: 2.0 (LLM-Integrated)
**Status**: Ready for Implementation
**Estimated Implementation**: 2-3 months
**Estimated Cost**: ₹4.3L/month (~₹52L/year)

