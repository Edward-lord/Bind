from dataclasses import dataclass, field
import yaml


@dataclass
class Scope:
    offre: str
    secteurs: list[str]
    zone: str
    taille: str
    fonctions: list[str]
    volume: int = 25
    besoin_precis: str = ""
    model: str = "claude-opus-5-5"

    @classmethod
    def load(cls, path: str) -> "Scope":
        with open(path, encoding="utf-8") as f:
            data = yaml.safe_load(f)
        return cls(**data)
