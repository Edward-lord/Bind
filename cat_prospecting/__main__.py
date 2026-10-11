import argparse
import datetime as dt

from .agent import run_agent
from .config import Scope
from .export import dedupe, key, load_seen, save_seen, write_xlsx


def main() -> None:
    p = argparse.ArgumentParser(prog="cat_prospecting")
    p.add_argument("--config", default="prospecting.yaml")
    p.add_argument("--seen", default="seen.json", help="mémoire des entreprises déjà livrées")
    p.add_argument("--out", default=f"prospects_{dt.date.today().isoformat()}.xlsx")
    a = p.parse_args()
    scope = Scope.load(a.config)
    seen = load_seen(a.seen)
    rows = dedupe(run_agent(scope, exclude=seen), seen)
    write_xlsx(rows, a.out)
    save_seen(a.seen, seen + [key(r["entreprise"]) for r in rows])
    print(f"{len(rows)} nouveaux prospects -> {a.out}")


main()
