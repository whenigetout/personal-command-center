// For Emotion:
export const emotionOptions = [
    { value: "neutral", label: "Neutral" },
    { value: "happy", label: "Happy" },
    { value: "sad", label: "Sad" },
    { value: "angry", label: "Angry" },
    { value: "excited", label: "Excited" },
    { value: "nervous", label: "Nervous" },
    { value: "aroused", label: "Aroused" },
    { value: "scared", label: "Scared" },
    { value: "curious", label: "Curious" },
    { value: "playful", label: "Playful" },
    { value: "serious", label: "Serious" },
    { value: "calm", label: "Calm" },
] as const;

export type Emotion = typeof emotionOptions[number]["value"]
export type EmotionOption = typeof emotionOptions[number]

export const isEmotion = (value: unknown): value is Emotion =>
    emotionOptions.some(o => o.value === value)

export const normalizeEmotion = (value: unknown): Emotion =>
    isEmotion(value) ? value : "neutral"