FROM python:3.9-slim-buster

WORKDIR /app


COPY requirements.txt .


RUN pip install --no-cache-dir -r requirements.txt


RUN useradd -r robin


COPY . .

# Changer le propriétaire des fichiers pour l'utilisateur non-root
RUN chown -R robin:robin /app

# Passer à l'utilisateur non-root pour l'exécution
USER robin

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]