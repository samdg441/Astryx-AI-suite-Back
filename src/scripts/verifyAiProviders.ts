/**
 * Verifica las 3 IAs sin levantar Express.
 * Uso: npm run ai:verify
 */
import { logAiProvidersOnStartup } from "../infrastructure/ai/verifyAiProviders";

void logAiProvidersOnStartup().then(() => process.exit(0));
