type OTPEntry = {
  code: string;
  expiresAt: number;
};

const store = new Map<string, OTPEntry>();

export function createOTP(phone: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  store.set(phone, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutos
  });

  return code;
}

export function verifyOTP(phone: string, code: string) {
  const entry = store.get(phone);

  if (!entry) return false;
  if (Date.now() > entry.expiresAt) return false;
  if (entry.code !== code) return false;

  store.delete(phone);
  return true;
}
