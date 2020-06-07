export const chapters = state => {
  // Take a list of book files
  return (
    Array.from(state.book[state.book.metadata.identifier])
      // 1. Filter for mp3s
      .filter(
        el =>
          el.source == "original" &&
          el.format.includes("MP3") &&
          !el.format.includes("ZIP") &&
          !!Object.getOwnPropertyDescriptor(el, "track")
      )
      // 2. Sort
      // Track can be in a "XX" or "XX/XX" formats
      .sort(
        (a, b) =>
          a.track.substring(
            0,
            a.track.indexOf("/") !== -1 ? a.track.indexOf("/") : undefined
          ) -
          b.track.substring(
            0,
            b.track.indexOf("/") !== -1 ? b.track.indexOf("/") : undefined
          )
      )
      // 3. Remove unnecesary properties
      .map(
        // eslint-disable-next-line no-unused-vars
        ({ creator, album, crc32, md5, sha1, size, mtime, ...keepAttrs }) =>
          keepAttrs
      )
      // 4. Add
      .map(obj => ({
        ...obj,
        // 4.1. file URL
        url:
          "https://archive.org/download/" +
          state.book.metadata.identifier +
          "/" +
          obj.name,
        // 4.2. chapter length
        // Find the 'derivative' track with the same title and take 'length' from there
        length: state.book[state.book.metadata.identifier].filter(
          el =>
            el.source == "derivative" &&
            el.title == obj.title &&
            el.format.includes("MP3")
        )[0].length
      }))
  );
};
