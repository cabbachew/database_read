export function toJsonWithBigInt(
  obj: Record<string, unknown>
): Record<string, unknown> {
  return JSON.stringify(obj, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}
