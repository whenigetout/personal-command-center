export function resolveImageSrc(
    relDir: string,
    filename: string
): string {
    const BASE = process.env.NEXT_PUBLIC_IMAGE_ROOT_INPUTS;

    if (!BASE) {
        throw new Error("NEXT_PUBLIC_IMAGE_ROOT_INPUTS is not set");
    }

    const base = BASE.replace(/\/$/, "");
    const dir = relDir.replace(/^\/|\/$/g, "");
    const file = filename.replace(/^\//, "");

    return `${base}/${dir}/${file}`;
}
