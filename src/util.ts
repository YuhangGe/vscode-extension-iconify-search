const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function getNonce() {
  let text = '';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function replaceTpl(tpl: string, ctx: Record<string, unknown>) {
  const keys = Object.keys(ctx);
  keys.forEach((k) => {
    const r = new RegExp('\\$\\{\\s*' + k + '\\s*\\}', 'g');
    tpl = tpl.replace(r, `${ctx[k]}`);
  });
  return tpl;
}
