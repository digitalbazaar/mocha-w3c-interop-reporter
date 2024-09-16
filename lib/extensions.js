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
        const atRiskRows = templateData.matrices.flatMap(addAtRisk);
        if(atRiskRows.length) {
          const atRiskMatrix = {
            title: 'At Risk',
            columns: templateData.matrices[0].columns,
            rows: atRiskRows
          };
          templateData.matrices.push(atRiskMatrix);
        }
      }
    }
  }
};

function addAtRisk(matrix) {
  const {rows = []} = matrix;
  const atRiskRows = rows.filter(({cells}) => atRisk(cells));
  return atRiskRows;
}
