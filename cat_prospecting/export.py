import json
import os

from openpyxl import Workbook

from .prompt import COLUMNS


def key(name: str) -> str:
    return " ".join(name.lower().split())


def load_seen(path: str) -> list[str]:
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return []


def save_seen(path: str, seen: list[str]) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(sorted(set(seen)), f, ensure_ascii=False, indent=1)


def dedupe(rows: list[dict], seen: list[str]) -> list[dict]:
    known = set(seen)
    out = []
    for r in rows:
        k = key(r["entreprise"])
        if k not in known:
            known.add(k)
            out.append(r)
    return out


def write_xlsx(rows: list[dict], path: str) -> None:
    wb = Workbook()
    ws = wb.active
    ws.title = "Prospects"
    ws.append(COLUMNS)
    for r in rows:
        ws.append([r.get(c, "") for c in COLUMNS])
    wb.save(path)
