export function getPropertyValue(
  property: NotionTitle | NotionFomula | NotionRichText
): string {
  let value: string

  if (property.type === 'title') {
    if (property.title.length) {
      value = property.title[0].plain_text
    } else {
      value = ''
    }
  } else if (property.type === 'rich_text') {
    if (property.rich_text.length) {
      value = property.rich_text[0].plain_text
    } else {
      value = ''
    }
  } else if (property.type === 'formula') {
    value = property.formula.string
  } else {
    value = ''
  }

  return value
}
