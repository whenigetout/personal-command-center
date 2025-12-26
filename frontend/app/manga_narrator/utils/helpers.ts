export const constructFolderPath = (root = '', sub = '') =>
    `${root}${sub ? '/' + sub : ''}`