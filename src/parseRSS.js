export default (rssData) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(rssData, 'text/xml');

  const parseError = dom.querySelector('parsererror');
  if (parseError) {
    const error = new Error(parseError.textContent);
    error.isParsingError = true;

    throw error;
  }

  const titleElement = dom.querySelector('channel > title');
  const title = titleElement.textContent;
  const descriptionElement = dom.querySelector('channel > description');
  const description = descriptionElement.textContent;

  const itemElements = dom.querySelectorAll('item');
  const items = Array.from(itemElements).map((element) => {
    const itemTitleElement = element.querySelector('title');
    const itemLinkElement = element.querySelector('link');
    const itemDescriptionElement = element.querySelector('description');

    return {
      title: itemTitleElement.textContent,
      link: itemLinkElement.textContent,
      description: itemDescriptionElement.textContent,
    };
  });

  return { title, description, items };
};
