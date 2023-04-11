import { Component } from "solid-js";

const Home: Component<{}> = (props) => {
  return (
    <div>
      <h1>LinkStache</h1>
      {/* Landing page for LinkStache - the read it later app with the goal of clearing out your list */}

      <h2>Goals</h2>
      <ul>
        <li>Sync across devices</li>
        <li>Clear out your list</li>
        <li>Keep your list small - Optional max capacity</li>
        <li>Auto-Expiration of oldest links</li>
        <li>Support for articles and video content</li>
      </ul>

      <h2>What is it?</h2>
      <p>
        LinkStache is a read it later app that will help you clear out your list
        of links to read. It's a simple app that will help you get your list of
        links to read down to 0.
      </p>
      <p>
        If you don't read your links within the time limit, they will be deleted.
        The rational here is to avoid building up a massive list of articles that you'll never read.
      </p>

    </div>
  )
};

export default Home;
