export function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

export function toTitleCase(value: string) {
  return normalizeSearchText(value).replace(/\b\w/g, (character) =>
    character.toUpperCase()
  );
}

export function getNameSearchVariants(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return [];
  }

  return Array.from(
    new Set([
      trimmed,
      normalizeSearchText(trimmed),
      trimmed.toUpperCase(),
      toTitleCase(trimmed)
    ])
  );
}

export function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function isPhoneSearch(value: string) {
  const trimmed = value.trim();

  return phoneDigits(trimmed).length > 0 && /^[+\d\s()-]+$/.test(trimmed);
}

export function getPhoneSearchVariants(value: string) {
  const trimmed = value.trim();
  const digits = phoneDigits(trimmed);
  const variants = new Set<string>();

  if (!digits) {
    return [];
  }

  variants.add(trimmed);
  variants.add(digits);

  if (digits.startsWith("01") && digits.length === 11) {
    variants.add(`+88${digits}`);
    variants.add(`88${digits}`);
  } else if (digits.startsWith("8801") && digits.length === 13) {
    variants.add(`+${digits}`);
    variants.add(`0${digits.slice(3)}`);
  }

  return Array.from(variants).slice(0, 3);
}
