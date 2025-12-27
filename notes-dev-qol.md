
Git Temp & Quick Commit Aliases (Windows)

### Purpose

Speed up commits during active development without thinking about `git add` every time.

These aliases are meant for **tracked files only**. New files must be added once manually.

---

## Alias 1: Temp commit with timestamp

### What it does

- Stages all **tracked** changes
    
- Commits with a fixed message + timestamp
    
- Zero thinking, safe checkpoint
    

### Setup (run once)

`git config --global alias.tc "!git commit -am \"temp: %DATE% %TIME%\""`

### Usage

`git tc`

### Example commit message

`temp: Wed 09/27/2025 10:42:13.12`

Use this when:

- experimenting
    
- refactoring
    
- afraid of breaking something
    
- want a save point
    

---

## Alias 2: Quick commit with custom message

### What it does

- Stages all **tracked** changes
    
- Lets you provide your own message inline
    

### Setup (run once)

`git config --global alias.c "commit -am"`

### Usage

`git c "wip narration workbench ui"`

Use this when:

- a change has intent
    
- you want a readable message
    
- still moving fast
    

---

## Important Notes

### About `-am`

- `-a` = stages **only tracked files**
    
- New files require:
    

`git add <file>`

(one time only)

This is intentional and safer than `git add .`.

---

### Is it okay to push temp commits?

Yes. Completely fine.

- Solo projects → no problem
    
- Personal tools → no problem
    
- Fast iteration → encouraged
    

Rebase is **optional**, not required.

---

## Optional Cleanup (Rebase)

### Purpose

Turn many temp/WIP commits into one clean commit **later**.

### Command

`git rebase -i HEAD~N`

Use only if/when:

- you care about history clarity
    
- opening a PR
    
- sharing publicly
    

Skip it if you don’t care.

---

## Sanity Check: View aliases

`git config --global --get-regexp alias`

---

## Mental Rule

- `git tc` → checkpoint
    
- `git c "msg"` → meaningful step
    
- `git push` → allowed anytime
    
- `git rebase` → polish, optional