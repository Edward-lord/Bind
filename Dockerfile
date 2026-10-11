FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY cat_prospecting cat_prospecting
COPY prospecting.yaml .
CMD ["python", "-m", "cat_prospecting", "--out", "/data/prospects.xlsx", "--seen", "/data/seen.json"]
