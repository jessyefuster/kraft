import * as yup from 'yup';

export const getRequiredFields = <T extends yup.AnyObject>(
  schema: yup.ObjectSchema<T>
) => {
  const fields = schema.describe().fields as Record<keyof T, yup.SchemaDescription>;

  return Object.entries(fields).reduce((newObj, [key, schemaDescription]) => {
    newObj[key as keyof T] = !schemaDescription.optional;
    return newObj;
  }, {} as Record<keyof T, boolean>);
};

export default yup;
