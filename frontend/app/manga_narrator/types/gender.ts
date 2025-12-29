// For Gender:
export const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "unknown", label: "Unknown" },
] as const;


export type Gender = typeof genderOptions[number]["value"]
export type GenderOption = typeof genderOptions[number]

export const isGender = (value: unknown): value is Gender =>
    genderOptions.some(o => o.value === value)

export const normalizeGender = (value: unknown): Gender =>
    isGender(value) ? value : "unknown"

