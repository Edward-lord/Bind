# Agent de prospection CAT

Agent de veille B2B pour le groupe CAT : recherche web, enrichissement (site, page contact, décideurs publics),
score de pertinence, export Excel avec la source de chaque information. Spécification d'origine : voir l'historique du projet.

## Utilisation

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=...            # jamais dans le dépôt
python -m cat_prospecting --config prospecting.yaml
```

Le périmètre (offre, secteurs, zone, taille, fonctions, volume) se règle dans `prospecting.yaml`.
`seen.json` mémorise les entreprises déjà livrées : les exécutions suivantes ne remontent que les nouvelles.

## Conformité
Seules des coordonnées professionnelles publiées sont collectées, avec leur source. Vérifier avant tout contact.

## Tests
`python -m pytest`
