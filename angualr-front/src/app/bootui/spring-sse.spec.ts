import { parseSpringSse } from './spring-sse';

describe('parseSpringSse', () => {
  it('shouldPreserveSpringTokenWhitespace', () => {
    expect(parseSpringSse('data:Voici\n\ndata: la liste\n\ndata: des clients :\n\n')).toBe(
      'Voici la liste des clients :',
    );
    expect(parseSpringSse('data: \n\ndata:  code\n\n')).toBe('   code');
  });
  it('shouldPreserveMultilineMarkdownAndBlankLines', () => {
    expect(
      parseSpringSse(
        'data:Clients\ndata:\ndata:| ID | Nom |\ndata:| --- | --- |\ndata:| 1 | Ahmed |\n\n',
      ),
    ).toBe('Clients\n\n| ID | Nom |\n| --- | --- |\n| 1 | Ahmed |');
  });
  it('shouldIgnoreMetadataAndDeferIncompleteEvents', () => {
    expect(
      parseSpringSse(':keepalive\r\n\r\nid:1\r\nevent:message\r\ndata:Bonjour\r\n\r\ndata: la sui'),
    ).toBe('Bonjour');
    expect(parseSpringSse('data:Bon')).toBe('');
  });
  it('shouldRebuildCumulativeProgressWithoutDuplicatingText', () => {
    const first = 'data:Bonjour\n\n';
    expect(parseSpringSse(first)).toBe('Bonjour');
    expect(parseSpringSse(first + 'data: à tous\n\n')).toBe('Bonjour à tous');
  });
});
