import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';

export default getRequestConfig(async ({requestLocale}) => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  if (!locale || !['pt', 'en'].includes(locale)) {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
    locale = cookieLocale && ['pt', 'en'].includes(cookieLocale) ? cookieLocale : 'pt';
  }
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});