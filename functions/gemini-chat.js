const fs = require('fs').promises;
const path = require('path');

async function callGeminiAPI(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        // This provides a clear error message if the API key is missing.
        return "عذراً، خدمة المساعد الذكي غير متاحة حالياً بسبب مشكلة في الإعدادات.";
    }

    const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ]
    };

    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Gemini API Error:", errorBody);
            throw new Error(`Gemini API error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts[0].text) {
            console.warn("Invalid response structure from Gemini API:", data);
            throw new Error("Received an invalid response from the AI assistant.");
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Return a user-friendly error message in Arabic
        return "عفواً، أواجه صعوبة في الاتصال حالياً. الرجاء المحاولة مرة أخرى بعد قليل.";
    }
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { message, history } = JSON.parse(event.body);

        // Define paths to data files. This assumes the function is run from the project root's /functions directory.
        const productsPath = path.resolve(process.cwd(), 'data/products.json');
        const faqPath = path.resolve(process.cwd(), 'data/faq.json');

        const productsData = await fs.readFile(productsPath, 'utf-8');
        const faqData = await fs.readFile(faqPath, 'utf-8');

        // Construct the prompt for Gemini
        const prompt = `
            You are a helpful and friendly customer service assistant for "Al Fahd Seafood", a premium seafood supplier.
            Your name is "Fahd Bot".
            Respond ONLY in Arabic.
            Your answers must be grounded in the information provided below. Do not make up information.
            If the user asks something you don't know, politely say you don't have the information and offer to connect them with a human agent via WhatsApp.

            Here is the available product information:
            ${productsData}

            Here are frequently asked questions and their answers:
            ${faqData}

            ---
            Conversation History:
            ${history.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}
            ---

            New User Message:
            user: ${message}

            Your response (in Arabic):
        `;

        // Call the Gemini API (simulated)
        const botResponse = await callGeminiAPI(prompt);

        // Return the response
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reply: botResponse }),
        };

    } catch (error) {
        console.error('Error in gemini-chat function:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Sorry, I am having trouble connecting. Please try again in a moment.' }),
        };
    }
};
