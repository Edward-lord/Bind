from .config import Scope

COLUMNS = [
    "entreprise", "secteur", "ville_region", "site_web", "taille_estimee",
    "contact_nom", "contact_fonction", "coordonnees_pro", "signal_opportunite",
    "score_pertinence", "source_url", "date_collecte",
]


def system_prompt(scope: Scope, exclude: list[str]) -> str:
    excl = "\n".join(f"- {e}" for e in exclude) or "(aucune)"
    return f"""Tu es un agent de recherche de prospects B2B pour le groupe CAT (Caterpillar).
Trouve des entreprises susceptibles d'être clientes, avec leurs coordonnées PROFESSIONNELLES PUBLIQUES.

Périmètre :
- Offre CAT ciblée : {scope.offre}
- Secteurs : {', '.join(scope.secteurs)}
- Zone : {scope.zone}
- Taille : {scope.taille}
- Fonctions visées : {', '.join(scope.fonctions)}
- Besoin précis : {scope.besoin_precis or 'non précisé'}
- Volume : {scope.volume} prospects maximum

Méthode : recherche web (sites d'entreprises, annuaires pro, presse, appels d'offres, chantiers,
offres d'emploi liées à la flotte), puis lecture du site et de la page contact de chaque entreprise.

Règles strictes :
- Uniquement des coordonnées professionnelles publiées (email générique ou publié, téléphone standard).
  Jamais d'email/téléphone personnel ni de réseaux sociaux privés. Ne contourne pas LinkedIn ni les sites protégés.
- N'invente rien : laisse vide ("") toute information non trouvée. Chaque fiche doit avoir une source_url réelle.
- score_pertinence : entier 0-100 selon l'adéquation avec l'offre (secteur, taille, signaux d'achat).
- signal_opportunite : appel d'offres, chantier, recrutement, levée de fonds… si observé.
- Ne retourne pas ces entreprises déjà collectées :
{excl}

Quand tu as terminé, appelle l'outil submit_prospects une seule fois avec la liste finale."""


def submit_tool() -> dict:
    str_fields = [c for c in COLUMNS if c not in ("score_pertinence", "date_collecte")]
    props = {c: {"type": "string"} for c in str_fields}
    props["score_pertinence"] = {"type": "integer"}
    return {
        "name": "submit_prospects",
        "description": "Livre la liste finale de prospects qualifiés.",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {"prospects": {"type": "array", "items": {
                "type": "object", "properties": props,
                "required": list(props), "additionalProperties": False}}},
            "required": ["prospects"], "additionalProperties": False,
        },
    }
