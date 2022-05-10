import {createRequire} from 'module';
const requireJson = createRequire(import.meta.url);

export const singleMatrix = requireJson('./single-matrix.json');
export const multipleMatrices = requireJson('./multiple-matrix.json');
