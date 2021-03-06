import { formatISO, isValid, parseISO } from 'date-fns';

export const validateDateString = (value: string) => isValid(parseISO(value));

export const serializeDate = (date: Date = new Date()) => {
  const asString = formatISO(date, { representation: 'date' });

  if (validateDateString(asString)) {
    return asString;
  }

  throw new Error(`Invalid date: ${asString}`);
};

export const toDate = (value: Date | string) =>
  value instanceof Date && !Number.isNaN(+value) ? value : new Date(value);
