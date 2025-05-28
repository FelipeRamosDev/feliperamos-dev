export function parseCSS(input: string | string[] = [], defaultValue: string = '') {
   if (typeof input === 'string') {
      input = [ input, defaultValue ].join(' ');
      return input;
   }

   if (Array.isArray(input)) {
      return [ ...input, defaultValue ].join(' ');
   }

   return '';
}
