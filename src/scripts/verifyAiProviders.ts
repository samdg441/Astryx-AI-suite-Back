import { logAiProvidersOnStartup } from "../infrastructure/ai/verifyAiProviders";

void logAiProvidersOnStartup().then(() => process.exit(0));
