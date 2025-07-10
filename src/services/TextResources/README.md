# TextResources Service

A powerful internationalization (i18n) service for managing text resources across multiple languages in React applications. This service provides a flexible and type-safe way to handle translations, dynamic text generation, and language switching.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Advanced Features](#advanced-features)
- [Best Practices](#best-practices)
- [TypeScript Support](#typescript-support)
- [Testing](#testing)
- [Contributing](#contributing)

## ✨ Features

- **Multi-language Support**: Manage text resources for multiple languages
- **Dynamic Text Generation**: Support for function-based text resources with parameters
- **React Integration**: Built-in React Context Provider and hooks
- **Type Safety**: Full TypeScript support with proper typing
- **Fallback System**: Automatic fallback to default language when translations are missing
- **Resource Merging**: Combine multiple TextResources instances
- **Flexible Configuration**: Customizable language settings and defaults
- **Error Handling**: Graceful error handling with helpful warnings

## 🚀 Installation

The TextResources service is already included in this project. Make sure your `app.config.ts` file is properly configured:

```typescript
// app.config.ts
export const allowedLanguages = ['en', 'es', 'pt', 'fr'];
export const defaultLanguage = 'en';
```

## 🎯 Quick Start

### Basic Setup

```tsx
import { TextResourcesProvider, useTextResources } from '@/services/TextResources';

function App() {
  return (
    <TextResourcesProvider>
      <YourComponent />
    </TextResourcesProvider>
  );
}

function YourComponent() {
  const { textResources } = useTextResources();
  
  // Add some text resources
  textResources.create('welcome.message', 'Welcome to our app!');
  textResources.create('welcome.message', '¡Bienvenido a nuestra aplicación!', 'es');
  
  return (
    <div>
      <h1>{textResources.getText('welcome.message')}</h1>
    </div>
  );
}
```

### With Custom Configuration

```tsx
<TextResourcesProvider 
  allowedLanguages={['en', 'es', 'pt']} 
  defaultLanguage="en"
  language="es"
>
  <YourApp />
</TextResourcesProvider>
```

## 📚 API Reference

### TextResources Class

#### Constructor
```typescript
constructor(
  languages: string[] = TextResources.allowedLanguages,
  defaultLanguage: string = TextResources.defaultLanguage
)
```

#### Properties
- `languages: string[]` - Array of supported languages
- `defaultLanguage: string` - Default language code
- `currentLanguage: string` - Currently active language (read-only)

#### Methods

##### `setLanguage(language?: string): void`
Sets the current active language.

```typescript
textResources.setLanguage('es'); // Switch to Spanish
textResources.setLanguage('pt'); // Switch to Portuguese
```

##### `create(path: string, value: TextResourceValue, language?: string): void`
Creates a new text resource.

```typescript
// String resource
textResources.create('app.title', 'My Application');

// Function resource
textResources.create('user.greeting', (name: string) => `Hello, ${name}!`);

// Resource in specific language
textResources.create('app.title', 'Mi Aplicación', 'es');
```

##### `getText(path: string, ...params: string[]): string`
Retrieves text for the given path.

```typescript
// Simple text
const title = textResources.getText('app.title');

// Function with parameters
const greeting = textResources.getText('user.greeting', 'John');
```

##### `merge(resourcesToMerge: TextResources): TextResources`
Merges another TextResources instance into this one.

```typescript
const additionalResources = new TextResources(['en'], 'en');
additionalResources.create('new.feature', 'New Feature');

textResources.merge(additionalResources);
```

##### `getLanguageSet(language?: string): Map<string, TextResourceValue> | undefined`
Gets the resource map for a specific language.

```typescript
const englishResources = textResources.getLanguageSet('en');
const currentLanguageResources = textResources.getLanguageSet();
```

### React Provider and Hook

#### TextResourcesProvider Props
```typescript
interface TextResourcesProviderProps {
  language?: string;              // Initial language
  allowedLanguages?: string[];    // Supported languages
  defaultLanguage?: string;       // Default language
  children: React.ReactNode;
}
```

#### useTextResources Hook
```typescript
function useTextResources(initResources?: TextResources): TextResourcesContextValue
```

Returns an object with:
- `textResources: TextResources` - The TextResources instance

## 💡 Usage Examples

### Basic Text Resources

```tsx
function WelcomeComponent() {
  const { textResources } = useTextResources();

  // Create resources
  textResources.create('welcome.title', 'Welcome');
  textResources.create('welcome.subtitle', 'Get started with our platform');
  
  // Spanish translations
  textResources.create('welcome.title', 'Bienvenido', 'es');
  textResources.create('welcome.subtitle', 'Comience con nuestra plataforma', 'es');

  return (
    <div>
      <h1>{textResources.getText('welcome.title')}</h1>
      <p>{textResources.getText('welcome.subtitle')}</p>
    </div>
  );
}
```

### Function-Based Resources

```tsx
function UserProfile({ user }) {
  const { textResources } = useTextResources();

  // Function resources with parameters
  textResources.create('user.greeting', (name: string) => `Hello, ${name}!`);
  textResources.create('user.greeting', (name: string) => `¡Hola, ${name}!`, 'es');
  
  textResources.create('user.itemCount', (count: string) => 
    count === '1' ? `${count} item` : `${count} items`
  );

  return (
    <div>
      <h2>{textResources.getText('user.greeting', user.name)}</h2>
      <p>{textResources.getText('user.itemCount', user.items.toString())}</p>
    </div>
  );
}
```

### Language Switching

```tsx
function LanguageSwitcher() {
  const { textResources } = useTextResources();

  const handleLanguageChange = (language: string) => {
    textResources.setLanguage(language);
    // Trigger re-render in your app
  };

  return (
    <div>
      <button onClick={() => handleLanguageChange('en')}>English</button>
      <button onClick={() => handleLanguageChange('es')}>Español</button>
      <button onClick={() => handleLanguageChange('pt')}>Português</button>
    </div>
  );
}
```

### Resource Merging

```tsx
function usePageResources() {
  const { textResources } = useTextResources();

  // Create page-specific resources
  const pageResources = new TextResources(['en', 'es'], 'en');
  
  // Add page-specific translations
  pageResources.create('page.title', 'Dashboard');
  pageResources.create('page.title', 'Panel de Control', 'es');
  
  pageResources.create('page.description', 'Manage your account');
  pageResources.create('page.description', 'Gestiona tu cuenta', 'es');

  // Merge with global resources
  textResources.merge(pageResources);

  return textResources;
}
```

## 🔧 Advanced Features

### Dynamic Resource Loading

```tsx
function useAsyncResources() {
  const { textResources } = useTextResources();

  const loadResources = async (language: string) => {
    try {
      const response = await fetch(`/api/translations/${language}`);
      const translations = await response.json();
      
      Object.entries(translations).forEach(([key, value]) => {
        textResources.create(key, value as string, language);
      });
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  };

  return { loadResources };
}
```

### Resource Validation

```tsx
function validateResources(textResources: TextResources) {
  const requiredKeys = ['app.title', 'user.welcome', 'nav.home'];
  const missingKeys: string[] = [];

  requiredKeys.forEach(key => {
    const text = textResources.getText(key);
    if (!text) {
      missingKeys.push(key);
    }
  });

  if (missingKeys.length > 0) {
    console.warn('Missing translations:', missingKeys);
  }

  return missingKeys.length === 0;
}
```

### Custom Resource Types

```typescript
// Custom function for complex formatting
const formatCurrency = (amount: string, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(parseFloat(amount));
};

textResources.create('price.format', formatCurrency);
```

## 📝 Best Practices

### 1. Resource Organization

```typescript
// Use dot notation for hierarchical organization
textResources.create('nav.home', 'Home');
textResources.create('nav.about', 'About');
textResources.create('nav.contact', 'Contact');

textResources.create('form.validation.required', 'This field is required');
textResources.create('form.validation.email', 'Please enter a valid email');
```

### 2. Function Resource Guidelines

```typescript
// Good: Clear parameter names and simple logic
textResources.create('user.itemCount', (count: string) => 
  count === '1' ? `${count} item` : `${count} items`
);

// Good: Handle edge cases
textResources.create('time.ago', (minutes: string) => {
  const mins = parseInt(minutes);
  if (mins === 0) return 'just now';
  if (mins === 1) return '1 minute ago';
  return `${mins} minutes ago`;
});
```

### 3. Error Handling

```typescript
function safeGetText(textResources: TextResources, key: string, fallback?: string): string {
  const text = textResources.getText(key);
  return text || fallback || key;
}
```

### 4. Resource Initialization

```typescript
// Create a helper function for resource initialization
function initializeAppResources(textResources: TextResources) {
  const commonResources = {
    'app.title': 'My Application',
    'app.loading': 'Loading...',
    'app.error': 'Something went wrong',
    'button.save': 'Save',
    'button.cancel': 'Cancel'
  };

  Object.entries(commonResources).forEach(([key, value]) => {
    textResources.create(key, value);
  });
}
```

## 🔍 TypeScript Support

The service is fully typed with TypeScript:

```typescript
import type { 
  TextResourceFunction, 
  TextResourceValue,
  TextResourcesContextValue,
  TextResourcesProviderProps 
} from '@/services/TextResources/TextResources.types';

// Type-safe function resources
const greeting: TextResourceFunction = (name: string) => `Hello, ${name}!`;
textResources.create('greeting', greeting);

// Type-safe context usage
const { textResources }: TextResourcesContextValue = useTextResources();
```

## 🧪 Testing

### Unit Testing

```typescript
import TextResources from '@/services/TextResources/TextResources';

describe('TextResources', () => {
  let textResources: TextResources;

  beforeEach(() => {
    textResources = new TextResources(['en', 'es'], 'en');
  });

  test('should create and retrieve text resources', () => {
    textResources.create('test.key', 'Test Value');
    expect(textResources.getText('test.key')).toBe('Test Value');
  });

  test('should handle function resources', () => {
    textResources.create('test.greeting', (name: string) => `Hello, ${name}!`);
    expect(textResources.getText('test.greeting', 'World')).toBe('Hello, World!');
  });
});
```

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import { TextResourcesProvider } from '@/services/TextResources';

test('renders with text resources', () => {
  render(
    <TextResourcesProvider>
      <TestComponent />
    </TextResourcesProvider>
  );
  
  expect(screen.getByText('Welcome')).toBeInTheDocument();
});
```

## 📊 Performance Considerations

### Memory Management

```typescript
// Clean up resources when component unmounts
useEffect(() => {
  return () => {
    // TextResources automatically handles cleanup
    // No manual cleanup required
  };
}, []);
```

### Lazy Loading

```typescript
// Load translations only when needed
const useLazyTranslations = (language: string) => {
  const [loaded, setLoaded] = useState(false);
  const { textResources } = useTextResources();

  useEffect(() => {
    if (!loaded) {
      loadTranslationsForLanguage(language)
        .then(translations => {
          Object.entries(translations).forEach(([key, value]) => {
            textResources.create(key, value as string, language);
          });
          setLoaded(true);
        });
    }
  }, [language, loaded, textResources]);

  return loaded;
};
```

## 🤝 Contributing

1. Follow the established patterns for resource creation
2. Add comprehensive tests for new features
3. Update this README when adding new functionality
4. Ensure TypeScript types are properly defined

## 📄 License

This service is part of the feliperamos-dev project and follows the same licensing terms.

---

**Need help?** Check the test files in `__tests__/` directory for more usage examples and edge cases.
