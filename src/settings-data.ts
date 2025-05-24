export const MODEL_SPECS = {
	"gpt-4.1": {
		displayText: "GPT 4.1",
		maxOutputTokens: 32_768,
		costPerMillionTokens: { input: 2.0, output: 8.0 },
		info: {
			intelligence: 4,
			speed: 3,
			url: "https://platform.openai.com/docs/models/gpt-4.1",
		},
	},
	"gpt-4.1-mini": {
		displayText: "GPT 4.1 mini",
		maxOutputTokens: 32_768,
		costPerMillionTokens: { input: 0.4, output: 1.6 },
		info: {
			intelligence: 3,
			speed: 4,
			url: "https://platform.openai.com/docs/models/gpt-4.1-mini",
		},
	},
	"gpt-4.1-nano": {
		displayText: "GPT 4.1 nano",
		maxOutputTokens: 32_768,
		costPerMillionTokens: { input: 0.1, output: 0.4 },
		info: {
			intelligence: 2,
			speed: 5,
			url: "https://platform.openai.com/docs/models/gpt-4.1-nano",
		},
	},
	// Gemini models
	"gemini-2.5-flash-preview-04-17": {
		displayText: "Gemini 2.5 Flash",
		maxOutputTokens: 8192,
		costPerMillionTokens: { input: 0.5, output: 1.5 },
		info: {
			intelligence: 3,
			speed: 5,
			url: "https://ai.google.dev/models/gemini",
		},
	},
	"gemini-2.5-pro-preview-05-06": {
		displayText: "Gemini 2.5 Pro",
		maxOutputTokens: 8192,
		costPerMillionTokens: { input: 3.5, output: 10.5 },
		info: {
			intelligence: 4,
			speed: 4,
			url: "https://ai.google.dev/models/gemini",
		},
	},
};

export type OpenAiModels = "gpt-4.1" | "gpt-4.1-mini" | "gpt-4.1-nano";
export type GeminiModels = "gemini-2.5-pro-preview-05-06" | "gemini-2.5-flash-preview-04-17";

export type SupportedModels = OpenAiModels | GeminiModels;

// Maps friendly Gemini model names to API model IDs
export const GEMINI_MODEL_ID_MAP: Record<string, string> = {
	"gemini-2.5-pro": "gemini-2.5-pro-preview-05-06",
	"gemini-2.5-flash": "gemini-2.5-flash-preview-04-17",
	"gemini-2.5-pro-preview-05-06": "gemini-2.5-pro-preview-05-06",
	"gemini-2.5-flash-preview-04-17": "gemini-2.5-flash-preview-04-17",
};
//──────────────────────────────────────────────────────────────────────────────

export interface TextTransformerPrompt {
	id: string; // unique identifier
	name: string; // display name
	text: string; // the prompt text
	isDefault: boolean; // true for default prompts
	enabled: boolean; // if this prompt is active
    model?: SupportedModels; // Optional: Specific model for this prompt
    temperature?: number; // Optional: Specific temperature for this prompt
    frequency_penalty?: number; // Optional: Specific frequency_penalty for this prompt
    presence_penalty?: number; // Optional: Specific presence_penalty for this prompt
    max_tokens?: number; // Optional: Specific max_tokens for this prompt
    showInPromptPalette?: boolean; // Should this prompt appear in the palette?
}

export type GeminiHarmCategory = 
	| "HARM_CATEGORY_HARASSMENT" 
	| "HARM_CATEGORY_HATE_SPEECH" 
	| "HARM_CATEGORY_SEXUALLY_EXPLICIT" 
	| "HARM_CATEGORY_DANGEROUS_CONTENT";

export type GeminiHarmBlockThreshold = 
	| "BLOCK_NONE" 
	| "BLOCK_ONLY_HIGH" 
	| "BLOCK_MEDIUM_AND_ABOVE" 
	| "BLOCK_LOW_AND_ABOVE";

export interface GeminiSafetySetting {
	category: GeminiHarmCategory;
	threshold: GeminiHarmBlockThreshold;
}

export interface TextTransformerSettings {
	openAiApiKey: string;
	geminiApiKey: string;
	model: SupportedModels; // Default model for the plugin
	prompts: TextTransformerPrompt[]; // All prompts (default + custom)
	defaultPromptId: string | null; // ID of the default prompt for full document
	alwaysShowPromptSelection: boolean; // Always show prompt selection modal even if only one enabled
	dynamicContextLineCount: number;
	translationLanguage: string;
	longInputThreshold: number;
	veryLongInputThreshold: number;
    temperature: number; // Default temperature
    frequency_penalty: number; // Default frequency_penalty
    presence_penalty: number; // Default presence_penalty
    max_tokens: number; // Default max_tokens
	geminiSafetySettings?: GeminiSafetySetting[]; // Optional: Advanced Gemini safety settings
}

export const DEFAULT_SETTINGS: TextTransformerSettings = {
	openAiApiKey: "",
	geminiApiKey: "",
	model: "gpt-4.1-nano",
	prompts: [], // Will be populated after its own definition
	defaultPromptId: "improve", // Default to the "Improve" prompt
	alwaysShowPromptSelection: false,
	dynamicContextLineCount: 3, 
	translationLanguage: "English",
	longInputThreshold: 1500,
	veryLongInputThreshold: 15000,
    temperature: 0.7, // Default temperature
    frequency_penalty: 0, // Default frequency_penalty
    presence_penalty: 0, // Default presence_penalty
    max_tokens: 2048, // Default max_tokens
	geminiSafetySettings: [ // Default safety settings: block medium and above
		{ category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
		{ category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
		{ category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
		{ category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
	],
};

export const DEFAULT_TEXT_TRANSFORMER_PROMPTS: TextTransformerPrompt[] = [
	{
		id: "improve",
		name: "Improve",
		text: "Act as a professional editor. Please make suggestions how to improve clarity, readability, grammar, and language of the following text. Preserve the original meaning and any technical jargon. Suggest structural changes only if they significantly improve flow or understanding. Avoid unnecessary expansion or major reformatting (e.g., no unwarranted lists). Try to make as little changes as possible, refrain from doing any changes when the writing is already sufficiently clear and concise. Output only the revised text and nothing else. The text is:",
		isDefault: true,
		enabled: true,
        showInPromptPalette: true,
	},
	{
		id: "shorten",
		name: "Shorten",
		text: "Act as a professional editor. Shorten the following text while preserving its meaning and clarity. Output only the revised text and nothing else. The text is:",
		isDefault: true,
		enabled: true,
        showInPromptPalette: true,
	},
	{
		id: "lengthen",
		name: "Lengthen",
		text: "Act as a professional editor. Expand and elaborate the following text for greater detail and depth, but do not add unrelated information. Output only the revised text and nothing else. The text is:",
		isDefault: true,
		enabled: true,
        showInPromptPalette: true,
	},
	{
		id: "fix-grammar",
		name: "Fix grammar",
		text: "Act as a professional proofreader. Correct any grammatical, spelling, or punctuation errors in the following text. Output only the revised text and nothing else. The text is:",
		isDefault: true,
		enabled: true,
        showInPromptPalette: true,
	},
	{
		id: "simplify-language",
		name: "Simplify language",
		text: "Act as a professional editor. Rewrite the following text in simpler language, making it easier to understand while preserving the original meaning. Output only the revised text and nothing else. The text is:",
		isDefault: true,
		enabled: true,
        showInPromptPalette: true,
	},
	{
		id: "enhance-readability",
		name: "Enhance readability",
		text: "Act as a professional editor. Improve the readability and flow of the following text. Output only the revised text and nothing else. The text is:",
		isDefault: true,
		enabled: true,
        showInPromptPalette: true,
	},
	{
		id: "mind-the-context",
		name: "Mind the Context!",
		text: "Act as a professional editor. You will receive a text selection, and a context. Do to the text whatever the context says, strictly. Output only the revised text and nothing else. The text is:",
		isDefault: true,
		enabled: true,
        showInPromptPalette: true,
	},
	{
		id: "translate",
		name: `Translate to ${DEFAULT_SETTINGS.translationLanguage}—autodetects source language`,
		text: "Act as a professional translator. Automatically detect language and translate the following text to {language}, preserving meaning, tone, format and style. Output only the translated text and nothing else. The text is:",
		isDefault: true,
		enabled: true,
        showInPromptPalette: true,
	},
];

// Assign DEFAULT_TEXT_TRANSFORMER_PROMPTS to DEFAULT_SETTINGS.prompts after definition
DEFAULT_SETTINGS.prompts = DEFAULT_TEXT_TRANSFORMER_PROMPTS.map((p) => ({ ...p }));