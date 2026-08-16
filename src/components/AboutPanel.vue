<template>
  <div class="about serif">
    <p>
      <em>Aloud</em> is an audiobook player designed and developed by
      <a rel="author" href="https://igorrazvodovsky.com/">Igor Razvodovsky</a>. All books are in
      the public domain and are recorded by
      <a rel="external" href="https://librivox.org/">LibriVox</a> volunteers 🙇.
    </p>
    <p>
      The app is made with <a rel="external" href="https://vuejs.org/">Vue</a>. Text is set in
      <a rel="external" href="https://github.com/adobe-fonts/source-serif">Source Serif</a> and
      <a rel="external" href="https://github.com/adobe-fonts/source-sans">Source Sans</a>. Icons
      are part of <a rel="external" href="https://iconoteka.com/">Iconoteka</a>.
    </p>
    <h3 class="about__heading">Keyboard</h3>
    <ul class="about__keys">
      <li><kbd>Space</kbd> Play or pause</li>
      <li><kbd>←</kbd> Back 15 seconds</li>
      <li><kbd>→</kbd> Forward 15 seconds</li>
    </ul>
  </div>
</template>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: var(--step-1);
  line-height: 1.6;
  max-inline-size: 34rem;
}

.about a {
  color: inherit;
  text-underline-offset: 2px;
}

.about__heading {
  font-family: var(--sans);
  font-size: var(--step--1);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-muted);
  margin-block-start: 0.5rem;
}

.about__keys {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: var(--sans);
  font-size: var(--step-0);
}

kbd {
  display: inline-block;
  min-inline-size: 2.5rem;
  margin-inline-end: 0.75rem;
  padding: 0.15rem 0.5rem;
  border: 1px solid var(--rule);
  border-radius: 0.25rem;
  font-family: var(--sans);
  font-size: var(--step--1);
  text-align: center;
}
</style>
