export function parseCSS(input: string | string[] = [], defaultValue: string = ''): string {
   if (typeof input === 'string') {
      input = [ input, defaultValue ].join(' ');
      return input;
   }

   if (Array.isArray(input)) {
      return [ ...input, defaultValue ].join(' ');
   }

   return '';
}

export function paddingClassName(paddingSize: string): string {
   return `padding-${paddingSize}`;
}
