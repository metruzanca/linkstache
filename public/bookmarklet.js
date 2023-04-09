function createElement(elementName, props = {}) {
  const element = document.createElement(elementName);
  Object.entries(props).forEach(([key, value]) => {
    element[key] = value;
  });
  // Override the append method to make it return the element.
  // ... Not a fan of this, but it's the easiest way to give appending a declarative API.
  element.append = (...children) => {
    children.forEach(child => {
      element.appendChild(child);
    });
    return element
  };
  return element;
}

const globalStyles = createElement('style', {
  textContent: /*css*/`
    .linkstache {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
      font-size: 16px;
    }
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
  `
})

const { baseUrl, id, decryptionKey, DEV } = window.stache

async function addLink(url) {
  // NOTE: Do not send the decryption key to the server.
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

/**
 * Welcome to my poorman's Solid.
 * We've got a function that returns a DOM element.
 * We've can use setTimeout to simulate onMount.
 * 
 * We can use the createElement function to create elements.
 * We can use the overwritten append method to declaratively add children.
 */
function Main() {
  const notification = createElement('div', {
    className: 'notification',
    close(delay = 0) {
      setTimeout(() => {
        // Transition the notification out.
        notification.style.opacity = '0';
        // Remove it from the DOM after the transition is done.
        setTimeout(() => {
          notification.remove();
        }, 1000);
      }, delay);
    },
    onclick: () => notification.close(),
  });

  const paragraph = createElement('p', { textContent: 'Adding to Stache...' });

  setTimeout(async () => {
    const json = await addLink(location.href);
    paragraph.textContent = json.message

    notification.close(1000)
  })

  const container = createElement('div', { className: 'linkstache' });

  return container.append(
    globalStyles,
    notification.append(
      paragraph,
    ),
  )
}

document.body.append(Main())
