# Push splendor2 to your GitHub repo

Repo: **https://github.com/rajimanu1626/splendor.git**

## Already done in this project

- Git is initialized in `splendor2` (branch **main**).
- Initial commit created (140 files).
- `.env` is in `.gitignore` so secrets are not committed.
- Remote **origin** = `https://github.com/rajimanu1626/splendor.git`.

## What you need to do: push once

From a **normal terminal** (so you can enter credentials):

```bash
cd /var/www/games/Splendor/splendor2
git push -u origin main
```

When prompted:
- **Username**: your GitHub username (`rajimanu1626`).
- **Password**: use a **Personal Access Token** (not your GitHub password).  
  Create one: GitHub → Settings → Developer settings → Personal access tokens → Generate new token (classic), scope `repo`.

Or use SSH (if you use SSH keys with GitHub):

```bash
git remote set-url origin git@github.com:rajimanu1626/splendor.git
git push -u origin main
```

---

## Reference: if you had to do everything from scratch (already done)

Steps to push (run in project root: `splendor2`)

### 1. Commit (if not already committed)

If you see "unknown option \`trailer'" when running `git commit`, you may have a global git hook or wrapper adding `--trailer`. Fix it by either:

- Temporarily unsetting the hook:
  ```bash
  git commit --no-verify -m "Initial commit: Splendor online"
  ```
  If that still fails, the wrapper may be injecting options; try committing from a normal terminal (outside Cursor) or check:
  ```bash
  which git
  git config --global --list
  ```

- Or commit using your editor (no `-m`):
  ```bash
  git commit
  ```
  Then save and close the editor.

### 2. Rename branch to `main` (GitHub default)

```bash
git branch -M main
```

### 3. Add your GitHub remote

```bash
git remote add origin https://github.com/rajimanu1626/splendor.git
```

If you already have an `origin` you want to replace:

```bash
git remote remove origin
git remote add origin https://github.com/rajimanu1626/splendor.git
```

### 4. Push to GitHub

```bash
git push -u origin main
```

Use your GitHub username and a **Personal Access Token** (not your password) when prompted. To create a token: GitHub → Settings → Developer settings → Personal access tokens.

### 5. (Optional) Use SSH instead of HTTPS

If you use SSH keys with GitHub:

```bash
git remote set-url origin git@github.com:rajimanu1626/splendor.git
git push -u origin main
```

---

## One-liner (after commit exists)

```bash
cd /var/www/games/Splendor/splendor2
git branch -M main
git remote add origin https://github.com/rajimanu1626/splendor.git
git push -u origin main
```
