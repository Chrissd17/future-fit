type EnvKey = {
  name: string;
  placeholderSubstrings?: string[];
  required: boolean;
};

const REQUIRED_ENV_KEYS: EnvKey[] = [
  {
    name: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    placeholderSubstrings: ["pk_test_your_publishable_key_here", "YOUR_PUBLISHABLE_KEY"],
    required: true,
  },
  {
    name: "CLERK_SECRET_KEY",
    placeholderSubstrings: ["sk_test_your_secret_key_here", "YOUR_SECRET_KEY"],
    required: true,
  },
];

const OPTIONAL_ENV_KEYS: EnvKey[] = [
  {
    name: "DATABASE_URL",
    placeholderSubstrings: [
      "postgresql://username:password@localhost:5432/futurefit",
    ],
    required: false,
  },
  // NEXTAUTH_* is optional in development; enforced in production below
  {
    name: "NEXTAUTH_URL",
    placeholderSubstrings: ["http://localhost:3000"],
    required: false,
  },
  {
    name: "NEXTAUTH_SECRET",
    placeholderSubstrings: ["your_nextauth_secret_here"],
    required: false,
  },
];

function isPlaceholder(value: string | undefined, substrings: string[] | undefined): boolean {
  if (!value || !substrings || substrings.length === 0) return false;
  const lower = value.toLowerCase();
  return substrings.some((s) => lower.includes(s.toLowerCase()));
}

export function validateEnv(): void {
  const isProd = process.env.NODE_ENV === "production";

  const missing: string[] = [];
  const placeholders: string[] = [];
  const optionalMissing: string[] = [];

  for (const key of REQUIRED_ENV_KEYS) {
    const val = process.env[key.name];
    if (!val || val.trim() === "") {
      missing.push(key.name);
      continue;
    }
    if (isPlaceholder(val, key.placeholderSubstrings)) {
      placeholders.push(key.name);
    }
  }

  for (const key of OPTIONAL_ENV_KEYS) {
    const val = process.env[key.name];
    if (!val || val.trim() === "") {
      optionalMissing.push(key.name);
    }
  }

  // Additional prod-only rules: NEXTAUTH_* required and URL must be https
  if (isProd) {
    const nextAuthMissing: string[] = [];
    for (const key of ["NEXTAUTH_URL", "NEXTAUTH_SECRET"]) {
      const val = process.env[key];
      if (!val || val.trim() === "") nextAuthMissing.push(key);
    }
    missing.push(...nextAuthMissing);

    const url = process.env.NEXTAUTH_URL || "";
    const isHttps = url.startsWith("https://");
    if (!isHttps) {
      placeholders.push("NEXTAUTH_URL (must be https in production)");
    }
  }

  if (missing.length === 0 && placeholders.length === 0 && optionalMissing.length === 0) {
    return;
  }

  if (isProd) {
    // Fail fast in production to avoid running with broken config
    const lines: string[] = [];
    if (missing.length > 0) lines.push(`Missing required: ${missing.join(", ")}`);
    if (placeholders.length > 0) lines.push(`Invalid/placeholder: ${placeholders.join(", ")}`);
    if (optionalMissing.length > 0) lines.push(`Optional not set: ${optionalMissing.join(", ")}`);
    const msg = `Env validation failed in production. ${lines.join(" | ")}\nRefer to .env.example.`;
    throw new Error(msg);
  } else {
    // Development-time warnings only
    const header = "[env] Configuration warnings (development only)";
    // eslint-disable-next-line no-console
    console.warn("\n" + header);

    if (missing.length > 0) {
      // eslint-disable-next-line no-console
      console.warn("- Missing required:", missing.join(", "));
    }

    if (placeholders.length > 0) {
      // eslint-disable-next-line no-console
      console.warn("- Using placeholder values for:", placeholders.join(", "));
    }

    if (optionalMissing.length > 0) {
      // eslint-disable-next-line no-console
      console.warn("- Optional not set:", optionalMissing.join(", "));
    }

    // eslint-disable-next-line no-console
    console.warn(
      "Compare against .env.example and set real values in .env.local\n",
    );
  }
}


