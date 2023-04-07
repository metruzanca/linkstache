function createElement(elementName, props = {}) {
  const element = document.createElement(elementName);
  Object.entries(props).forEach(([key, value]) => {
    element[key] = value;
  });
  return element;
}

function createStyle(css) {
  const style = document.createElement('style');
  style.textContent = css;
  return style;
}

function createNotification() {
  const notification = createElement('div', { className: 'notification' });

  notification.close = (delay = 0) => {
    // Transition the notification out.
    setTimeout(() => {
      notification.style.opacity = '0';
      // Remove it from the DOM after the transition is done.
      setTimeout(() => {
        notification.remove();
      }, 1000);
    }, delay);
  }

  notification.addEventListener('click', () => {
    notification.close();
  });

  return notification;
}

async function add(url) {
  // NOTE: Do not send the decryption key to the server.
  const { baseUrl, id, decryptionKey } = window.stache
  const data = await fetch(`${baseUrl}/api/`, {
    method: 'POST',
    body: JSON.stringify({
      url,
      user: { id },
    }),
  });
  return data.json();
}

function wait(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

const globalCss = /*css*/`
.hidden {
  transform: translateY(100%);
}
.notification {
  position: fixed;
  background: #000;
  color: #fff;
  border-radius: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  z-index: 9999;
  top: 0;
  right: 0;
  transition: all 0.5s ease;
  cursor: pointer;
}
p {
  padding: 1rem;
}
`;

async function main() {
  const { DEV } = window.stache
  const notification = createNotification()

  notification.append(
    createStyle(globalCss),
    createElement('p', { textContent: 'Adding to Stache...' })
  );

  document.body.append(notification);

  const json = await add(location.href);
  if (DEV) {
    await wait(1000);
  }
  p.textContent = json.message

  notification.close(1000)
}

main();
