import { useAppContext } from "./appContext"

// Bookmarklet Rules:
// 1. You must use semicolons. :(
// 2. You must use multiline comments for any comments.
// 3. Update the loaderVersion if you change the bookmarklet.
export const makeBookmarklet = () => {
  const baseUrl = location.origin
  const { user } = useAppContext()
  const { id, decryptionKey } = user()
  return `javascript:(async function(){
    window.stache = {
      baseUrl: '${baseUrl}',
      DEV: ${import.meta.env.DEV},
      id: '${id}',
      decryptionKey: '${decryptionKey}',
      loaderVersion: 1,
    };
    const response = await fetch('${baseUrl}/bookmarklet.js');
    const bookmarklet = await response.text();
    eval(bookmarklet);
  })();`
}
