// IMO ship identification number check (7 digits): the first six digits multiplied by 7,6,5,4,3,2,
// summed; the last digit of the sum is the check digit (IMO resolution A.1117(30) scheme).
export function checkImo(raw) {
  const digits = String(raw ?? '').replace(/^IMO\s*/i, '').replace(/\s/g, '');
  if (!/^\d{7}$/.test(digits)) return { ok: false, digits, reason: 'An IMO number has 7 digits.' };
  const sum = [...digits.slice(0, 6)].reduce((s, d, i) => s + Number(d) * (7 - i), 0);
  const ok = sum % 10 === Number(digits[6]);
  return { ok, digits, reason: ok ? null : 'Check digit does not match: please check for a typo.' };
}
