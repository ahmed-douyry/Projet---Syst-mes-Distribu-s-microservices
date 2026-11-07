/** Decode the cumulative text produced by Spring's Flux<String> SSE endpoint.
 * Spring writes `data:` immediately before each token: leading spaces belong to
 * the token. Lines within one event are joined with LF; events are concatenated.
 * The last, incomplete event is deferred until its terminating blank line arrives.
 */
export function parseSpringSse(payload: string): string {
  return payload
    .split(/\r?\n\r?\n/)
    .slice(0, -1)
    .map((event) =>
      event
        .split(/\r?\n/)
        .filter((line) => line === 'data' || line.startsWith('data:'))
        .map((line) => (line === 'data' ? '' : line.slice(5)))
        .join('\n'),
    )
    .join('');
}
