from types import SimpleNamespace as NS

from cat_prospecting.agent import run_agent
from cat_prospecting.config import Scope
from cat_prospecting.export import dedupe


class FakeStream:
    def __init__(self, msg): self.msg = msg
    def __enter__(self): return self
    def __exit__(self, *a): return False
    def get_final_message(self): return self.msg


class FakeClient:
    def __init__(self, rows):
        block = NS(type="tool_use", name="submit_prospects", input={"prospects": rows})
        self.messages = NS(stream=lambda **kw: FakeStream(NS(stop_reason="tool_use", content=[block])))


def scope():
    return Scope.load("prospecting.yaml")


def test_agent_filters_and_sorts():
    rows = [{"entreprise": "A", "source_url": "u", "score_pertinence": 10},
            {"entreprise": "B", "source_url": "u", "score_pertinence": 90},
            {"entreprise": "C", "source_url": "", "score_pertinence": 99}]
    out = run_agent(scope(), client=FakeClient(rows))
    assert [r["entreprise"] for r in out] == ["B", "A"]
    assert out[0]["date_collecte"]


def test_dedupe_against_seen():
    rows = [{"entreprise": "Acme  SA"}, {"entreprise": "Neuf"}]
    assert [r["entreprise"] for r in dedupe(rows, ["acme sa"])] == ["Neuf"]
