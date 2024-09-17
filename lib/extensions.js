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
            rowLabel: 'Statement',
            columnLabel: 'Reason',
            columns: ['More than 2 passing implementations'],
            rows: atRiskRows
          };
          templateData.matrices.push(atRiskMatrix);
        }
      }
    }
  }
};

function addAtRisk({rows = []} = {}) {
  return rows.filter(({cells}) => atRisk(cells)).map(
    row => {
      row.cells = [{state: 'failed'}];
      return row;
    });
}
