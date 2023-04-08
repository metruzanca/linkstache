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

async function addLink(url) {
  // NOTE: Do not send the decryption key to the server.
  const { baseUrl, id, decryptionKey, DEV } = window.stache
  const data = await fetch(`${baseUrl}/api/`, {
    method: 'POST',
    body: JSON.stringify({
      url,
      user: { id },
    }),
  });

  if (DEV) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return data.json();
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

  const notification = createElement('div', {
    className: 'notification',
    close(delay = 0) {
      // Transition the notification out.
      setTimeout(() => {
        notification.style.opacity = '0';
        // Remove it from the DOM after the transition is done.
        setTimeout(() => {
          notification.remove();
        }, 1000);
      }, delay);
    },
    onclick: () => this.close(),
  });

  const paragraph = createElement('p', { textContent: 'Adding to Stache...' });

  notification.append(
    createStyle(globalCss),
    paragraph,
  );

  document.body.append(notification);

  const json = await addLink(location.href);
  paragraph.textContent = json.message

  notification.close(1000)
}

main();
