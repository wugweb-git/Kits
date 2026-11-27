#!/usr/bin/env python3
"""Fail when a plugin ships the visible text 'Animal Writes' in a string literal (outside comments).

Animal Writes wording belongs in sites/animalwrites/, or comes from get_bloginfo('name'). Plugin internals named aw_ / aw- are
not checked: they are stored option, hook and slug names kept for the live site. Files that must name the site because they
are carry-over code gated to it are listed in tools/validate/visible-brand-allow.txt, one path per line, with a reason.
"""
import os, re, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
allow = set()
ap = os.path.join(os.path.dirname(__file__), 'visible-brand-allow.txt')
if os.path.exists(ap):
    for l in open(ap):
        l = l.split('#')[0].strip()
        if l:
            allow.add(l)
pat = re.compile(r"""(['"])((?:(?!\1).)*Animal Writes(?:(?!\1).)*)\1""")
bad = []
for plug in sorted(os.listdir(os.path.join(ROOT, 'plugins'))):
    base = os.path.join(ROOT, 'plugins', plug)
    for r, d, f in os.walk(base):
        d[:] = [x for x in d if x not in ('node_modules', 'build', 'tests', 'languages', 'vendor')]
        for n in f:
            if not n.endswith(('.php', '.js')):
                continue
            fp = os.path.join(r, n)
            rel = os.path.relpath(fp, ROOT)
            if rel in allow:
                continue
            for i, l in enumerate(open(fp, errors='ignore'), 1):
                if l.strip().startswith(('//', '*', '/*', '#')):
                    continue
                code = re.sub(r'\s//.*$', '', l)
                for m in pat.finditer(code):
                    bad.append(f'{rel}:{i}: {m.group(2)[:100]}')
if bad:
    print('Visible "Animal Writes" text in plugin code (use get_bloginfo(\'name\'), a neutral word, or sites/animalwrites/):')
    print('\n'.join(bad))
    sys.exit(1)
print('ok: no visible "Animal Writes" text in plugin code')
