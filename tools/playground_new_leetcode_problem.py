#!/usr/bin/env python3
"""
Simple LeetCode problem scaffolder.

Place this file in your project's `tools/` folder.
It will create: playground/leetcode/0001_slug/python/{solution.py,tests.py} plus playground/leetcode/0001_slug/problem.md

Usage:
  - Interactive (recommended): python tools/playground_new_leetcode_problem.py
  - With args: python tools/playground_new_leetcode_problem.py slug --num 12 --lang python --title "Two Sum" --url "https://..." --diff Easy --tags "array,hash-table"

Notes:
  - The script finds repo root as two levels above this file (adjust if your structure differs).
  - Language defaults to 'python'. Add more templates later if you want other languages.
"""
from pathlib import Path
import argparse
import textwrap
import sys

REPO_ROOT = Path(__file__).resolve().parents[1]  # file is in tools/, so parent.parent is repo root
PLAYGROUND_DIR = REPO_ROOT / "playground" / "leetcode"

SOLUTION_TEMPLATE = """# Problem: {title}
# URL: {url}
# Difficulty: {diff}
# Tags: {tags}

from typing import List, Optional

class Solution:
    def solve(self, *args, **kwargs):
        \"\"\"Implement the main function expected by LeetCode and your local tests.\"\"\"
        raise NotImplementedError
"""

TESTS_TEMPLATE = """import pytest
from solution import Solution

sol = Solution()

def test_placeholder():
    # Replace these with real cases.
    assert True
"""

PROBLEM_MD_TEMPLATE = """# {title}

URL: {url}

Difficulty: {diff}
Tags: {tags}

Problem statement:
- paste here
"""

READABLE_NAME_TEMPLATE = "{num}_{slug}"

def find_next_number(base_dir: Path) -> int:
    if not base_dir.exists():
        return 1
    nums = []
    for p in base_dir.iterdir():
        if p.is_dir() and p.name[:4].isdigit():
            try:
                nums.append(int(p.name.split("_", 1)[0]))
            except Exception:
                pass
    return (max(nums) + 1) if nums else 1

def slugify(name: str) -> str:
    s = name.strip().lower().replace(" ", "_").replace("-", "_")
    # keep it simple: remove problematic characters
    allowed = "abcdefghijklmnopqrstuvwxyz0123456789_"
    return "".join(ch for ch in s if ch in allowed)[:60] or "problem"

def create_problem(slug: str, lang: str, title: str, url: str, diff: str, tags: str):
    folder_name = f"{slug}"
    target_base = PLAYGROUND_DIR / folder_name / lang
    md_path = PLAYGROUND_DIR / folder_name / "problem.md"

    # create directories
    target_base.mkdir(parents=True, exist_ok=True)

    # files
    solution_path = target_base / "solution.py"
    tests_path = target_base / "tests.py"

    if solution_path.exists() or tests_path.exists() or md_path.exists():
        print("Warning: One or more target files already exist. Aborting to avoid overwrite.")
        print(solution_path, tests_path, md_path)
        return False

    solution_path.write_text(SOLUTION_TEMPLATE.format(title=title, url=url, diff=diff, tags=tags))
    tests_path.write_text(TESTS_TEMPLATE)
    md_path.write_text(PROBLEM_MD_TEMPLATE.format(title=title, url=url, diff=diff, tags=tags))
    print(f"Created problem at: {PLAYGROUND_DIR / folder_name}")
    print(f" - solution: {solution_path}")
    print(f" - tests:    {tests_path}")
    print(f" - md:       {md_path}")
    return True

def interactive_flow():
    print("Interactive LeetCode problem scaffolder\n(press Enter to accept defaults)")
    PLAYGROUND_DIR.mkdir(parents=True, exist_ok=True)
    next_num = find_next_number(PLAYGROUND_DIR)
    print(f"Next available number: {str(next_num).zfill(4)}")
    slug_input = input("Slug (short id, e.g. two_sum): ").strip()
    if slug_input:
        title_default = input("Title (friendly, e.g. Two Sum): ").strip() or slug_input.replace("_", " ").title()
        slug_input = slugify(slug_input)

    else:
        title_default = input("Title (friendly) [press Enter to auto-generate]: ").strip() or slug_input.replace("_", " ").title()
    lang = input("Language [python]: ").strip() or "python"
    url = input("URL (optional): ").strip() or ""
    diff = input("Difficulty [Unknown]: ").strip() or "Unknown"
    tags = input("Tags (comma separated) []: ").strip() or ""
    confirm = input(f"Create {slug_input} in {lang}? [Y/n]: ").strip().lower() or "y"
    if confirm.startswith("y"):
        return create_problem(slug_input, lang, title_default, url, diff, tags)
    print("Aborted.")
    return False

def parse_args(argv):
    p = argparse.ArgumentParser(description="Create a LeetCode problem scaffold inside playground/leetcode")
    p.add_argument("slug", nargs="?", help="slug for the problem (e.g. two_sum). If omitted, runs interactive mode.")
    p.add_argument("--num", type=int, help="specific problem number (optional)")
    p.add_argument("--lang", default="python", help="language subfolder (default: python)")
    p.add_argument("--title", default=None, help="friendly title (e.g. Two Sum)")
    p.add_argument("--url", default="", help="problem URL")
    p.add_argument("--diff", default="Unknown", help="difficulty")
    p.add_argument("--tags", default="", help="comma-separated tags")
    return p.parse_args(argv)

def main(argv):
    args = parse_args(argv)
    PLAYGROUND_DIR.mkdir(parents=True, exist_ok=True)

    if not args.slug:
        return 0 if interactive_flow() else 1

    # non-interactive mode
    slug = slugify(args.slug)
    # choose number
    if args.num:
        num = args.num
    else:
        num = find_next_number(PLAYGROUND_DIR)

    title = args.title or args.slug.replace("_", " ").title()
    ok = create_problem(num, slug, args.lang, title, args.url, args.diff, args.tags)
    return 0 if ok else 2

if __name__ == "__main__":
    exit_code = main(sys.argv[1:])
    sys.exit(exit_code)
