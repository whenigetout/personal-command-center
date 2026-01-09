import { MediaRef } from "@manganarrator/contracts"

const MEDIA_ROOT = process.env.NEXT_PUBLIC_MEDIA_ROOT

export const resolveMediaRef = (mediaRef: MediaRef) =>
    `${MEDIA_ROOT}/${mediaRef.namespace}/${mediaRef.path}`

export const fileNameFromMediaRef = (mediaRef: MediaRef) =>
    `${mediaRef.path.split('/').pop()}`