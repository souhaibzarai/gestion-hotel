export type ApiValidationError = Error & {
  details?: Record<string, string[]>;
};
