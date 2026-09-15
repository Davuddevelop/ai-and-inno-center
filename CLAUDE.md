@AGENTS.md

# Commit authorship

Commits on this repo are authored by the project owner, not by Claude. Use his
GitHub private-email identity so the commits link to his account and count
toward his contribution graph:

```
git -c user.name="Davud Ali" \
    -c user.email="140797113+Davuddevelop@users.noreply.github.com" \
    commit -m "..."
```

Pass the identity per command with `-c` — do not write it into git config.
Keep the `Co-Authored-By: Claude` trailer in the message body; it records the
assistance without changing who the commit is authored by.
