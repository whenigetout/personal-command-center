import { GENDERS, TTSInput, Gender, Emotion, EmotionParams, Speaker, OCRRun, MediaRef, DialogueLine } from "@manganarrator/contracts"

export const buildTTSInput = (
    dlgLine: DialogueLine,
    safeFloat: (value: unknown, fallback: number) => number,
    exg: string | number,
    cfg: string | number,
    emotionOptions: Emotion[],
    image_ref: MediaRef,
    useCustom: boolean,
    run_id: string
): TTSInput => {
    const GENDER_VALUES = Object.values(GENDERS).map(g => g.value);
    function isGenderValue(value: string): value is Gender["value"] {
        return GENDER_VALUES.includes(value as Gender["value"]);
    }

    const gender: Gender = {
        value: isGenderValue(dlgLine.gender)
            ? dlgLine.gender
            : "neutral",
    };

    const settings: EmotionParams = {
        exaggeration: safeFloat(exg, 1.0),
        cfg: safeFloat(cfg, 1.0),
    }

    const emotion: Emotion = {
        name: emotionOptions.some(emo => emo.name === dlgLine.emotion)
            ? dlgLine.emotion
            : "neutral",
        params: settings
    }
    const speaker: Speaker = {
        name: dlgLine.speaker,
        wav_file: "",
        gender: gender
    }

    const req: TTSInput = {
        text: dlgLine.text,
        gender: gender,
        emotion: emotion,
        speaker: speaker,
        image_ref: image_ref,
        customSettings: useCustom ? settings : undefined,
        run_id: run_id,
        custom_filename: "",
        dialogue_id: dlgLine.id
    }

    return req
}

