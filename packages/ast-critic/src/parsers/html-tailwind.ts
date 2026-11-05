/**
 * Unified AST Node representation and HTML/Tailwind Parser
 */

export interface ASTNode {
  tag: string;
  attributes: Record<string, string>;
  classes: string[];
  text: string;
  children: ASTNode[];
  start: number;
  end: number;
  raw: string;
}

export function parseHTML(source: string): ASTNode[] {
  const nodes: ASTNode[] = [];
  const tagStartRegex = /<([a-zA-Z0-9\-]+)([^>]*?)(\/?)>/g;
  let match: RegExpExecArray | null;

  while ((match = tagStartRegex.exec(source)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    const attrString = match[2];
    const isSelfClosing =
      match[3] === '/' || ['input', 'img', 'br', 'hr', 'meta', 'link'].includes(tagName);
    const startIndex = match.index;

    // Attributes extraction
    const attributes: Record<string, string> = {};
    const attrRegex = /([a-zA-Z0-9_\-:@.]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      const key = attrMatch[1];
      const val = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';
      attributes[key] = val;
    }
    const classStr = attributes['class'] || attributes['className'] || '';
    const classes = classStr.split(/\s+/).filter(Boolean);

    if (isSelfClosing) {
      nodes.push({
        tag: tagName,
        attributes,
        classes,
        text: '',
        children: [],
        start: startIndex,
        end: startIndex + fullTag.length,
        raw: fullTag,
      });
      continue;
    }

    // Find the matching closing tag </tagName> accounting for nested tags of same name
    let depth = 1;
    const searchIndex = tagStartRegex.lastIndex;
    const nextTagRegex = new RegExp(`<(/?)${tagName}(?:[\\s>][^>]*?)?>`, 'gi');
    nextTagRegex.lastIndex = searchIndex;

    let nextMatch: RegExpExecArray | null;
    let endIndex = -1;
    let innerEndIndex = -1;

    while ((nextMatch = nextTagRegex.exec(source)) !== null) {
      const isClosing = nextMatch[1] === '/';
      const isNextSelfClosing = nextMatch[0].endsWith('/>');

      if (!isNextSelfClosing) {
        if (isClosing) {
          depth--;
          if (depth === 0) {
            innerEndIndex = nextMatch.index;
            endIndex = nextMatch.index + nextMatch[0].length;
            break;
          }
        } else {
          depth++;
        }
      }
    }

    if (endIndex === -1) {
      endIndex = startIndex + fullTag.length;
      innerEndIndex = endIndex;
    }

    const innerContent = source.slice(searchIndex, innerEndIndex);
    const rawContent = source.slice(startIndex, endIndex);
    const children = innerContent ? parseHTML(innerContent) : [];
    const text = innerContent
      ? innerContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      : '';

    nodes.push({
      tag: tagName,
      attributes,
      classes,
      text,
      children,
      start: startIndex,
      end: endIndex,
      raw: rawContent,
    });

    tagStartRegex.lastIndex = endIndex;
  }

  return nodes;
}
