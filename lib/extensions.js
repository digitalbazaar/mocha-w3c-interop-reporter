/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
 */
import {atRisk} from './utils.js';

/**
 * Extensions are functions that extend test data reports.
 * Extensions maybe toggled off or on.
 */
export const extensions = {
  templateData: {
    addAtRisk({templateData}) {
      if(templateData.matrices.length) {
        templateData.matrices = templateData.matrices.flatMap(addAtRisk);
      }
    }
  }
};

function addAtRisk(matrix) {
  const {rows = [], columns} = matrix;
  const atRiskRows = rows.filter(({cells}) => atRisk(cells));
  if(atRiskRows.length) {
    return [matrix, {
      ...matrix,
      title: matrix?.title + ' At Risk',
      columns: [...columns],
      rows: atRiskRows
    }];
  }
  return [matrix];
}
