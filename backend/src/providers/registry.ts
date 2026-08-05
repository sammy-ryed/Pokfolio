import { Provider } from './types.js';
import { githubProvider } from './github/github.provider.js';

class ProviderRegistry {
  private providers: Map<string, Provider> = new Map();

  register(provider: Provider) {
    this.providers.set(provider.name.toLowerCase(), provider);
  }

  get(name: string): Provider {
    const provider = this.providers.get(name.toLowerCase());
    if (!provider) {
      throw new Error(`Provider not found: ${name}`);
    }
    return provider;
  }
}

export const registry = new ProviderRegistry();

// Register all providers here
registry.register(githubProvider);
