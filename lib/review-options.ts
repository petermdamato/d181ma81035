/**
 * Review form dropdown options
 */

export const FOUND_WHEN_OPTIONS = [
  { value: "idly_browsing", label: "idly browsing" },
  { value: "doing_research", label: "doing research" },
  { value: "making_a_list", label: "making a list of options" },
  { value: "looking_to_close", label: "looking to close a deal" },
] as const;

export const RESULT_OPTIONS = [
  { value: "didnt_inquire", label: "didn't inquire" },
  { value: "no_response", label: "no response from company" },
  { value: "bought", label: "bought" },
] as const;

export type FoundWhenValue = (typeof FOUND_WHEN_OPTIONS)[number]["value"];
export type ResultValue = (typeof RESULT_OPTIONS)[number]["value"];

export function getFoundWhenLabel(value: string): string {
  return FOUND_WHEN_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function getResultLabel(value: string): string {
  return RESULT_OPTIONS.find((o) => o.value === value)?.label ?? value;
}
