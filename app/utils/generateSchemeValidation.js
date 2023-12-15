import * as z from 'zod';

const getFieldValidation = (field) => {
  switch (field.type) {
    case 'fill-in':
    case 'single-select':
    case 'condition':
      return z.string().min(1, {
        message: `${field.label} required`,
      });
    default:
      return null;
  }
};

export const generateFormValidationSchema = (form) => {
  const schemaObject = {};

  Object.keys(form).forEach((screen) => {
    const screenValidation = {};

    form[screen].forEach((field) => {
      const validation = getFieldValidation(field);
      if (validation) {
        screenValidation[field.questionId] = validation;
      }
    });

    if (Object.keys(screenValidation).length > 0) {
      schemaObject[screen] = z.object(screenValidation);
    }
  });

  return schemaObject;
};
