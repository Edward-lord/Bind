import datetime as dt

import anthropic

from .config import Scope
from .prompt import submit_tool, system_prompt

MAX_TURNS = 8


def run_agent(scope: Scope, exclude: list[str] | None = None, client=None) -> list[dict]:
    """Boucle agent : recherche web côté serveur, puis submit_prospects (outil client)."""
    client = client or anthropic.Anthropic()
    tools = [
        {"type": "web_search_20260209", "name": "web_search", "max_uses": 40},
        {"type": "web_fetch_20260209", "name": "web_fetch", "max_uses": 60},
        submit_tool(),
    ]
    messages = [{"role": "user", "content": "Lance la recherche selon le périmètre."}]
    system = system_prompt(scope, exclude or [])
    for _ in range(MAX_TURNS):
        with client.messages.stream(
            model=scope.model, max_tokens=32000, system=system, tools=tools,
            messages=messages, thinking={"type": "adaptive"},
            output_config={"effort": "high"},
        ) as stream:
            resp = stream.get_final_message()
        if resp.stop_reason == "refusal":
            raise RuntimeError("Requête refusée par le modèle")
        for block in resp.content:
            if block.type == "tool_use" and block.name == "submit_prospects":
                return _clean(block.input["prospects"], scope.volume)
        messages.append({"role": "assistant", "content": resp.content})
        if resp.stop_reason == "end_turn":  # pas de livraison : on relance
            messages.append({"role": "user", "content": "Appelle submit_prospects avec la liste finale."})
        # pause_turn : on renvoie tel quel, le serveur reprend
    raise RuntimeError("Aucune liste livrée après le nombre maximal de tours")


def _clean(rows: list[dict], limit: int) -> list[dict]:
    today = dt.date.today().isoformat()
    out = [dict(r, date_collecte=today) for r in rows if r.get("entreprise") and r.get("source_url")]
    out.sort(key=lambda r: r.get("score_pertinence", 0), reverse=True)
    return out[:limit]
